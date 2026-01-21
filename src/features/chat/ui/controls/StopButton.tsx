import { Button } from "@/shared/ui";
import { stopStreamingGeneration } from "../../lib/scheduler";
import { selectIsGenerating } from "../../model/selectors";
import { useChatStore } from "../../model/store";

function StopButton() {
  const isGenerating = useChatStore(selectIsGenerating);

  function handleClick() {
    if (!isGenerating) return;

    // stopStreamingGeneration() already calls finalizeStream("stopped")
    stopStreamingGeneration();
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!isGenerating}
      className="
        border-rose-200 bg-rose-50 text-rose-700
        hover:bg-rose-100 active:bg-rose-200
        focus-visible:ring-rose-200
      "
    >
      Остановить
    </Button>
  );
}

export default StopButton;
