"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";
import { splitLines } from "@/lib/motion/splitLines";

type Props = {
  children: ReactNode;
  as?: "div" | "p" | "h1" | "h2" | "h3";
  delay?: number;
  className?: string;
  /** Split into lines and stagger. Only valid for plain-text children. */
  lines?: boolean;
};

/**
 * Reveals content on scroll. Content is visible in markup; gsap.from()
 * animates *from* a hidden state, so a JS failure leaves it readable.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  lines = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useGsapContext(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        const targets = lines ? splitLines(el as HTMLElement) : [el];
        if (targets.length === 0) return;

        gsap.from(targets, {
          yPercent: lines ? 110 : 0,
          y: lines ? 0 : MOTION.distance,
          opacity: lines ? 1 : 0,
          duration: MOTION.base,
          ease: MOTION.ease,
          stagger: lines ? 0.08 : 0,
          delay,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      return () => mm.revert();
    },
    [delay, lines],
    ref,
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
