import { Toggle } from "@/shared/ui";

type AutoScrollToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

function AutoScrollToggle({ enabled, onToggle }: AutoScrollToggleProps) {
  return (
    <Toggle
      onClick={onToggle}
      className={`h-10 rounded-lg px-4 text-sm font-medium transition
        ${
          enabled
            ? "bg-sky-600 text-white shadow hover:bg-sky-500 active:bg-sky-700"
            : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 active:bg-slate-100"
        }`}
    >
      {enabled ? "Auto-scroll: On" : "Auto-scroll: Off"}
    </Toggle>
  );
}

export default AutoScrollToggle;
