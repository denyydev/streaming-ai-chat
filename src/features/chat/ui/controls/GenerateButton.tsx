import { Button } from "@/shared/ui";
import { startStreamingGeneration } from "../../lib/scheduler";
import { selectIsGenerating } from "../../model/selectors";
import { useChatStore } from "../../model/store";

function GenerateButton() {
  const isGenerating = useChatStore(selectIsGenerating);

  function handleClick() {
    if (isGenerating) {
      return;
    }

    startStreamingGeneration({ targetWords: 10000 });
  }

  return (
    <Button onClick={handleClick} disabled={isGenerating}>
      Генератор
    </Button>
  );
}

export default GenerateButton;
