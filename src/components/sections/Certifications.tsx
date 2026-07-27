import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

type Cert = {
  name: string;
  issuer: string;
  date: string;
  image?: string;
  link?: string;
  bullets: string[];
};

export function Certifications({
  certifications,
}: {
  certifications: Cert[];
}) {
  if (!certifications?.length) return null;

  return (
    <section id="certifications" className="py-20 md:py-28">
      <h2 className="border-b border-rule pb-5 font-mono text-sm uppercase tracking-[0.22em] text-ink">
        <span className="text-accent">05</span> — Certificates &amp; Licenses
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {certifications.map((c) => (
          <Reveal
            key={c.name}
            className="group overflow-hidden border border-rule bg-raised"
          >
            <div className="relative h-48 w-full overflow-hidden border-b border-rule">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="h-full w-full bg-surface" />
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-medium text-ink">{c.name}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    {c.issuer} · {c.date}
                  </p>
                </div>

                {c.link ? (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-accent px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent-ink transition-opacity hover:opacity-90"
                  >
                    View
                  </a>
                ) : null}
              </div>

              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                {c.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-2 h-px w-4 flex-none bg-accent" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
