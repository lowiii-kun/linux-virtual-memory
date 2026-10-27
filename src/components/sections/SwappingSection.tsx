import { useState } from "react";
import { AlertOctagon, ArrowLeftRight, Gauge, Layers } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import ConceptCard from "../common/ConceptCard";
import Modal from "../common/Modal";
import { swapConcepts } from "../../data/concepts";
import type { ConceptDetail } from "../../types";

function CacheVisual() {
  return (
    <div className="flex h-28 items-center justify-center">
      <Layers className="text-emerald-300" size={34} />
      <div className="ml-3 flex flex-col gap-1 font-mono-term text-[9px]">
        <span className="rounded bg-emerald-500/10 border border-emerald-400/30 px-2 py-0.5 text-emerald-300">buff/cache</span>
        <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-400">reclaimable instantly</span>
      </div>
    </div>
  );
}

function SwapVisual() {
  return (
    <div className="flex h-28 items-center justify-center gap-3">
      <ArrowLeftRight className="text-amber-300" size={28} />
      <div className="flex flex-col gap-1 font-mono-term text-[9px] text-slate-400">
        <span>RAM ⇄ Disk/zram</span>
        <span className="text-amber-300">cold anon pages</span>
      </div>
    </div>
  );
}

function SwappinessVisual() {
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-2">
      <Gauge className="text-amber-300" size={26} />
      <div className="h-1.5 w-36 rounded-full bg-slate-700">
        <div className="h-1.5 w-[60%] rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" />
      </div>
      <span className="font-mono-term text-[10px] text-slate-400">vm.swappiness = 60 (default)</span>
    </div>
  );
}

function OomVisual() {
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-2">
      <AlertOctagon className="text-rose-400" size={26} />
      <span className="rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 font-mono-term text-[10px] text-rose-300">
        SIGKILL highest badness
      </span>
    </div>
  );
}

const visuals: Record<string, React.ReactNode> = {
  "page-cache": <CacheVisual />,
  "swap-space": <SwapVisual />,
  swappiness: <SwappinessVisual />,
  "oom-killer": <OomVisual />,
};

export default function SwappingSection() {
  const [active, setActive] = useState<ConceptDetail | null>(null);

  return (
    <section id="swapping" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="05"
        kicker="Memory Pressure"
        accent="amber"
        title="Swapping, Caching & Memory Pressure"
        description="RAM is always treated as precious, reclaimable space. Linux fills unused RAM with a page cache for speed, pushes idle anonymous pages to swap under pressure, and — in the worst case — unleashes the OOM Killer to save the system from collapse."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {swapConcepts.map((c) => (
          <ConceptCard key={c.id} concept={c} onOpen={setActive} visual={visuals[c.id]} />
        ))}
      </div>

      <Modal concept={active} onClose={() => setActive(null)} />
    </section>
  );
}
