import { Textarea } from "@/shared/ui";
import { useChatStore } from "../model/store";
import { selectLastAssistantWordCount, selectIsGenerating } from "../model/selectors";
import GenerateButton from "./controls/GenerateButton";
import StopButton from "./controls/StopButton";

function Composer() {
  const isGenerating = useChatStore(selectIsGenerating);
  const wordCount = useChatStore(selectLastAssistantWordCount);

  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto w-full max-w-4xl px-3 py-3 sm:px-4">
        <div
          className="
            flex items-end gap-2
            rounded-2xl border border-slate-200 bg-white
            px-3 py-2
            shadow-sm
            focus-within:ring-2 focus-within:ring-sky-200 focus-within:ring-offset-2 focus-within:ring-offset-white
          "
        >
          <Textarea
            placeholder="Сообщение..."
            className="
              flex-1
              min-h-[44px] max-h-[180px]
              resize-none
              border-0 bg-transparent p-0
              text-[15px] leading-6 text-slate-900
              placeholder:text-slate-400
              outline-none
            "
          />

          <div className="flex items-center gap-2 pb-0.5">
            {import.meta.env.DEV && isGenerating && wordCount > 0 && (
              <span className="text-xs text-slate-400 tabular-nums">
                {wordCount.toLocaleString()}
              </span>
            )}
            <GenerateButton />
            <StopButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Composer;
