import { TerminalSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-800 bg-slate-950/80 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
              <TerminalSquare size={16} />
            </span>
            <span className="font-mono-term text-sm font-semibold text-slate-200">vmem@linux:~$</span>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-500">
            An interactive educational resource exploring how the Linux kernel manages virtual memory —
            from address spaces and the MMU to page faults, swapping, and memory security — built with
            live simulators, a 3D model, and real diagnostic tool walkthroughs.
          </p>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <p className="font-mono-term text-xs uppercase tracking-widest text-slate-400">
            Major Course Output in CpE 9 - Operating Systems
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Developed by: Louie Jay Pontinez, Ceryl Ann Rarugal, and Jovie Ann Pleserda.
          </p>
          <p className="mt-4 text-xs text-slate-600">© {new Date().getFullYear()} Virtual Memory for Linux. Educational use only.</p>
        </div>
      </div>
    </footer>
  );
}
