import Image from "next/image";
import { BookOpen, BriefcaseBusiness } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Surface } from "@/components/ui/Surface";
import { TimelineEntry, TimelineRail } from "@/components/ui/Timeline";

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

function JourneyCard({
  item,
  kind,
  current = false,
}: {
  item: Item;
  kind: "Work" | "Study";
  current?: boolean;
}) {
  return (
    <TimelineEntry active={current}>
      <Surface as="article" interactive className="p-6 md:p-7">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
          <div className="flex items-start gap-4">
            <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-rule bg-surface">
              {item.logo ? (
                <Image
                  src={item.logo}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <span className="font-mono text-xs font-semibold text-accent">
                  {item.org.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                  {kind === "Work" ? (
                    <BriefcaseBusiness size={12} />
                  ) : (
                    <BookOpen size={12} />
                  )}
                  {kind}
                </span>
                {current ? (
                  <span className="rounded-lg bg-signal-soft px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-signal">
                    Current
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-ink">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{item.org}</p>
            </div>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal md:text-right">
            {item.date}
          </p>
        </div>

        <ul className="mt-5 grid gap-2.5 text-sm leading-6 text-muted md:grid-cols-2">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </Surface>
    </TimelineEntry>
  );
}

export function Experience({ experience }: ExperienceProps) {
  const journey = [
    ...experience.work.map((item) => ({ item, kind: "Work" as const })),
    ...experience.studies.map((item) => ({ item, kind: "Study" as const })),
  ];

  return (
    <section id="experience" className="py-20 md:py-28">
      <div className="grid gap-7 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="section-kicker">01 / Journey</p>
          <Reveal as="h2" className="section-title mt-4">
            Learning and shipping on one timeline.
          </Reveal>
        </div>
        <Reveal
          as="p"
          className="max-w-xl text-base leading-7 text-muted md:justify-self-end"
        >
          Study and work stay visible together. The line connects formal
          foundations, production experience, and the systems thinking behind both.
        </Reveal>
      </div>

      <TimelineRail className="mt-11">
        {journey.map(({ item, kind }) => (
          <JourneyCard
            key={`${kind}-${item.title}-${item.date}`}
            item={item}
            kind={kind}
            current={item.date.includes("Present")}
          />
        ))}
      </TimelineRail>
    </section>
  );
}
