"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
};

/**
 * Counts up to `value` when scrolled into view.
 *
 * The element renders the FINAL value in markup. If JS never runs, the
 * correct number is still on screen — the animation only rewinds and
 * replays it. This is the additive-motion rule.
 */
export function Counter({ value, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useGsapContext(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        const obj = { n: 0 };
        gsap.to(obj, {
          n: value,
          duration: MOTION.slow,
          ease: MOTION.easeOut,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.n).toLocaleString()}${suffix}`;
          },
          onComplete: () => {
            el.textContent = `${value.toLocaleString()}${suffix}`;
          },
        });
      });

      return () => mm.revert();
    },
    [value, suffix],
    ref,
  );

  return (
    <span ref={ref} className={className}>
      {`${value.toLocaleString()}${suffix}`}
    </span>
  );
}
