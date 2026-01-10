"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import FunGameClient from "@components/fun/FunGameClient";

export default function FunPage() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Kick focus away from any text/caret target (Windows caret browsing)
    (document.activeElement as HTMLElement | null)?.blur();
    rootRef.current?.focus();
  }, []);

  return (
    <main
      ref={rootRef as any}
      tabIndex={-1}
      className="relative h-[100svh] w-full overflow-hidden bg-white outline-none"
      onMouseDown={() => rootRef.current?.focus()}
      onTouchStart={() => rootRef.current?.focus()}
    >
      {/* Sticky Back Home (no header) */}
      <div className="pointer-events-none absolute left-4 top-4 z-50">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
        >
          ← Back Home
        </Link>
      </div>

      {/* Instruction bar */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2">
        <div className="select-none rounded-full border border-zinc-300 bg-white/85 px-4 py-2 text-xs text-zinc-800 shadow-sm backdrop-blur">
          Explore neighborhoods • Move: WASD/Arrow • Interact: E (near knights/kids)
        </div>

      </div>

      <FunGameClient />
    </main>
  );
}
