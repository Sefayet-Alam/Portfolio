"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Layout shifts invalidate ScrollTrigger's cached start/end positions.
 * Theme changes swap fonts and borders; webfont loading reflows text.
 * Both need an explicit refresh or pinned sections drift.
 */
export function ScrollRefresher() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [resolvedTheme]);

  useEffect(() => {
    if (!document.fonts) return;
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return null;
}
