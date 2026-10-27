import { useState } from "react";
import { CheckCircle2, ChevronRight, HardDrive, Layers, RotateCcw, Zap } from "lucide-react";
import { cn } from "../../../utils/cn";

type FaultType = "minor" | "major";

interface Stage {
  title: string;
  detail: string;
  icon: React.ReactNode;
}

const baseStages: Stage[] = [
  {
    title: "1. CPU Accesses Virtual Address",
    detail: "A `mov` instruction touches a virtual address that hasn't been mapped into the page table yet (e.g., a freshly brk()'d heap page).",
    icon: <Zap size={16} />,
  },
  {
    title: "2. MMU / TLB Lookup Misses",
    detail: "The MMU checks the TLB for a cached translation — it isn't there, so it begins a full page-table walk and finds the PTE marked 'not present'.",
    icon: <Layers size={16} />,
  },
  {
    title: "3. Page Fault Exception Raised",
    detail: "The CPU traps into the kernel, invoking the architecture fault handler which calls into mm/memory.c's handle_mm_fault().",
    icon: <Zap size={16} />,
  },
  {
    title: "4. Kernel Classifies the Fault",
    detail: "The kernel checks the VMA covering this address: is it valid? Is the page already resident elsewhere (minor), or does it require disk I/O (major)?",
    icon: <Layers size={16} />,
  },
];

const minorStages: Stage[] = [
  {
    title: "5a. Minor Fault: Resolve In-Memory",
    detail: "The physical page is already in RAM — maybe the kernel's shared zero-page, or a page cache entry from a shared library. No disk I/O occurs.",
    icon: <CheckCircle2 size={16} />,
  },
  {
    title: "6a. Update Page Table Entry",
    detail: "The kernel allocates (if needed) and installs a valid PTE pointing at the resident frame, marking it present.",
    icon: <Layers size={16} />,
  },
  {
    title: "7a. Resume Execution",
    detail: "The faulting instruction is retried from Ring 3 — this time the TLB/page-table lookup succeeds, often within a few microseconds total.",
    icon: <CheckCircle2 size={16} />,
  },
];

const majorStages: Stage[] = [
  {
    title: "5b. Major Fault: Schedule Disk I/O",
    detail: "The data lives only on swap or in a backing file. The process is descheduled (sleeps) while the kernel issues a block I/O read request.",
    icon: <HardDrive size={16} />,
  },
  {
    title: "6b. Page Read From Swap/Disk",
    detail: "Milliseconds pass — orders of magnitude slower than RAM — as the storage device transfers the page's data into a freshly allocated frame.",
    icon: <HardDrive size={16} />,
  },
  {
    title: "7b. Update Page Table & Resume",
    detail: "Once I/O completes, the kernel installs the PTE, wakes the process, and execution resumes exactly where it faulted.",
    icon: <CheckCircle2 size={16} />,
  },
];

export default function PageFaultSimulator() {
  const [faultType, setFaultType] = useState<FaultType>("minor");
  const [stepIndex, setStepIndex] = useState(0);

  const fullPipeline = [...baseStages, ...(faultType === "minor" ? minorStages : majorStages)];
  const atBranch = stepIndex === baseStages.length - 1;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-50">
          <Layers size={18} className="text-emerald-300" /> Step-by-Step Page Fault Pipeline Simulator
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Step through exactly what the Linux kernel does the moment a page fault is raised. At the
          branch point, choose whether the fault resolves as a cheap minor fault or an expensive major
          fault requiring disk I/O.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="font-mono-term text-xs text-slate-400">Fault outcome:</span>
          <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-1">
            <button
              onClick={() => {
                setFaultType("minor");
                if (stepIndex > baseStages.length - 1) setStepIndex(baseStages.length - 1);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono-term text-xs transition",
                faultType === "minor" ? "bg-cyan-500/20 text-cyan-200" : "text-slate-500",
              )}
            >
              Minor Fault
            </button>
            <button
              onClick={() => {
                setFaultType("major");
                if (stepIndex > baseStages.length - 1) setStepIndex(baseStages.length - 1);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono-term text-xs transition",
                faultType === "major" ? "bg-amber-500/20 text-amber-200" : "text-slate-500",
              )}
            >
              Major Fault
            </button>
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
              disabled={stepIndex === 0}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono-term text-xs text-slate-400 disabled:opacity-30"
            >
              Back
            </button>
            <button
              onClick={() => setStepIndex((s) => Math.min(fullPipeline.length - 1, s + 1))}
              disabled={stepIndex === fullPipeline.length - 1}
              className="flex items-center gap-1 rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-3 py-2 font-mono-term text-xs text-emerald-300 disabled:opacity-30"
            >
              Next Step <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setStepIndex(0)}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono-term text-xs text-slate-400"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-2">
          {fullPipeline.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all",
                i === stepIndex
                  ? "border-emerald-400/60 bg-emerald-500/10 scale-[1.02]"
                  : i < stepIndex
                  ? "border-slate-700/50 bg-slate-900/40 opacity-60"
                  : "border-slate-800 bg-slate-950/40 opacity-40",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono-term text-[10px]",
                  i <= stepIndex ? "border-emerald-400/50 text-emerald-300" : "border-slate-700 text-slate-600",
                )}
              >
                {i + 1}
              </span>
              <span className="text-xs font-medium text-slate-200 sm:text-sm">{s.title.replace(/^\d+[ab]?\.\s/, "")}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-slate-900/60 p-6 glow-emerald">
          <div className="flex items-center gap-2 text-emerald-300">{fullPipeline[stepIndex].icon}
            <span className="font-mono-term text-xs uppercase tracking-widest">Current Stage</span>
          </div>
          <h4 className="mt-3 text-xl font-bold text-slate-50">{fullPipeline[stepIndex].title}</h4>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{fullPipeline[stepIndex].detail}</p>

          {atBranch && (
            <p className="mt-4 rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-200">
              Branch point reached — use the toggle above to pick Minor or Major before clicking "Next Step".
            </p>
          )}

          {stepIndex === fullPipeline.length - 1 && (
            <p className="mt-4 rounded-lg border border-cyan-400/40 bg-cyan-500/10 p-3 text-xs text-cyan-200">
              Pipeline complete — the instruction resumes as if nothing happened, which is exactly why
              page faults are often invisible to the application itself.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
