import type { MarkdownNode } from '../model/types'
import { parseMarkdown } from './markdown'

type RequestMessage = {
  id: string
  version: number
  text: string
}

type ResponseMessage = {
  id: string
  version: number
  ast: MarkdownNode[]
}

self.onmessage = (event: MessageEvent<RequestMessage>) => {
  const { id, version, text } = event.data
  const ast = parseMarkdown(text)
  const message: ResponseMessage = {
    id,
    version,
    ast,
  }
  ;(self as unknown as Worker).postMessage(message)
}

export {}


