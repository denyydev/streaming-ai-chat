import { Button, Textarea } from "@/shared/ui";
import { startStreamingGeneration } from "../lib/scheduler";
import { selectIsGenerating } from "../model/selectors";
import { useChatStore } from "../model/store";
import GenerateButton from "./controls/GenerateButton";
import StopButton from "./controls/StopButton";

function Composer() {
  const isGenerating = useChatStore(selectIsGenerating);
  const seedDemoHistory = useChatStore((state) => state.seedDemoHistory);
  const reset = useChatStore((state) => state.reset);

  function handleSeed() {
    if (isGenerating) {
      return;
    }

    seedDemoHistory();
  }

  function handleGenerateHuge() {
    if (isGenerating) {
      return;
    }

    startStreamingGeneration({ targetWords: 10000 });
  }

  function handleClear() {
    if (isGenerating) {
      return;
    }

    reset();
  }

  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto w-full max-w-4xl px-4 py-3">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 p-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <Textarea
                  placeholder="Type a message..."
                  className="min-h-[96px] resize-none"
                />
              </div>
              <div className="flex flex-col items-end justify-between gap-3">
                <div className="flex items-center gap-2">
                  <GenerateButton />
                  <StopButton />
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                    onClick={handleSeed}
                    disabled={isGenerating}
                  >
                    Seed 120
                  </Button>
                  <Button
                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                    onClick={handleGenerateHuge}
                    disabled={isGenerating}
                  >
                    Generate 10k
                  </Button>
                  <Button
                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                    onClick={handleClear}
                    disabled={isGenerating}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-500">
                Enter to send • Shift+Enter for new line
              </div>
              <div className="flex items-center gap-2 sm:hidden">
                <Button
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                  onClick={handleSeed}
                  disabled={isGenerating}
                >
                  Seed 120
                </Button>
                <Button
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                  onClick={handleGenerateHuge}
                  disabled={isGenerating}
                >
                  Generate 10k
                </Button>
                <Button
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                  onClick={handleClear}
                  disabled={isGenerating}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Composer;
