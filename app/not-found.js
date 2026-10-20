'use client'
import { useEffect, useRef } from "react";
import Link from "next/link";

/*
  404 page, same palette as the hero
  paper  #F4F6FC   ink  #10163A
  field  slate-blue #8A98C9 → dusty rose #D3A3B8 → sand #D8C49C

  Idea: the hero's live signal is here "losing signal". Three traces of dots
  start strong on the left and decay into a flat line. Moving the cursor
  over the page re-tunes the signal locally, so the flat part wakes up.
*/

const hex = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const A = hex("#8A98C9");
const B = hex("#D3A3B8");
const C = hex("#D8C49C");

const mix = (p, q, t) => [
  p[0] + (q[0] - p[0]) * t,
  p[1] + (q[1] - p[1]) * t,
  p[2] + (q[2] - p[2]) * t,
];
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function FlatlineField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const host = canvas.closest("section") || canvas.parentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;

    // cursor state (px, canvas space)
    const pointer = { x: -999, y: -999, sx: -999, strength: 0, target: 0 };

    const TRACES = [
      { dy: -26, phase: 0.0, freq: 0.021, speed: 2.0, alpha: 0.5 },
      { dy: 0, phase: 1.7, freq: 0.017, speed: 1.6, alpha: 0.85 },
      { dy: 26, phase: 3.1, freq: 0.024, speed: 2.4, alpha: 0.5 },
    ];
    const GAP = 8; // distance between dots along x

    const draw = (time) => {
      ctx.clearRect(0, 0, w, h);

      const baseY = h * 0.66;
      const maxAmp = Math.min(h * 0.17, 120);

      // smooth the cursor so the bump glides instead of jumping
      pointer.sx += (pointer.x - pointer.sx) * 0.12;
      pointer.strength += (pointer.target - pointer.strength) * 0.06;

      for (const tr of TRACES) {
        for (let x = 0; x <= w; x += GAP) {
          const u = x / w;

          // signal strength: strong on the left, decays to a flat line
          const decay = Math.exp(-u * 4.2);

          // the cursor re-tunes the signal around itself
          const dx = x - pointer.sx;
          const bump = Math.exp(-(dx * dx) / (2 * 150 * 150)) * pointer.strength;

          const env = Math.max(decay, bump * 0.9);

          const phase = x * tr.freq - time * tr.speed + tr.phase;
          const wave = Math.sin(phase) + 0.35 * Math.sin(phase * 2.3 + 1.1);
          const y = baseY + tr.dy + wave * maxAmp * env * 0.7;

          // colour follows height, like the hero field
          const t = smooth(-1, 1, wave * env);
          let col = mix(A, B, t);
          col = mix(col, C, smooth(0.55, 1.1, wave * env));

          // flat sections stay quiet but visible
          const radius = 1.4 + 1.3 * env;
          const alpha = tr.alpha * (0.35 + 0.65 * Math.min(1, env * 1.6));

          ctx.beginPath();
          ctx.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${alpha})`;
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(reduceMotion ? 1.2 : performance.now() / 1000);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      if (pointer.strength < 0.05) pointer.sx = pointer.x; // no sweep on first entry
      pointer.target = 1;
    };
    const onLeave = () => {
      pointer.target = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    let visible = true;
    let io;

    const loop = (ts) => {
      draw(ts / 1000);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    if (!reduceMotion) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      // pause rendering when the page is scrolled out of view
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(loop);
      });
      io.observe(host);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        // keep the top clean behind the headline
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export default function NotFound() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden bg-paper px-5 pb-20 pt-28 sm:px-[7vw]"
      id="not-found"
    >
      {/* soft colour washes (same as hero, mirrored) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-[#D3A3B8]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/3 h-[24rem] w-[24rem] rounded-full bg-[#8A98C9]/20 blur-3xl"
      />

      <FlatlineField />

      <div className="relative z-10 max-w-[1200px]">
        <h1 className="m-0 font-title text-5xl font-normal leading-[1.05] tracking-[-0.04em] text-ink sm:text-7xl lg:text-8xl">
          404. We lost the signal.
        </h1>

        <p className="mt-6 max-w-[34em] font-body text-lg leading-[1.5] text-ink/75 sm:mt-8 sm:text-xl">
          This page doesn&rsquo;t exist or has moved. Check the address for
          typos, or go back to the homepage and find your way from there.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
          <Link
            href="/"
            className="inline-flex items-center bg-ink px-7 py-3 font-body text-lg text-white transition-colors hover:bg-theme-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Back to home
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center border border-ink/30 px-7 py-3 font-body text-lg text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Explore events
          </Link>
        </div>
      </div>
    </section>
  );
}