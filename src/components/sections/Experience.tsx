"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

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

function CardItem({ item }: { item: Item }) {
  return (
    <div className="relative pl-12">
      {/* logo */}
      <div className="absolute left-0 top-0">
        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <Image src={item.logo} alt="" fill className="object-cover" sizes="36px" />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white/55 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{item.org}</p>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.date}</p>
        </div>

        <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
          {item.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span className="leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Experience({ experience }: ExperienceProps) {
  const [tab, setTab] = useState<"work" | "studies">("work");

  const items = useMemo(() => {
    return tab === "work" ? experience.work : experience.studies;
  }, [tab, experience.work, experience.studies]);

  return (
    <section id="experience" className="py-12">
      <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
      {/* Tabs (responsive + wide) */}
      <div className="mt-5 rounded-2xl border border-zinc-200 bg-white/55 p-3 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="grid w-full grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTab("work")}
            className={[
              "h-11 w-full rounded-xl text-sm font-semibold transition",
              tab === "work"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black"
                : "border border-zinc-200 bg-white/60 text-zinc-900 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            Work
          </button>

          <button
            type="button"
            onClick={() => setTab("studies")}
            className={[
              "h-11 w-full rounded-xl text-sm font-semibold transition",
              tab === "studies"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black"
                : "border border-zinc-200 bg-white/60 text-zinc-900 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            Studies
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {items.map((it) => (
            <CardItem key={`${it.title}-${it.date}`} item={it} />
          ))}
        </div>
      </div>
    </section>
  );
}
