import { useEffect, useState } from "react";
import { requestMarkdownParse } from "../lib/worker";
import { selectMessageById } from "../model/selectors";
import { useChatStore } from "../model/store";
import type {
  MarkdownCodeBlockNode,
  MarkdownNode,
  MarkdownParagraphNode,
  MessageId,
} from "../model/types";

type MarkdownMessageProps = {
  messageId: MessageId;
};

function renderParagraph(node: MarkdownParagraphNode, key: number) {
  return (
    <p key={key} className="mb-2 last:mb-0 whitespace-pre-wrap break-words">
      {node.children.map((child, index) => {
        if (child.type === "bold") {
          return (
            <strong key={index} className="font-semibold">
              {child.children.map((inner, innerIndex) => (
                <span key={innerIndex}>{inner.value}</span>
              ))}
            </strong>
          );
        }

        return <span key={index}>{child.value}</span>;
      })}
    </p>
  );
}

function renderCodeBlock(node: MarkdownCodeBlockNode, key: number) {
  return (
    <div key={key} className="mb-2 last:mb-0">
      <pre
        className="
          overflow-x-auto
          rounded-xl
          border border-slate-200
          bg-slate-50
          px-3 py-2
          text-[13px] leading-relaxed
          text-slate-900
        "
      >
        <code className="block whitespace-pre font-mono">{node.code}</code>
      </pre>
    </div>
  );
}

function renderNodes(nodes: MarkdownNode[]) {
  return nodes.map((node, index) => {
    if (node.type === "paragraph") return renderParagraph(node, index);
    return renderCodeBlock(node, index);
  });
}

function MarkdownMessage({ messageId }: MarkdownMessageProps) {
  const message = useChatStore((state) => selectMessageById(state, messageId));
  const [nodes, setNodes] = useState<MarkdownNode[] | null>(null);

  useEffect(() => {
    if (!message) {
      setNodes(null);
      return;
    }

    if (message.status === "streaming") {
      setNodes(null);
      return;
    }

    const currentId = message.id;
    const currentVersion = message.updatedAt;
    const text = message.text;
    let cancelled = false;

    requestMarkdownParse({ id: currentId, version: currentVersion, text })
      .then((ast) => {
        if (!cancelled) setNodes(ast);
      })
      .catch(() => {
        if (!cancelled) setNodes(null);
      });

    return () => {
      cancelled = true;
    };
  }, [message?.id, message?.updatedAt, message?.status, message?.text]);

  if (!message) return null;

  if (message.status === "streaming" || !nodes) {
    return (
      <div className="whitespace-pre-wrap break-words">{message.text}</div>
    );
  }

  return <div>{renderNodes(nodes)}</div>;
}

export default MarkdownMessage;
