import type { ChatState, Message, MessageId } from './types'

export function selectMessageIds(state: ChatState): MessageId[] {
  return state.messageIds
}

export function selectMessageById(state: ChatState, id: MessageId): Message | undefined {
  return state.messagesById[id]
}

export function selectMessageCount(state: ChatState): number {
  return state.messageIds.length
}

export function selectIsGenerating(state: ChatState): boolean {
  return state.isGenerating
}

export function selectStreamingMessageId(state: ChatState): MessageId | null {
  return state.streamingMessageId
}

export function selectCommitVersion(state: ChatState): number {
  return state.commitVersion
}

export function selectScrollToBottomVersion(state: ChatState): number {
  return state.scrollToBottomVersion
}

export function selectLastAssistantWordCount(state: ChatState): number {
  const { streamingMessageId, messagesById } = state
  const messageId = streamingMessageId || state.messageIds[state.messageIds.length - 1]
  
  if (!messageId) {
    return 0
  }

  const message = messagesById[messageId]
  if (!message || message.role !== 'assistant') {
    return 0
  }

  const text = message.text.trim()
  if (!text) {
    return 0
  }

  return text.split(/\s+/).filter(Boolean).length
}

