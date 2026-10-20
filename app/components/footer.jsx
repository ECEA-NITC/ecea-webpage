import DotWordmark from "./DotWordMark.jsx";
import footer_dotted from "../assets/footer_dotted.png"

const info = ["Home", "Gallery", "Activities", "About", "Contact"];
const socials = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Linkedin", href: "https://www.linkedin.com/" },
];

const linkClass =
  "font-title text-xl font-normal hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current sm:text-2xl";

const headingClass =
  "m-0 font-roman text-4xl font-normal uppercase tracking-wider sm:text-5xl";

export default function Footer() {
  return (
    <footer className="bg-white px-4 pb-10 pt-6 text-black dark:bg-black dark:text-white sm:px-8">
      <hr className="m-0 border-0 border-t border-current" />

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.65fr_1fr] lg:gap-16">
        <img src={footer_dotted.src}></img>

        <div>
          <section>
            <h2 className={headingClass}>Info</h2>
            <ul className="m-0 mt-5 flex list-none flex-wrap gap-x-8 gap-y-2 p-0 sm:gap-x-10">
              {info.map((label) => (
                <li key={label}>
                  <a href={`#${label.toLowerCase()}`} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <hr className="my-7 border-0 border-t border-current" />

          <section>
            <h2 className={headingClass}>Socials</h2>
            <ul className="m-0 mt-5 flex list-none flex-wrap gap-x-8 gap-y-2 p-0 sm:gap-x-10">
              {socials.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </footer>
  );
}