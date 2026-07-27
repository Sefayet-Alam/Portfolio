"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

/**
 * Rotates up from a reclined position as it enters view.
 *
 * Perspective is applied to THIS wrapper only, never to a page-level
 * ancestor — a page-level perspective would trap the fixed chat widget
 * and sticky header. See the layer contract in globals.css.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.firstElementChild;
      if (!inner) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION.desktop, () => {
        gsap.from(inner, {
          rotateX: 18,
          y: 60,
          opacity: 0,
          transformOrigin: "50% 100%",
          duration: MOTION.slow,
          ease: MOTION.ease,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      return () => mm.revert();
    },
    [],
    ref,
  );

  return (
    <div ref={ref} className={className} style={{ perspective: "1200px" }}>
      <div style={{ transformStyle: "preserve-3d" }}>{children}</div>
    </div>
  );
}
