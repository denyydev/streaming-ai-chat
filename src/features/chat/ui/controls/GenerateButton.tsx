import { Button } from '@/shared/ui'
import { useChatStore } from '../../model/store'
import { selectIsGenerating } from '../../model/selectors'
import { startStreamingGeneration } from '../../lib/scheduler'

function GenerateButton() {
  const isGenerating = useChatStore(selectIsGenerating)

  function handleClick() {
    if (isGenerating) {
      return
    }

    startStreamingGeneration({ targetWords: 10000 })
  }

  return (
    <Button onClick={handleClick} disabled={isGenerating}>
      Generate
    </Button>
  )
}

export default GenerateButton

