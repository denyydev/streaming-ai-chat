import { Button } from "@/shared/ui";
import { stopStreamingGeneration } from "../../lib/scheduler";
import { selectIsGenerating } from "../../model/selectors";
import { useChatStore } from "../../model/store";

function StopButton() {
  const isGenerating = useChatStore(selectIsGenerating);
  const stopGenerating = useChatStore((state) => state.stopGenerating);

  function handleClick() {
    if (!isGenerating) {
      return;
    }

    stopGenerating();
    stopStreamingGeneration();
  }

  return (
    <Button onClick={handleClick} disabled={!isGenerating}>
      Стоп
    </Button>
  );
}

export default StopButton;
