import ChatList from "./ChatList";
import Composer from "./Composer";

function ChatPage() {
  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-50 p-5">
      <div className="rounded-4xl py-5 px-2 bg-white w-full max-w-5xl mx-auto h-full flex flex-col">
        <ChatList />
        <Composer />
      </div>
    </div>
  );
}

export default ChatPage;
