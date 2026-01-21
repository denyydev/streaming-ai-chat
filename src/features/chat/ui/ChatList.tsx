import MessageItem from './MessageItem'

const items = [
  { role: 'user' as const, text: 'Hi, I want to build a streaming AI chat.' },
  {
    role: 'assistant' as const,
    text: 'We can start with a simple feature-based architecture for the UI.',
  },
  {
    role: 'user' as const,
    text: 'I also need good support for long responses with markdown blocks.',
  },
  {
    role: 'assistant' as const,
    text: 'A virtualized list and streaming renderer will help keep it smooth.',
  },
  {
    role: 'assistant' as const,
    text: 'For now this is only a static placeholder for future messages.',
  },
  {
    role: 'user' as const,
    text: 'Looks good. I like that the layout already feels like a real app.',
  },
]

function ChatList() {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
      {items.map((item, index) => (
        <MessageItem key={index} role={item.role} text={item.text} />
      ))}
    </div>
  )
}

export default ChatList

