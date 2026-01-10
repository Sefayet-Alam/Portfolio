"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type EntryLink = {
  label?: string; // optional display name
  url: string;
};

type Item = {
  logo?: string;
  title: string;
  org: string;
  date: string;
  bullets: string[];
  // OLD (kept for backward compatibility, optional)
  link?: string;
  // NEW
  links?: EntryLink[];
};

type Props = {
  highlights: {
    achievements: Item[];
    publications: Item[];
  };
};

// Domain -> nice name mapping
const DOMAIN_LABELS: Record<string, string> = {
  "codeforces.com": "Codeforces",
  "codechef.com": "CodeChef",
  "atcoder.jp": "AtCoder",
  "leetcode.com": "LeetCode",
  "github.com": "GitHub",
  "linkedin.com": "LinkedIn",
  "arxiv.org": "arXiv",
  "ieeexplore.ieee.org": "IEEE Xplore",
  "openreview.net": "OpenReview",
  "facebook.com": "Facebook",
  "web.facebook.com": "Facebook",
};

function prettyLabelFromUrl(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    return DOMAIN_LABELS[host] ?? host;
  } catch {
    return "Link";
  }
}

function LinkChips({ links, legacyLink }: { links?: EntryLink[]; legacyLink?: string }) {
  const merged: EntryLink[] = [
    ...(legacyLink ? [{ label: "Link", url: legacyLink }] : []),
    ...(links ?? []),
  ].filter((x) => x?.url);

  if (!merged.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {merged.map((l) => {
        const label =
          l.label && l.label.trim().length > 0 ? l.label.trim() : prettyLabelFromUrl(l.url);

        return (
          <a
            key={`${label}-${l.url}`}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs text-zinc-900 backdrop-blur hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:hover:bg-zinc-900"
            title={l.url}
          >
            {label}
            <span aria-hidden="true" className="opacity-60">
              ↗
            </span>
          </a>
        );
      })}
    </div>
  );
}

function Tabs({
  value,
  onChange,
}: {
  value: "achievements" | "publications";
  onChange: (v: "achievements" | "publications") => void;
}) {
  return (
    <div className="mt-5 w-full">
      <div className="flex w-full items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onChange("achievements")}
          className={[
            "h-10 w-1/2 rounded-xl border text-sm font-medium transition",
            value === "achievements"
              ? "border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-50 dark:text-black"
              : "border-transparent bg-transparent text-zinc-400 hover:text-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100",
          ].join(" ")}
        >
          Achievements
        </button>

        <button
          type="button"
          onClick={() => onChange("publications")}
          className={[
            "h-10 w-1/2 rounded-xl border text-sm font-medium transition",
            value === "publications"
              ? "border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-50 dark:text-black"
              : "border-transparent bg-transparent text-zinc-400 hover:text-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100",
          ].join(" ")}
        >
          Publications
        </button>
      </div>

      <div className="mt-4 h-px w-full bg-zinc-200/50 dark:bg-zinc-800/70" />
    </div>
  );
}

function Timeline({ items }: { items: Item[] }) {
  return (
    <div className="relative mt-8">
      <div className="absolute left-6 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-10">
        {items.map((it) => (
          <div key={`${it.title}-${it.date}`} className="relative pl-20">
            <div className="absolute left-0 top-0">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                {it.logo ? (
                  <Image
                    src={it.logo}
                    alt="logo"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold tracking-tight">{it.title}</p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{it.org}</p>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{it.date}</span>
              </div>

              {/* NEW: multiple links as chips (also supports old it.link) */}
              <LinkChips links={it.links} legacyLink={it.link} />
            </div>

            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {(it.bullets || []).slice(0, 5).map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Achievements({ highlights }: Props) {
  const [tab, setTab] = useState<"achievements" | "publications">("achievements");
  const items = useMemo(
    () => (tab === "achievements" ? highlights.achievements : highlights.publications),
    [highlights, tab]
  );

  return (
    <section id="highlights" className="py-14">
      <div className="rounded-3xl border border-zinc-200 bg-white/55 p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/45">
        <h2 className="text-lg font-semibold tracking-tight md:text-xl">Highlights</h2>
        <Tabs value={tab} onChange={setTab} />
        <Timeline items={items} />
      </div>
    </section>
  );
}
