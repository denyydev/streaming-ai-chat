import { Button } from "@/shared/ui";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
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
  if (!message) return null;
  return <MessageItem role={message.role} messageId={id} />;
}

const AUTO_SCROLL_THRESHOLD = 120;

function ChatList() {
  const messageIds = useChatStore(selectMessageIds);
  const commitVersion = useChatStore(selectCommitVersion);
  const isGenerating = useChatStore(selectIsGenerating);
  const scrollToBottomVersion = useChatStore(selectScrollToBottomVersion);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tailRef = useRef<HTMLDivElement | null>(null);

  const autoScrollLockRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastScrollHeightRef = useRef(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { historyIds, tailId } = useMemo(() => {
    if (messageIds.length === 0) {
      return {
        historyIds: [] as MessageId[],
        tailId: null as MessageId | null,
      };
    }
    const tail = messageIds[messageIds.length - 1]!;
    const history = messageIds.length > 1 ? messageIds.slice(0, -1) : [];
    return { historyIds: history, tailId: tail };
  }, [messageIds]);

  const virtualizer = useVirtualizer({
    count: historyIds.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 96,
    overscan: 12,
    getItemKey: (index) => historyIds[index] ?? index,
  });

  function scrollToBottom() {
    const container = containerRef.current;
    if (!container) return;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      isProgrammaticScrollRef.current = true;

      const scrollHeight = container.scrollHeight;
      lastScrollHeightRef.current = scrollHeight;
      container.scrollTop = scrollHeight;

      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    });
  }

  useEffect(() => {
    const tail = tailRef.current;
    const container = containerRef.current;
    if (!tail || !container) return;

    resizeObserverRef.current?.disconnect();

    let rafId: number | null = null;

    resizeObserverRef.current = new ResizeObserver(() => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (isProgrammaticScrollRef.current) return;

        const currentScrollHeight = container.scrollHeight;
        const distanceToBottom =
          currentScrollHeight - (container.scrollTop + container.clientHeight);

        if (
          isAutoScrollEnabled &&
          !autoScrollLockRef.current &&
          distanceToBottom <= AUTO_SCROLL_THRESHOLD * 2
        ) {
          scrollToBottom();
        }

        lastScrollHeightRef.current = currentScrollHeight;
      });
    });

    resizeObserverRef.current.observe(tail);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [tailId, isAutoScrollEnabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    lastScrollHeightRef.current = container.scrollHeight;
  }, []);

  useEffect(() => {
    autoScrollLockRef.current = false;
    setIsAutoScrollEnabled(true);
    setIsAtBottom(true);
    scrollToBottom();
  }, [scrollToBottomVersion]);

  useEffect(() => {
    if (!isGenerating) return;
    if (!isAutoScrollEnabled || autoScrollLockRef.current) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (isGenerating && isAutoScrollEnabled && !autoScrollLockRef.current) {
          scrollToBottom();
        }
      });
    });
  }, [commitVersion, isGenerating, isAutoScrollEnabled]);

  useEffect(() => {
    if (isGenerating) return;
    if (!isAutoScrollEnabled || autoScrollLockRef.current) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });
  }, [isGenerating, isAutoScrollEnabled, tailId]);

  function handleScroll() {
    if (isProgrammaticScrollRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollHeight = container.scrollHeight;
    const distanceToBottom =
      scrollHeight - (container.scrollTop + container.clientHeight);

    const atBottom = distanceToBottom <= AUTO_SCROLL_THRESHOLD;
    setIsAtBottom(atBottom);

    if (atBottom && !autoScrollLockRef.current) {
      setIsAutoScrollEnabled(true);
    }

    lastScrollHeightRef.current = scrollHeight;
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (!isGenerating || !isAutoScrollEnabled) return;

    if (event.deltaY < 0) {
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
    <div className="relative flex-1 bg-[#F4F6F8] overflow-hidden">
      <div
        ref={containerRef}
        className="
          h-full overflow-y-auto overflow-x-hidden
          px-3 pt-3 pb-28 sm:px-4 sm:pt-4
          [scrollbar-gutter:stable]
        "
        onScroll={handleScroll}
        onWheel={handleWheel}
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
              const id = historyIds[item.index];
              if (!id) return null;

              return (
                <div
                  key={id}
                  data-index={item.index}
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

          {tailId && (
            <div ref={tailRef} className="py-1.5 sm:py-2">
              <ChatListItem id={tailId} />
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-end px-3 sm:px-4">
        {(!isAtBottom || autoScrollLockRef.current) && (
          <div className="pointer-events-auto">
            <Button onClick={handleJumpToBottom}>Вниз</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatList;
