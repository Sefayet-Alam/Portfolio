import Image from "next/image";
import { Github, Linkedin, Mail, Phone, Trophy, FileText } from "lucide-react";

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
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white/70 text-zinc-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200 dark:hover:bg-zinc-900"
    >
      {children}
    </a>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white/65 px-3 py-1 text-xs text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/45 dark:text-zinc-200">
      {children}
    </span>
  );
}

export function Hero({ profile }: HeroProps) {
  return (
    <section id="about" className="py-12">
      <div className="rounded-3xl border border-zinc-200 bg-white/55 p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/45 md:p-8">
        <div className="grid gap-8 md:grid-cols-[1.35fr_0.65fr] md:items-center">
          {/* Left */}
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{profile.location}</p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
              {profile.name}
            </h1>

            <p className="mt-3 text-lg text-zinc-700 dark:text-zinc-200 md:text-xl">
              {profile.title}
            </p>

            {/* CV-derived punchline (tight + recruiter friendly) */}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {profile.tagline}
            </p>

            {/* Strongest facts from CV */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip>Codeforces Expert (max 1734)</Chip>
              <Chip>3500+ problems solved</Chip>
              <Chip>UIU IUPC 2025 — 8th / 120+ teams</Chip>
              <Chip>CodeChef 5★ (max 2019)</Chip>
              <Chip>AtCoder Cyan (max 1271)</Chip>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={profile.links.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 dark:bg-zinc-50 dark:text-black"
              >
                <FileText size={16} />
                Resume
              </a>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                  profile.email
                )}&su=${encodeURIComponent("Hello Sefayet")}&body=${encodeURIComponent(
                  "Hi Sefayet,%0D%0A%0D%0AI visited your portfolio and would like to connect.%0D%0A%0D%0AThanks!"
                )}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                <Mail size={16} />
                Email
              </a>


              <a
                href={`tel:${profile.phone}`}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:hover:bg-zinc-900"
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

          {/* Right: profile image hover swap */}
          <div className="flex justify-center md:justify-end">
            <div className="group relative h-52 w-52 overflow-hidden rounded-full border border-zinc-200 shadow-sm dark:border-zinc-800 md:h-64 md:w-64">
              <Image
                src={profile.images.primary}
                alt="Profile"
                fill
                className="object-cover transition-opacity duration-200 group-hover:opacity-0"
                sizes="260px"
                priority
              />
              <Image
                src={profile.images.hover}
                alt="Profile hover"
                fill
                className="object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                sizes="260px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
