import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Starts Lenis and wires it to GSAP's ticker. Returns a teardown fn. */
export function startLenis(): () => void {
  if (typeof window === "undefined") return () => {};
  if (lenis) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Touch devices keep native scrolling — smoothing it fights the OS.
    syncTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

/**
 * Scrolls to an element by id, honoring the sticky header offset.
 * Falls back to native scrolling when Lenis is not running
 * (reduced-motion, or the /fun route).
 */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const offsetVar = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-offset",
  );
  const offset = -(parseInt(offsetVar, 10) || 92);

  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2 });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "auto" });
  }
}
