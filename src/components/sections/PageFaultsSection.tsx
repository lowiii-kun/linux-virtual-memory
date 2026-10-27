import { useState } from "react";
import { Database, HardDrive, Sparkles, Split } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import ConceptCard from "../common/ConceptCard";
import Modal from "../common/Modal";
import { pageFaultConcepts } from "../../data/concepts";
import type { ConceptDetail } from "../../types";

function MinorVisual() {
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-2">
      <Database className="text-cyan-300" size={24} />
      <p className="font-mono-term text-[10px] text-slate-400">page in RAM, not yet mapped</p>
      <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 font-mono-term text-[10px] text-cyan-300">
        update PTE only
      </span>
    </div>
  );
}

function MajorVisual() {
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-2">
      <HardDrive className="text-amber-300" size={24} />
      <p className="font-mono-term text-[10px] text-slate-400">page on disk / swap</p>
      <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 font-mono-term text-[10px] text-amber-300">
        blocking disk I/O
      </span>
    </div>
  );
}

function LazyVisual() {
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-2">
      <Sparkles className="text-cyan-300" size={24} />
      <p className="font-mono-term text-[10px] text-slate-400">malloc(10GB) reserves VA only</p>
      <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 font-mono-term text-[10px] text-slate-300">
        frame on first touch
      </span>
    </div>
  );
}

function CowVisual() {
  return (
    <div className="flex h-28 items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono-term text-[9px] text-slate-400">Parent</span>
        <div className="h-8 w-8 rounded bg-emerald-500/40 border border-emerald-400/60" />
      </div>
      <Split className="text-slate-500" size={18} />
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono-term text-[9px] text-slate-400">Child</span>
        <div className="h-8 w-8 rounded bg-emerald-500/40 border border-emerald-400/60" />
      </div>
      <span className="absolute mt-14 font-mono-term text-[9px] text-amber-300">write → copy</span>
    </div>
  );
}

const visuals: Record<string, React.ReactNode> = {
  "minor-fault": <MinorVisual />,
  "major-fault": <MajorVisual />,
  "lazy-allocation": <LazyVisual />,
  cow: <CowVisual />,
};

export default function PageFaultsSection() {
  const [active, setActive] = useState<ConceptDetail | null>(null);

  return (
    <section id="page-faults" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="04"
        kicker="Demand Paging"
        accent="emerald"
        title="Page Faults & Demand Paging"
        description="A page fault isn't always an error — it's the core mechanism Linux uses to allocate memory lazily and share pages efficiently. The kernel distinguishes between cheap 'minor' faults and expensive 'major' faults that require real disk I/O."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pageFaultConcepts.map((c) => (
          <ConceptCard key={c.id} concept={c} onOpen={setActive} visual={visuals[c.id]} />
        ))}
      </div>

      <Modal concept={active} onClose={() => setActive(null)} />
    </section>
  );
}
