"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

/**
 * Scroll-triggered entrance for a section's items. Each section gets its own
 * variant so the page doesn't repeat one fade-up everywhere.
 *
 * - slide   (Experience)     cards swing in from the left on a 3D hinge
 * - flip    (Education)      cards fold down from the top edge
 * - assemble(Skills)         cards converge from the sides, chips pop in
 * - clip    (Projects)       cards wipe up through a clip mask, images settle
 * - cascade (Achievements)   year rows drift in from the right, cards stagger
 * - deal    (Certifications) cards are dealt up from below with a slight spin
 *
 * Every card also gets a one-shot border-beam sweep (`.beam-run`) as it lands.
 * Items are the container's direct children unless `selector` is given.
 * Under prefers-reduced-motion nothing is hidden or moved.
 */
export type MotionVariant = "slide" | "flip" | "assemble" | "clip" | "cascade" | "deal";

type Props = {
  variant: MotionVariant;
  children: ReactNode;
  className?: string;
  selector?: string;
};

const FROM: Record<MotionVariant, (i: number) => gsap.TweenVars> = {
  slide: () => ({
    opacity: 0,
    filter: "blur(10px)",
    x: -90,
    rotationY: 14,
    transformPerspective: 1100,
    transformOrigin: "left center",
  }),
  flip: () => ({
    opacity: 0,
    filter: "blur(8px)",
    y: 40,
    rotationX: -75,
    transformPerspective: 900,
    transformOrigin: "50% 0%",
  }),
  assemble: (i) => ({
    opacity: 0,
    x: i % 2 === 0 ? -110 : 110,
    scale: 0.88,
  }),
  clip: () => ({
    opacity: 0.2,
    y: 70,
    clipPath: "inset(100% 0% 0% 0% round 24px)",
  }),
  cascade: () => ({
    opacity: 0,
    filter: "blur(10px)",
    x: 120,
    skewX: -6,
  }),
  deal: (i) => ({
    opacity: 0,
    y: 160,
    rotation: i % 2 === 0 ? -7 : 7,
    scale: 0.92,
    transformOrigin: "50% 100%",
  }),
};

const TO: Record<MotionVariant, gsap.TweenVars> = {
  slide: {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    rotationY: 0,
    duration: 0.95,
    ease: "expo.out",
    stagger: 0.14,
  },
  flip: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    rotationX: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.16,
  },
  assemble: { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "power4.out", stagger: 0.1 },
  clip: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0% round 24px)",
    duration: 1.1,
    ease: "expo.out",
    stagger: 0.12,
  },
  cascade: {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    skewX: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.15,
  },
  deal: {
    opacity: 1,
    y: 0,
    rotation: 0,
    scale: 1,
    duration: 0.95,
    ease: MOTION.easeSpring,
    stagger: 0.1,
  },
};

// Extra flourishes on elements inside each item, played as the item lands.
function inner(variant: MotionVariant, items: Element[]) {
  const pick = (sel: string) => items.flatMap((el) => Array.from(el.querySelectorAll(sel)));

  if (variant === "assemble") {
    const chips = pick("li");
    if (chips.length) {
      gsap.fromTo(
        chips,
        { opacity: 0, scale: 0.4, y: 12 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: { each: 0.025, from: "random" },
          delay: 0.25,
          clearProps: "transform,opacity",
        },
      );
    }
  }

  if (variant === "clip") {
    const images = pick("img");
    if (images.length) {
      gsap.fromTo(
        images,
        { scale: 1.3 },
        { scale: 1, duration: 1.6, ease: "expo.out", clearProps: "transform" },
      );
    }
  }

  if (variant === "slide" || variant === "cascade") {
    const dots = pick("[data-timeline-dot]");
    if (dots.length) {
      gsap.fromTo(
        dots,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.6,
          ease: "back.out(3)",
          stagger: 0.14,
          delay: 0.2,
          clearProps: "transform",
        },
      );
    }
  }

  if (variant === "cascade") {
    const cards = pick("article");
    if (cards.length) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 34, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.2,
          clearProps: "transform,opacity",
        },
      );
    }
  }
}

export function SectionMotion({ variant, children, className, selector }: Props) {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        const items = Array.from(
          selector ? el.querySelectorAll(selector) : el.children,
        ) as HTMLElement[];
        if (!items.length) return;

        items.forEach((item, i) => gsap.set(item, FROM[variant](i)));

        const triggers = ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              ...TO[variant],
              clearProps: "transform,opacity,clipPath,filter",
              overwrite: true,
            });
            inner(variant, batch);

            // Border beam sweeps each card as it settles.
            batch.forEach((item, i) => {
              const cards = item.matches("article")
                ? [item]
                : Array.from(item.querySelectorAll("article"));
              gsap.delayedCall(0.35 + i * 0.12, () =>
                cards.forEach((card) => card.classList.add("beam-run")),
              );
            });
          },
        });

        return () => triggers.forEach((t) => t.kill());
      });

      return () => mm.revert();
    },
    [variant, selector],
    root,
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
