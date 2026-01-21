import { create } from 'zustand'
import type { ChatRole, ChatState, Message } from './types'

function createMessageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function createMessage(input: { role: ChatRole; text: string }): Message {
  return {
    id: createMessageId(),
    role: input.role,
    text: input.text,
    createdAt: Date.now(),
  }
}

const mockTexts: { role: ChatRole; text: string }[] = [
  {
    role: 'user',
    text: 'Hi, I want to build a streaming AI chat interface that feels instant.',
  },
  {
    role: 'assistant',
    text: 'We can start with a simple layout and then layer streaming on top.',
  },
  {
    role: 'user',
    text: 'Long answers should stay readable, even when they contain multiple paragraphs of text.',
  },
  {
    role: 'assistant',
    text: 'Chunking the output and rendering it incrementally will help keep everything responsive.',
  },
  {
    role: 'assistant',
    text: 'Later we can add markdown, syntax highlighting and other presentation features.',
  },
  {
    role: 'user',
    text: 'For now static mock messages are fine, I just want to see the shape of the UI.',
  },
  {
    role: 'assistant',
    text: 'Once the skeleton looks good we can wire it to a real backend or worker.',
  },
]

export const useChatStore = create<ChatState>((set, get) => ({
  messageIds: [],
  messagesById: {},
  addMessage: (input) => {
    const message = createMessage(input)

    set((state) => ({
      messageIds: [...state.messageIds, message.id],
      messagesById: {
        ...state.messagesById,
        [message.id]: message,
      },
    }))

    return message.id
  },
  seedMockHistory: () => {
    const count = get().messageIds.length
    if (count > 0) {
      return
    }

    mockTexts.forEach((item) => {
      get().addMessage(item)
    })
  },
  reset: () => {
    set({
      messageIds: [],
      messagesById: {},
    })
  },
}))

