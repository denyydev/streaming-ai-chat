import { useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Button } from '@/shared/ui'
import { useChatStore } from '../model/store'
import {
    selectCommitVersion,
    selectIsGenerating,
    selectMessageById,
    selectMessageIds,
} from '../model/selectors'
import type { MessageId } from '../model/types'
import AutoScrollToggle from './controls/AutoScrollToggle'
import MessageItem from './MessageItem'

type ChatListItemProps = {
    id: MessageId
}

function ChatListItem({ id }: ChatListItemProps) {
    const message = useChatStore((state) => selectMessageById(state, id))

    if (!message) {
        return null
    }

    return <MessageItem role={message.role} text={message.text} />
}

const AUTO_SCROLL_THRESHOLD = 120

function ChatList() {
    const messageIds = useChatStore(selectMessageIds)
    const commitVersion = useChatStore(selectCommitVersion)
    const isGenerating = useChatStore(selectIsGenerating)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true)
    const [isAtBottom, setIsAtBottom] = useState(true)

  const virtualizer = useVirtualizer({
    count: messageIds.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 80,
    overscan: 8,
  })

    function scrollToBottom() {
        requestAnimationFrame(() => {
      if (!messageIds.length) {
        return
      }

      virtualizer.scrollToIndex(messageIds.length - 1, { align: 'end' })
        })
    }

    useEffect(() => {
        if (!isGenerating || !isAutoScrollEnabled) {
            return
        }

        if (!messageIds.length) {
            return
        }

    virtualizer.measure()
        scrollToBottom()
  }, [commitVersion, isGenerating, isAutoScrollEnabled, messageIds.length, virtualizer])

    function handleScroll() {
        const container = containerRef.current

        if (!container) {
            return
        }

        const distanceToBottom =
            container.scrollHeight - (container.scrollTop + container.clientHeight)

        const atBottom = distanceToBottom <= AUTO_SCROLL_THRESHOLD
        setIsAtBottom(atBottom)

        if (!atBottom && isAutoScrollEnabled) {
            setIsAutoScrollEnabled(false)
        }

        if (atBottom && !isAutoScrollEnabled) {
            setIsAutoScrollEnabled(true)
        }
    }

    function handleToggleAutoScroll() {
        const next = !isAutoScrollEnabled
        setIsAutoScrollEnabled(next)

        if (next) {
            scrollToBottom()
        }
    }

    function handleJumpToBottom() {
        setIsAutoScrollEnabled(true)
        scrollToBottom()
    }

    return (
        <div className="relative flex-1">
            <div
                ref={containerRef}
        className="h-full overflow-y-auto px-4 py-4"
                onScroll={handleScroll}
            >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((item) => {
            const id = messageIds[item.index]

            if (!id) {
              return null
            }

            return (
              <div
                key={id}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${item.start}px)`,
                }}
              >
                <ChatListItem id={id} />
              </div>
            )
          })}
        </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-end justify-between px-4">
                <div className="pointer-events-auto">
                    <AutoScrollToggle enabled={isAutoScrollEnabled} onToggle={handleToggleAutoScroll} />
                </div>
                {!isAtBottom && (
                    <div className="pointer-events-auto">
                        <Button
                            className="bg-sky-700 text-sky-50 hover:bg-sky-600"
                            onClick={handleJumpToBottom}
                        >
                            Jump to bottom
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatList