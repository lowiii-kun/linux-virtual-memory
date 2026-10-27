import type { ConceptDetail } from "../types";

export const introConcepts: ConceptDetail[] = [
  {
    id: "linux-os-type",
    title: "What Kind of OS is Linux?",
    tagline: "01 · Foundations",
    accent: "cyan",
    summary:
      "Linux is a free, open-source, Unix-like operating system kernel built around a monolithic architecture. It powers everything from embedded devices and smartphones (Android) to the majority of the world's supercomputers and cloud servers.",
    details: [
      "Linux was created by Linus Torvalds in 1991 as a free alternative to proprietary Unix systems, released under the GNU General Public License (GPLv2).",
      "'Unix-like' means it follows POSIX conventions: everything is a file, hierarchical filesystem, multi-user permissions, and a shell-driven environment.",
      "Being open-source means its entire source tree (including mm/ for memory management) is publicly auditable on kernel.org and mirrored on Elixir Bootlin.",
      "The kernel itself is only one component; a full 'Linux OS' (distribution) bundles it with GNU userland tools, init systems (systemd), and package managers.",
      "Its portability and modular driver model let the same kernel core run on x86_64, ARM, RISC-V, and dozens of other architectures.",
    ],
    kernelSources: [{ label: "Top-level tree", path: "linux/ (kernel.org)" }],
    syscalls: ["uname"],
  },
  {
    id: "monolithic-kernel",
    title: "Monolithic Kernel Design",
    tagline: "01 · Foundations",
    accent: "cyan",
    summary:
      "Linux uses a monolithic kernel: core services like process scheduling, memory management, file systems, and device drivers all run in a single privileged address space for speed, with loadable kernel modules (LKMs) added for flexibility.",
    details: [
      "Unlike microkernels that isolate services in separate processes, Linux executes subsystems (mm, fs, net, drivers) in one shared kernel address space, enabling fast direct function calls instead of costly IPC.",
      "Loadable Kernel Modules (.ko files) let you insert/remove drivers (insmod/rmmod) at runtime without recompiling or rebooting, softening the monolithic design's rigidity.",
      "The trade-off is reliability isolation: a bug in a driver can, in theory, crash the entire kernel since it shares memory with core subsystems.",
      "Performance-critical paths like the Memory Management Unit interface and page fault handler live directly in kernel space for minimal latency.",
      "Hybrid techniques like kernel preemption, RCU locking, and namespaces have been layered on top to improve responsiveness and isolation over time.",
    ],
    kernelSources: [
      { label: "Memory mgmt core", path: "mm/" },
      { label: "Module loader", path: "kernel/module/main.c" },
    ],
  },
  {
    id: "ring-boundary",
    title: "User Space (Ring 3) vs Kernel Space (Ring 0)",
    tagline: "01 · Foundations",
    accent: "emerald",
    summary:
      "CPUs expose privilege rings; Linux only uses Ring 0 (kernel mode, full hardware access) and Ring 3 (user mode, restricted). This hard boundary protects the system: user applications cannot directly touch hardware or other processes' memory.",
    details: [
      "Ring 0 (kernel mode) can execute privileged instructions: manipulating page tables, handling interrupts, and talking to the MMU directly.",
      "Ring 3 (user mode) is sandboxed — any attempt to execute a privileged instruction or access unmapped memory raises a fault, trapping into the kernel.",
      "Transitions between rings happen via system calls (syscall/sysenter instructions), interrupts, or exceptions like page faults — the CPU validates the switch via the GDT/IDT.",
      "This separation is what allows virtual memory security to work: the kernel manages page tables in Ring 0 so a process in Ring 3 can never forge access to physical memory it doesn't own.",
      "On x86_64, the syscall instruction + SYSCALL_64 entry point in the kernel efficiently handles the Ring 3 → Ring 0 transition with minimal overhead.",
    ],
    kernelSources: [
      { label: "Syscall entry", path: "arch/x86/entry/entry_64.S" },
      { label: "Page fault trap", path: "arch/x86/mm/fault.c" },
    ],
    syscalls: ["syscall", "ptrace"],
  },
  {
    id: "multitask-multiuser",
    title: "Multi-Tasking & Multi-User Capabilities",
    tagline: "01 · Foundations",
    accent: "amber",
    summary:
      "Linux is preemptively multi-tasking (the scheduler can interrupt any process) and multi-user (many accounts can run isolated workloads concurrently). Virtual memory is the key enabler — it gives every task the illusion of owning all of RAM.",
    details: [
      "The Completely Fair Scheduler (CFS) time-slices the CPU between hundreds of runnable tasks, switching contexts in microseconds.",
      "Each process gets an independent virtual address space via its own mm_struct and page tables, so Process A can never see Process B's memory unless explicitly shared.",
      "Multi-user isolation relies on UID/GID checks plus memory isolation — two users running the same binary get entirely separate heaps, stacks, and mapped files.",
      "Context switches swap the CR3 register (x86) to point the MMU at a different page table root, instantly changing the entire visible memory map.",
      "This foundation is what allows containers and cgroups to safely multiplex thousands of isolated workloads on one physical machine.",
    ],
    kernelSources: [
      { label: "Scheduler core", path: "kernel/sched/core.c" },
      { label: "Process descriptor", path: "include/linux/sched.h" },
    ],
  },
];

