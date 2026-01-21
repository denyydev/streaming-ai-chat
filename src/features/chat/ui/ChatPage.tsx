import { useEffect } from 'react'
import { useChatStore } from '@/features/chat'
import { selectMessageCount } from '../model/selectors'
import ChatList from './ChatList'
import Composer from './Composer'

function ChatPage() {
  const seedMockHistory = useChatStore((state) => state.seedMockHistory)
  const hasMessages = useChatStore((state) => selectMessageCount(state) > 0)

  useEffect(() => {
    if (!hasMessages) {
      seedMockHistory()
    }
  }, [hasMessages, seedMockHistory])

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col border-x border-slate-800 bg-slate-900/60">
        <ChatList />
        <Composer />
      </div>
    </div>
  )
}

export default ChatPage