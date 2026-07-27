// Single source of truth for motion feel. Change it here, not per component.
export const MOTION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  ease: "power3.out",
  easeOut: "expo.out",
  distance: 48,
  // gsap.matchMedia() query keys
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