export const addressSpaceConcepts: ConceptDetail[] = [
  {
    id: "text-segment",
    title: "Text Segment (.text)",
    tagline: "Layout · Code",
    accent: "cyan",
    summary:
      "The text segment holds compiled, executable machine instructions. It's mapped read-only and executable, and is typically shared between multiple instances of the same running program to save physical memory.",
    details: [
      "Loaded directly from the ELF binary's executable sections by the kernel's binfmt_elf loader at exec() time.",
      "Marked read-only + executable in page table entries; attempts to write trigger a SIGSEGV, preventing self-modifying code exploits.",
      "Shared mapping: if you run 50 copies of bash, the kernel maps the same physical frames for .text into each process's virtual space.",
      "Demand-paged: instruction pages load lazily from disk only when first executed, reducing startup I/O.",
    ],
    kernelSources: [{ label: "ELF loader", path: "fs/binfmt_elf.c" }],
    syscalls: ["execve", "mmap"],
  },
  {
    id: "data-bss",
    title: "Initialized Data & BSS",
    tagline: "Layout · Globals",
    accent: "cyan",
    summary:
      "The Data segment stores explicitly initialized global/static variables, while BSS (Block Started by Symbol) reserves space for uninitialized globals that default to zero — without consuming space in the binary file itself.",
    details: [
      "Data segment contents are copied from the binary file into memory; BSS is simply a size recorded in the ELF header and zero-filled on demand.",
      "Zero-filled BSS pages use the kernel's shared zero-page trick until written, then a real physical frame is allocated (lazy allocation).",
      "Both segments are private (copy-on-write) per process — even though code is shared, global variable state is not.",
      "Static linking increases both segments' size; dynamic linking defers much of this into shared libraries instead.",
    ],
    kernelSources: [{ label: "ELF section mapping", path: "fs/binfmt_elf.c" }],
  },
  {
    id: "heap-segment",
    title: "The Heap",
    tagline: "Layout · Dynamic Memory",
    accent: "emerald",
    summary:
      "The heap grows upward from the end of BSS and backs dynamic allocations from malloc()/new. It is managed by the C library allocator which requests more virtual pages from the kernel via brk() or sbrk() as needed.",
    details: [
      "glibc's malloc maintains free lists/bins in user space; it only calls into the kernel when it runs out of already-mapped heap space.",
      "The brk() syscall simply moves the 'program break' pointer, extending or shrinking the heap's virtual size — no physical memory is touched yet.",
      "For large allocations (typically > 128 KB), glibc instead uses mmap() to carve out an anonymous mapping outside the heap, which can be returned to the OS immediately on free().",
      "Heap growth is monitored to prevent collision with the stack or shared library mappings in the virtual address layout.",
    ],
    kernelSources: [{ label: "brk syscall", path: "mm/mmap.c" }],
    syscalls: ["brk", "sbrk", "mmap"],
  },
  {
    id: "mmap-shared-libs",
    title: "Memory-Mapped Region (Shared Libraries)",
    tagline: "Layout · mmap()",
    accent: "emerald",
    summary:
      "Between the heap and stack sits the mmap region, where the dynamic linker maps shared libraries (libc.so, ld.so), memory-mapped files, and anonymous allocations requested directly via mmap().",
    details: [
      "Shared libraries are mapped once into physical RAM and shared read-only (code) across every process that links them, drastically reducing memory footprint system-wide.",
      "Each library mapping carries its own VMA (vm_area_struct) describing permissions, backing file, and offset.",
      "Memory-mapped files allow a process to treat a file on disk as if it were an array in memory, with the kernel handling page-in/page-out transparently.",
      "This region is also where ASLR injects the most entropy, randomizing library base addresses on every execution.",
    ],
    kernelSources: [{ label: "VMA management", path: "mm/mmap.c" }, { label: "VMA struct", path: "include/linux/mm_types.h" }],
    syscalls: ["mmap", "munmap"],
  },
  {
    id: "stack-segment",
    title: "The Stack",
    tagline: "Layout · Execution Frames",
    accent: "amber",
    summary:
      "The stack grows downward from a high virtual address, storing function call frames, local variables, and return addresses. It auto-expands on demand but is capped by RLIMIT_STACK to catch runaway recursion.",
    details: [
      "Each thread in a process gets its own stack; the main thread's stack is placed near the top of user-space virtual memory.",
      "Stack growth is implemented via a guard-page fault: writing just below the current stack VMA triggers the kernel to expand it automatically (expand_stack()).",
      "A non-executable guard page (stack-guard-gap) sits beyond the limit to detect and kill processes on stack overflow rather than corrupting adjacent mappings.",
      "ASLR randomizes the stack's base address at exec() time, and the NX bit marks it non-executable to block classic stack-smashing shellcode attacks.",
    ],
    kernelSources: [{ label: "Stack expansion", path: "mm/mmap.c (expand_stack)" }],
  },
  {
    id: "kernel-space-segment",
    title: "Kernel Space (Upper Region)",
    tagline: "Layout · Privileged",
    accent: "amber",
    summary:
      "The topmost portion of every process's virtual address space is reserved and mapped to the same kernel code/data for all processes, but is only accessible in Ring 0 — enabling fast syscall entry without a full address-space switch.",
    details: [
      "On x86_64 Linux, user space spans roughly 0x0000000000000000–0x00007fffffffffff, and kernel space occupies the canonical high half.",
      "Because the kernel mapping is identical across all processes, a syscall trap doesn't need to reload CR3, keeping transitions cheap (this is partly why Meltdown-style isolation like KPTI had a performance cost).",
      "User-mode code faults immediately (segmentation fault) if it tries to dereference a kernel-space pointer — enforced by page table protection bits, not software checks alone.",
      "Kernel Page Table Isolation (KPTI) was introduced to separate these mappings more strictly after the Meltdown vulnerability.",
    ],
    kernelSources: [{ label: "KPTI implementation", path: "arch/x86/mm/pti.c" }],
  },
];

