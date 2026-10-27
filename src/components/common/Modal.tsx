import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import type { ConceptDetail } from "../../types";

const accentMap = {
  cyan: {
    border: "border-cyan-400/40",
    text: "text-cyan-300",
    glow: "glow-cyan",
    chip: "bg-cyan-500/10 text-cyan-300 border-cyan-400/30",
  },
  emerald: {
    border: "border-emerald-400/40",
    text: "text-emerald-300",
    glow: "glow-emerald",
    chip: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
  },
  amber: {
    border: "border-amber-400/40",
    text: "text-amber-300",
    glow: "glow-amber",
    chip: "bg-amber-500/10 text-amber-300 border-amber-400/30",
  },
};

export default function Modal({
  concept,
  onClose,
}: {
  concept: ConceptDetail | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!concept) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [concept, onClose]);

  if (!concept) return null;
  const accent = accentMap[concept.accent];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl card-surface border p-6 sm:p-8 animate-fade-in-up",
          accent.border,
          accent.glow,
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-600/50 bg-slate-800/70 p-2 text-slate-300 transition hover:border-cyan-400/60 hover:text-cyan-300"
          aria-label="Close detail panel"
        >
          <X size={18} />
        </button>

        <p className={cn("font-mono-term text-xs uppercase tracking-[0.3em]", accent.text)}>
          {concept.tagline}
        </p>
        <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-50">{concept.title}</h3>
        <p className="mt-4 text-slate-300 leading-relaxed">{concept.summary}</p>

        <div className="mt-6 space-y-3">
          {concept.details.map((d, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-slate-700/50 bg-slate-900/50 p-3 text-sm text-slate-300"
            >
              <span className={cn("mt-0.5 font-mono-term text-xs", accent.text)}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p>{d}</p>
            </div>
          ))}
        </div>

        {(concept.kernelSources?.length || concept.syscalls?.length) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {concept.kernelSources?.length ? (
              <div className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-4">
                <p className="font-mono-term text-xs uppercase tracking-wider text-slate-400">
                  Kernel Source References
                </p>
                <ul className="mt-2 space-y-1.5">
                  {concept.kernelSources.map((s) => (
                    <li key={s.path} className="font-mono-term text-xs text-emerald-300">
                      <span className="text-slate-500">{s.label}:</span> {s.path}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {concept.syscalls?.length ? (
              <div className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-4">
                <p className="font-mono-term text-xs uppercase tracking-wider text-slate-400">
                  Related System Calls
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {concept.syscalls.map((sc) => (
                    <span
                      key={sc}
                      className={cn(
                        "rounded-full border px-2.5 py-1 font-mono-term text-xs",
                        accent.chip,
                      )}
                    >
                      {sc}()
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
