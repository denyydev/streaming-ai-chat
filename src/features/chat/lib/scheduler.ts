import { useChatStore } from '../model/store'
import { createTextGenerator } from './generator'

let chunkTimer: ReturnType<typeof setInterval> | null = null
let commitTimer: ReturnType<typeof setInterval> | null = null
let activeGenerationId: string | null = null

function clearTimers() {
  if (chunkTimer) {
    clearInterval(chunkTimer)
    chunkTimer = null
  }

  if (commitTimer) {
    clearInterval(commitTimer)
    commitTimer = null
  }

  activeGenerationId = null
}

export function startStreamingGeneration() {
  const initialState = useChatStore.getState()

  if (initialState.isGenerating) {
    return
  }

  initialState.startGenerating()

  const afterStart = useChatStore.getState()
  const generationId = afterStart.generationId

  if (!generationId) {
    return
  }

  activeGenerationId = generationId

  const generator = createTextGenerator()

  chunkTimer = setInterval(() => {
    const state = useChatStore.getState()

    if (!state.isGenerating || !state.generationId || state.generationId !== activeGenerationId) {
      clearTimers()
      return
    }

    const chunk = generator.nextChunk()

    if (!chunk) {
      state.finalizeStream('done')
      clearTimers()
      return
    }

    state.appendStreamChunk(chunk)
  }, 15)

  commitTimer = setInterval(() => {
    const state = useChatStore.getState()

    if (!state.isGenerating || !state.generationId || state.generationId !== activeGenerationId) {
      clearTimers()
      return
    }

    state.commitStream()
  }, 80)
}

