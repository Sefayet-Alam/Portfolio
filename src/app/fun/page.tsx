"use client";

import Link from "next/link";
import { ArrowLeft, Gamepad2 } from "lucide-react";
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
      <div className="pointer-events-none absolute left-5 top-5 z-50">
        <Link
          href="/"
          className="fun-hud-panel pointer-events-auto inline-flex min-h-11 items-center gap-2 px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-[transform,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-rule-strong hover:text-signal"
        >
          <ArrowLeft size={14} />
          Portfolio
        </Link>
      </div>

      <div className="pointer-events-none absolute right-5 top-5 z-50">
        <div className="pointer-events-auto rounded-xl bg-surface/75 backdrop-blur-md">
          <ThemeToggle />
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-5 z-40 hidden -translate-x-1/2 sm:block">
        <div className="fun-hud-panel flex select-none items-center gap-2 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
          <Gamepad2 size={13} className="text-signal" />
          Move WASD · Jump Space · Sprint Shift · Interact E
        </div>
      </div>

      <FunGameClient />
    </main>
  );
}
