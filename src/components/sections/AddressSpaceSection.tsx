import { useState } from "react";
import SectionHeading from "../common/SectionHeading";
import Modal from "../common/Modal";
import { addressSpaceConcepts } from "../../data/concepts";
import type { ConceptDetail } from "../../types";
import { cn } from "../../utils/cn";

const order = [
  "kernel-space-segment",
  "stack-segment",
  "mmap-shared-libs",
  "heap-segment",
  "data-bss",
  "text-segment",
];

const accentBar = {
  cyan: "from-cyan-500/30 to-cyan-500/5 border-cyan-400/40",
  emerald: "from-emerald-500/30 to-emerald-500/5 border-emerald-400/40",
  amber: "from-amber-500/30 to-amber-500/5 border-amber-400/40",
};

export default function AddressSpaceSection() {
  const [active, setActive] = useState<ConceptDetail | null>(null);
  const byId = Object.fromEntries(addressSpaceConcepts.map((c) => [c.id, c]));

  return (
    <section id="address-space" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="02"
        kicker="Per-Process Isolation"
        accent="emerald"
        title="The Process Address Space"
        description="Every Linux process believes it owns the entire address space — a private illusion maintained by the kernel. This virtual space is carved into well-defined segments. Click any band in the memory map below to explore its role, kernel source path, and related system calls."
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-4 sm:p-6">
          <p className="mb-4 font-mono-term text-xs uppercase tracking-widest text-slate-500">
            0xFFFFFFFFFFFFFFFF (high) → 0x0000000000000000 (low)
          </p>
          <div className="flex flex-col gap-2">
            {order.map((id, i) => {
              const c = byId[id];
              const heightClass = id === "kernel-space-segment" ? "h-16" : id === "text-segment" ? "h-12" : "h-16 sm:h-20";
              return (
                <div
                  key={id}
                  onClick={() => setActive(c)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActive(c)}
                  className={cn(
                    "clickable-card flex items-center justify-between rounded-lg border bg-gradient-to-r px-4 shadow-md",
                    heightClass,
                    accentBar[c.accent],
                  )}
                >
                  <div>
                    <p className="font-mono-term text-[10px] text-slate-400">
                      SEGMENT {String(order.length - i).padStart(2, "0")}
                    </p>
                    <p className="text-sm font-semibold text-slate-100 sm:text-base">{c.title}</p>
                  </div>
                  <span className="font-mono-term text-[10px] text-slate-500 hidden sm:block">click →</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center font-mono-term text-xs text-slate-500">
            ↑ growth direction varies: heap grows up, stack grows down ↓
          </p>
        </div>

        <div className="space-y-4">
          {addressSpaceConcepts.slice(0, 4).map((c) => (
            <div
              key={c.id}
              onClick={() => setActive(c)}
              className="clickable-card rounded-xl card-surface border border-slate-700/50 p-4 hover:border-emerald-400/40"
            >
              <p className="font-mono-term text-[11px] uppercase tracking-widest text-emerald-300">{c.tagline}</p>
              <h4 className="mt-1 font-semibold text-slate-100">{c.title}</h4>
              <p className="mt-1.5 text-sm text-slate-400">{c.summary}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal concept={active} onClose={() => setActive(null)} />
    </section>
  );
}
