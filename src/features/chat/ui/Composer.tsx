import { Textarea } from "@/shared/ui";
import GenerateButton from "./controls/GenerateButton";
import StopButton from "./controls/StopButton";

function Composer() {
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Composer;
