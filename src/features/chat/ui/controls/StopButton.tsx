import { Button } from '@/shared/ui'
import { useChatStore } from '../../model/store'
import { selectIsGenerating } from '../../model/selectors'

function StopButton() {
  const isGenerating = useChatStore(selectIsGenerating)
  const stopGenerating = useChatStore((state) => state.stopGenerating)

  function handleClick() {
    if (!isGenerating) {
      return
    }

    stopGenerating()
  }

  return (
    <Button onClick={handleClick} disabled={!isGenerating}>
      Stop
    </Button>
  )
}

export default StopButton

