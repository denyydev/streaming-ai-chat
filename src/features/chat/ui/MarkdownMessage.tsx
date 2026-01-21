import { useEffect, useState } from 'react'
import { useChatStore } from '../model/store'
import { selectIsGenerating, selectMessageById } from '../model/selectors'
import type { MarkdownNode, MessageId, MarkdownParagraphNode, MarkdownCodeBlockNode } from '../model/types'
import { requestMarkdownParse } from '../lib/worker'

type MarkdownMessageProps = {
  messageId: MessageId
}

function renderParagraph(node: MarkdownParagraphNode, key: number) {
  return (
    <p key={key} className="mb-1 last:mb-0">
      {node.children.map((child, index) => {
        if (child.type === 'bold') {
          return (
            <strong key={index} className="font-semibold">
              {child.children.map((inner, innerIndex) => (
                <span key={innerIndex} className="whitespace-pre-wrap break-words">
                  {inner.value}
                </span>
              ))}
            </strong>
          )
        }

        return (
          <span key={index} className="whitespace-pre-wrap break-words">
            {child.value}
          </span>
        )
      })}
    </p>
  )
}

function renderCodeBlock(node: MarkdownCodeBlockNode, key: number) {
  return (
    <pre
      key={key}
      className="mb-1 overflow-x-auto rounded-md bg-slate-900 px-3 py-2 text-xs leading-relaxed"
    >
      <code className="whitespace-pre">
        {node.code}
      </code>
    </pre>
  )
}

function renderNodes(nodes: MarkdownNode[]) {
  return nodes.map((node, index) => {
    if (node.type === 'paragraph') {
      return renderParagraph(node, index)
    }

    return renderCodeBlock(node, index)
  })
}

function MarkdownMessage({ messageId }: MarkdownMessageProps) {
  const message = useChatStore((state) => selectMessageById(state, messageId))
  const isGenerating = useChatStore(selectIsGenerating)
  const [nodes, setNodes] = useState<MarkdownNode[] | null>(null)

  useEffect(() => {
    if (!message) {
      setNodes(null)
      return
    }

    if (message.status === 'streaming' || isGenerating) {
      setNodes(null)
      return
    }

    const currentId = message.id
    const currentVersion = message.updatedAt
    const text = message.text
    let cancelled = false

    requestMarkdownParse({
      id: currentId,
      version: currentVersion,
      text,
    })
      .then((ast) => {
        if (cancelled) {
          return
        }

        setNodes(ast)
      })
      .catch(() => {
        if (cancelled) {
          return
        }

        setNodes(null)
      })

    return () => {
      cancelled = true
    }
  }, [message?.id, message?.updatedAt, message?.status, isGenerating])

  if (!message) {
    return null
  }

  if (!nodes) {
    return (
      <span className="whitespace-pre-wrap break-words">
        {message.text}
      </span>
    )
  }

  return (
    <div>
      {renderNodes(nodes)}
    </div>
  )
}

export default MarkdownMessage


