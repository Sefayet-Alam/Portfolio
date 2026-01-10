"use client";

import Image from "next/image";

type EntryLink = {
  label?: string;
  url: string;
};

type Item = {
  logo?: string;
  title: string;
  org: string;
  date: string;
  bullets: string[];
  // OLD (kept for backward compatibility)
  link?: string;
  // NEW
  links?: EntryLink[];
};

type PublicationsProps = {
  publications: Item[];
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

function Timeline({ items }: { items: Item[] }) {
  return (
    <div className="relative mt-8">
      <div className="absolute left-6 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-10">
        {items.map((it) => (
          <div key={`${it.title}-${it.date}`} className="relative pl-20">
            <div className="absolute left-0 top-0">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                {it.logo ? (
                  <Image src={it.logo} alt="logo" fill className="object-cover" sizes="48px" />
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
              {(it.bullets || []).slice(0, 4).map((b) => (
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

export function Publications({ publications }: PublicationsProps) {
  return (
    <section className="py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Publications</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Selected papers, write-ups, and research outputs.
        </p>

        {publications.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
            No publications added yet.
          </div>
        ) : (
          <Timeline items={publications} />
        )}
      </div>
    </section>
  );
}
