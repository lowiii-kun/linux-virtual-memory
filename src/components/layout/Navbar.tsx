import { useEffect, useState } from "react";
import { Menu, X, TerminalSquare } from "lucide-react";

const links = [
  { href: "#introduction", label: "Intro" },
  { href: "#address-space", label: "Address Space" },
  { href: "#mmu", label: "MMU" },
  { href: "#page-faults", label: "Page Faults" },
  { href: "#swapping", label: "Swap & OOM" },
  { href: "#security", label: "Security" },
  { href: "#model-3d", label: "3D Model" },
  { href: "#terminal", label: "Terminal" },
];

export default function Navbar({ onOpenLab }: { onOpenLab: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 glow-cyan">
            <TerminalSquare size={18} />
          </span>
          <span className="font-mono-term text-sm font-semibold tracking-wide text-slate-100">
            vmem<span className="text-cyan-400">@</span>linux
            <span className="text-slate-500">:~$</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-cyan-300"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={onOpenLab}
            className="ml-2 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 glow-emerald"
          >
            Virtual Lab
          </button>
        </div>

        <button
          className="rounded-md border border-slate-700 p-2 text-slate-200 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-cyan-300"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                onOpenLab();
              }}
              className="mt-1 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2.5 text-sm font-semibold text-emerald-300"
            >
              Virtual Laboratory
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
