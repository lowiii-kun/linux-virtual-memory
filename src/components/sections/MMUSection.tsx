import { useState } from "react";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import ConceptCard from "../common/ConceptCard";
import Modal from "../common/Modal";
import { mmuConcepts } from "../../data/concepts";
import type { ConceptDetail } from "../../types";

function PageWalkVisual() {
  const levels = ["PGD", "PUD", "PMD", "PTE", "Frame"];
  return (
    <div className="flex h-28 items-center justify-center gap-1 overflow-x-auto">
      {levels.map((l, i) => (
        <div key={l} className="flex items-center gap-1 shrink-0">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-md border font-mono-term text-[10px] ${
              i === levels.length - 1
                ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200"
                : "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
            }`}
          >
            {l}
          </div>
          {i < levels.length - 1 && <ArrowRight size={12} className="text-slate-600" />}
        </div>
      ))}
    </div>
  );
}

function HugePageVisual() {
  return (
    <div className="flex h-28 items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <div className="grid grid-cols-4 gap-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-sm bg-cyan-500/40" />
          ))}
        </div>
        <span className="font-mono-term text-[9px] text-cyan-300">512 × 4KB PTEs</span>
      </div>
      <ArrowRight size={16} className="text-slate-500" />
      <div className="flex flex-col items-center gap-1">
        <div className="h-9 w-9 rounded-md bg-amber-500/40 border border-amber-400/60" />
        <span className="font-mono-term text-[9px] text-amber-300">1 × 2MB PMD</span>
      </div>
    </div>
  );
}

function FramesVisual() {
  return (
    <div className="grid h-28 grid-cols-6 gap-1 p-2">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className={`rounded-sm ${
            [3, 7, 11, 14, 19].includes(i) ? "bg-emerald-500/60" : "bg-slate-700/60"
          }`}
        />
      ))}
    </div>
  );
}

function TlbVisual() {
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-2">
      <div className="rounded-lg border border-amber-400/50 bg-amber-500/10 px-4 py-2 font-mono-term text-xs text-amber-200">
        TLB Cache
      </div>
      <div className="flex gap-3 font-mono-term text-[10px]">
        <span className="rounded border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-emerald-300">
          HIT → ~1 cycle
        </span>
        <span className="rounded border border-rose-400/40 bg-rose-500/10 px-2 py-1 text-rose-300">
          MISS → full walk
        </span>
      </div>
    </div>
  );
}

const visuals: Record<string, React.ReactNode> = {
  "pages-vs-hugepages": <HugePageVisual />,
  "page-table-levels": <PageWalkVisual />,
  "physical-frames": <FramesVisual />,
  tlb: <TlbVisual />,
};

export default function MMUSection() {
  const [active, setActive] = useState<ConceptDetail | null>(null);

  return (
    <section id="mmu" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="03"
        kicker="Address Translation"
        accent="cyan"
        title="Address Translation & the MMU"
        description="The Memory Management Unit (MMU) is dedicated CPU hardware that converts every virtual address a program uses into a physical RAM address — consulting multi-level page tables and a hardware TLB cache to do it billions of times per second."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mmuConcepts.map((c) => (
          <ConceptCard key={c.id} concept={c} onOpen={setActive} visual={visuals[c.id]} />
        ))}
      </div>

      <Modal concept={active} onClose={() => setActive(null)} />
    </section>
  );
}
