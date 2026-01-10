"use client";

import { useEffect, useRef } from "react";

export function BackgroundFx() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* Auto-animating aurora layer (no grid) */}
      <div className="absolute inset-0 aurora opacity-70 dark:opacity-90" />

      {/* Slow drifting “blobs” (adds depth) */}
      <div className="absolute -inset-24 blob blob-a opacity-30 dark:opacity-35" />
      <div className="absolute -inset-24 blob blob-b opacity-25 dark:opacity-30" />
      <div className="absolute -inset-24 blob blob-c opacity-20 dark:opacity-25" />

      {/* Mouse spotlight: subtle in light, richer in dark */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "radial-gradient(650px circle at var(--mx, 50%) var(--my, 40%), rgba(0,0,0,0.06), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(760px circle at var(--mx, 50%) var(--my, 40%), rgba(99,102,241,0.16), transparent 62%)",
        }}
      />

      {/* Soft shimmer (barely-there, but makes it feel “not flat”) */}
      <div className="absolute inset-0 shimmer opacity-[0.10] dark:opacity-[0.14]" />

      {/* Noise to break banding + add texture */}
      <div className="absolute inset-0 noise mix-blend-soft-light opacity-[0.10] dark:opacity-[0.14]" />

      {/* Vignette to keep edges darker and center readable */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.10)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_34%,rgba(0,0,0,0.75)_100%)]" />
    </div>
  );
}
