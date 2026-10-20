const seeAllHref = "/posts";

const samplePosts = [
  {
    title: "Introduction to Embedded Systems Workshop",
    date: "12 Sep 2026",
    excerpt:
      "A two-day hands-on session covering microcontroller basics, sensor interfacing and firmware debugging.",
    href: "/posts/embedded-systems-workshop",
    image: null,
  },
  {
    title: "Talk: Careers in VLSI and Chip Design",
    date: "28 Aug 2026",
    excerpt:
      "Alumni from the semiconductor industry shared how they moved from campus projects to design teams.",
    href: "/posts/vlsi-careers-talk",
    image: null,
  },
  {
    title: "ECEA Hardware Hackathon 2026",
    date: "03 Aug 2026",
    excerpt:
      "Twelve teams built working prototypes in 24 hours, from smart meters to low-cost radio receivers.",
    href: "/posts/hardware-hackathon",
    image: null,
  },
  {
    title: "Signal Processing Reading Group",
    date: "15 Jul 2026",
    excerpt:
      "Weekly sessions working through filter design and the Fourier transform with practical MATLAB examples.",
    href: "/posts/dsp-reading-group",
    image: null,
  },
];

const linkClass =
  "font-title text-xl font-normal hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current sm:text-2xl";

const headingClass =
  "m-0 font-roman text-4xl font-normal uppercase tracking-wider sm:text-5xl";

export default function PostList({ posts = samplePosts, href = seeAllHref }) {
  return (
    <section className="bg-paper px-4 py-16 text-ink sm:px-8 sm:py-24">
      <hr className="m-0 border-0 border-t border-current" />

      <div className="mt-8 flex items-end justify-between gap-6">
        <h2 className={headingClass}>Featured</h2>
        <a href={href} className={linkClass}>
          See all
        </a>
      </div>

      {/* horizontal list: native scroll with snapping, next card peeks in */}
      <ul
        className="m-0 mt-8 -mx-4 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:-mx-8 sm:gap-6 sm:px-8"
        aria-label="Latest posts"
      >
        {posts.map(({ title, date, excerpt, href, image }) => (
          <li
            key={href}
            className="w-[60vw] shrink-0 snap-start sm:w-[16rem] lg:w-[18rem]"
          >
            <a
              href={href}
              className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              {image ? (
                <img
                  src={image}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="aspect-square w-full bg-signal-slate/20"
                />
              )}

              <div className="flex flex-1 flex-col pt-4">
                <time className="font-body text-base text-ink/60">{date}</time>
                <h3 className="m-0 mt-2 font-title text-2xl font-normal leading-tight group-hover:underline group-hover:underline-offset-4 sm:text-3xl">
                  {title}
                </h3>
                <p className="m-0 mt-3 line-clamp-3 font-body text-base leading-[1.5] text-ink/75">
                  {excerpt}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}