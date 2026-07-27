"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

type Item = {
  logo: string;
  title: string;
  org: string;
  date: string;
  bullets: string[];
};

type ExperienceProps = {
  experience: {
    work: Item[];
    studies: Item[];
  };
};

function CardItem({ item, index }: { item: Item; index: number }) {
  return (
    <div
      className="exp-card sticky top-28 border border-rule bg-raised p-6 md:p-8"
      style={{ zIndex: index + 1 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden border border-rule">
            <Image
              src={item.logo}
              alt=""
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div>
            <p className="text-lg font-medium text-ink">{item.title}</p>
            <p className="text-sm text-muted">{item.org}</p>
          </div>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
          {item.date}
        </p>
      </div>

      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
        {item.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-2 h-px w-4 shrink-0 bg-accent" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Experience({ experience }: ExperienceProps) {
  const [tab, setTab] = useState<"work" | "studies">("work");
  const root = useRef<HTMLElement | null>(null);

  const items = useMemo(
    () => (tab === "work" ? experience.work : experience.studies),
    [tab, experience.work, experience.studies],
  );

  useGsapContext(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.desktop, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.94,
            opacity: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 140px",
              end: "bottom 120px",
              scrub: true,
            },
          });
        });
      });

      return () => mm.revert();
    },
    [tab, items.length],
    root,
  );

  // Tab switching changes document height; stale trigger positions
  // would leave cards stacked at the wrong scroll offsets.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => window.clearTimeout(id);
  }, [tab]);

  return (
    <section ref={root} id="experience" className="py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-5">
        <h2 className="font-mono text-sm uppercase tracking-[0.22em] text-ink">
          <span className="text-accent">01</span> — Experience
        </h2>

        <div className="flex gap-1">
          {(["work", "studies"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                "px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
                tab === t
                  ? "bg-accent text-accent-ink"
                  : "border border-rule text-muted hover:text-ink",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {items.map((it, i) => (
          <CardItem key={`${it.title}-${it.date}`} item={it} index={i} />
        ))}
      </div>
    </section>
  );
}
