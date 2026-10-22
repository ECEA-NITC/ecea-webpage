import Image from "next/image";

// Placeholder photos from Lorem Picsum. The seed keeps each image stable between
// reloads. Swap `pic(...)` for a static import or a /public path when real photos
// arrive. A tile with `src: null` falls back to its flat theme colour.
const pic = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
//
// Spans are written out in full so Tailwind can see them.
// Mobile: 2 columns. lg: 12 columns, three interlocking blocks with no gaps.
const items = [
  // Block A (rows 1-4): one 5x4 anchor beside four tiles
  {
    title: "Untitled I",
    year: "2025",
    src: pic("gallery-1", 1000, 1000),
    tone: "bg-signal-slate",
    span: "col-span-2 row-span-2 lg:col-span-5 lg:row-span-4",
  },
  {
    title: "Untitled II",
    year: "2025",
    src: pic("gallery-2", 900, 500),
    tone: "bg-signal-rose",
    span: "lg:col-span-4 lg:row-span-2",
  },
  {
    title: "Untitled III",
    year: "2024",
    src: pic("gallery-3", 600, 800),
    tone: "bg-theme-primary",
    span: "row-span-2 lg:col-span-3 lg:row-span-2",
  },
  {
    title: "Untitled IV",
    year: "2024",
    src: pic("gallery-4", 600, 500),
    tone: "bg-signal-sand",
    span: "lg:col-span-3 lg:row-span-2",
  },
  {
    title: "Untitled V",
    year: "2024",
    src: pic("gallery-5", 900, 500),
    tone: "bg-theme-secondary",
    span: "lg:col-span-4 lg:row-span-2",
  },

  // Block B (rows 5-7): tall, wide, tall, with two small tiles under the wide one
  {
    title: "Untitled VI",
    year: "2023",
    src: pic("gallery-6", 600, 900),
    tone: "bg-signal-sand",
    span: "row-span-2 lg:col-span-3 lg:row-span-3",
  },
  {
    title: "Untitled VII",
    year: "2023",
    src: pic("gallery-7", 1200, 500),
    tone: "bg-theme-background",
    span: "col-span-2 lg:col-span-6 lg:row-span-2",
  },
  {
    title: "Untitled VIII",
    year: "2023",
    src: pic("gallery-8", 600, 900),
    tone: "bg-signal-slate",
    span: "row-span-2 lg:col-span-3 lg:row-span-3",
  },
  {
    title: "Untitled IX",
    year: "2022",
    src: pic("gallery-9", 700, 300),
    tone: "bg-signal-rose",
    span: "lg:col-span-3 lg:row-span-1",
  },
  {
    title: "Untitled X",
    year: "2022",
    src: pic("gallery-10", 700, 300),
    tone: "bg-paper",
    span: "lg:col-span-3 lg:row-span-1",
  },

  // Block C (rows 8-9): wide closer
  {
    title: "Untitled XI",
    year: "2022",
    src: pic("gallery-11", 1400, 500),
    tone: "bg-theme-primary",
    span: "col-span-2 lg:col-span-8 lg:row-span-2",
  },
  {
    title: "Untitled XII",
    year: "2021",
    src: pic("gallery-12", 900, 500),
    tone: "bg-signal-slate",
    span: "col-span-2 lg:col-span-4 lg:row-span-2",
  },
];

export default function Gallery() {
  return (
    <div className="relative min-h-screen bg-paper pt-28 px-4">
      <section
        id="gallery"
        className="bg-paper px-4 pb-16 pt-6 text-black dark:bg-black dark:text-white sm:px-8"
      >
        {/* The wrapper colour shows through the 1px gaps and becomes the hairlines.
          It is the inverse of the page background, so it works in light and dark. */}
        <ul className="m-0 grid list-none auto-rows-32 grid-cols-2 grid-flow-dense gap-px bg-black p-px dark:bg-white sm:auto-rows-40 lg:auto-rows-28 lg:grid-cols-12 xl:auto-rows-32">
          {items.map(({ title, year, src, tone, span }, i) => (
            <li
              key={title}
              className={`${span} group relative min-h-0 overflow-hidden`}
            >
              <figure className={`relative m-0 h-full w-full ${tone}`}>
                {src && (
                  <Image
                    src={src}
                    alt={title}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover saturate-60 transition duration-500 group-hover:saturate-100 group-focus-within:saturate-100 motion-reduce:transition-none"
                  />
                )}

                {/* Text-only overlay. The gradient sits behind the text for contrast
                  and appears with it. On touch screens (no hover) it stays visible. */}
                <figcaption className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/75 via-black/25 to-transparent p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100">
                  <span className="font-title text-lg leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:text-xl">
                    {title}
                  </span>
                  <span className="font-body text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {year}
                  </span>
                </figcaption>

                {/* Keyboard focus target and hover outline in the theme accent */}
                <a
                  href={`#${title.toLowerCase().replace(/\s+/g, "-")}`}
                  aria-label={title}
                  className="absolute inset-0 outline-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent group-hover:outline-2 group-hover:-outline-offset-2 group-hover:outline-accent"
                />
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}