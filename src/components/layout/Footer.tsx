import { Github, Linkedin, Mail, Phone, Trophy, Sparkles } from "lucide-react";

type FooterProps = {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  codeforces: string;
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
      className="
        group inline-flex h-11 w-11 items-center justify-center rounded-xl
        border border-zinc-200 bg-white/70 text-zinc-800 shadow-sm backdrop-blur
        transition
        hover:-translate-y-0.5 hover:bg-white hover:shadow-md
        dark:border-zinc-800 dark:bg-zinc-950/45 dark:text-zinc-100 dark:hover:bg-zinc-900
      "
    >
      <span className="transition-transform group-hover:scale-110">{children}</span>
      <span
        className="
          pointer-events-none absolute h-11 w-11 rounded-xl opacity-0 blur-xl transition-opacity
          group-hover:opacity-60
          dark:bg-indigo-500/25
        "
      />
    </a>
  );
}

function RowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="underline-offset-4 hover:underline text-zinc-700 dark:text-zinc-200"
    >
      {children}
    </a>
  );
}

export function Footer({ email, phone, github, linkedin, codeforces }: FooterProps) {
  return (
    <footer className="mt-14">
      {/* gradient top rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

      <div className="bg-white/45 backdrop-blur dark:bg-zinc-950/35">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {/* Left */}
            <div className="space-y-4">
              <div>
                <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Let’s build something solid.
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  Full-Stack Developer • Flutter • Competitive Programming
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="inline-flex items-center gap-2">
                    <Mail size={16} className="text-zinc-500 dark:text-zinc-400" />
                    <RowLink href={`mailto:${email}`}>{email}</RowLink>
                  </span>
                </p>

                <p className="text-sm">
                  <span className="inline-flex items-center gap-2">
                    <Phone size={16} className="text-zinc-500 dark:text-zinc-400" />
                    <RowLink href={`tel:${phone}`}>{phone}</RowLink>
                  </span>
                </p>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-2">
                  <Sparkles size={14} />
                  Available for full-time,remote and freelance projects.
                </p>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                © {new Date().getFullYear()} Khandoker Sefayet Alam 
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col items-start gap-4 md:items-end">
              <div className="flex items-center gap-2">
                <IconLink href={github} label="GitHub">
                  <Github size={18} />
                </IconLink>
                <IconLink href={linkedin} label="LinkedIn">
                  <Linkedin size={18} />
                </IconLink>
                <IconLink href={codeforces} label="Codeforces">
                  <Trophy size={18} />
                </IconLink>
              </div>

              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="rounded-full border border-zinc-200 bg-white/60 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950/40">
                  Recruiter tip: click “Ask AI” for a quick summary
                </span>
              </div>
            </div>
          </div>

          {/* bottom fade */}
          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
        </div>
      </div>
    </footer>
  );
}
