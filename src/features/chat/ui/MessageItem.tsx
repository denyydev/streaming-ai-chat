import type { ChatRole, MessageId } from '../model/types'
import MarkdownMessage from './MarkdownMessage'

type MessageItemProps = {
  role: ChatRole
  messageId: MessageId
}

function MessageItem({ role, messageId }: MessageItemProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-sky-600 text-white'
            : 'bg-slate-800 text-slate-100'
        }`}
      >
        <MarkdownMessage messageId={messageId} />
      </div>
    </div>
  )
}

export default MessageItem