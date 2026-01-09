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
    <section id="contact" className="py-14">
      <h2 className="text-lg font-semibold tracking-tight md:text-xl">Contact</h2>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <p className="text-sm text-zinc-600">
          Email:{" "}
          <a
            className="text-zinc-900 underline-offset-4 hover:underline"
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a
            className="text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline"
            href={links.resume}
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
          <a
            className="text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline"
            href={links.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline"
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline"
            href={links.codeforces}
            target="_blank"
            rel="noreferrer"
          >
            Codeforces
          </a>
        </div>
      </div>
    </section>
  );
}
