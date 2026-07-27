import Image from "next/image";
import { Github, Linkedin, Mail, Phone, Trophy, FileText } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { TiltCard } from "@/components/motion/TiltCard";

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
      resume: string;
    };
  };
};

function IconBtn({
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
      className="inline-flex h-11 w-11 items-center justify-center border border-rule text-ink transition-colors hover:bg-accent hover:text-accent-ink"
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
    <div className="border-t border-rule pt-3">
      <p className="font-mono text-4xl font-medium tracking-tighter text-ink md:text-5xl">
        <Counter value={value} suffix={suffix} />
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
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
    <section id="about" className="pb-20 pt-16 md:pb-28 md:pt-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
        {profile.location}
      </p>

      <Reveal
        as="h1"
        lines
        className="mt-6 font-mono text-[13vw] font-medium leading-[0.86] tracking-tighter text-ink md:text-[7.5rem]"
      >
        {profile.name}
      </Reveal>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div>
          <Reveal as="p" className="text-xl text-ink md:text-2xl">
            {profile.title}
          </Reveal>

          <Reveal
            as="p"
            delay={0.08}
            className="mt-4 max-w-xl leading-relaxed text-muted"
          >
            {profile.tagline}
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
            <Stat value={1814} label="Codeforces max" />
            <Stat value={3500} suffix="+" label="Problems solved" />
            <Stat value={2019} label="CodeChef max" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={profile.links.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-sm font-medium uppercase tracking-wider text-accent-ink transition-opacity hover:opacity-90"
            >
              <FileText size={16} />
              Résumé
            </a>

            <a
              href={gmail}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border border-rule px-5 py-3 font-mono text-sm uppercase tracking-wider text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              <Mail size={16} />
              Email
            </a>

            <a
              href={`tel:${profile.phone}`}
              className="inline-flex items-center gap-2 border border-rule px-5 py-3 font-mono text-sm text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              <Phone size={16} />
              {profile.phone}
            </a>

            <div className="flex items-center gap-2">
              <IconBtn href={profile.links.github} label="GitHub">
                <Github size={18} />
              </IconBtn>
              <IconBtn href={profile.links.linkedin} label="LinkedIn">
                <Linkedin size={18} />
              </IconBtn>
              <IconBtn href={profile.links.codeforces} label="Codeforces">
                <Trophy size={18} />
              </IconBtn>
            </div>
          </div>
        </div>

        <TiltCard className="justify-self-center md:justify-self-end">
          {/* group hover-swap preserved exactly */}
          <div className="group relative h-64 w-64 overflow-hidden border border-rule md:h-80 md:w-80">
            <Image
              src={profile.images.primary}
              alt="Profile"
              fill
              className="object-cover grayscale transition-all duration-300 group-hover:opacity-0 group-hover:grayscale-0"
              sizes="320px"
              priority
            />
            <Image
              src={profile.images.hover}
              alt="Profile hover"
              fill
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              sizes="320px"
              priority
            />
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
