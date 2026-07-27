"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startLenis } from "@/lib/motion/lenis";

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
    return stop;
  }, [pathname]);

  return null;
}
