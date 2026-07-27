"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { actionClassName } from "@/components/ui/ActionButton";
import { scrollToId } from "@/lib/motion/lenis";

type HeaderProps = {
  resumeHref: string;
};

const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "highlights", label: "Proof" },
  { id: "certifications", label: "Credentials" },
];

export function Header({ resumeHref }: HeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  const openChat = () => window.dispatchEvent(new CustomEvent("open-chat"));

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[20px] border border-rule bg-raised-soft shadow-[0_18px_55px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div className="flex min-h-16 items-center justify-between gap-6 px-4 sm:px-5">
          <a
            href="#about"
            onClick={go("about")}
            className="group flex shrink-0 items-center gap-3"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-rule-strong bg-accent-soft font-mono text-xs font-semibold text-accent">
              SA
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-raised bg-signal" />
            </span>
            <span className="hidden text-sm font-semibold tracking-[-0.02em] text-ink sm:block">
              Sefayet Alam
            </span>
          </a>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={go(item.id)}
                className="rounded-lg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.11em] text-muted transition-[color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-accent-soft hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 xl:flex">
              <ThemeToggle />

              <button
                type="button"
                onClick={openChat}
                className={actionClassName("quiet", "px-3")}
              >
                <Sparkles size={14} />
                Ask AI
              </button>

              <Link
                href="/fun"
                className={actionClassName("secondary", "px-3")}
              >
                Fun site
              </Link>

              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                className={actionClassName("primary", "px-3")}
              >
                Résumé
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <ThemeToggle />

              <button
                type="button"
                onClick={openChat}
                className={actionClassName("quiet", "px-3")}
              >
                <Sparkles size={14} />
                <span className="hidden sm:inline">Ask AI</span>
              </button>

              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className="grid h-11 w-11 place-items-center rounded-xl border border-rule bg-raised text-ink transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-soft"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="border-t border-rule px-4 pb-5 xl:hidden">
            <nav className="grid py-2" aria-label="Mobile">
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className="flex items-center justify-between border-b border-rule py-3 text-sm font-medium text-ink"
                >
                  {item.label}
                  <span className="font-mono text-xs text-signal">↘</span>
                </a>
              ))}
            </nav>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href="/fun"
                onClick={() => setOpen(false)}
                className={actionClassName("secondary")}
              >
                Fun site
              </Link>
              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className={actionClassName("primary")}
              >
                Résumé
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
