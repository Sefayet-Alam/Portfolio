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

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* subtle grid texture (theme-friendly) */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.16) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* LIGHT MODE spotlight */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "radial-gradient(650px circle at var(--mx, 50%) var(--my, 40%), rgba(0,0,0,0.06), transparent 60%)",
        }}
      />

      {/* DARK MODE spotlight */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(700px circle at var(--mx, 50%) var(--my, 40%), rgba(99,102,241,0.16), transparent 62%)",
        }}
      />

      {/* vignette (lighter on light mode) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.12)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.60)_100%)]" />
    </div>
  );
}
