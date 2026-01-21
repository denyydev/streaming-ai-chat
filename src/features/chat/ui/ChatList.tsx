import { Button } from "@/shared/ui";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type WheelEvent,
} from "react";
import {
  selectCommitVersion,
  selectIsGenerating,
  selectMessageById,
  selectMessageIds,
  selectScrollToBottomVersion,
} from "../model/selectors";
import { useChatStore } from "../model/store";
import type { MessageId } from "../model/types";
import MessageItem from "./MessageItem";

type ChatListItemProps = {
  id: MessageId;
};

function ChatListItem({ id }: ChatListItemProps) {
  const message = useChatStore((state) => selectMessageById(state, id));

  if (!message) {
    return null;
  }

  return <MessageItem role={message.role} messageId={id} />;
}

const AUTO_SCROLL_THRESHOLD = 120;

function ChatList() {
  const messageIds = useChatStore(selectMessageIds);
  const commitVersion = useChatStore(selectCommitVersion);
  const isGenerating = useChatStore(selectIsGenerating);
  const scrollToBottomVersion = useChatStore(selectScrollToBottomVersion);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollLockRef = useRef(false);
  const fastStartRef = useRef(0);
  const prevIsGeneratingRef = useRef(false);
  const measureRafIdRef = useRef<number | null>(null);
  const measureAtRef = useRef(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const virtualizer = useVirtualizer({
    count: messageIds.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 80,
    overscan: 8,
  });

  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (!messageIds.length) {
        return;
      }

      virtualizer.scrollToIndex(messageIds.length - 1, { align: "end" });
    });
  }

  function lightScrollToBottom() {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
    }
  }

  function scheduleMeasure() {
    if (measureRafIdRef.current !== null) {
      return;
    }

    const now = performance.now();
    if (now - measureAtRef.current < 250) {
      return;
    }

    measureRafIdRef.current = requestAnimationFrame(() => {
      virtualizer.measure();
      measureRafIdRef.current = null;
      measureAtRef.current = performance.now();
    });
  }

  useEffect(() => {
    if (prevIsGeneratingRef.current === false && isGenerating === true) {
      fastStartRef.current = 6;
    }
    prevIsGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  useEffect(() => {
    autoScrollLockRef.current = false;
    setIsAutoScrollEnabled(true);
    setIsAtBottom(true);
    fastStartRef.current = 6;
    lightScrollToBottom();
  }, [scrollToBottomVersion]);

  useEffect(() => {
    if (!isGenerating || !isAutoScrollEnabled || autoScrollLockRef.current) {
      return;
    }

    if (!messageIds.length) {
      return;
    }

    if (fastStartRef.current > 0) {
      fastStartRef.current -= 1;
      lightScrollToBottom();
      return;
    }

    scheduleMeasure();
    scrollToBottom();
  }, [
    commitVersion,
    isGenerating,
    isAutoScrollEnabled,
    messageIds.length,
    virtualizer,
  ]);

  function handleScroll() {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const distanceToBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight);

    const atBottom = distanceToBottom <= AUTO_SCROLL_THRESHOLD;
    setIsAtBottom(atBottom);

    if (atBottom && !autoScrollLockRef.current) {
      setIsAutoScrollEnabled(true);
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (!isGenerating || !isAutoScrollEnabled) {
      return;
    }

    if (event.deltaY < 0) {
      autoScrollLockRef.current = true;
      setIsAutoScrollEnabled(false);
      setIsAtBottom(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isGenerating || !isAutoScrollEnabled) {
      return;
    }

    const { key, shiftKey } = event;

    if (key === "PageUp" || key === "ArrowUp" || (key === " " && shiftKey)) {
      autoScrollLockRef.current = true;
      setIsAutoScrollEnabled(false);
      setIsAtBottom(false);
    }
  }

  function handleJumpToBottom() {
    autoScrollLockRef.current = false;
    setIsAutoScrollEnabled(true);
    setIsAtBottom(true);
    scrollToBottom();
  }

  return (
    <div className="relative flex-1 bg-[#F4F6F8]">
      <div
        ref={containerRef}
        className="
        h-full overflow-y-auto
        px-3 pt-3 pb-28 sm:px-4 sm:pt-4
        outline-none
        focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6F8]
        [scrollbar-gutter:stable]
      "
        onScroll={handleScroll}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="mx-auto w-full max-w-4xl">
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((item) => {
              const id = messageIds[item.index];
              if (!id) return null;

              return (
                <div
                  key={id}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${item.start}px)`,
                  }}
                  className="py-1.5 sm:py-2"
                >
                  <ChatListItem id={id} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex items-center justify-end px-3 sm:px-4">
        {(!isAtBottom || autoScrollLockRef.current) && (
          <div className="pointer-events-auto">
            <Button
              className="
              group
              inline-flex h-10 items-center gap-2 rounded-full
              border border-slate-200 bg-white/95 px-3.5
              text-sm font-medium text-slate-700 shadow-sm
              backdrop-blur
              cursor-pointer select-none
              hover:bg-white hover:shadow
              active:scale-[0.99] active:bg-slate-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6F8]
              disabled:cursor-not-allowed disabled:opacity-60
            "
              onClick={handleJumpToBottom}
            >
              <span className="leading-none">Вниз</span>
              <span className="text-slate-400 transition-colors group-hover:text-slate-500">
                ↓
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatList;
