'use client'
import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
  Palette (muted, so the field stays in the background)
  paper  #F4F6FC   ink  #10163A
  field  slate-blue #8A98C9 → dusty rose #D3A3B8 → sand #D8C49C
*/

// hex -> raw sRGB vec3 (the shader writes final colours, no conversion needed)
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255
  );
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uStrength;
  varying float vH;
  varying float vFade;

  void main() {
    vec3 p = position;

    // two fixed "emitters" whose waves interfere, like radio sources
    float d1 = length(p.xz - vec2(-22.0, -8.0));
    float d2 = length(p.xz - vec2(24.0, -16.0));
    float h = sin(d1 * 0.42 - uTime * 1.0) * 0.9
            + sin(d2 * 0.36 - uTime * 0.8) * 0.8
            + sin((p.x + p.z) * 0.18 + uTime * 0.4) * 0.5;

    // the cursor is a third emitter
    float dm = length(p.xz - uMouse);
    h += sin(dm * 1.1 - uTime * 3.0) * 1.6 * exp(-dm * 0.14) * uStrength;

    p.y = h;
    vH = h;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    gl_PointSize = clamp(uSize * uPixelRatio * (34.0 / dist), 1.0, 7.0 * uPixelRatio);
    vFade = smoothstep(95.0, 35.0, dist);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  varying float vH;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = 1.0 - smoothstep(0.32, 0.5, d);
    if (disc < 0.01) discard;

    float t = smoothstep(-1.6, 1.6, vH);
    vec3 col = mix(uColorA, uColorB, t);
    col = mix(col, uColorC, smoothstep(1.2, 2.6, vH));

    // crests read slightly stronger than troughs
    float a = disc * vFade * uOpacity * (0.55 + 0.45 * t);
    gl_FragColor = vec4(col, a);
  }
`;

function SignalField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.closest("section") || canvas.parentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 200);
    camera.position.set(0, 9, 26);
    camera.lookAt(0, 0, -12);

    // grid of points on the XZ plane
    const COLS = 170;
    const ROWS = 100;
    const SPACING = 0.62;
    const positions = new Float32Array(COLS * ROWS * 3);
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        positions[i++] = (c - COLS / 2) * SPACING;
        positions[i++] = 0;
        positions[i++] = 14 - r * SPACING * 1.15;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 2.2 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uStrength: { value: 0 },
        uOpacity: { value: 0.7 },
        uColorA: { value: rgb("#8A98C9") },
        uColorB: { value: rgb("#D3A3B8") },
        uColorC: { value: rgb("#D8C49C") },
      },
    });
    scene.add(new THREE.Points(geometry, material));

    // cursor -> point on the y=0 plane
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    const ndc = new THREE.Vector2();
    const target = new THREE.Vector2(999, 999);
    let targetStrength = 0;

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      ndc.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        if (material.uniforms.uStrength.value < 0.05) {
          material.uniforms.uMouse.value.set(hit.x, hit.z); // no sweep on first entry
        }
        target.set(hit.x, hit.z);
        targetStrength = 1;
      }
    };
    const onLeave = () => {
      targetStrength = 0;
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = camera.aspect < 1 ? 72 : 52;
      camera.updateProjectionMatrix();
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      renderer.render(scene, camera);
    };

    // Timer does not tick on its own: update() must be called once per frame
    // before reading getElapsed()/getDelta().
    const timer = new THREE.Timer();
    timer.connect(document); // Page Visibility API: zero delta while the tab is hidden

    let raf = 0;
    let visible = true;

    const loop = (timestamp) => {
      timer.update(timestamp); // rAF timestamp shares performance.now()'s time origin

      const u = material.uniforms;
      u.uTime.value = timer.getElapsed() * 0.6;
      u.uMouse.value.lerp(target, 0.08);
      u.uStrength.value += (targetStrength - u.uStrength.value) * 0.05;
      renderer.render(scene, camera);

      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let io;
    if (!reduceMotion) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      // pause rendering when the hero scrolls out of view
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          timer.reset(); // don't count the paused interval as elapsed time
          raf = requestAnimationFrame(loop);
        }
      });
      io.observe(host);
      raf = requestAnimationFrame(loop);
    } else {
      material.uniforms.uTime.value = 2.0;
      renderer.render(scene, camera);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      timer.dispose(); // also disconnects the visibilitychange listener
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        // keep the top of the hero clean behind the headline
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 38%, black 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 38%, black 100%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-paper px-5 pb-20 pt-28 sm:px-[7vw]" id="hero">
      {/* soft colour washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-[#8A98C9]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/4 h-[24rem] w-[24rem] rounded-full bg-[#D3A3B8]/15 blur-3xl"
      />

      <SignalField />

      <div className="relative z-10 max-w-[1200px]">
        <h1 className="m-0 font-title text-5xl font-normal leading-[1.05] tracking-[-0.04em] text-ink sm:text-7xl lg:text-8xl">
          Electronics And Communication Engineering Association
        </h1>

        <p className="mt-6 max-w-[34em] font-body text-lg leading-[1.5] text-ink/75 sm:mt-8 sm:text-xl">
          Talks, workshops and projects that connect ECE students at NIT
          Calicut with working engineers and the wider industry.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
          <a
            href="/activities"
            className="inline-flex items-center bg-ink px-7 py-3 font-body text-lg text-white transition-colors hover:bg-theme-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Explore events
          </a>
          {/* <span className="font-body text-sm text-ink/60">
            Move your cursor to send a ripple
          </span> */}
        </div>
      </div>
    </section>
  );
}