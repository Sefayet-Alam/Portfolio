"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import FunGameClient from "@components/fun/FunGameClient";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function FunPage() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Kick focus away from any text/caret target (Windows caret browsing)
    (document.activeElement as HTMLElement | null)?.blur();
    rootRef.current?.focus();
  }, []);

  return (
    <main
      ref={rootRef}
      tabIndex={-1}
      className="relative h-[100svh] w-full overflow-hidden bg-surface outline-none"
      onMouseDown={() => rootRef.current?.focus()}
      onTouchStart={() => rootRef.current?.focus()}
    >
      {/* Back home — top left */}
      <div className="pointer-events-none absolute left-5 top-5 z-50">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 border border-rule bg-surface/90 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-ink backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-ink"
        >
          ← Back Home
        </Link>
      </div>

      {/* Theme toggle — top right. Switches the village between day and dusk. */}
      <div className="pointer-events-none absolute right-5 top-5 z-50">
        <div className="pointer-events-auto bg-surface/90 backdrop-blur-sm">
          <ThemeToggle />
        </div>
      </div>

      {/* Instruction bar — top center */}
      <div className="pointer-events-none absolute left-1/2 top-5 z-40 hidden -translate-x-1/2 sm:block">
        <div className="select-none border border-rule bg-surface/85 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted backdrop-blur-sm">
          Move WASD / Arrows · Press E to enter · Esc to close
        </div>
      </div>

      <FunGameClient />
    </main>
  );
}
