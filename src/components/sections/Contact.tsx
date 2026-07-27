type ContactProps = {
  email: string;
  links: {
    github: string;
    linkedin: string;
    codeforces: string;
    resume: string;
  };
};

export function Contact({ email, links }: ContactProps) {
  return (
    <section id="contact" className="py-20 md:py-28">
      <h2 className="border-b border-rule pb-5 font-mono text-sm uppercase tracking-[0.22em] text-ink">
        Contact
      </h2>

      <div className="mt-10 border border-rule bg-raised p-6">
        <p className="text-sm text-muted">
          Email:{" "}
          <a
            className="text-ink underline-offset-4 hover:underline"
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { href: links.resume, label: "Résumé" },
            { href: links.github, label: "GitHub" },
            { href: links.linkedin, label: "LinkedIn" },
            { href: links.codeforces, label: "Codeforces" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="border border-rule px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
