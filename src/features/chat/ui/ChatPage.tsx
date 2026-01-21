import ChatList from "./ChatList";
import Composer from "./Composer";

function ChatPage() {
  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-50">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col border-x border-slate-800 bg-slate-900/60">
        <ChatList />
        <Composer />
      </div>
    </div>
  );
}

export default ChatPage;
