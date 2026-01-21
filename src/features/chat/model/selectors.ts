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

