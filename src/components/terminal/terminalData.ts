export interface FieldBreakdown {
  field: string;
  meaning: string;
}

export interface TerminalCommand {
  id: string;
  command: string;
  description: string;
  output: string;
  breakdown: FieldBreakdown[];
}

export const terminalCommands: TerminalCommand[] = [
  {
    id: "meminfo",
    command: "cat /proc/meminfo",
    description:
      "Dumps a live, detailed snapshot of system-wide memory statistics straight from the kernel — the raw data source behind tools like `free` and `top`.",
    output: `MemTotal:       16384000 kB
MemFree:         1203456 kB
MemAvailable:    8322104 kB
Buffers:          210344 kB
Cached:          6120988 kB
SwapCached:         2048 kB
Active:          7341200 kB
Inactive:        4982112 kB
SwapTotal:       4194300 kB
SwapFree:        4190204 kB
Dirty:              8120 kB
AnonPages:       5602144 kB
Mapped:           452880 kB
Slab:             389216 kB
PageTables:        48216 kB
VmallocTotal: 34359738367 kB
HugePages_Total:       0
HugePages_Free:        0
Hugepagesize:       2048 kB`,
    breakdown: [
      { field: "MemTotal", meaning: "Total usable physical RAM installed, minus a small amount reserved by the kernel/BIOS." },
      { field: "MemFree", meaning: "Truly idle RAM untouched by any cache or allocation — usually small since Linux uses 'spare' RAM for caching." },
      { field: "MemAvailable", meaning: "Kernel's best estimate of memory available for new applications without swapping, including reclaimable cache." },
      { field: "Buffers / Cached", meaning: "Page cache for block devices and files — reclaimed first under pressure, not truly 'used' memory." },
      { field: "SwapTotal / SwapFree", meaning: "Total configured swap space and how much remains unused." },
      { field: "AnonPages", meaning: "Memory backing heap/stack data not tied to any file — the pages that can only go to swap, never dropped." },
      { field: "PageTables", meaning: "Memory consumed by the page table structures themselves (PGD/PUD/PMD/PTE entries)." },
      { field: "HugePages_Total/Free", meaning: "Count of static 2MB huge pages reserved via vm.nr_hugepages, and how many remain unallocated." },
    ],
  },
  {
    id: "pmap",
    command: "pmap -d 4821",
    description:
      "Shows the complete virtual memory map of a specific process ID (PID) — every VMA (mapped region), its permissions, and backing file, revealing the segments from Section 2 for a real running program.",
    output: `4821:   /usr/bin/nginx -g daemon off;
Address           Kbytes Mode  Offset           Device    Mapping
0000560a1f3b0000     132 r-x-- 0000000000000000 103:02    nginx
0000560a1f5e0000      16 r---- 0000000000020000 103:02    nginx
0000560a1f5e4000       8 rw--- 0000000000024000 103:02    nginx
0000560a20a12000     136 rw--- 0000000000000000 000:00    [ anon ]  (heap)
00007f2b4c000000    1804 r-x-- 0000000000000000 103:02    libc-2.31.so
00007f2b4c3c3000      16 rw--- 00000000001c3000 103:02    libc-2.31.so
00007f2b4e9fa000     132 rw--- 0000000000000000 000:00    [ anon ]
00007ffd1a9d0000     132 rw--- 0000000000000000 000:00    [ stack ]
mapped: 2385892K    writeable/private: 405112K    shared: 12044K`,
    breakdown: [
      { field: "Address", meaning: "Virtual (not physical!) starting address of this mapped region within the process's address space." },
      { field: "Mode (r-x--)", meaning: "Permission bits: read / write / execute / may-share — the .text segment here is r-x, matching NX protection." },
      { field: "[ anon ] (heap)", meaning: "Anonymous private mapping not backed by any file — this is the process's heap, managed via brk()." },
      { field: "libc-2.31.so", meaning: "Shared library mapped read+exec, shared physically across every process using libc, saving system-wide RAM." },
      { field: "[ stack ]", meaning: "The thread's stack region, growing downward, marked non-executable (NX) by default." },
      { field: "mapped / writeable / shared", meaning: "Totals summarizing how much virtual memory is mapped, privately writable, versus shared with other processes." },
    ],
  },
  {
    id: "vmstat",
    command: "vmstat 1",
    description:
      "Streams live virtual memory statistics once per second — procs, memory, swap I/O, block I/O, and CPU — ideal for spotting swap thrashing (high si/so) or CPU starvation in real time.",
    output: `procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 2  0  12040 1203456 210344 6120988    0    0     2    14  180  305  4  1 94  1  0
 3  1  12040 1109232 210344 6188120    0   64     0   412  220  410  6  3 88  3  0
 1  0  12040  988012 210412 6250440   48  120    30   260  198  380  5  2 90  3  0`,
    breakdown: [
      { field: "r / b", meaning: "Processes currently running on CPU vs. blocked waiting on I/O — sustained high 'b' hints at disk/swap bottlenecks." },
      { field: "swpd", meaning: "Total virtual memory currently swapped out to disk, in KB." },
      { field: "si / so", meaning: "Swap-in / swap-out rate (KB/s) — nonzero, sustained values are the clearest sign of memory pressure and thrashing." },
      { field: "bi / bo", meaning: "Blocks received from / sent to block devices (disk I/O) per second." },
      { field: "us / sy / id / wa", meaning: "CPU time in user space, kernel (system) space, idle, and waiting on I/O respectively." },
    ],
  },
];
