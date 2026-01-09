"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export type FunStoryOverlayProps = {
  stop: {
    id: string;
    title: string;
    subtitle?: string;
    body?: string[];
    images?: string[];
  };
  onClose: () => void;
};

function eraFromStopId(id: string) {
  if (id.startsWith("nb1")) return { name: "Roots", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" };
  if (id.startsWith("nb2")) return { name: "RUET & RAPL", tone: "bg-sky-50 text-sky-800 border-sky-200" };
  if (id.startsWith("nb3")) return { name: "Professional", tone: "bg-violet-50 text-violet-800 border-violet-200" };
  if (id.startsWith("nb4")) return { name: "Future", tone: "bg-amber-50 text-amber-900 border-amber-200" };
  return { name: "Story", tone: "bg-zinc-50 text-zinc-800 border-zinc-200" };
}

export function FunStoryOverlay({ stop, onClose }: FunStoryOverlayProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const images = stop.images ?? [];
  const safeActive = Math.min(Math.max(active, 0), Math.max(0, images.length - 1));
  const hero = images[safeActive];

  const era = useMemo(() => eraFromStopId(stop.id), [stop.id]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 md:items-center">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative flex h-[85svh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-zinc-200 px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${era.tone}`}>
                Era: {era.name}
              </span>
              <span className="text-xs text-zinc-500">Press Esc to close</span>
            </div>

            <h2 className="font-serif text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
              {stop.title}
            </h2>
            {stop.subtitle ? (
              <p className="mt-1 text-sm text-zinc-600 md:text-base">{stop.subtitle}</p>
            ) : null}
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Images */}
          {images.length > 0 ? (
            <div className="mb-6">
              <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                <Image src={hero} alt={stop.title} fill className="object-cover" />
              </div>

              {images.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, idx) => (
                    <button
                      key={src + idx}
                      onClick={() => setActive(idx)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${
                        idx === safeActive ? "border-zinc-900" : "border-zinc-200"
                      } bg-zinc-50`}
                      aria-label={`Open image ${idx + 1}`}
                    >
                      <Image src={src} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mb-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
              No images for this story yet.
            </div>
          )}

          {/* Story Text */}
          <div className="space-y-4 text-[15px] leading-relaxed text-zinc-700">
            {(stop.body ?? []).map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-zinc-800 first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-serif first-letter:text-4xl first-letter:font-semibold"
                    : ""
                }
              >
                {p}
              </p>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-600">
            Tip: Explore other houses in this neighborhood — each one is a chapter of the journey.
          </div>
        </div>
      </div>
    </div>
  );
}
