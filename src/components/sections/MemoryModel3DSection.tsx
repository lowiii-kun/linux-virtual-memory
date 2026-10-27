import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MousePointerClick, RotateCw } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import Scene from "../three/Scene";
import { modelParts } from "../three/modelData";

export default function MemoryModel3DSection() {
  const [selected, setSelected] = useState<string | null>("mmu");
  const part = selected ? modelParts[selected] : null;

  return (
    <section id="model-3d" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="08"
        kicker="Spatial Model"
        accent="amber"
        title="Interactive 3D Virtual Memory Model"
        description="Drag to rotate, scroll to zoom, and click any component — the MMU, page tables, RAM frames, or swap storage — to inspect how they connect in the full virtual-to-physical translation pipeline."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="relative h-[420px] overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-950 to-slate-900 shadow-2xl sm:h-[500px]">
          <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-950/70 px-3 py-1.5 font-mono-term text-[10px] text-slate-400">
            <MousePointerClick size={12} /> click a component
          </div>
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-950/70 px-3 py-1.5 font-mono-term text-[10px] text-slate-400">
            <RotateCw size={12} /> drag to orbit
          </div>
          <Canvas camera={{ position: [4.5, 2.2, 5.5], fov: 45 }}>
            <Suspense fallback={null}>
              <Scene selected={selected} onSelect={setSelected} />
            </Suspense>
            <OrbitControls
              enablePan={false}
              minDistance={3.5}
              maxDistance={9}
              autoRotate
              autoRotateSpeed={0.8}
            />
          </Canvas>
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6">
          {part ? (
            <div key={part.id} className="animate-fade-in-up">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border font-mono-term text-xs"
                style={{ borderColor: part.color, color: part.color, background: `${part.color}1a` }}
              >
                ●
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-50">{part.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{part.description}</p>
              <ul className="mt-4 space-y-2">
                {part.facts.map((f, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-slate-700/50 bg-slate-950/50 p-2.5 text-xs text-slate-400"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Select a component to see details.</p>
          )}

          <div className="mt-auto pt-6 flex flex-wrap gap-2">
            {Object.values(modelParts).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className="rounded-full border px-3 py-1.5 font-mono-term text-[10px] transition"
                style={{
                  borderColor: selected === p.id ? p.color : "#334155",
                  color: selected === p.id ? p.color : "#94a3b8",
                  background: selected === p.id ? `${p.color}1a` : "transparent",
                }}
              >
                {p.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
