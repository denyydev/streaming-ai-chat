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

