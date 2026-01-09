"use client";

import Image from "next/image";

type Item = {
  logo?: string;
  title: string;
  org: string;
  date: string;
  bullets: string[];
  link?: string;
};

type PublicationsProps = {
  publications: Item[];
};

function Timeline({ items }: { items: Item[] }) {
  return (
    <div className="relative mt-8">
      <div className="absolute left-6 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-10">
        {items.map((it) => (
          <div key={`${it.title}-${it.date}`} className="relative pl-20">
            <div className="absolute left-0 top-0">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                {it.logo ? (
                  <Image src={it.logo} alt="logo" fill className="object-cover" sizes="48px" />
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold tracking-tight">{it.title}</p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{it.org}</p>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{it.date}</span>
                {it.link ? (
                  <a
                    href={it.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
                  >
                    Link
                  </a>
                ) : null}
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {(it.bullets || []).slice(0, 4).map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Publications({ publications }: PublicationsProps) {
  return (
    <section className="py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Publications</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Selected papers, write-ups, and research outputs.
        </p>

        {publications.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
            No publications added yet.
          </div>
        ) : (
          <Timeline items={publications} />
        )}
      </div>
    </section>
  );
}
