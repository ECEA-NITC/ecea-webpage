// Replace the placeholder entries with real achievements.
// `logo` is optional: import an image and pass it in, e.g.
//   import ieeeLogo from "../assets/logos/ieee.png";
//   { title: "...", year: "2025", logo: ieeeLogo, invertOnDark: true }
// Set invertOnDark for black/white logos so they flip with the theme.
const achievements = [
  { title: "Achievement One", year: "2025" },
  { title: "Achievement Two", year: "2025" },
  { title: "Achievement Three", year: "2024" },
  { title: "Achievement Four", year: "2024" },
  { title: "Achievement Five", year: "2023" },
  { title: "Achievement Six", year: "2023" },
];

function Card({ title, year, logo, invertOnDark, duplicate = false }) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      className={`${duplicate ? "motion-reduce:hidden " : ""}flex w-52 shrink-0 flex-col items-center gap-4 sm:w-64`}
    >
      <div className="grid aspect-square w-28 place-items-center sm:w-36">
        {logo ? (
          <img
            src={logo}
            alt=""
            className={`max-h-full max-w-full object-contain ${invertOnDark ? "dark:invert" : ""}`}
          />
        ) : (
          /* placeholder: shown until a logo is supplied */
          <div className="grid size-full place-items-center rounded-full border-2 border-dashed border-current font-nav text-xs tracking-wide opacity-40">
            LOGO
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="m-0 font-title text-lg leading-tight sm:text-xl">{title}</p>
        <p className="m-0 mt-1 font-body text-base opacity-60">{year}</p>
      </div>
    </li>
  );
}

export default function LogoCarousel({ items = achievements, duration = 40 }) {
  return (
    <section
      aria-labelledby="achievements-heading"
      className="bg-paper px-4 py-16 text-black dark:bg-black dark:text-white sm:px-8 sm:py-24"
    >
      <hr className="m-0 border-0 border-t border-current" />

      <h2
        id="achievements-heading"
        className="m-0 mt-10 font-roman text-4xl font-normal uppercase tracking-wider sm:text-5xl"
      >
        Achievements
      </h2>

      {/* edge fade + pause on hover/focus; falls back to a scrollable row for reduced motion */}
      <div
        className="group mt-12 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <ul
          className="m-0 flex w-max list-none gap-10 p-0 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ animationDuration: `${duration}s` }}
        >
          {items.map((item) => (
            <Card key={item.title} {...item} />
          ))}
          {/* duplicate set makes the -50% loop seamless; hidden from assistive tech */}
          {items.map((item) => (
            <Card key={`dup-${item.title}`} {...item} duplicate />
          ))}
        </ul>
      </div>
    </section>
  );
}