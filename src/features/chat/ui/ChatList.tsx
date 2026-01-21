import { useEffect, useRef, useState } from 'react'
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

    function scrollToBottom() {
        const container = containerRef.current

        if (!container) {
            return
        }

        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight
        })
    }

    useEffect(() => {
        if (!isGenerating || !isAutoScrollEnabled) {
            return
        }

        if (!messageIds.length) {
            return
        }

        scrollToBottom()
    }, [commitVersion, isGenerating, isAutoScrollEnabled, messageIds.length])

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
                className="flex h-full flex-col space-y-3 overflow-y-auto px-4 py-4"
                onScroll={handleScroll}
            >
                {messageIds.map((id) => (
                    <ChatListItem key={id} id={id} />
                ))}
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