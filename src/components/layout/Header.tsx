"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { scrollToId } from "@/lib/motion/lenis";

type HeaderProps = {
  resumeHref: string;
};

const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "highlights", label: "Highlights" },
  { id: "certifications", label: "Certificates" },
];

export function Header({ resumeHref }: HeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Lenis does not honor native hash navigation, so intercept and delegate.
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  const openChat = () => window.dispatchEvent(new CustomEvent("open-chat"));

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-surface/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#about"
          onClick={go("about")}
          className="font-mono text-sm font-medium uppercase tracking-[0.18em] text-ink"
        >
          Sefayet
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={go(item.id)}
              className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
            >
              <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>{" "}
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />

            <button
              type="button"
              onClick={openChat}
              className="border border-rule px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              Ask AI
            </button>

            <Link
              href="/fun"
              className="bg-accent px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-accent-ink transition-opacity hover:opacity-90"
            >
              Fun Site
            </Link>

            <a
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
              className="border border-rule px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              Résumé
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={openChat}
              className="border border-rule px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              Ask AI
            </button>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center border border-rule text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-rule bg-surface px-6 pb-6 lg:hidden">
          <div className="mx-auto max-w-6xl pt-4">
            <div className="grid">
              {nav.map((item, i) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className="border-b border-rule py-4 font-mono text-sm uppercase tracking-wider text-ink"
                >
                  <span className="text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/fun"
                onClick={() => setOpen(false)}
                className="bg-accent px-4 py-3 text-center font-mono text-xs font-medium uppercase tracking-wider text-accent-ink"
              >
                Fun Site
              </Link>

              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="border border-rule px-4 py-3 text-center font-mono text-xs uppercase tracking-wider text-ink"
              >
                Résumé
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
