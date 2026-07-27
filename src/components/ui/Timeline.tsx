"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

export function TimelineRail({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.motionOk, () => {
        gsap.fromTo(
          ".timeline-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 72%",
              end: "bottom 78%",
              scrub: 0.6,
            },
          },
        );
      });
      return () => mm.revert();
    },
    [],
    root,
  );

  return (
    <div ref={root} className={`relative ${className}`}>
      <span className="absolute bottom-0 left-[15px] top-0 w-px bg-rule sm:left-[19px]" />
      <span className="timeline-progress absolute bottom-0 left-[15px] top-0 w-px origin-top bg-gradient-to-b from-accent via-signal to-accent sm:left-[19px]" />
      <div className="space-y-5">{children}</div>
    </div>
  );
}

export function TimelineEntry({
  children,
  className = "",
  active = false,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <div className={`relative pl-11 sm:pl-14 ${className}`}>
      <span
        className={[
          "absolute left-[9px] top-8 z-10 h-3.5 w-3.5 rounded-full border-[3px] border-surface sm:left-[13px]",
          active
            ? "bg-signal shadow-[0_0_18px_var(--signal)]"
            : "bg-accent",
        ].join(" ")}
      />
      {children}
    </div>
  );
}
