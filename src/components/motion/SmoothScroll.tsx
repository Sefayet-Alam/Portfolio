"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToId, startLenis } from "@/lib/motion/lenis";

/**
 * Mounts Lenis everywhere except /fun, where the canvas owns input and
 * smooth scrolling would interfere with WASD movement.
 * Also skipped entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/fun")) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const stop = startLenis();
    let cancelled = false;

    const applyInitialHash = async () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id) return;
      await document.fonts.ready;
      if (cancelled) return;
      ScrollTrigger.refresh();
      window.requestAnimationFrame(() => scrollToId(id));
    };

    void applyInitialHash();
    window.addEventListener("intro-complete", applyInitialHash);

    return () => {
      cancelled = true;
      window.removeEventListener("intro-complete", applyInitialHash);
      stop();
    };
  }, [pathname]);

  return null;
}
