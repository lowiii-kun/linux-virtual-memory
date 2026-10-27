import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Cpu, GitFork, Gauge, Layers } from "lucide-react";
import { cn } from "../../utils/cn";
import AddressTranslatorTool from "./tools/AddressTranslatorTool";
import PageFaultSimulator from "./tools/PageFaultSimulator";
import CowVisualizer from "./tools/CowVisualizer";
import MemoryPressureSandbox from "./tools/MemoryPressureSandbox";

const tabs = [
  { id: "translator", label: "Address Translator", icon: Cpu },
  { id: "pagefault", label: "Page Fault Pipeline", icon: Layers },
  { id: "cow", label: "Fork & CoW", icon: GitFork },
  { id: "pressure", label: "Memory Pressure & OOM", icon: Gauge },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function LabWorkspace({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<TabId>("translator");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col bg-slate-950">
      <div className="absolute inset-0 grid-pulse-bg opacity-30" />
      <header className="relative z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 sm:px-6">
        <div>
          <p className="font-mono-term text-[10px] uppercase tracking-[0.3em] text-emerald-300">
            Virtual Laboratory
          </p>
          <h2 className="text-lg font-bold text-slate-50 sm:text-xl">Interactive Memory Simulators</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:border-rose-400/60 hover:text-rose-300"
          aria-label="Close laboratory"
        >
          <X size={20} />
        </button>
      </header>

      <div className="relative z-10 flex flex-wrap gap-2 border-b border-slate-800 bg-slate-950/80 px-4 py-3 sm:px-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono-term text-xs transition",
              tab === t.id
                ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200 glow-emerald"
                : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600",
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          {tab === "translator" && <AddressTranslatorTool />}
          {tab === "pagefault" && <PageFaultSimulator />}
          {tab === "cow" && <CowVisualizer />}
          {tab === "pressure" && <MemoryPressureSandbox />}
        </div>
      </div>
    </div>,
    document.body,
  );
}
