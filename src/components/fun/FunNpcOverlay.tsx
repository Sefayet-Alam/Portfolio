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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
            {npc.avatar ? (
              <Image src={npc.avatar} alt={npc.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-zinc-600">
                {emoji}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs text-zinc-500">
              {label} <span className="ml-1">{emoji}</span>
            </p>
            <p className="truncate font-semibold text-zinc-900">{npc.name}</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm leading-relaxed text-zinc-900">
            {npc.message}
          </div>
        </div>

        <div className="border-t border-zinc-200 px-5 py-3 text-xs text-zinc-500">
          Press <b>E</b> near villagers/animals to interact. Press <b>Esc</b> to close.
        </div>
      </div>
    </div>
  );
}
