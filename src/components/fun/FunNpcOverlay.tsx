"use client";

import { useEffect } from "react";
import Image from "next/image";

export type FunNpcOverlayProps = {
  npc: {
    name: string;
    avatar?: string;
    message: string;
    kind?: "kid" | "cat" | "dog";
  };
  onClose: () => void;
};

export function FunNpcOverlay({ npc, onClose }: FunNpcOverlayProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const kind = npc.kind ?? "kid";
  const label =
    kind === "cat" ? "Village cat" : kind === "dog" ? "Friendly dog" : "Local kid";
  const emoji = kind === "cat" ? "😺" : kind === "dog" ? "🐶" : "🙂";

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 md:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden border border-rule bg-raised shadow-2xl">
        <div className="flex items-center gap-3 border-b border-rule px-5 py-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-rule bg-surface">
            {npc.avatar ? (
              <Image
                src={npc.avatar}
                alt={npc.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm">
                {emoji}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {label} <span className="ml-1">{emoji}</span>
            </p>
            <p className="truncate font-medium text-ink">{npc.name}</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center border border-rule text-ink transition-colors hover:bg-accent hover:text-accent-ink"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="border-l-2 border-accent bg-surface px-4 py-3 text-sm leading-relaxed text-ink">
            {npc.message}
          </div>
        </div>

        <div className="border-t border-rule px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Press E near villagers to interact · Esc to close
        </div>
      </div>
    </div>
  );
}
