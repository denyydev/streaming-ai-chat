import { Button } from "@/shared/ui";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import {
  selectCommitVersion,
  selectIsGenerating,
  selectMessageById,
  selectMessageIds,
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
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (!isGenerating || !isAutoScrollEnabled) {
      return;
    }

    if (!messageIds.length) {
      return;
    }

    virtualizer.measure();
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

    if (!atBottom) {
      setIsAutoScrollEnabled(false);
    } else {
      setIsAutoScrollEnabled(true);
    }
  }

  function handleJumpToBottom() {
    setIsAutoScrollEnabled(true);
    scrollToBottom();
  }

  return (
    <div className="relative flex-1 bg-slate-50">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto px-4 pt-4 pb-28"
        onScroll={handleScroll}
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

              if (!id) {
                return null;
              }

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
                  className="py-1.5"
                >
                  <ChatListItem id={id} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex items-center justify-end px-4">
        {!isAtBottom && (
          <div className="pointer-events-auto">
            <Button
              className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100"
              onClick={handleJumpToBottom}
            >
              Jump to bottom
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatList;
