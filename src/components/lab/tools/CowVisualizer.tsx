import { useState } from "react";
import { GitFork, RotateCcw, Copy, Lock } from "lucide-react";
import { cn } from "../../../utils/cn";

interface Page {
  id: number;
  label: string;
  owner: "shared" | "parent" | "child";
  refs: number;
}

const initialPages = (): Page[] => [
  { id: 0, label: "Code (.text)", owner: "shared", refs: 2 },
  { id: 1, label: "Heap Page A", owner: "shared", refs: 2 },
  { id: 2, label: "Heap Page B", owner: "shared", refs: 2 },
  { id: 3, label: "Stack Page", owner: "shared", refs: 2 },
];

export default function CowVisualizer() {
  const [forked, setForked] = useState(false);
  const [pages, setPages] = useState<Page[]>(initialPages());
  const [log, setLog] = useState<string[]>([]);

  function doFork() {
    setForked(true);
    setPages(initialPages());
    setLog(["fork() called → child created. Page tables copied, physical pages shared (refcount=2). No data copied yet."]);
  }

  function writeToPage(id: number, by: "parent" | "child") {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== id || p.owner !== "shared") return p;
        setLog((l) => [
          ...l,
          `${by === "parent" ? "Parent" : "Child"} writes to "${p.label}" → write-protection fault → do_wp_page() copies the page → ${by} now owns a private copy (refcount split 1/1).`,
        ]);
        return { ...p, owner: by, refs: 1 };
      }),
    );
  }

  function reset() {
    setForked(false);
    setPages(initialPages());
    setLog([]);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-50">
          <GitFork size={18} className="text-amber-300" /> Fork & Copy-on-Write (CoW) Visualizer
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Click "fork()" to spawn a child process that instantly shares every physical page with its
          parent, marked read-only. Then try writing to a page from either side — watch the kernel
          split off a private copy only at that moment (Copy-on-Write).
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={doFork}
            className="flex items-center gap-2 rounded-lg border border-amber-400/50 bg-amber-500/10 px-4 py-2 font-mono-term text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
          >
            <GitFork size={14} /> fork()
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono-term text-xs text-slate-400 hover:border-slate-500"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {!forked ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center text-sm text-slate-500">
          No child process yet. Click fork() to begin.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {(["parent", "child"] as const).map((role) => (
            <div key={role} className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
              <p
                className={cn(
                  "font-mono-term text-xs uppercase tracking-widest",
                  role === "parent" ? "text-cyan-300" : "text-emerald-300",
                )}
              >
                {role === "parent" ? "Parent Process (PID 1000)" : "Child Process (PID 1001)"}
              </p>
              <div className="mt-3 space-y-2">
                {pages.map((p) => {
                  const belongsHere = p.owner === "shared" || p.owner === role;
                  return (
                    <div
                      key={p.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-3 py-2.5 text-xs transition",
                        !belongsHere
                          ? "border-slate-800 bg-slate-950/30 opacity-30"
                          : p.owner === "shared"
                          ? "border-amber-400/40 bg-amber-500/10"
                          : role === "parent"
                          ? "border-cyan-400/40 bg-cyan-500/10"
                          : "border-emerald-400/40 bg-emerald-500/10",
                      )}
                    >
                      <span className="flex items-center gap-2 text-slate-200">
                        {p.owner === "shared" && <Lock size={12} className="text-amber-300" />}
                        {p.label}
                      </span>
                      {belongsHere && (
                        <div className="flex items-center gap-2">
                          <span className="font-mono-term text-[10px] text-slate-500">
                            {p.owner === "shared" ? `refs=${p.refs} (RO)` : "private"}
                          </span>
                          {p.owner === "shared" && (
                            <button
                              onClick={() => writeToPage(p.id, role)}
                              className="flex items-center gap-1 rounded border border-slate-600 px-2 py-1 font-mono-term text-[10px] text-slate-300 hover:border-cyan-400/60 hover:text-cyan-300"
                            >
                              <Copy size={10} /> write
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {log.length > 0 && (
        <div className="rounded-2xl border border-slate-700/50 bg-black/50 p-4 font-mono-term text-xs text-emerald-300">
          {log.map((l, i) => (
            <p key={i} className="border-b border-slate-800/60 py-1.5 last:border-0">
              $ {l}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
