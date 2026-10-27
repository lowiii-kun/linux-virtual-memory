import { BookOpen, ExternalLink, Sparkles } from "lucide-react";

const references = [
  {
    category: "Official Linux Kernel Documentation",
    items: [
      { label: "Linux Kernel Memory Management Documentation", url: "https://www.kernel.org/doc/html/latest/admin-guide/mm/index.html" },
      { label: "Transparent Hugepage Support", url: "https://www.kernel.org/doc/html/latest/admin-guide/mm/transhuge.html" },
      { label: "Concepts Overview — mm/", url: "https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html" },
    ],
  },
  {
    category: "Elixir Bootlin Cross-Reference",
    items: [
      { label: "mm/memory.c (page fault handling)", url: "https://elixir.bootlin.com/linux/latest/source/mm/memory.c" },
      { label: "mm/mmap.c (VMA & mmap/brk management)", url: "https://elixir.bootlin.com/linux/latest/source/mm/mmap.c" },
      { label: "mm/oom_kill.c (OOM Killer)", url: "https://elixir.bootlin.com/linux/latest/source/mm/oom_kill.c" },
    ],
  },
  {
    category: "LWN.net Articles",
    items: [
      { label: "The page cache and page writeback", url: "https://lwn.net/Kernel/Index/#Memory_management-Page_cache" },
      { label: "Five-level page tables", url: "https://lwn.net/Articles/717293/" },
      { label: "Kernel Page Table Isolation (KPTI)", url: "https://lwn.net/Articles/741878/" },
    ],
  },
  {
    category: "Manual Pages (man7.org)",
    items: [
      { label: "proc(5) — /proc/meminfo documentation", url: "https://man7.org/linux/man-pages/man5/proc.5.html" },
      { label: "mmap(2) system call reference", url: "https://man7.org/linux/man-pages/man2/mmap.2.html" },
      { label: "vmstat(8) / pmap(1) diagnostic tools", url: "https://man7.org/linux/man-pages/man8/vmstat.8.html" },
    ],
  },
  {
    category: "Academic Textbooks",
    items: [
      { label: "Silberschatz, Galvin, Gagne — Operating System Concepts, 10th Ed.", url: "" },
      { label: "Bovet & Cesati — Understanding the Linux Kernel, 3rd Ed.", url: "" },
      { label: "Love, R. — Linux Kernel Development, 3rd Ed.", url: "" },
    ],
  },
];

export default function ReferencesSection() {
  return (
    <section id="references" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/40 px-3 py-1 font-mono-term text-xs tracking-widest text-slate-300">
          <BookOpen size={13} /> References & Sources
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Grounded in Official Documentation
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-400">
          Every technical claim on this site traces back to authoritative kernel documentation, source
          code, and established operating systems textbooks.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {references.map((group) => (
          <div key={group.category} className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
            <h4 className="font-mono-term text-xs uppercase tracking-widest text-cyan-300">{group.category}</h4>
            <ul className="mt-3 space-y-2.5">
              {group.items.map((it) =>
                it.url ? (
                  <li key={it.label}>
                    <a
                      href={it.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start gap-1.5 text-sm text-slate-400 hover:text-cyan-300"
                    >
                      <ExternalLink size={13} className="mt-0.5 shrink-0 opacity-60 group-hover:opacity-100" />
                      <span>{it.label}</span>
                    </a>
                  </li>
                ) : (
                  <li key={it.label} className="flex items-start gap-1.5 text-sm text-slate-400">
                    <BookOpen size={13} className="mt-0.5 shrink-0 opacity-60" />
                    <span>{it.label}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/5 p-5">
        <Sparkles className="mt-0.5 shrink-0 text-amber-300" size={20} />
        <p className="text-sm leading-relaxed text-amber-100/90">
          <span className="font-semibold text-amber-200">AI Disclosure:</span> This website was built
          with the assistance of Artificial Intelligence (AI).
        </p>
      </div>
    </section>
  );
}
