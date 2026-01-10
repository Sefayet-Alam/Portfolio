"use client";

import { useEffect, useRef } from "react";

export function BackgroundFx() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    if (prefersReduced) return; // no mouse spotlight updates

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    let raf = 0;
    let scheduled = false;

    const flush = () => {
      scheduled = false;
      el.style.setProperty("--mx", `${mx}px`);
      el.style.setProperty("--my", `${my}px`);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Throttle updates to once per frame
      if (!scheduled) {
        scheduled = true;
        raf = requestAnimationFrame(flush);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* Aurora (cheap animation: background-position only) */}
      <div className="absolute inset-0 aurora-smooth opacity-60 dark:opacity-85" />

      {/* Blobs (transform animation only; no animated blur filters) */}
      <div className="absolute -inset-24 blob-smooth blob-a opacity-35 dark:opacity-40" />
      <div className="absolute -inset-24 blob-smooth blob-b opacity-30 dark:opacity-35" />

      {/* Mouse spotlight (RAF throttled) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(700px circle at var(--mx, 50%) var(--my, 40%), rgba(99,102,241,0.16), transparent 62%)",
        }}
      />

      {/* Static texture (very light) */}
      <div className="absolute inset-0 noise opacity-[0.06] dark:opacity-[0.09] mix-blend-soft-light" />

      {/* Vignette */}
      <div className="absolute inset-0 vignette-smooth" />
    </div>
  );
}