export const mmuConcepts: ConceptDetail[] = [
  {
    id: "pages-vs-hugepages",
    title: "4 KB Pages vs. Transparent Huge Pages",
    tagline: "Translation · Granularity",
    accent: "cyan",
    summary:
      "Linux normally divides memory into 4 KB pages, the base unit of translation and protection. Transparent Huge Pages (THP) opportunistically use 2 MB (or 1 GB) pages instead, drastically cutting the number of page table entries and TLB misses for large workloads.",
    details: [
      "A 4 KB page needs a full 4-level table walk; a 2 MB huge page collapses one level (PMD points directly to a large frame), and a 1 GB page collapses two levels.",
      "Fewer, larger entries mean far better TLB coverage — a single TLB entry can now cover 2 MB instead of 4 KB, reducing TLB misses for memory-intensive databases and VMs.",
      "THP is managed automatically by khugepaged, which scans and opportunistically collapses contiguous small pages into huge pages in the background.",
      "The trade-off is internal fragmentation and higher latency on minor faults (zeroing 2 MB costs more than zeroing 4 KB), so THP is tunable via /sys/kernel/mm/transparent_hugepage/enabled.",
    ],
    kernelSources: [{ label: "THP core", path: "mm/huge_memory.c" }],
  },
  {
    id: "page-table-levels",
    title: "Multi-Level Page Tables (PGD → PUD → PMD → PTE)",
    tagline: "Translation · Hierarchy",
    accent: "emerald",
    summary:
      "x86_64 Linux uses a 4 (or 5) level radix tree to translate virtual to physical addresses: Page Global Directory, Page Upper Directory, Page Middle Directory, and Page Table Entry — each level indexed by slices of the virtual address.",
    details: [
      "A 48-bit virtual address is split into 5 fields: 9 bits each for PGD, PUD, PMD, PTE indices, plus a 12-bit in-page offset (2^12 = 4096 bytes per page).",
      "CR3 register holds the physical address of the current process's PGD (top-level table) — this is what gets swapped on a context switch.",
      "Each level's entry either points to the next table or, for huge pages, directly to a large physical frame, terminating the walk early.",
      "5-level paging (LA57) extends this to support up to 128 PB of virtual address space on modern CPUs, adding a P4D layer above PGD.",
    ],
    kernelSources: [
      { label: "Page table types", path: "arch/x86/include/asm/pgtable_types.h" },
      { label: "Generic walk", path: "mm/pagewalk.c" },
    ],
  },
  {
    id: "physical-frames",
    title: "Physical Frames & the Page Allocator",
    tagline: "Translation · Physical RAM",
    accent: "emerald",
    summary:
      "Physical RAM is divided into fixed-size frames matching the page size. The kernel's buddy allocator tracks free/used frames in power-of-two blocks, servicing allocation requests from the page fault handler and slab allocators.",
    details: [
      "The buddy system splits and merges contiguous blocks of 2^order pages, minimizing external fragmentation while keeping allocation O(log n).",
      "struct page exists for every physical frame in the system, tracking reference counts, flags (locked, dirty, LRU status), and mapping info.",
      "Zones (DMA, DMA32, Normal, HighMem) classify frames by which hardware can address them, important for legacy 32-bit DMA devices.",
      "Memory compaction defragments physical RAM by migrating pages, freeing up contiguous blocks needed for huge page allocation.",
    ],
    kernelSources: [{ label: "Buddy allocator", path: "mm/page_alloc.c" }],
  },
  {
    id: "tlb",
    title: "The Translation Lookaside Buffer (TLB)",
    tagline: "Translation · Hardware Cache",
    accent: "amber",
    summary:
      "The TLB is a small, extremely fast on-CPU cache of recent virtual-to-physical translations. A TLB hit skips the entire multi-level page table walk; a TLB miss forces the MMU's hardware page-walker (or software walk) to consult memory.",
    details: [
      "TLBs are typically split into instruction (ITLB) and data (DTLB) caches, each with limited entries (e.g., 64–1536 entries depending on CPU and page size).",
      "Because TLB entries are tagged per address space (via PCID on x86_64), the kernel can avoid a full TLB flush on every context switch, improving performance.",
      "A TLB shootdown is the cross-CPU IPI mechanism the kernel uses to invalidate stale translations on all cores when a page mapping changes or is unmapped.",
      "Huge pages dramatically increase effective TLB reach since one entry now maps 2 MB or 1 GB instead of 4 KB, which is central to the Virtual Lab's hit-rate demo.",
    ],
    kernelSources: [{ label: "TLB flush logic", path: "arch/x86/mm/tlb.c" }],
  },
];

