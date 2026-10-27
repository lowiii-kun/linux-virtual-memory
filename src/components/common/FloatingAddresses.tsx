import { useMemo } from "react";

function randomHex() {
  return "0x" + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0");
}

export default function FloatingAddresses({ count = 16 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 14 + Math.random() * 14,
        size: 10 + Math.random() * 4,
        label: randomHex(),
        color: ["text-cyan-400/30", "text-emerald-400/25", "text-amber-400/25"][i % 3],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {items.map((it) => (
        <span
          key={it.id}
          className={`absolute font-mono-term ${it.color}`}
          style={{
            left: `${it.left}%`,
            bottom: "-5%",
            fontSize: `${it.size}px`,
            animation: `floatUp ${it.duration}s linear ${it.delay}s infinite`,
          }}
        >
          {it.label}
        </span>
      ))}
    </div>
  );
}
