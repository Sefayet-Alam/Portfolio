import { Reveal } from "@/components/motion/Reveal";
import { SectionMotion } from "@/components/motion/SectionMotion";
import { TimelineRail } from "@/components/ui/Timeline";
import { JourneyCard, type Item } from "@/components/sections/Experience";

type EducationProps = {
  studies: Item[];
};

export function Education({ studies }: EducationProps) {
  return (
    <section id="education" className="py-20 md:py-28">
      <div className="grid gap-7 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="section-kicker">02 / Education</p>
          <Reveal as="h2" className="section-title mt-4">
            Academic background.
          </Reveal>
        </div>
        <Reveal
          as="p"
          className="max-w-xl text-base leading-7 text-muted md:justify-self-end"
        >
          From school in Rajshahi to a B.Sc. in Computer Science &amp;
          Engineering at RUET.
        </Reveal>
      </div>

      <SectionMotion variant="flip" selector="[data-timeline-entry]">
        <TimelineRail className="mt-11">
          {studies.map((item) => (
            <JourneyCard
              key={`${item.title}-${item.date}`}
              item={item}
              kind="Study"
            />
          ))}
        </TimelineRail>
      </SectionMotion>
    </section>
  );
}
