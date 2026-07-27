"use client";

import { useLayoutEffect, useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// useLayoutEffect warns during SSR; useEffect is the correct no-op there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs GSAP setup inside a gsap.context() scoped to `scopeRef`, so every
 * tween and ScrollTrigger created inside is reverted on unmount. Without
 * this, ScrollTriggers survive navigation and corrupt scroll positions.
 */
export function useGsapContext(
  fn: (ctx: gsap.Context) => void,
  deps: unknown[],
  scopeRef: RefObject<HTMLElement | null>,
) {
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context((self) => fn(self), scopeRef.current ?? undefined);
    return () => ctx.revert();
  }, deps);
}
