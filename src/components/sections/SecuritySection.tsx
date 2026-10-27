import { useState } from "react";
import { Dices, ShieldBan } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import ConceptCard from "../common/ConceptCard";
import Modal from "../common/Modal";
import { securityConcepts } from "../../data/concepts";
import type { ConceptDetail } from "../../types";

function AslrVisual() {
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-2 font-mono-term text-[10px]">
      <Dices className="text-emerald-300" size={24} />
      <span className="text-slate-500">stack base, run 1:</span>
      <span className="text-emerald-300">0x7ffd_a21{Math.random() > 0.5 ? "3" : "9"}c000</span>
      <span className="text-slate-500">stack base, run 2:</span>
      <span className="text-emerald-300">0x7ffd_f08{Math.random() > 0.5 ? "7" : "2"}a000</span>
    </div>
  );
}

function NxVisual() {
  return (
    <div className="flex h-28 items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2">
        <ShieldBan className="text-rose-300" size={20} />
        <span className="font-mono-term text-[9px] text-rose-300">shellcode blocked</span>
      </div>
      <span className="font-mono-term text-[10px] text-slate-500">stack page: RW, NX=1</span>
    </div>
  );
}

const visuals: Record<string, React.ReactNode> = {
  aslr: <AslrVisual />,
  "nx-bit": <NxVisual />,
};

export default function SecuritySection() {
  const [active, setActive] = useState<ConceptDetail | null>(null);

  return (
    <section id="security" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="06"
        kicker="Hardening"
        accent="emerald"
        title="Memory Security Mechanics"
        description="Virtual memory isn't just about performance — it's a foundational security boundary. By controlling where code and data live, and which pages can be executed, Linux defeats entire classes of classic memory corruption exploits."
      />

      <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
        {securityConcepts.map((c) => (
          <ConceptCard key={c.id} concept={c} onOpen={setActive} visual={visuals[c.id]} />
        ))}
      </div>

      <Modal concept={active} onClose={() => setActive(null)} />
    </section>
  );
}
