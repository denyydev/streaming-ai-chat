export type ChatRole = 'user' | 'assistant'

export type MessageId = string

export type Message = {
  id: MessageId
  role: ChatRole
  text: string
  createdAt: number
}

export type ChatState = {
  messageIds: MessageId[]
  messagesById: Record<MessageId, Message>
  addMessage: (input: { role: ChatRole; text: string }) => MessageId
  seedMockHistory: () => void
  reset: () => void
}

