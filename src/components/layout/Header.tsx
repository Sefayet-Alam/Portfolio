"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type HeaderProps = {
  resumeHref: string;
};

const nav = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#highlights", label: "Highlights" },
  { href: "#certifications", label: "Certificates" },
];

export function Header({ resumeHref }: HeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Left */}
        <a
          href="#top"
          className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          onClick={() => setOpen(false)}
        >
          Sefayet
        </a>

        {/* Center (desktop nav) */}
        <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
              className="rounded-xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Ask AI
            </button>

            <Link
              href="/fun"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95"
            >
              Fun Site
            </Link>

            <a
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Download Resume
            </a>
          </div>

          {/* Mobile: Toggle + Ask AI + Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
              className="rounded-xl border border-zinc-200 bg-white/60 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Ask AI
            </button>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/60 text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-zinc-200 bg-white/80 px-4 pb-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 md:hidden">
          <div className="mx-auto max-w-5xl pt-3">
            <div className="grid gap-2">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-white/60 px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href="/fun"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Fun Site
              </Link>

              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-zinc-200 bg-white/60 px-4 py-3 text-center text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
