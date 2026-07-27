import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

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

function LinkChips({
  links,
  legacyLink,
}: {
  links?: EntryLink[];
  legacyLink?: string;
}) {
  const merged: EntryLink[] = [
    ...(legacyLink ? [{ label: "Link", url: legacyLink }] : []),
    ...(links ?? []),
  ].filter((x) => x?.url);

  if (!merged.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {merged.map((l) => {
        const label =
          l.label && l.label.trim().length > 0
            ? l.label.trim()
            : prettyLabelFromUrl(l.url);

        return (
          <a
            key={`${label}-${l.url}`}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 border border-rule px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink transition-colors hover:bg-accent hover:text-accent-ink"
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
    <div className="relative mt-10">
      <div className="absolute left-6 top-0 hidden h-full w-px bg-rule sm:block" />

      <div className="space-y-12">
        {items.map((it) => (
          <Reveal key={`${it.title}-${it.date}`} className="relative sm:pl-20">
            <div className="absolute left-0 top-0 hidden sm:block">
              <div className="relative h-12 w-12 overflow-hidden border border-rule bg-raised">
                {it.logo ? (
                  <Image
                    src={it.logo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-base font-medium tracking-tight text-ink">
                {it.title}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm text-muted">{it.org}</p>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  {it.date}
                </span>
              </div>

              {/* multiple links as chips (also supports legacy it.link) */}
              <LinkChips links={it.links} legacyLink={it.link} />
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
              {(it.bullets || []).slice(0, 4).map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2 h-px w-4 flex-none bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function Publications({ publications }: PublicationsProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="border-b border-rule pb-5">
        <h1 className="font-mono text-sm uppercase tracking-[0.22em] text-ink">
          Publications
        </h1>
        <p className="mt-3 text-sm text-muted">
          Selected papers, write-ups, and research outputs.
        </p>
      </div>

      {publications.length === 0 ? (
        <div className="mt-10 border border-dashed border-rule p-6 text-sm text-muted">
          No publications added yet.
        </div>
      ) : (
        <Timeline items={publications} />
      )}
    </section>
  );
}
