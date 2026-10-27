import type { ReactNode } from "react";
import { Maximize2 } from "lucide-react";
import { cn } from "../../utils/cn";
import type { ConceptDetail } from "../../types";

const accentMap = {
  cyan: "hover:border-cyan-400/50 hover:shadow-cyan-500/10",
  emerald: "hover:border-emerald-400/50 hover:shadow-emerald-500/10",
  amber: "hover:border-amber-400/50 hover:shadow-amber-500/10",
};

const accentText = {
  cyan: "text-cyan-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
};

export default function ConceptCard({
  concept,
  onOpen,
  visual,
}: {
  concept: ConceptDetail;
  onOpen: (c: ConceptDetail) => void;
  visual?: ReactNode;
}) {
  return (
    <div
      onClick={() => onOpen(concept)}
      className={cn(
        "clickable-card group relative flex flex-col rounded-2xl card-surface border p-5 shadow-lg shadow-black/20",
        accentMap[concept.accent],
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(concept);
      }}
    >
      <div className="absolute right-4 top-4 rounded-full border border-slate-700/60 bg-slate-900/70 p-1.5 text-slate-400 opacity-0 transition group-hover:opacity-100">
        <Maximize2 size={14} />
      </div>
      {visual && <div className="mb-4">{visual}</div>}
      <p className={cn("font-mono-term text-[11px] uppercase tracking-[0.25em]", accentText[concept.accent])}>
        {concept.tagline}
      </p>
      <h4 className="mt-1.5 text-lg font-semibold text-slate-50">{concept.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{concept.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 group-hover:text-cyan-300">
        Click to explore deep dive →
      </span>
    </div>
  );
}
