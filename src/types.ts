export interface SourceRef {
  label: string;
  path: string;
}

export interface ConceptDetail {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  accent: "cyan" | "emerald" | "amber";
  details: string[];
  kernelSources?: SourceRef[];
  syscalls?: string[];
}
