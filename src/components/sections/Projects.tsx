"use client";

import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import YouTubeCard from "@/components/YouTubeCard";
import { PointerTilt } from "@/components/motion/PointerTilt";
import { Reveal } from "@/components/motion/Reveal";
import { SectionMotion } from "@/components/motion/SectionMotion";
import { actionClassName } from "@/components/ui/ActionButton";
import { Surface } from "@/components/ui/Surface";

type Project = {
  name: string;
  image?: string;
  video?: string;
  stack: string[];
  bullets: string[];
  repo?: string;
  live?: string;
};

function ProjectCard({
  project,
  index,
  featured = false,
  className,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  className: string;
}) {
  return (
    <PointerTilt maxTilt={featured ? 2.2 : 1.8} lift={5} className={className}>
      <Surface
        as="article"
        className="group flex h-full flex-col overflow-hidden p-2.5"
      >
        <div
          className={`relative overflow-hidden rounded-[16px] border border-rule bg-surface ${
            featured ? "aspect-[16/9]" : "aspect-[16/8]"
          }`}
        >
          {project.video ? (
            <YouTubeCard url={project.video} title={project.name} />
          ) : project.image ? (
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes={featured ? "(max-width: 1024px) 100vw, 58vw" : "42vw"}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
            />
          ) : (
            <div className="h-full w-full bg-accent-soft" />
          )}
          <span className="absolute left-3 top-3 z-10 rounded-lg border border-white/15 bg-[#090b12]/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur">
            Project {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className={`flex flex-1 flex-col ${featured ? "p-6" : "p-5"}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">
                {featured ? "Featured build" : "Selected build"}
              </p>
              <h3
                className={`mt-2 font-semibold leading-tight tracking-[-0.045em] text-ink ${
                  featured ? "text-3xl" : "text-xl"
                }`}
              >
                {project.name}
              </h3>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-rule bg-accent-soft text-accent transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight size={17} />
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-rule bg-surface/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.11em] text-muted"
              >
                {item}
              </span>
            ))}
          </div>

          <ul className="mt-5 space-y-2.5 text-sm leading-6 text-muted">
            {project.bullets.slice(0, featured ? 6 : 2).map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className={actionClassName("primary")}
              >
                Open live
                <ArrowUpRight size={14} />
              </a>
            ) : null}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className={actionClassName("quiet")}
              >
                <Github size={14} />
                Source
              </a>
            ) : null}
          </div>
        </div>
      </Surface>
    </PointerTilt>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="grid gap-7 md:grid-cols-[1fr_0.8fr] md:items-end">
        <div>
          <p className="section-kicker">04 / Selected work</p>
          <Reveal as="h2" className="section-title mt-4">
            Projects you can compare, not chase.
          </Reveal>
        </div>
        <Reveal
          as="p"
          className="max-w-lg text-base leading-7 text-muted md:justify-self-end"
        >
          Five builds live in one spatial directory, led by an explainable
          agentic system for agriculture. Hover for depth; open the evidence.
        </Reveal>
      </div>

      <SectionMotion variant="clip" className="mt-10 grid gap-5 lg:grid-cols-12">
        {projects.map((project, index) => {
          const className =
            index === 0
              ? "lg:col-span-7 lg:row-span-2"
              : index === 1 || index === 2
                ? "lg:col-span-5"
                : "lg:col-span-6";
          return (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              featured={index === 0}
              className={className}
            />
          );
        })}
      </SectionMotion>
    </section>
  );
}
