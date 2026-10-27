import { ArrowDown, Cpu, FlaskConical, Layers3 } from "lucide-react";

export default function Hero({ onOpenLab }: { onOpenLab: () => void }) {
  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20">
      <div className="absolute inset-0 grid-pulse-bg z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950 z-0" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/5 px-4 py-1.5 font-mono-term text-xs tracking-widest text-cyan-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          CpE 9 · Operating Systems — Interactive Module
        </div>

        <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-50 sm:text-6xl md:text-7xl">
          Virtual Memory
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 text-glow-cyan">
            for Linux
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          An interactive deep dive into how the Linux kernel turns a finite block of physical RAM
          into a vast, private, and secure illusion of memory for every process — from page tables
          and the MMU to swapping, security, and real diagnostic tools.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#introduction"
            className="group inline-flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500/20 glow-cyan"
          >
            Begin Exploration
            <ArrowDown size={16} className="transition group-hover:translate-y-0.5" />
          </a>
          <button
            onClick={onOpenLab}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-500/20 glow-emerald"
          >
            <FlaskConical size={16} />
            Open Virtual Laboratory
          </button>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Layers3, label: "7 Core Modules", color: "text-cyan-300 border-cyan-400/30" },
            { icon: Cpu, label: "Interactive 3D MMU Model", color: "text-emerald-300 border-emerald-400/30" },
            { icon: FlaskConical, label: "4 Live Lab Simulators", color: "text-amber-300 border-amber-400/30" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className={`flex items-center justify-center gap-2 rounded-xl border bg-slate-900/50 px-4 py-3 font-mono-term text-xs ${color}`}
            >
              <Icon size={16} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
