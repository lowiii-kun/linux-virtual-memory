import { useMemo, useState } from "react";
import { ArrowRight, Binary, Gauge, RefreshCcw } from "lucide-react";
import { cn } from "../../../utils/cn";

const TLB_CAPACITY = 4;
const WORKING_SET_BYTES = 48 * 1024 * 1024; // 48MB simulated working set

function randomAddress() {
  return Math.floor(Math.random() * WORKING_SET_BYTES);
}

function toHex(n: number) {
  return "0x" + n.toString(16).padStart(8, "0");
}

export default function AddressTranslatorTool() {
  const [hugePages, setHugePages] = useState(false);
  const [address, setAddress] = useState(randomAddress());
  const [tlb, setTlb] = useState<number[]>([]);
  const [history, setHistory] = useState<{ hit: boolean }[]>([]);

  const pageSize = hugePages ? 2 * 1024 * 1024 : 4096;
  const pageNumber = Math.floor(address / pageSize);
  const offset = address % pageSize;

  const bits = useMemo(() => {
    // Simplified illustrative bit split (not literal hardware bit counts for huge-page offset)
    if (hugePages) {
      return [
        { label: "PGD", bits: 9 },
        { label: "PUD", bits: 9 },
        { label: "PMD", bits: 9 },
        { label: "Offset", bits: 21 },
      ];
    }
    return [
      { label: "PGD", bits: 9 },
      { label: "PUD", bits: 9 },
      { label: "PMD", bits: 9 },
      { label: "PTE", bits: 9 },
      { label: "Offset", bits: 12 },
    ];
  }, [hugePages]);

  const steps = bits.length - 1; // table walks before hitting data

  function accessAddress(fresh = true) {
    const addr = fresh ? randomAddress() : address;
    setAddress(addr);
    const pn = Math.floor(addr / pageSize);
    setTlb((prev) => {
      const hit = prev.includes(pn);
      setHistory((h) => [...h.slice(-19), { hit }]);
      if (hit) {
        // move to front (MRU)
        return [pn, ...prev.filter((p) => p !== pn)];
      }
      const next = [pn, ...prev].slice(0, TLB_CAPACITY);
      return next;
    });
  }

  function reset() {
    setTlb([]);
    setHistory([]);
    setAddress(randomAddress());
  }

  const hitRate = history.length ? Math.round((history.filter((h) => h.hit).length / history.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-50">
          <Binary size={18} className="text-cyan-300" /> Address Translator & Page Size Switcher
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Toggle between standard 4&nbsp;KB pages and 2&nbsp;MB Transparent Huge Pages, then repeatedly
          "access" addresses from a simulated 48&nbsp;MB working set to watch how fewer, larger pages
          dramatically improve the TLB hit-rate and shorten the page-table walk.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="font-mono-term text-xs text-slate-400">Page Size:</span>
          <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-1">
            <button
              onClick={() => {
                setHugePages(false);
                reset();
              }}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono-term text-xs transition",
                !hugePages ? "bg-cyan-500/20 text-cyan-200" : "text-slate-500",
              )}
            >
              4 KB Standard
            </button>
            <button
              onClick={() => {
                setHugePages(true);
                reset();
              }}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono-term text-xs transition",
                hugePages ? "bg-amber-500/20 text-amber-200" : "text-slate-500",
              )}
            >
              2 MB Huge Pages
            </button>
          </div>

          <button
            onClick={() => accessAddress(true)}
            className="ml-auto flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 font-mono-term text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
          >
            Access Random Address
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono-term text-xs text-slate-400 hover:border-slate-500"
          >
            <RefreshCcw size={13} /> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
          <p className="font-mono-term text-xs uppercase tracking-widest text-cyan-300">Current Virtual Address</p>
          <p className="mt-2 font-mono-term text-2xl text-slate-100">{toHex(address)}</p>

          <div className="mt-4 flex flex-wrap items-center gap-1">
            {bits.map((b, i) => (
              <div key={b.label} className="flex items-center gap-1">
                <div
                  className={cn(
                    "rounded-md border px-2.5 py-2 text-center font-mono-term text-[10px]",
                    b.label === "Offset"
                      ? "border-slate-600 bg-slate-800 text-slate-300"
                      : "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
                  )}
                >
                  <div>{b.label}</div>
                  <div className="text-slate-500">{b.bits}b</div>
                </div>
                {i < bits.length - 1 && <ArrowRight size={12} className="text-slate-600" />}
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 font-mono-term text-xs">
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-3">
              <p className="text-slate-500">Page Number</p>
              <p className="mt-1 text-emerald-300">{pageNumber}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-3">
              <p className="text-slate-500">In-Page Offset</p>
              <p className="mt-1 text-amber-300">{offset}</p>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-3 col-span-2">
              <p className="text-slate-500">Table Walks Required (on TLB miss)</p>
              <p className="mt-1 text-cyan-300">
                {steps} level{steps > 1 ? "s" : ""} {hugePages && "(PTE level skipped)"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
          <p className="flex items-center gap-2 font-mono-term text-xs uppercase tracking-widest text-emerald-300">
            <Gauge size={14} /> Simulated TLB ({TLB_CAPACITY} entries)
          </p>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: TLB_CAPACITY }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex h-14 items-center justify-center rounded-lg border font-mono-term text-[10px]",
                  tlb[i] !== undefined
                    ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200"
                    : "border-slate-700 bg-slate-950/50 text-slate-600",
                )}
              >
                {tlb[i] !== undefined ? `PFN ${tlb[i]}` : "empty"}
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between font-mono-term text-xs text-slate-400">
              <span>Rolling Hit Rate (last {history.length})</span>
              <span className={hitRate > 50 ? "text-emerald-300" : "text-amber-300"}>{hitRate}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${hitRate}%` }}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
            {history.map((h, i) => (
              <span
                key={i}
                className={cn(
                  "h-5 w-5 shrink-0 rounded-sm border font-mono-term text-[8px] flex items-center justify-center",
                  h.hit
                    ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-300"
                    : "border-rose-400/50 bg-rose-500/10 text-rose-300",
                )}
                title={h.hit ? "TLB Hit" : "TLB Miss"}
              >
                {h.hit ? "H" : "M"}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {hugePages
              ? "Each 2MB entry covers 512× more memory than a 4KB entry, so the same 4-slot TLB now blankets the entire working set — expect a much higher hit rate."
              : "Each entry only covers 4KB, so the small working set quickly evicts useful entries — expect more frequent misses."}
          </p>
        </div>
      </div>
    </div>
  );
}
