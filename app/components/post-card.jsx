const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function PostCard({ title, date, excerpt, href, image }) {
  return (
    <li className="w-[60vw] shrink-0 snap-start sm:w-[16rem] lg:w-[18rem]">
      <a
        href={href}
        className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      >
        {image ? (
          <img src={image} alt="" className="aspect-square w-full object-cover" />
        ) : (
          <div
            aria-hidden="true"
            className="aspect-square w-full bg-signal-slate/20"
          />
        )}

        <div className="flex flex-1 flex-col pt-4">
          <time
            dateTime={date.toISOString()}
            className="font-body text-base text-ink/60"
          >
            {dateFormatter.format(date)}
          </time>
          <h3 className="m-0 mt-2 font-title text-2xl font-normal leading-tight group-hover:underline group-hover:underline-offset-4 sm:text-3xl">
            {title}
          </h3>
          <p className="m-0 mt-3 line-clamp-3 font-body text-base leading-[1.5] text-ink/75">
            {excerpt}
          </p>
        </div>
      </a>
    </li>
  );
}