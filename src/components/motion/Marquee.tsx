"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

/**
 * Continuously scrolling strip whose direction flips with scroll direction
 * and whose speed rises with scroll velocity.
 *
 * Children are rendered twice so the loop has no visible seam.
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
}) {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const track = root.current?.querySelector(".marquee-track");
      if (!track) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        const tween = gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          {
            xPercent: reverse ? 0 : -50,
            repeat: -1,
            duration: speed,
            ease: "none",
          },
        );

        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            // Flip playback direction to match scroll direction, and
            // briefly speed up proportional to velocity.
            const v = Math.abs(self.getVelocity());
            tween.timeScale(
              (self.direction === 1 ? 1 : -1) *
                gsap.utils.clamp(1, 4, 1 + v / 1200),
            );
          },
        });

        return () => {
          tween.kill();
          st.kill();
        };
      });

      return () => mm.revert();
    },
    [speed, reverse],
    root,
  );

  return (
    <div ref={root} className="overflow-hidden">
      <div className="marquee-track flex w-max gap-4">
        {children}
        {children}
      </div>
    </div>
  );
}
