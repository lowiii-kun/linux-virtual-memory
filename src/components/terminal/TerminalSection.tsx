import { useEffect, useState } from "react";
import { TerminalSquare, PlayCircle } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import { terminalCommands } from "./terminalData";
import { cn } from "../../utils/cn";

export default function TerminalSection() {
  const [activeId, setActiveId] = useState(terminalCommands[0].id);
  const [typed, setTyped] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const active = terminalCommands.find((c) => c.id === activeId)!;

  useEffect(() => {
    setTyped("");
    setShowOutput(false);
    let i = 0;
    const cmd = active.command;
    const interval = setInterval(() => {
      i++;
      setTyped(cmd.slice(0, i));
      if (i >= cmd.length) {
        clearInterval(interval);
        setTimeout(() => setShowOutput(true), 250);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [activeId, active.command]);

  return (
    <section id="terminal" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="07"
        kicker="Hands-On Diagnostics"
        accent="cyan"
        title="Real-World Diagnostic Tools CLI"
        description="Theory meets practice: explore simulated, realistic outputs of the exact commands Linux engineers run daily to diagnose memory health, inspect per-process maps, and watch swap activity live."
      />

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {terminalCommands.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono-term text-xs transition",
              activeId === c.id
                ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-200 glow-cyan"
                : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600",
            )}
          >
            $ {c.command}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-black/70 shadow-2xl shadow-cyan-500/5">
          <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 flex items-center gap-1.5 font-mono-term text-xs text-slate-400">
              <TerminalSquare size={13} /> root@linux-lab:~
            </span>
          </div>
          <div className="min-h-[340px] p-5 font-mono-term text-[12.5px] leading-relaxed text-emerald-300 sm:text-sm">
            <p>
              <span className="text-cyan-400">root@linux-lab</span>
              <span className="text-slate-500">:</span>
              <span className="text-amber-300">~</span>
              <span className="text-slate-500">$ </span>
              <span className="text-slate-100">{typed}</span>
              {!showOutput && <span className="blink-cursor text-slate-200">▌</span>}
            </p>
            {showOutput && (
              <pre className="mt-2 whitespace-pre-wrap text-slate-300 animate-fade-in-up">{active.output}</pre>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
            <p className="flex items-center gap-2 font-mono-term text-xs uppercase tracking-widest text-cyan-300">
              <PlayCircle size={14} /> What am I looking at?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{active.description}</p>
          </div>
          <div className="space-y-2.5 rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 max-h-[320px] overflow-y-auto">
            <p className="font-mono-term text-xs uppercase tracking-widest text-emerald-300">Field Breakdown</p>
            {active.breakdown.map((b) => (
              <div key={b.field} className="rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
                <p className="font-mono-term text-xs text-amber-300">{b.field}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{b.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