export const pageFaultConcepts: ConceptDetail[] = [
  {
    id: "minor-fault",
    title: "Minor Page Faults",
    tagline: "Faults · Soft",
    accent: "cyan",
    summary:
      "A minor (soft) fault occurs when the accessed page isn't yet mapped into the process's page table, but the data is already resident in physical RAM (e.g., shared library already loaded, or a lazily-zeroed page). The kernel just updates the page table — no disk I/O required.",
    details: [
      "Common triggers: first touch of a freshly brk()'d heap page, mapping a shared library another process already loaded, or accessing a Copy-on-Write page that hasn't diverged yet.",
      "Resolution is fast — typically sub-microsecond — since it only involves updating the PTE and possibly bumping a page's reference count.",
      "Tools like `ps -o min_flt` or `/usr/bin/time -v` report minor fault counts per process, useful for profiling lazy-allocation heavy workloads.",
      "A high minor fault rate right after process startup is normal and expected (demand paging warming up); a sustained high rate can indicate thrashing in page-table management.",
    ],
    kernelSources: [{ label: "Fault entry", path: "mm/memory.c (handle_mm_fault)" }],
  },
  {
    id: "major-fault",
    title: "Major Page Faults",
    tagline: "Faults · Hard",
    accent: "amber",
    summary:
      "A major (hard) fault happens when the needed page isn't in RAM at all and must be fetched from disk — from the swap area or a backing file. This is orders of magnitude slower than a minor fault due to storage I/O latency.",
    details: [
      "The faulting process is put to sleep while the kernel issues a block I/O request to read the page from swap or the filesystem's page cache backing store.",
      "Major faults are the primary cause of application 'stutter' under memory pressure — they show up as `majflt` in `ps`/`vmstat` and as 'si/so' (swap-in/out) activity.",
      "Memory-mapped file access (mmap()) relies heavily on major faults for its lazy-loading behavior — pages load only when actually touched.",
      "Minimizing major faults is a core goal of capacity planning: insufficient RAM forces frequent swap-ins, degrading performance severely (thrashing).",
    ],
    kernelSources: [{ label: "Swap-in path", path: "mm/memory.c (do_swap_page)" }],
  },
  {
    id: "lazy-allocation",
    title: "Lazy Allocation (Demand Paging)",
    tagline: "Faults · Deferred Work",
    accent: "cyan",
    summary:
      "Linux never actually allocates physical memory the instant you call malloc() or mmap(). It only reserves virtual address space; physical frames are assigned lazily the first time each page is touched, triggering a page fault that the kernel resolves transparently.",
    details: [
      "This lets programs 'allocate' far more virtual memory than physically exists (e.g., reserving a 10 GB buffer that's mostly unused) without wasting RAM.",
      "The kernel initially maps new anonymous pages to a shared, read-only zero-page; only a write triggers allocation of a real, private, zeroed frame.",
      "Lazy allocation is why `malloc()` almost never fails even for huge sizes — the failure (if any) is deferred to first-touch time, potentially invoking the OOM killer later.",
      "This technique underlies container memory limits too — cgroups account for pages only once they're actually faulted in and resident.",
    ],
    kernelSources: [{ label: "Anonymous fault", path: "mm/memory.c (do_anonymous_page)" }],
    syscalls: ["mmap", "brk"],
  },
  {
    id: "cow",
    title: "Copy-on-Write (CoW)",
    tagline: "Faults · Fork Optimization",
    accent: "emerald",
    summary:
      "When a process calls fork(), the kernel doesn't duplicate memory immediately. Instead, parent and child share the same physical pages marked read-only. Only when either process writes to a shared page does the kernel copy it, splitting the two apart at that moment.",
    details: [
      "fork() duplicates page tables (cheap) rather than physical memory (expensive), making process creation extremely fast even for large address spaces.",
      "Each shared page's reference count is incremented; a write access triggers a protection fault, caught by do_wp_page(), which allocates a fresh frame and copies the data before resuming.",
      "This is the same mechanism behind efficient `vfork`-like behavior and is essential to how container runtimes snapshot filesystems and memory cheaply.",
      "CoW also applies to shared libraries' data segments and to memory-mapped files opened with MAP_PRIVATE.",
    ],
    kernelSources: [{ label: "Write-protect fault", path: "mm/memory.c (do_wp_page)" }, { label: "Fork implementation", path: "kernel/fork.c" }],
    syscalls: ["fork", "clone"],
  },
];

