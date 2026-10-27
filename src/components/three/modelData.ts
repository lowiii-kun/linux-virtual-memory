export interface ModelPart {
  id: string;
  name: string;
  color: string;
  description: string;
  facts: string[];
}

export const modelParts: Record<string, ModelPart> = {
  mmu: {
    id: "mmu",
    name: "MMU (Memory Management Unit)",
    color: "#22d3ee",
    description:
      "Dedicated CPU hardware that intercepts every memory access, walking page tables (or consulting the TLB) to translate the virtual address a program used into a real physical RAM address.",
    facts: [
      "Reads CR3 register to find the current process's top-level page table (PGD).",
      "Performs the translation in hardware, independent of the OS, for maximum speed.",
      "Raises a page-fault exception to the kernel when a translation isn't valid.",
    ],
  },
  pagetable: {
    id: "pagetable",
    name: "Page Tables (PGD → PTE)",
    color: "#34d399",
    description:
      "A multi-level radix tree of tables that stores the actual virtual-to-physical mappings, permission bits, and dirty/accessed flags for every page in a process's address space.",
    facts: [
      "4 levels on x86_64: PGD, PUD, PMD, PTE (5 with LA57 / P4D).",
      "Each table is exactly one 4KB page, holding 512 entries of 8 bytes each.",
      "Huge pages let a PMD entry point straight to a 2MB frame, skipping the PTE level.",
    ],
  },
  ram: {
    id: "ram",
    name: "RAM Frames (Physical Memory)",
    color: "#fbbf24",
    description:
      "Physical RAM divided into fixed-size frames (matching page size) that actually hold program code and data. The kernel's buddy allocator tracks which frames are free, used, or shared.",
    facts: [
      "Each frame is described by a `struct page` tracking reference counts and LRU status.",
      "Frames can be shared across processes (shared libraries, CoW) to save memory.",
      "Under pressure, cold frames are reclaimed to the page cache or written to swap.",
    ],
  },
  swap: {
    id: "swap",
    name: "Swap Storage",
    color: "#f87171",
    description:
      "Disk-backed (or compressed RAM-backed) overflow space. When physical RAM is exhausted, the kernel's reclaim algorithm (kswapd) evicts cold anonymous pages here to free up frames.",
    facts: [
      "Anonymous (heap/stack) pages must go to swap — they have no other backing store.",
      "Swapped-in pages trigger a 'major' page fault, which is orders of magnitude slower than RAM access.",
      "zswap/zram compress pages into RAM instead of hitting physical disk, reducing latency.",
    ],
  },
};
