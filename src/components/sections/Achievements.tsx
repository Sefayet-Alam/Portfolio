import Image from "next/image";
import {
  ArrowUpRight,
  BookMarked,
  BrainCircuit,
  FlaskConical,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionMotion } from "@/components/motion/SectionMotion";
import { Surface } from "@/components/ui/Surface";
import { TimelineEntry, TimelineRail } from "@/components/ui/Timeline";

type EntryLink = {
  label?: string;
  url: string;
};

type ResearchMedia = {
  src: string;
  label: string;
  caption: string;
  tag: string;
  credit?: string;
  creditUrl?: string;
  /** CSS object-position for the crop, e.g. "50% 30%". */
  position?: string;
};

type Item = {
  logo?: string;
  title: string;
  org: string;
  date: string;
  bullets: string[];
  link?: string;
  links?: EntryLink[];
  /** Research cards only: badge text, e.g. "Submitted" / "In progress". */
  status?: string;
  /** Research cards only: kicker text, e.g. "Conference paper". */
  kind?: string;
  /** Research cards only: header visual; defaults to the word-embedding plot. */
  media?: ResearchMedia;
};

const DEFAULT_RESEARCH_MEDIA: ResearchMedia = {
  src: "https://upload.wikimedia.org/wikipedia/commons/8/87/2016_02_mini_embedding.png",
  label: "Representation space",
  caption: "Language mapped as relationships",
  tag: "Word2vec · t-SNE",
  credit: "Visual: Ewulczyn (WMF), CC BY-SA 4.0",
  creditUrl: "https://commons.wikimedia.org/wiki/File:2016_02_mini_embedding.png",
};

type Props = {
  highlights: {
    achievements: Item[];
    publications: Item[];
  };
  scholarUrl: string;
};

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

function prettyLabel(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return DOMAIN_LABELS[host] ?? host;
  } catch {
    return "Evidence";
  }
}

function ProofLinks({ item }: { item: Item }) {
  const links = [
    ...(item.link ? [{ label: "Evidence", url: item.link }] : []),
    ...(item.links ?? []),
  ].filter((link) => link.url);

  if (!links.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={`${link.label}-${link.url}`}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rule bg-surface/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.11em] text-muted transition-[transform,color,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-rule-strong hover:bg-accent-soft hover:text-ink"
        >
          {link.label?.trim() || prettyLabel(link.url)}
          <ArrowUpRight size={11} />
        </a>
      ))}
    </div>
  );
}

function yearFor(item: Item) {
  if (/ongoing/i.test(item.date)) return "Ongoing";
  return item.date.match(/20\d{2}/)?.[0] ?? item.date;
}

function AchievementCard({ item }: { item: Item }) {
  return (
    <Surface as="article" interactive className="h-full p-5">
      <div className="flex items-start gap-3">
        <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-rule bg-accent-soft text-accent">
          {item.logo ? (
            <Image
              src={item.logo}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <Trophy size={16} />
          )}
        </div>
        <div>
          <h4 className="font-semibold leading-snug tracking-[-0.025em] text-ink">
            {item.title}
          </h4>
          <p className="mt-1 text-xs leading-5 text-muted">{item.org}</p>
        </div>
      </div>
      {item.bullets?.length ? (
        <p className="mt-4 text-sm leading-6 text-muted">{item.bullets[0]}</p>
      ) : null}
      <ProofLinks item={item} />
    </Surface>
  );
}

