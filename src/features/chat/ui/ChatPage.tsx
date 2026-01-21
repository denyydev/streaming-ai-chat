import ChatList from "./ChatList";
import Composer from "./Composer";

function ChatPage() {
  return (
    <div className="h-full bg-slate-50 text-slate-900">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ChatList />
          <Composer />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
