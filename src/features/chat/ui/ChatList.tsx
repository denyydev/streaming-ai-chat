import { useChatStore } from '@/features/chat'
import { selectMessageById, selectMessageIds } from '../model/selectors'
import type { MessageId } from '../model/types'
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

function ChatList() {
    const messageIds = useChatStore(selectMessageIds)

    return (
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messageIds.map((id) => (
                <ChatListItem key={id} id={id} />
            ))}
        </div>
    )
}

export default ChatList