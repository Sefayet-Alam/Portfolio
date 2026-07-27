"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import YouTubeCard from "@/components/YouTubeCard";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

type Project = {
  name: string;
  image?: string; // fallback image (optional)
  video?: string; // YouTube link
  stack: string[];
  bullets: string[];
  repo?: string;
  live?: string;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-rule px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
      {children}
    </span>
  );
}

function LinkBtn({
  href,
  label,
  solid,
}: {
  href: string;
  label: string;
  solid?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
        solid
          ? "bg-accent text-accent-ink hover:opacity-90"
          : "border border-rule text-ink hover:bg-accent hover:text-accent-ink",
      ].join(" ")}
    >
      {label}
    </a>
  );
}

function Card({ p, index }: { p: Project; index: number }) {
  return (
    <article className="project-card w-full shrink-0 border border-rule bg-raised lg:w-[38vw]">
      {/* Media — locked aspect so it can never take over the page */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-rule">
        {p.video ? (
          <YouTubeCard url={p.video} title={p.name} />
        ) : p.image ? (
          <Image
            src={p.image}
            alt={p.name}
            fill
            priority={false}
            sizes="(max-width: 1024px) 100vw, 38vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-surface" />
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h3 className="text-lg font-medium text-ink">
            <span className="mr-2 font-mono text-sm text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            {p.name}
          </h3>

          <div className="flex shrink-0 gap-2">
            {p.live ? <LinkBtn href={p.live} label="Live" solid /> : null}
            {p.repo ? <LinkBtn href={p.repo} label="Repo" /> : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>

        <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted">
          {p.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-2 h-px w-4 shrink-0 bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement | null>(null);

  useGsapContext(
    () => {
      const track = root.current?.querySelector<HTMLElement>(".rail-track");
      const pinWrap = root.current?.querySelector<HTMLElement>(".rail-pin");
      if (!track || !pinWrap) return;

      const mm = gsap.matchMedia();

      // Desktop only. Below 1024px the rail is a normal vertical stack,
      // because pinning + horizontal scroll is hostile on touch.
      mm.add(MOTION.desktop, () => {
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + 96);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinWrap,
            start: "top 88px",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            // Iframes swallow pointer events unpredictably mid-transform.
            // Disable them only while actively scrubbing, restore at rest.
            onUpdate: (self) => {
              track.style.pointerEvents =
                Math.abs(self.getVelocity()) > 1 ? "none" : "auto";
            },
            onLeave: () => {
              track.style.pointerEvents = "auto";
            },
            onLeaveBack: () => {
              track.style.pointerEvents = "auto";
            },
          },
        });

        return () => {
          tween.kill();
          track.style.pointerEvents = "auto";
          gsap.set(track, { clearProps: "x" });
        };
      });

      return () => mm.revert();
    },
    [projects.length],
    root,
  );

  return (
    <section ref={root} id="projects" className="py-20 md:py-28">
      <h2 className="border-b border-rule pb-5 font-mono text-sm uppercase tracking-[0.22em] text-ink">
        <span className="text-accent">03</span> — Projects
      </h2>

      <div className="rail-pin mt-10">
        <div className="rail-track flex flex-col gap-6 lg:w-max lg:flex-row lg:gap-8">
          {projects.map((p, i) => (
            <Card key={p.name} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
