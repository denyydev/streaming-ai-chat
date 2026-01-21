import type {
  MarkdownBoldNode,
  MarkdownCodeBlockNode,
  MarkdownNode,
  MarkdownParagraphNode,
  MarkdownTextNode,
} from '../model/types'

function createTextNode(value: string): MarkdownTextNode {
  return {
    type: 'text',
    value,
  }
}

function createBoldNode(value: string): MarkdownBoldNode {
  return {
    type: 'bold',
    children: [createTextNode(value)],
  }
}

function parseParagraph(source: string): MarkdownParagraphNode {
  const children: (MarkdownTextNode | MarkdownBoldNode)[] = []
  let index = 0

  while (index < source.length) {
    const start = source.indexOf('**', index)

    if (start === -1) {
      const value = source.slice(index)
      if (value) {
        children.push(createTextNode(value))
      }
      break
    }

    if (start > index) {
      const value = source.slice(index, start)
      if (value) {
        children.push(createTextNode(value))
      }
    }

    const end = source.indexOf('**', start + 2)

    if (end === -1) {
      const value = source.slice(start)
      if (value) {
        children.push(createTextNode(value))
      }
      break
    }

    const boldValue = source.slice(start + 2, end)
    if (boldValue) {
      children.push(createBoldNode(boldValue))
    }

    index = end + 2
  }

  return {
    type: 'paragraph',
    children,
  }
}

function parseCodeBlock(code: string, lang: string | null): MarkdownCodeBlockNode {
  return {
    type: 'codeBlock',
    lang,
    code,
  }
}

export function parseMarkdown(input: string): MarkdownNode[] {
  const nodes: MarkdownNode[] = []
  let index = 0
  let buffer = ''
  const length = input.length

  while (index < length) {
    if (input.startsWith('```', index)) {
      if (buffer) {
        nodes.push(parseParagraph(buffer))
        buffer = ''
      }

      index += 3

      let lang = ''
      while (index < length) {
        const char = input[index]
        index += 1
        if (char === '\n') {
          break
        }
        lang += char
      }

      const fenceIndex = input.indexOf('```', index)

      if (fenceIndex === -1) {
        const code = input.slice(index)
        nodes.push(parseCodeBlock(code, lang ? lang.trim() : null))
        index = length
        break
      }

      const code = input.slice(index, fenceIndex)
      nodes.push(parseCodeBlock(code, lang ? lang.trim() : null))
      index = fenceIndex + 3
      continue
    }

    buffer += input[index]
    index += 1
  }

  if (buffer) {
    nodes.push(parseParagraph(buffer))
  }

  return nodes
}

