import Image from "next/image";

type Project = {
  name: string;
  image?: string;
  stack: string[];
  bullets: string[];
  repo?: string;
  live?: string;
};

type ProjectsProps = {
  projects: Project[];
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200">
      {children}
    </span>
  );
}

function LinkBtn({
  href,
  label,
  variant = "solid",
}: {
  href: string;
  label: string;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5";
  const solid =
    "bg-zinc-900 text-white hover:opacity-90 dark:bg-zinc-50 dark:text-black";
  const outline =
    "border border-zinc-200 bg-white/60 text-zinc-900 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:hover:bg-zinc-900";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${base} ${variant === "solid" ? solid : outline}`}
    >
      {label}
    </a>
  );
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="py-12">
      <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Selected work — clean UI, solid APIs, and practical features.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.name}
            className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white/55 shadow-sm backdrop-blur transition hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-950/40"
          >
            {/* Image (LOCKED size so it can never take over the page) */}
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900" />
              )}

              {/* subtle gradient to make text readable if you ever overlay later */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70" />
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {p.name}
                </h3>

                <div className="flex items-center gap-2">
                  {p.live ? <LinkBtn href={p.live} label="Live" variant="solid" /> : null}
                  {p.repo ? <LinkBtn href={p.repo} label="Repo" variant="outline" /> : null}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
