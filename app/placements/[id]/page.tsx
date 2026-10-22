import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EXPERIENCES,
  TAG_STYLES,
  domainLabel,
  formatPosted,
  getExperience,
} from "@/lib/placements";

/*
  Palette (same muted set as the listing page)
  paper  #F4F6FC   ink  #10163A
  slate-blue #8A98C9   dusty rose #D3A3B8   sand #D8C49C
*/

// Prerender the known ids at build time. Ids not returned here are still
// rendered on demand (dynamicParams defaults to true).
export async function generateStaticParams() {
  return EXPERIENCES.map((e) => ({ id: e.id }));
}

// PageProps is a global helper. Next.js generates it during `next dev`,
// `next build` or `next typegen`, and types params as Promise<{ id: string }>.
export async function generateMetadata(
  props: PageProps<"/placements/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const e = getExperience(id); // cached, so the page below reuses this lookup
  if (!e) notFound(); // allowed inside generateMetadata

  return {
    title: `${e.company}, ${e.role}`,
    description: e.summary,
  };
}

function Block({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-ink/10 pt-6">
      <h2 className="m-0 font-title text-xl font-normal tracking-[-0.02em] text-ink sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function PlacementExperience(
  props: PageProps<"/placements/[id]">
) {
  const { id } = await props.params;
  const e = getExperience(id);
  if (!e) notFound();

  const facts: { label: string; value: string }[] = [
    { label: "Author", value: e.author },
    { label: "Batch", value: e.batch },
    { label: "Posted", value: formatPosted(e.postedAt) },
    ...(e.ctc ? [{ label: "CTC", value: e.ctc }] : []),
    ...(e.location ? [{ label: "Location", value: e.location }] : []),
  ];

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
          <Link
            href="/placements"
            className="inline-flex items-center gap-2 font-body text-base text-ink/70 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M12 5l-5 5 5 5" />
            </svg>
            All experiences
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="m-0 font-title text-4xl font-normal tracking-[-0.02em] text-ink sm:text-6xl">
                {e.company}
              </h1>
              <p className="mt-3 font-body text-lg text-ink/75 sm:text-xl">
                {e.role}
              </p>
            </div>
            <span
              className={`h-fit w-fit px-3 py-1 font-body text-sm ${TAG_STYLES[e.domain]}`}
            >
              {domainLabel(e.domain)}
            </span>
          </div>

          <p className="mt-6 max-w-[34em] font-body text-lg leading-[1.5] text-ink/75 sm:text-xl">
            {e.summary}
          </p>
        </header>

        <div className="grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
          <aside className="border border-ink/10 bg-white/50 p-4 backdrop-blur-sm sm:p-5">
            <dl className="m-0 grid gap-4">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col gap-1">
                  <dt className="font-body text-sm text-ink/70">{f.label}</dt>
                  <dd className="m-0 font-body text-base text-ink sm:text-lg">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>

          <article className="grid gap-8">
            {e.rounds && e.rounds.length > 0 && (
              <Block title="Selection process">
                {/* A numbered list is right here: the rounds are a sequence */}
                <ol className="m-0 grid list-none divide-y divide-ink/10 border-y border-ink/10 p-0">
                  {e.rounds.map((r, i) => (
                    <li
                      key={r.title}
                      className="grid gap-1 px-1 py-5 sm:grid-cols-[3rem_1fr] sm:gap-4 sm:px-4"
                    >
                      <span className="font-title text-2xl text-ink/45">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="m-0 font-title text-xl font-normal tracking-[-0.02em] text-ink">
                          {r.title}
                        </h3>
                        <p className="mt-2 max-w-[44em] font-body text-base leading-[1.55] text-ink/75">
                          {r.details}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Block>
            )}

            {e.questions && e.questions.length > 0 && (
              <Block title="Questions asked">
                <ul className="m-0 grid list-none gap-3 p-0">
                  {e.questions.map((q) => (
                    <li
                      key={q}
                      className="max-w-[44em] border-l-2 border-[#8A98C9] bg-white/50 py-3 pl-4 pr-4 font-body text-base leading-[1.55] text-ink/80"
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {e.tips && e.tips.length > 0 && (
              <Block title="Preparation advice">
                <ul className="m-0 grid list-none gap-3 p-0">
                  {e.tips.map((t) => (
                    <li
                      key={t}
                      className="max-w-[44em] border-l-2 border-[#D8C49C] bg-white/50 py-3 pl-4 pr-4 font-body text-base leading-[1.55] text-ink/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Block>
            )}
          </article>
        </div>
      </main>
    </section>
  );
}