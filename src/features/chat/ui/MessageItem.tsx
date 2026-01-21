import type { ChatRole, MessageId } from "../model/types";
import MarkdownMessage from "./MarkdownMessage";

type MessageItemProps = {
  role: ChatRole;
  messageId: MessageId;
};

function MessageItem({ role, messageId }: MessageItemProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[80%]
          px-3.5 py-2.5
          text-[15px] leading-6
          shadow-sm
          ${
            isUser
              ? `
                rounded-2xl rounded-br-md
                bg-sky-100 text-slate-900
              `
              : `
                rounded-2xl rounded-bl-md
                bg-white text-slate-800
                border border-slate-200
              `
          }
        `}
      >
        <MarkdownMessage messageId={messageId} />
      </div>
    </div>
  );
}

export default MessageItem;
