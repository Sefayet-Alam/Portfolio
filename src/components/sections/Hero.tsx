import Image from "next/image";
import {
  ArrowDownRight,
  ArrowUpRight,
  Code2,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Trophy,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { PointerTilt } from "@/components/motion/PointerTilt";
import { MagneticAction } from "@/components/motion/MagneticAction";
import { ActionLink } from "@/components/ui/ActionButton";
import { Surface } from "@/components/ui/Surface";

type HeroProps = {
  profile: {
    name: string;
    title: string;
    tagline: string;
    location: string;
    email: string;
    phone: string;
    images: { primary: string; hover: string };
    links: {
      github: string;
      linkedin: string;
      codeforces: string;
      scholar: string;
      resume: string;
    };
  };
};

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="grid h-11 w-11 place-items-center rounded-xl border border-rule bg-raised-soft text-muted transition-[transform,color,border-color,background-color] duration-200 hover:-translate-y-1 hover:border-rule-strong hover:bg-accent-soft hover:text-ink"
    >
      {children}
    </a>
  );
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-rule bg-raised-soft px-4 py-3">
      <p className="font-mono text-2xl font-semibold tracking-[-0.06em] text-ink md:text-3xl">
        <Counter value={value} suffix={suffix} />
      </p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
    </div>
  );
}

export function Hero({ profile }: HeroProps) {
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email,
  )}&su=${encodeURIComponent("Hello Sefayet")}`;

  return (
    <section
      id="about"
      className="grid min-h-[calc(100dvh-104px)] items-center py-12 md:py-16"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
        <div>
          <Reveal
            as="p"
            className="section-kicker flex items-center gap-2.5"
          >
            <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_18px_var(--signal)]" />
            Available for engineering roles
          </Reveal>

          <Reveal
            as="h1"
            delay={0.03}
            className="mt-5 max-w-[11ch] text-[clamp(3.2rem,6vw,5.75rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-ink"
          >
            {profile.name}
          </Reveal>

          <Reveal
            as="p"
            delay={0.07}
            className="mt-6 max-w-2xl text-lg font-medium leading-snug tracking-[-0.025em] text-ink md:text-2xl"
          >
            {profile.title.trim()}
          </Reveal>

          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 max-w-xl text-[15px] leading-7 text-muted md:text-base"
          >
            I turn research and algorithmic thinking into deployable AI
            systems—combining grounded language workflows, full-stack
            engineering, and competitive-programming rigor.
          </Reveal>

          <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat value={1770} label="Codeforces max" />
            <Stat value={3500} suffix="+" label="Problems solved" />
            <Stat value={2} suffix="×" label="ICPC regionalist" />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <MagneticAction>
              <ActionLink
                href={profile.links.resume}
                variant="primary"
                external
              >
                <FileText size={15} />
                View résumé
                <ArrowUpRight size={14} />
              </ActionLink>
            </MagneticAction>

            <MagneticAction>
              <ActionLink href={gmail} variant="secondary" external>
                <Mail size={15} />
                Email me
              </ActionLink>
            </MagneticAction>

            <a
              href={`tel:${profile.phone}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 font-mono text-xs text-muted transition-colors hover:text-ink"
            >
              <Phone size={14} />
              {profile.phone}
            </a>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <IconLink href={profile.links.github} label="GitHub">
              <Github size={17} />
            </IconLink>
            <IconLink href={profile.links.linkedin} label="LinkedIn">
              <Linkedin size={17} />
            </IconLink>
            <IconLink href={profile.links.codeforces} label="Codeforces">
              <Trophy size={17} />
            </IconLink>
            <IconLink href={profile.links.scholar} label="Google Scholar">
              <GraduationCap size={17} />
            </IconLink>
            <span className="ml-2 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:flex">
              <MapPin size={13} className="text-signal" />
              {profile.location}
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[430px] lg:mr-0">
          <div className="absolute -left-6 top-16 hidden rounded-2xl border border-rule bg-raised-soft px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted shadow-[var(--shadow-ambient)] backdrop-blur-xl sm:block">
            <span className="mb-1 flex items-center gap-2 text-signal">
              <Code2 size={13} />
              Current stack
            </span>
            Python · NLP · LangGraph
          </div>

          <PointerTilt maxTilt={4} lift={5}>
            <Surface className="overflow-hidden p-2.5">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[18px] border border-rule bg-surface">
                <Image
                  src={profile.images.primary}
                  alt={`Portrait of ${profile.name}`}
                  fill
                  className="object-cover object-center grayscale transition-[opacity,filter,transform] duration-300 group-hover:scale-[1.025] group-hover:opacity-0 group-hover:grayscale-0"
                  sizes="(max-width: 1024px) 86vw, 430px"
                  priority
                />
                <Image
                  src={profile.images.hover}
                  alt=""
                  fill
                  className="object-cover object-center opacity-0 transition-[opacity,transform] duration-300 group-hover:scale-[1.025] group-hover:opacity-100"
                  sizes="(max-width: 1024px) 86vw, 430px"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090b12]/85 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
                      Builder profile
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                      Logic with a human edge.
                    </p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 backdrop-blur">
                    <ArrowDownRight size={18} />
                  </span>
                </div>
              </div>
            </Surface>
          </PointerTilt>

          <div className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-rule bg-raised-soft px-4 py-3 shadow-[var(--shadow-ambient)] backdrop-blur-xl sm:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
              Signal
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">
              CP × Product × AI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
