import { FlaskConical } from "lucide-react";

export default function LabBubble({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-emerald-400/50 bg-slate-900/90 px-4 py-3.5 font-semibold text-emerald-300 shadow-xl shadow-emerald-500/20 backdrop-blur transition hover:bg-emerald-500/15 sm:bottom-8 sm:right-8 pulse-ring"
      aria-label="Open Virtual Laboratory"
    >
      <FlaskConical size={20} className="animate-pulse" />
      <span className="hidden text-sm sm:inline">Virtual Laboratory</span>
    </button>
  );
}
