"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch: render a placeholder until mounted
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/60 text-zinc-900 shadow-sm backdrop-blur transition dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50"
      >
        <Sun size={18} />
      </button>
    );
  }

  const current = (theme === "system" ? resolvedTheme : theme) || "dark";
  const isDark = current === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/60 text-zinc-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      {isDark ? (
        <Sun size={18} className="transition-transform group-hover:rotate-12" />
      ) : (
        <Moon size={18} className="transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}