function ResearchCard({ item, index }: { item: Item; index: number }) {
  const kind = item.kind ?? (index === 0 ? "Thesis research" : "Journal research");
  const status = item.status ?? (index === 0 ? "Submitted" : "In progress");
  const Icon = /thesis/i.test(kind) ? BookMarked : FlaskConical;
  const media = item.media ?? DEFAULT_RESEARCH_MEDIA;
  const isDefaultMedia = !item.media;

  return (
    <Surface as="article" interactive className="relative overflow-hidden p-2.5">
      <div className="group/media relative h-44 overflow-hidden rounded-[16px] border border-rule bg-[#090b12]">
        <Image
          src={media.src}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          style={media.position ? { objectPosition: media.position } : undefined}
          className={`object-cover transition-transform duration-300 group-hover/media:scale-[1.035] ${
            isDefaultMedia
              ? `opacity-70 mix-blend-screen ${index % 2 === 0 ? "object-[50%_42%]" : "object-[58%_62%]"}`
              : "object-center opacity-90"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b12] via-[#090b12]/25 to-transparent" />
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">
              {media.label}
            </p>
            <p className="mt-1 text-sm font-medium">{media.caption}</p>
          </div>
          <span className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white/70 backdrop-blur">
            {media.tag}
          </span>
        </div>
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-rule bg-signal-soft text-signal">
            <Icon size={19} />
          </span>
          <span className="rounded-xl border border-rule bg-raised px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-signal">
            {status}
          </span>
        </div>

        <p className="section-kicker mt-7">{kind}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-ink">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-muted">
          {item.org} · {item.date}
        </p>

        <ul className="mt-5 space-y-2.5 text-sm leading-6 text-muted">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <ProofLinks item={item} />
        {media.credit && media.creditUrl ? (
          <a
            href={media.creditUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
          >
            {media.credit}
            <ArrowUpRight size={10} />
          </a>
        ) : media.credit ? (
          <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
            {media.credit}
          </p>
        ) : null}
      </div>
    </Surface>
  );
}

export function Achievements({ highlights, scholarUrl }: Props) {
  const yearOrder = ["Ongoing", "2026", "2025", "2024", "2023", "2022", "2021"];
  const groups = new Map<string, Item[]>();

  for (const item of highlights.achievements) {
    const year = yearFor(item);
    groups.set(year, [...(groups.get(year) ?? []), item]);
  }

  const orderedGroups = [...groups.entries()].sort(
    ([a], [b]) => yearOrder.indexOf(a) - yearOrder.indexOf(b),
  );

  return (
    <section id="highlights" className="py-20 md:py-28">
      <div className="grid gap-7 md:grid-cols-[1fr_0.8fr] md:items-end">
        <div>
          <p className="section-kicker">05 / Proof of work</p>
          <Reveal as="h2" className="section-title mt-4">
            Research and results, with receipts.
          </Reveal>
        </div>
        <Reveal
          as="p"
          className="max-w-lg text-base leading-7 text-muted md:justify-self-end"
        >
          Competitive results, research, and verified profiles arranged as a
          chronology—no tabs hiding the evidence.
        </Reveal>
      </div>

      {highlights.publications.length ? (
        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-rule bg-accent-soft text-accent">
                <BrainCircuit size={16} />
              </span>
              <p className="section-kicker">Active AI / NLP research</p>
            </div>
            <a
              href={scholarUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-rule bg-raised-soft px-3 font-mono text-[9px] uppercase tracking-[0.13em] text-muted transition-[transform,color,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-rule-strong hover:bg-accent-soft hover:text-ink"
            >
              <GraduationCap size={14} />
              Google Scholar
              <ArrowUpRight size={11} />
            </a>
          </div>
          <SectionMotion
            variant="cascade"
            className={`grid gap-4 ${
              highlights.publications.length >= 3 ? "md:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-2"
            }`}
          >
            {highlights.publications.map((item, index) => (
              <ResearchCard
                key={`${item.title}-${item.date}`}
                item={item}
                index={index}
              />
            ))}
          </SectionMotion>
        </div>
      ) : null}

      <SectionMotion variant="cascade" selector="[data-timeline-entry]">
      <TimelineRail className="mt-8">
        {orderedGroups.map(([year, items]) => (
          <TimelineEntry key={year} active={year === "Ongoing"}>
            <div className="grid gap-4 lg:grid-cols-[110px_1fr]">
              <div className="pt-5">
                <p className="font-mono text-sm font-semibold tracking-[-0.02em] text-signal">
                  {year}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  {items.length} milestone{items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <AchievementCard
                    key={`${item.title}-${item.date}`}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </TimelineEntry>
        ))}
      </TimelineRail>
      </SectionMotion>
    </section>
  );
}