export const swapConcepts: ConceptDetail[] = [
  {
    id: "page-cache",
    title: "The Page Cache",
    tagline: "Pressure · Caching",
    accent: "emerald",
    summary:
      "Linux aggressively caches file data read from disk in otherwise-idle RAM — the page cache. This makes repeated file reads nearly instant and allows writes to be buffered (write-back) for better throughput, at the cost of 'used' memory that's actually reclaimable.",
    details: [
      "Page cache memory shows up as 'buff/cache' in `free -h` — it's not wasted memory; the kernel will reclaim it instantly under pressure before resorting to swap.",
      "Dirty pages (modified but not yet flushed to disk) are written back by kernel flusher threads (pdflush/writeback) based on dirty_ratio and dirty_background_ratio tunables.",
      "Because reads and writes funnel through this cache, a second read of the same file is served straight from RAM with zero disk I/O.",
      "`sync` and `echo 3 > /proc/sys/vm/drop_caches` let administrators manually force writeback and cache eviction for testing/benchmarking.",
    ],
    kernelSources: [{ label: "Page cache core", path: "mm/filemap.c" }],
  },
  {
    id: "swap-space",
    title: "Swap Space",
    tagline: "Pressure · Overflow Storage",
    accent: "amber",
    summary:
      "Swap is disk (or zram/compressed-RAM) space used as an overflow for anonymous memory pages that haven't been accessed recently, when physical RAM runs low. It lets the system keep more processes 'alive' at the cost of much higher access latency if swapped pages are touched again.",
    details: [
      "Unlike file-backed pages (which can just be dropped and re-read), anonymous pages (heap/stack data) have nowhere else to go — they must be written to swap to be reclaimed.",
      "The kernel's LRU (Least Recently Used) lists for anonymous and file pages decide which cold pages get swapped out first via `kswapd`.",
      "Modern setups often use zswap or zram — compressing pages into a RAM-backed pool before (or instead of) writing to slower disk-based swap.",
      "Swap thrashing — constant swap-in/swap-out cycling — is one of the most severe performance pathologies in Linux and is visible as high `si`/`so` columns in `vmstat`.",
    ],
    kernelSources: [{ label: "Swap subsystem", path: "mm/swap.c" }, { label: "Swap file/device mgmt", path: "mm/swapfile.c" }],
    syscalls: ["swapon", "swapoff"],
  },
  {
    id: "swappiness",
    title: "Swappiness",
    tagline: "Pressure · Tunable",
    accent: "amber",
    summary:
      "`vm.swappiness` (0–200, default 60) is a kernel tunable controlling how aggressively the kernel prefers to reclaim anonymous (swap-bound) memory versus page-cache (file-backed) memory when free RAM gets low.",
    details: [
      "A low swappiness (e.g., 10) tells the kernel to strongly prefer dropping clean file-cache pages and avoid swapping, ideal for latency-sensitive servers.",
      "A high swappiness (e.g., 100+) makes the kernel swap out idle anonymous pages more proactively, which can free up cache for frequently-accessed files.",
      "It's set via `sysctl vm.swappiness=N` or persisted in /etc/sysctl.conf, and is a key tuning knob for databases, where swapping is often disabled almost entirely.",
      "Swappiness doesn't disable swap outright (except conceptually at 0 on older kernels) — it only biases the reclaim algorithm's scan balance between LRU lists.",
    ],
    kernelSources: [{ label: "Reclaim balance logic", path: "mm/vmscan.c" }],
  },
  {
    id: "oom-killer",
    title: "The OOM Killer",
    tagline: "Pressure · Last Resort",
    accent: "cyan",
    summary:
      "When the system exhausts both physical RAM and swap and reclaim can't free enough memory, the Out-Of-Memory (OOM) Killer steps in as a last resort, selecting and terminating a process to prevent a total system lockup.",
    details: [
      "Each process is assigned a 'badness' score (oom_score) based on memory usage, runtime, and an adjustable oom_score_adj (-1000 to disable, +1000 to prioritize killing).",
      "The killer targets the process that will free the most memory while minimizing collateral damage, typically large, non-critical, recently-started processes.",
      "You can observe OOM kills in `dmesg` or `journalctl -k`, which log the selected victim, its RSS, and full system memory state at the time of the kill.",
      "In containers and cgroup v2 setups, memory.oom.group and memory.max allow OOM behavior to be scoped per-container rather than system-wide.",
    ],
    kernelSources: [{ label: "OOM kill logic", path: "mm/oom_kill.c" }],
  },
];

