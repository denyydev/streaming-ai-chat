import { Button, Textarea } from '@/shared/ui'
import { useChatStore } from '../model/store'
import { selectIsGenerating } from '../model/selectors'
import { startStreamingGeneration } from '../lib/scheduler'
import GenerateButton from './controls/GenerateButton'
import StopButton from './controls/StopButton'

function Composer() {
  const isGenerating = useChatStore(selectIsGenerating)
  const seedDemoHistory = useChatStore((state) => state.seedDemoHistory)
  const reset = useChatStore((state) => state.reset)

  function handleSeed() {
    if (isGenerating) {
      return
    }

    seedDemoHistory()
  }

  function handleGenerateHuge() {
    if (isGenerating) {
      return
    }

    startStreamingGeneration({ targetWords: 10000 })
  }

  function handleClear() {
    if (isGenerating) {
      return
    }

    reset()
  }

  return (
    <div className="border-t border-slate-800 bg-slate-950/80 px-4 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <Textarea placeholder="Type a message..." />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <GenerateButton />
              <StopButton />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 text-xs text-slate-300">
          <Button
            className="px-2 py-1 text-xs"
            onClick={handleSeed}
            disabled={isGenerating}
          >
            Seed 120
          </Button>
          <Button
            className="px-2 py-1 text-xs"
            onClick={handleGenerateHuge}
            disabled={isGenerating}
          >
            Generate 10k
          </Button>
          <Button
            className="px-2 py-1 text-xs"
            onClick={handleClear}
            disabled={isGenerating}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Composer

