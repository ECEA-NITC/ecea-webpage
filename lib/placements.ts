import { cache } from "react";

// Shared by app/placements/page.tsx and app/placements/[id]/page.tsx.
// Replace EXPERIENCES with a real data source (DB / CMS) when ready.

export type Domain = "core" | "swe" | "other";

export type Round = {
  title: string;
  details: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  author: string;
  batch: string;
  postedAt: string; // ISO date
  domain: Domain;
  summary: string;
  // Optional long-form fields shown on the detail page
  ctc?: string;
  location?: string;
  rounds?: Round[];
  questions?: string[];
  tips?: string[];
};

export const DOMAINS: { value: Domain; label: string }[] = [
  { value: "core", label: "Core" },
  { value: "swe", label: "Software and IT" },
  { value: "other", label: "Management & Others" },
];

export const TAG_STYLES: Record<Domain, string> = {
  core: "bg-[#8A98C9]/25 text-ink",
  swe: "bg-[#D3A3B8]/30 text-ink",
  other: "bg-[#D8C49C]/40 text-ink",
};

export const domainLabel = (d: Domain) =>
  DOMAINS.find((x) => x.value === d)?.label ?? d;

export const formatPosted = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

export const EXPERIENCES: Experience[] = [
  {
    id: "1",
    company: "Company name",
    role: "Role title",
    author: "Student name",
    batch: "2025",
    postedAt: "2026-09-12",
    domain: "core",
    summary:
      "A short summary of the selection process: rounds, topics asked and preparation advice.",
    ctc: "Add CTC here",
    location: "Add location here",
    rounds: [
      {
        title: "Online test",
        details: "Describe the format, duration and sections of the test.",
      },
      {
        title: "Technical interview",
        details: "Describe the topics covered and how deep the questions went.",
      },
      {
        title: "HR interview",
        details: "Describe what was asked and how long the round lasted.",
      },
    ],
    questions: [
      "A question that was asked in the technical round.",
      "Another question worth practising.",
    ],
    tips: [
      "A preparation tip for juniors targeting this company.",
      "Another tip, such as which resources helped.",
    ],
  },
];

// React `cache` dedupes calls within one request. Next.js memoizes `fetch`
// automatically, but not DB or in-memory lookups, so wrap those like this.
export const getExperience = cache((id: string) =>
  EXPERIENCES.find((e) => e.id === id)
);