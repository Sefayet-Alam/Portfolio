import {
  ArrowUpRight,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
  Sparkles,
  Trophy,
} from "lucide-react";
import { ActionLink } from "@/components/ui/ActionButton";
import { Surface } from "@/components/ui/Surface";

type FooterProps = {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  codeforces: string;
  scholar: string;
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

export function Footer({
  email,
  phone,
  github,
  linkedin,
  codeforces,
  scholar,
}: FooterProps) {
  return (
    <footer className="mx-auto mt-8 max-w-6xl px-6 pb-8">
      <Surface className="overflow-hidden p-7 md:p-10">
        <div className="grid gap-9 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <p className="section-kicker flex items-center gap-2">
              <Sparkles size={13} />
              Open channel
            </p>
            <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-ink md:text-6xl">
              Let&apos;s make the difficult feel obvious.
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href={`mailto:${email}`} variant="primary">
                <Mail size={15} />
                Start a conversation
                <ArrowUpRight size={14} />
              </ActionLink>
              <ActionLink href={`tel:${phone}`} variant="secondary">
                <Phone size={15} />
                {phone}
              </ActionLink>
            </div>
          </div>

          <div className="md:justify-self-end">
            <p className="max-w-sm text-sm leading-6 text-muted md:text-right">
              Available for full-time, remote, and select freelance work. Recruiters
              can also use Ask AI for a fast, grounded summary.
            </p>
            <div className="mt-5 flex items-center gap-2 md:justify-end">
              <IconLink href={github} label="GitHub">
                <Github size={17} />
              </IconLink>
              <IconLink href={linkedin} label="LinkedIn">
                <Linkedin size={17} />
              </IconLink>
              <IconLink href={codeforces} label="Codeforces">
                <Trophy size={17} />
              </IconLink>
              <IconLink href={scholar} label="Google Scholar">
                <GraduationCap size={17} />
              </IconLink>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-muted">
            © {new Date().getFullYear()} Khandoker Sefayet Alam
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-muted">
            AI/ML · NLP research · Full-stack systems
          </p>
        </div>
      </Surface>
    </footer>
  );
}
