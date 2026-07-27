"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The resolved theme is only known on the client. Rendering a neutral
  // placeholder until mount is what prevents a hydration mismatch here.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch: render a placeholder until mounted
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex h-10 w-10 items-center justify-center border border-rule text-ink"
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
      className="group inline-flex h-10 w-10 items-center justify-center border border-rule text-ink transition-colors hover:bg-accent hover:text-accent-ink"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      {isDark ? (
        <Sun size={18} className="transition-transform group-hover:rotate-45" />
      ) : (
        <Moon
          size={18}
          className="transition-transform group-hover:-rotate-12"
        />
      )}
    </button>
  );
}
