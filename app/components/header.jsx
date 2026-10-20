"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import logo from "@/app/assets/logo.png";

const links = [
  // { label: "Home", href: "#home" },
  { label: "Gallery", href: "/gallery" },
  { label: "Activities", href: "/activities" },
  // { label: "Contact", href: "#footer" },
  {label: "Placement Experiences", href: "/placements"},
  { label: "About", href: "#about" },
];

const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

const linkClass = `font-title text-xl font-normal hover:underline hover:underline-offset-4 ${focusClass} sm:text-2xl`;

const mobileLinkClass = `font-title text-4xl font-normal hover:underline hover:underline-offset-8 ${focusClass}`;

const iconButtonClass = `-m-2 flex h-12 w-12 items-center justify-center ${focusClass}`;

function Logo({ className = "" }) {
  return (
    <a
      href="/#home"
      aria-label="ECEA NITC, back to top"
      className={`${focusClass} ${className}`}
    >
      <img
        src={logo.src}
        alt="ECEA NITC logo"
        width={70}
        height={70}
        className="h-12 w-12 sm:h-[70px] sm:w-[70px]"
      />
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const openButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) openButtonRef.current?.focus();
  }, []);

  // Lock page scroll and move focus into the menu while it's open
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Escape closes the menu; Tab stays inside it
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;

      const focusable = menuRef.current.querySelectorAll("a[href], button");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // If the viewport grows to desktop size, close the mobile menu
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = (e) => {
      if (e.matches) close(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-start justify-between p-6 text-ink sm:px-8 sm:py-7">
      {/* Desktop nav */}
      <nav aria-label="Main" className="hidden sm:block">
        <ul className="m-0 flex list-none flex-wrap gap-x-10 gap-y-2 px-6">
          {links.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className={linkClass}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Logo />

      {/* Hamburger (mobile only) */}
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={`${iconButtonClass} sm:hidden`}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Full-screen mobile menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`fixed inset-0 z-[100] flex flex-col bg-paper p-6 text-ink transition-[opacity,visibility] duration-200 sm:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-start justify-between">
          <Logo />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => close()}
            aria-label="Close menu"
            className={iconButtonClass}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="flex flex-1 flex-col justify-center pb-16"
        >
          <ul className="m-0 flex list-none flex-col gap-6 p-0">
            {links.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={() => close(false)}
                  className={mobileLinkClass}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}