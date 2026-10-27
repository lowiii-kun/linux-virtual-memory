import { cn } from "../../utils/cn";

const accentMap = {
  cyan: "text-cyan-300 border-cyan-400/30 bg-cyan-500/5",
  emerald: "text-emerald-300 border-emerald-400/30 bg-emerald-500/5",
  amber: "text-amber-300 border-amber-400/30 bg-amber-500/5",
};

export default function SectionHeading({
  index,
  kicker,
  title,
  description,
  accent = "cyan",
}: {
  index: string;
  kicker: string;
  title: string;
  description: string;
  accent?: "cyan" | "emerald" | "amber";
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono-term text-xs tracking-widest",
          accentMap[accent],
        )}
      >
        {index} // {kicker}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}
