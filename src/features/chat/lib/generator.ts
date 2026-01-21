const loremChunks = [
  'Streaming interfaces should feel responsive even under heavy load. ',
  'A good chat layout keeps messages readable over long sessions. ',
  'Developers often mix prose with inline code to explain ideas clearly. ',
  'The transport layer can stream data in small pieces without blocking the UI. ',
  'Batching updates lets React commit changes without locking up the main thread. ',
]

const codeChunks = [
  'const buffer: string[] = [];\n',
  'function appendChunk(chunk: string) {\n',
  '  buffer.push(chunk)\n',
  '}\n',
  'export function flush() {\n',
  '  return buffer.join(\"\")\n',
  '}\n',
]

type TextGeneratorState = {
  wordCount: number
  targetWords: number
  index: number
  mode: 'text' | 'code'
}

export function createTextGenerator(targetWords = 10000) {
  const state: TextGeneratorState = {
    wordCount: 0,
    targetWords,
    index: 0,
    mode: 'text',
  }

  function takeChunk(): string | null {
    if (state.wordCount >= state.targetWords) {
      return null
    }

    const useCode = state.mode === 'code'
    const pool = useCode ? codeChunks : loremChunks

    const piece = pool[state.index % pool.length]
    state.index += 1

    const words = piece.split(/\s+/).filter(Boolean).length
    state.wordCount += words

    if (state.index % 7 === 0) {
      state.mode = state.mode === 'text' ? 'code' : 'text'
    }

    return piece
  }

  return {
    nextChunk: takeChunk,
  }
}

