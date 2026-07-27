import { Github, Linkedin, Mail, Phone, Trophy } from "lucide-react";

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
      className="inline-flex h-11 w-11 items-center justify-center border border-rule text-ink transition-colors hover:bg-accent hover:text-accent-ink"
    >
      {children}
    </a>
  );
}

export function Footer({
  email,
  phone,
  github,
  linkedin,
  codeforces,
}: FooterProps) {
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}`;

  return (
    <footer className="mt-16 border-t border-rule">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          {/* Left */}
          <div className="space-y-6">
            <p className="font-mono text-3xl font-medium tracking-tighter text-ink md:text-4xl">
              Let&apos;s build
              <br />
              something solid.
            </p>

            <div className="space-y-3">
              <p className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-accent" />
                <a
                  href={gmail}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-ink underline-offset-4 hover:underline"
                >
                  {email}
                </a>
              </p>

              <p className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-accent" />
                <a
                  href={`tel:${phone}`}
                  className="text-ink underline-offset-4 hover:underline"
                >
                  {phone}
                </a>
              </p>
            </div>

            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Available for full-time, remote and freelance work
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start gap-6 md:items-end">
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

            <p className="border border-rule px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Recruiter tip: click &ldquo;Ask AI&rdquo; for a quick summary
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            © {new Date().getFullYear()} Khandoker Sefayet Alam
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Full-Stack · Flutter · Competitive Programming
          </p>
        </div>
      </div>
    </footer>
  );
}
