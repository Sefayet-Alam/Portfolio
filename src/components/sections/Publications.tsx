import Image from "next/image";
import { ArrowUpRight, BrainCircuit, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Surface } from "@/components/ui/Surface";

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
  scholarUrl: string;
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
            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-rule px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink transition-[transform,color,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink"
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
    <div className="mt-10 grid gap-5 lg:grid-cols-2">
      {items.map((it, index) => (
        <Reveal key={`${it.title}-${it.date}`}>
          <Surface
            as="article"
            interactive
            className="h-full overflow-hidden p-2.5"
          >
            <div className="relative h-52 overflow-hidden rounded-[16px] border border-rule bg-[#090b12]">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/2016_02_mini_embedding.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover opacity-70 mix-blend-screen ${
                  index === 0 ? "object-[48%_38%]" : "object-[58%_66%]"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b12] via-transparent to-[#090b12]/20" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white">
                <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-white/65">
                  Active research track {String(index + 1).padStart(2, "0")}
                </p>
                <span className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white/70 backdrop-blur">
                  NLP · ML
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-rule bg-accent-soft">
                  {it.logo ? (
                    <Image
                      src={it.logo}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <BrainCircuit
                      size={18}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-accent"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xl font-semibold tracking-[-0.035em] text-ink">
                    {it.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{it.org}</p>
                  <span className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.14em] text-signal">
                    {it.date}
                  </span>
                </div>
              </div>

              <LinkChips links={it.links} legacyLink={it.link} />

              <ul className="mt-5 space-y-2.5 text-sm leading-6 text-muted">
                {(it.bullets || []).slice(0, 4).map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-signal" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://commons.wikimedia.org/wiki/File:2016_02_mini_embedding.png"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted hover:text-ink"
              >
                Word2vec t-SNE · Ewulczyn (WMF) · CC BY-SA 4.0
                <ArrowUpRight size={10} />
              </a>
            </div>
          </Surface>
        </Reveal>
      ))}
    </div>
  );
}

export function Publications({
  publications,
  scholarUrl,
}: PublicationsProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="grid gap-7 border-b border-rule pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="section-kicker">Research notebook</p>
          <h1 className="section-title mt-4">
            Active NLP work, without inflated claims.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            Two manuscripts are in motion. Submission targets are shown
            transparently; neither project is presented as accepted or
            published.
          </p>
        </div>
        <a
          href={scholarUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rule bg-raised-soft px-4 font-mono text-[10px] uppercase tracking-[0.13em] text-ink transition-[transform,color,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-rule-strong hover:bg-accent-soft hover:text-accent"
        >
          <GraduationCap size={16} />
          Google Scholar
          <ArrowUpRight size={12} />
        </a>
      </div>

      {publications.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-rule p-6 text-sm text-muted">
          No publications added yet.
        </div>
      ) : (
        <Timeline items={publications} />
      )}
    </section>
  );
}
