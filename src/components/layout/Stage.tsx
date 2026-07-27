"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

/**
 * Fixed background depth. Three planes translate on Z and drift at
 * different rates on scroll, producing parallax.
 *
 * This is the ONLY element tree allowed to carry `perspective` — see the
 * layer contract in globals.css. It is inert: pointer-events: none, aria-hidden.
 */
export function Stage() {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        gsap.to(".plane-a", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.6 },
        });
        gsap.to(".plane-b", {
          yPercent: -26,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.9 },
        });
        gsap.to(".plane-c", {
          yPercent: -40,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 1.2 },
        });
      });

      return () => mm.revert();
    },
    [],
    root,
  );

  return (
    <div ref={root} aria-hidden className="layer-stage">
      {/* Hairline grid, deepest plane */}
      <div
        className="plane-c absolute inset-[-20%]"
        style={{
          transform: "translateZ(-600px) scale(1.6)",
          backgroundImage:
            "linear-gradient(to right, var(--plane-1) 1px, transparent 1px), linear-gradient(to bottom, var(--plane-1) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />
      {/* Accent wash, mid plane */}
      <div
        className="plane-b absolute inset-[-20%]"
        style={{
          transform: "translateZ(-300px) scale(1.3)",
          background:
            "radial-gradient(60% 50% at 78% 18%, var(--plane-3), transparent 70%)",
        }}
      />
      {/* Soft tonal plane, nearest */}
      <div
        className="plane-a absolute inset-[-20%]"
        style={{
          transform: "translateZ(-120px) scale(1.12)",
          background:
            "radial-gradient(50% 40% at 18% 82%, var(--plane-2), transparent 72%)",
        }}
      />
    </div>
  );
}
