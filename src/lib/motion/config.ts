// Single source of truth for motion feel. Change it here, not per component.
export const MOTION = {
  micro: 0.2,
  fast: 0.32,
  base: 0.68,
  slow: 0.92,
  ease: "power3.out",
  easeOut: "expo.out",
  easeSpring: "back.out(1.35)",
  distance: 28,
  // gsap.matchMedia() query keys
  desktop:
    "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)",
  pointer:
    "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
