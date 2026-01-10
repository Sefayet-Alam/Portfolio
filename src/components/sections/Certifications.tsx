import Image from "next/image";

type Cert = {
  name: string;
  issuer: string;
  date: string;
  image?: string;
  link?: string;
  bullets: string[];
};

export function Certifications({ certifications }: { certifications: Cert[] }) {
  if (!certifications?.length) return null;

  return (
    <section id="certifications" className="py-14">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Certificates & Licenses</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {certifications.map((c) => (
          <div
            key={c.name}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40"
          >
            <div className="relative h-44 w-full overflow-hidden">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover transition group-hover:scale-[1.02]"
                />
              ) : (
                <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900" />
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold">{c.name}</p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {c.issuer} • {c.date}
                  </p>
                </div>

                {c.link ? (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900"
                  >
                    View
                  </a>
                ) : null}
              </div>

              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
                {c.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