export const securityConcepts: ConceptDetail[] = [
  {
    id: "aslr",
    title: "Address Space Layout Randomization (ASLR)",
    tagline: "Security · Randomization",
    accent: "emerald",
    summary:
      "ASLR randomizes the base virtual addresses of the stack, heap, shared libraries, and executable mappings on every process launch. This makes it far harder for attackers to reliably predict memory addresses needed to redirect execution in a buffer overflow exploit.",
    details: [
      "Controlled by /proc/sys/kernel/randomize_va_space (0=off, 1=conservative, 2=full randomization including heap), full mode is the Linux default.",
      "Because virtual memory abstracts physical placement, the kernel is free to pick a different random offset for each region without the program's logic ever needing to know or care.",
      "Position-Independent Executables (PIE) extend ASLR to the main binary's own code segment, not just libraries — compiled by default with -fPIE on modern distros.",
      "ASLR is probabilistic, not absolute — info leaks (e.g., format string bugs) can defeat it, which is why it's paired with stack canaries and NX protection.",
    ],
    kernelSources: [{ label: "ASLR randomization", path: "mm/util.c (arch_pick_mmap_layout)" }],
  },
  {
    id: "nx-bit",
    title: "The NX / XD (No-Execute) Bit",
    tagline: "Security · Hardware Protection",
    accent: "amber",
    summary:
      "The NX bit (called XD — eXecute Disable — on Intel) is a flag in each page table entry that marks a memory page as non-executable. Linux sets this bit on stack and heap pages so injected shellcode data can never be run as instructions, directly blocking classic buffer overflow attacks.",
    details: [
      "Before NX existed, a classic stack-smashing attack could write executable shellcode onto the stack and jump into it; with NX set, the CPU raises a fault instead of executing it.",
      "Linux enforces this through the W^X (Write XOR Execute) principle: a page should rarely be both writable and executable simultaneously.",
      "The PTE's NX bit (bit 63 on x86_64) is checked directly by the MMU hardware during instruction fetch — it's enforced before the CPU even decodes an instruction.",
      "Combined with ASLR, NX forced the evolution of more complex exploitation techniques like Return-Oriented Programming (ROP), which reuses existing executable code instead of injecting new code.",
    ],
    kernelSources: [{ label: "PTE protection flags", path: "arch/x86/include/asm/pgtable_types.h" }],
  },
];
