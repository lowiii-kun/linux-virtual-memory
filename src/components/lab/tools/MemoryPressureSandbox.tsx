import { useEffect, useMemo, useState } from "react";
import { AlertOctagon, Gauge, Plus, RotateCcw, Skull } from "lucide-react";
import { cn } from "../../../utils/cn";

interface Proc {
  id: number;
  name: string;
  mem: number; // MB
  score: number;
}

const RAM_TOTAL = 8192;
const SWAP_TOTAL = 4096;
const CACHE_TOTAL = 2048;

const NAME_POOL = [
  "chrome-renderer",
  "node-server",
  "postgres",
  "video-encoder",
  "ml-training-job",
  "docker-container",
  "java-build",
  "vscode-helper",
];

let idCounter = 1;

export default function MemoryPressureSandbox() {
  const [swappiness, setSwappiness] = useState(60);
  const [processes, setProcesses] = useState<Proc[]>([]);
  const [log, setLog] = useState<string[]>(["System idle. RAM and swap are mostly free."]);

  const totals = useMemo(() => {
    const totalMem = processes.reduce((s, p) => s + p.mem, 0);
    const cacheFloor = CACHE_TOTAL * (swappiness / 150);
    let cacheUsed = Math.min(CACHE_TOTAL, Math.max(0, RAM_TOTAL - totalMem));
    let swapUsed = 0;
    let oomNeeded = 0;

    const roomForProcessesInRam = RAM_TOTAL - cacheFloor;
    if (totalMem > roomForProcessesInRam) {
      cacheUsed = cacheFloor;
      const excess = totalMem - roomForProcessesInRam;
      swapUsed = Math.min(excess, SWAP_TOTAL);
      if (excess > SWAP_TOTAL) {
        oomNeeded = excess - SWAP_TOTAL;
      }
    }

    const ramUsedByProcesses = Math.min(totalMem, RAM_TOTAL - cacheUsed);
    const ramUsed = Math.min(RAM_TOTAL, ramUsedByProcesses + cacheUsed);

    return { totalMem, cacheUsed, swapUsed, oomNeeded, ramUsed };
  }, [processes, swappiness]);

  useEffect(() => {
    if (totals.oomNeeded > 0 && processes.length > 0) {
      const victim = [...processes].sort((a, b) => b.score - a.score)[0];
      setProcesses((prev) => prev.filter((p) => p.id !== victim.id));
      setLog((l) => [
        `🔪 OOM Killer invoked: RAM + swap exhausted. Selected "${victim.name}" (${victim.mem} MB, oom_score=${victim.score}) — sent SIGKILL.`,
        ...l,
      ]);
    }
  }, [totals.oomNeeded, processes]);

  function spawnProcess() {
    const name = NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)];
    const mem = 300 + Math.floor(Math.random() * 1300);
    const score = Math.round(mem / 40 + Math.random() * 15);
    const proc: Proc = { id: idCounter++, name: `${name}-${idCounter}`, mem, score };
    setProcesses((p) => [...p, proc]);
    setLog((l) => [`Spawned "${proc.name}" requesting ${mem} MB of anonymous memory.`, ...l]);
  }

  function killOne(id: number) {
    const p = processes.find((pr) => pr.id === id);
    setProcesses((prev) => prev.filter((pr) => pr.id !== id));
    if (p) setLog((l) => [`Manually terminated "${p.name}", freeing ${p.mem} MB.`, ...l]);
  }

  function reset() {
    setProcesses([]);
    setLog(["System reset. RAM and swap are mostly free."]);
  }

  const ramPct = (totals.ramUsed / RAM_TOTAL) * 100;
  const cachePct = (totals.cacheUsed / RAM_TOTAL) * 100;
  const swapPct = (totals.swapUsed / SWAP_TOTAL) * 100;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-50">
          <Gauge size={18} className="text-rose-300" /> Memory Pressure, Swappiness & OOM Killer Sandbox
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Spawn memory-hungry processes and watch RAM fill up with both process memory and page cache.
          Tune <code className="text-amber-300">vm.swappiness</code> to see whether the kernel protects
          the page cache (low) or proactively swaps out anonymous pages (high). Push far enough and the
          OOM Killer will step in.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            onClick={spawnProcess}
            className="flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 font-mono-term text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
          >
            <Plus size={14} /> Spawn Process (~300–1600 MB)
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono-term text-xs text-slate-400 hover:border-slate-500"
          >
            <RotateCcw size={13} /> Reset
          </button>

          <div className="flex min-w-[220px] flex-1 items-center gap-3">
            <span className="font-mono-term text-xs text-slate-400">vm.swappiness</span>
            <input
              type="range"
              min={0}
              max={100}
              value={swappiness}
              onChange={(e) => setSwappiness(Number(e.target.value))}
              className="h-1.5 flex-1 accent-amber-400"
            />
            <span className="w-8 font-mono-term text-xs text-amber-300">{swappiness}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
          <p className="font-mono-term text-xs uppercase tracking-widest text-cyan-300">RAM ({RAM_TOTAL} MB)</p>
          <div className="mt-3 h-6 w-full overflow-hidden rounded-full bg-slate-800 flex">
            <div
              className="h-full bg-cyan-500/70 transition-all duration-500"
              style={{ width: `${Math.max(0, ramPct - cachePct)}%` }}
              title="Process memory"
            />
            <div
              className="h-full bg-emerald-500/50 transition-all duration-500"
              style={{ width: `${cachePct}%` }}
              title="Page cache"
            />
          </div>
          <div className="mt-2 flex justify-between font-mono-term text-[10px] text-slate-400">
            <span><span className="text-cyan-300">■</span> processes</span>
            <span><span className="text-emerald-300">■</span> page cache</span>
            <span>{Math.round(ramPct)}% used</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
          <p className="font-mono-term text-xs uppercase tracking-widest text-amber-300">Swap ({SWAP_TOTAL} MB)</p>
          <div className="mt-3 h-6 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={cn(
                "h-full transition-all duration-500",
                swapPct > 80 ? "bg-rose-500/70" : "bg-amber-500/60",
              )}
              style={{ width: `${swapPct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono-term text-[10px] text-slate-400">
            <span>{Math.round(totals.swapUsed)} MB swapped out</span>
            <span>{Math.round(swapPct)}% used</span>
          </div>
          {totals.oomNeeded > 0 && (
            <p className="mt-3 flex items-center gap-2 rounded-lg border border-rose-400/50 bg-rose-500/10 px-3 py-2 font-mono-term text-[10px] text-rose-300">
              <AlertOctagon size={14} /> Memory + swap exhausted — OOM Killer engaging…
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
        <p className="font-mono-term text-xs uppercase tracking-widest text-slate-300">Running Processes</p>
        {processes.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No active processes. Spawn one to apply memory pressure.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {[...processes]
              .sort((a, b) => b.score - a.score)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-950/50 px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate font-mono-term text-xs text-slate-200">{p.name}</span>
                  <span className="font-mono-term text-[10px] text-slate-500">{p.mem} MB</span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 font-mono-term text-[10px]",
                      p.score > 50
                        ? "border-rose-400/50 text-rose-300 bg-rose-500/10"
                        : "border-slate-600 text-slate-400",
                    )}
                  >
                    score {p.score}
                  </span>
                  <button
                    onClick={() => killOne(p.id)}
                    className="rounded border border-slate-700 p-1.5 text-slate-400 hover:border-rose-400/60 hover:text-rose-300"
                    aria-label="Kill process"
                  >
                    <Skull size={12} />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-700/50 bg-black/50 p-4 font-mono-term text-xs text-emerald-300">
        {log.map((l, i) => (
          <p key={i} className="border-b border-slate-800/60 py-1.5 last:border-0">
            $ {l}
          </p>
        ))}
      </div>
    </div>
  );
}
