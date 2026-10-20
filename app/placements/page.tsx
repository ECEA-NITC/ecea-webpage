import type { ReactNode } from "react";
import Form from "next/form";

/*
  Palette (same muted set as the hero / 404)
  paper  #F4F6FC   ink  #10163A
  slate-blue #8A98C9   dusty rose #D3A3B8   sand #D8C49C

  Domain tags borrow the three muted colours, so nothing on the page
  needs a saturated primary.
*/

const DOMAINS = [
  { value: "core", label: "Core" },
  { value: "swe", label: "Software and IT" },
  { value: "other", label: "Management & Others" },
];

const POSTED_RANGES = [
  { value: "1m", label: "Last month" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
  { value: "all", label: "All time" },
];

// Earliest date to include for a ?posted= value, or null for all time.
// Not exported on purpose: page files may only export the page itself
// and Next.js config fields. Move it to lib/ if other files need it.
function rangeStart(range: string, now = new Date()): Date | null {
  const months = { "1m": 1, "6m": 6, "1y": 12 }[range as "1m" | "6m" | "1y"];
  if (!months) return null;
  const d = new Date(now);
  d.setMonth(d.getMonth() - months);
  return d;
}

const formatPosted = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

const TAG_STYLES: Record<string, string> = {
  core: "bg-[#8A98C9]/25 text-ink",
  swe: "bg-[#D3A3B8]/30 text-ink",
  other: "bg-[#D8C49C]/40 text-ink",
};

// Sample entry so the results styling is visible. Replace with real data.
const EXPERIENCES = [
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
  },
];

const fieldBase =
  "w-full border border-ink/20 bg-white/80 px-4 py-3 font-body text-base text-ink " +
  "placeholder:text-ink/45 transition-colors hover:border-ink/40 " +
  "focus:border-ink focus:outline-none focus:ring-2 focus:ring-[#8A98C9]/50 sm:text-lg";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="font-body text-sm text-ink/70">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/60"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const first = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) ?? "";

// Server Component page. In current Next.js, searchParams is a Promise
// and must be awaited.
export default async function PlacementExperiences({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = first(params.q).trim();
  const domain = first(params.domain);
  const posted = first(params.posted) || "all";

  const start = rangeStart(posted);
  const needle = q.toLowerCase();
  const results = EXPERIENCES.filter(
    (e) =>
      (!domain || e.domain === domain) &&
      (!start || new Date(e.postedAt) >= start) &&
      (!needle ||
        [e.company, e.role, e.author].some((f) =>
          f.toLowerCase().includes(needle)
        ))
  );

  return (
    <section className="relative flex min-h-screen items-start overflow-hidden bg-paper px-5 pb-20 pt-28 sm:px-[7vw]">
      {/* soft colour washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-[#8A98C9]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 h-[24rem] w-[24rem] rounded-full bg-[#D3A3B8]/15 blur-3xl"
      />

      <main className="relative z-10 grid w-full max-w-[1200px] gap-10 sm:gap-14">
        <header>
          <p className="mt-5 max-w-[34em] font-body text-lg leading-[1.5] text-ink/75 sm:text-xl">
            Interview rounds, questions and preparation notes shared by
            seniors, searchable by company, domain and date posted.
          </p>
        </header>

        <Form
          role="search"
          action=""
          className="grid items-end gap-4 border border-ink/10 bg-white/50 p-4 backdrop-blur-sm sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,1fr)_14rem_12rem_auto]"
        >
          <Field label="Search" htmlFor="q">
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Company, role or name"
              autoComplete="off"
              className={fieldBase}
            />
          </Field>

          <Field label="Domain" htmlFor="domain">
            <div className="relative">
              <select
                id="domain"
                name="domain"
                defaultValue={domain}
                className={`${fieldBase} appearance-none pr-10`}
              >
                <option value="">All domains</option>
                {DOMAINS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>

          <Field label="Posted" htmlFor="posted">
            <div className="relative">
              <select
                id="posted"
                name="posted"
                defaultValue={posted}
                className={`${fieldBase} appearance-none pr-10`}
              >
                {POSTED_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>

          <button
            type="submit"
            className="inline-flex items-center justify-center bg-ink px-7 py-3 font-body text-base text-white transition-colors hover:bg-theme-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-lg"
          >
            Search
          </button>
        </Form>

        <div>
          <article className="grid gap-6">
            {results.length === 0 ? (
              <p className="m-0 border-y border-ink/10 py-10 font-body text-lg text-ink/70">
                No experiences match these filters. Try a different company
                name, or set the domain and date posted back to All.
              </p>
            ) : (
            <ul className="m-0 grid list-none divide-y divide-ink/10 border-y border-ink/10 p-0">
              {results.map((e) => (
                <li
                  key={e.id}
                  className="grid gap-3 px-1 py-6 transition-colors hover:bg-white/60 sm:grid-cols-[1fr_auto] sm:gap-8 sm:px-4"
                >
                  <div>
                    <h2 className="m-0 font-title text-2xl font-normal tracking-[-0.02em] text-ink sm:text-3xl">
                      {e.company}
                    </h2>
                    <p className="mt-1 font-body text-base text-ink/70 sm:text-lg">
                      {e.role} &middot; {e.author}, batch of {e.batch} &middot;
                      posted {formatPosted(e.postedAt)}
                    </p>
                    <p className="mt-3 max-w-[44em] font-body text-base leading-[1.55] text-ink/75">
                      {e.summary}
                    </p>
                  </div>
                  <span
                    className={`h-fit w-fit px-3 py-1 font-body text-sm ${TAG_STYLES[e.domain]}`}
                  >
                    {DOMAINS.find((d) => d.value === e.domain)?.label}
                  </span>
                </li>
              ))}
            </ul>
            )}
          </article>
        </div>
      </main>
    </section>
  );
}