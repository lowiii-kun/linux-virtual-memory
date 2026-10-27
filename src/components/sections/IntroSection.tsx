import { useState } from "react";
import { Cpu, GitBranch, ShieldHalf, Users } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import ConceptCard from "../common/ConceptCard";
import Modal from "../common/Modal";
import { introConcepts } from "../../data/concepts";
import type { ConceptDetail } from "../../types";

function RingVisual() {
  return (
    <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
      <div className="absolute h-32 w-32 rounded-full border-2 border-dashed border-slate-600/60" />
      <div className="absolute h-20 w-20 rounded-full border-2 border-cyan-400/60" />
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-mono-term text-cyan-200">
        R0
      </div>
      <span className="absolute -top-1 right-3 font-mono-term text-[10px] text-slate-400">Ring 3</span>
      <span className="absolute bottom-6 left-0 font-mono-term text-[10px] text-cyan-300">Ring 0</span>
    </div>
  );
}

function KernelStackVisual() {
  return (
    <div className="flex h-32 flex-col justify-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-950/50 p-3 font-mono-term text-[10px]">
      {["Network Stack", "Filesystems (VFS)", "Memory Mgmt (mm/)", "Process Scheduler", "Device Drivers"].map((l, i) => (
        <div
          key={l}
          className="flex items-center gap-2 rounded border border-slate-700/50 bg-slate-800/60 px-2 py-1"
          style={{ opacity: 1 - i * 0.08 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="text-slate-300">{l}</span>
        </div>
      ))}
    </div>
  );
}

function OrbitVisual() {
  return (
    <div className="relative flex h-32 items-center justify-center">
      <Cpu className="text-amber-300" size={30} />
      <div className="absolute h-28 w-28 animate-spin rounded-full border border-dashed border-amber-400/30" style={{ animationDuration: "12s" }} />
      {["P1", "P2", "P3", "P4"].map((p, i) => (
        <span
          key={p}
          className="absolute rounded-full bg-amber-500/20 px-2 py-0.5 font-mono-term text-[9px] text-amber-200 border border-amber-400/40"
          style={{
            transform: `rotate(${i * 90}deg) translate(56px) rotate(-${i * 90}deg)`,
          }}
        >
          {p}
        </span>
      ))}
    </div>
  );
}

function TuxVisual() {
  return (
    <div className="flex h-32 items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-500/5 px-4 py-3">
        <span className="font-mono-term text-2xl">🐧</span>
        <span className="font-mono-term text-[10px] text-emerald-300">kernel.org</span>
      </div>
      <GitBranch className="text-slate-500" size={20} />
      <div className="flex flex-col gap-1 font-mono-term text-[9px] text-slate-400">
        <span className="rounded border border-slate-700 px-2 py-0.5">GPLv2</span>
        <span className="rounded border border-slate-700 px-2 py-0.5">Open Source</span>
        <span className="rounded border border-slate-700 px-2 py-0.5">Unix-like</span>
      </div>
    </div>
  );
}

const visuals: Record<string, React.ReactNode> = {
  "linux-os-type": <TuxVisual />,
  "monolithic-kernel": <KernelStackVisual />,
  "ring-boundary": <RingVisual />,
  "multitask-multiuser": <OrbitVisual />,
};

export default function IntroSection() {
  const [active, setActive] = useState<ConceptDetail | null>(null);

  return (
    <section id="introduction" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="01"
        kicker="Foundations"
        accent="cyan"
        title="Introduction to Linux & OS Architecture"
        description="Before diving into memory internals, let's ground ourselves in what Linux actually is: an open-source, Unix-like, monolithic-kernel operating system engineered for multi-tasking and multi-user workloads — all protected by a hard boundary between user space and kernel space."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {introConcepts.map((c) => (
          <ConceptCard key={c.id} concept={c} onOpen={setActive} visual={visuals[c.id]} />
        ))}
      </div>

      <div className="mt-10 grid gap-4 rounded-2xl border border-slate-700/40 bg-slate-900/40 p-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <Users className="mt-1 shrink-0 text-cyan-300" size={20} />
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-200">Multi-user:</span> dozens of accounts can
            run isolated workloads on one machine simultaneously, each shielded by independent
            virtual address spaces and permission checks.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <ShieldHalf className="mt-1 shrink-0 text-emerald-300" size={20} />
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-200">Ring isolation:</span> the kernel (Ring 0)
            is the only code trusted to manipulate page tables directly — user processes (Ring 3)
            must always ask politely via a system call.
          </p>
        </div>
      </div>

      <Modal concept={active} onClose={() => setActive(null)} />
    </section>
  );
}
