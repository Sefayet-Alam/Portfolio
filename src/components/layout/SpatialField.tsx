"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { MOTION } from "@/lib/motion/config";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { NeuralField } from "@/components/layout/NeuralField";

export function SpatialField() {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        gsap.to(".spatial-plane-near", {
          yPercent: -25,
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
      <div
        className="spatial-plane-near absolute inset-[-12%]"
        style={{
          transform: "translateZ(-90px) scale(1.08)",
          background:
            "radial-gradient(38% 30% at 78% 18%, var(--plane-2), transparent 72%), radial-gradient(34% 28% at 15% 76%, var(--plane-3), transparent 72%)",
        }}
      />

      <NeuralField />

      {/* Cinematic finish: vignette + film grain (CSS only, no media). */}
      <div className="stage-vignette absolute inset-0" />
      <div className="stage-grain absolute inset-[-50%]" />
    </div>
  );
}
