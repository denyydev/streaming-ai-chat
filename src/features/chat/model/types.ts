export type ChatRole = 'user' | 'assistant'

export type MessageStatus = 'idle' | 'streaming' | 'done' | 'stopped'

export type MessageId = string

export type GenerationId = string

export type MarkdownTextNode = {
  type: 'text'
  value: string
}

export type MarkdownBoldNode = {
  type: 'bold'
  children: MarkdownTextNode[]
}

export type MarkdownCodeBlockNode = {
  type: 'codeBlock'
  lang: string | null
  code: string
}

export type MarkdownParagraphNode = {
  type: 'paragraph'
  children: (MarkdownTextNode | MarkdownBoldNode)[]
}

export type MarkdownNode = MarkdownParagraphNode | MarkdownCodeBlockNode

export type Message = {
  id: MessageId
  role: ChatRole
  text: string
  createdAt: number
  updatedAt: number
  status: MessageStatus
}

export type ChatState = {
  messageIds: MessageId[]
  messagesById: Record<MessageId, Message>
  streamingMessageId: MessageId | null
  generationId: GenerationId | null
  isGenerating: boolean
  streamBuffer: string[]
  commitVersion: number
  addMessage: (input: { role: ChatRole; text: string }) => MessageId
  seedMockHistory: () => void
  seedDemoHistory: () => void
  reset: () => void
  startGenerating: () => void
  stopGenerating: () => void
  appendStreamChunk: (chunk: string) => void
  commitStream: () => void
  finalizeStream: (status: MessageStatus) => void
}

