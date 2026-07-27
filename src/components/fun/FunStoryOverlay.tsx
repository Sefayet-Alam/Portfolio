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
  if (id.startsWith("nb1")) return "Roots";
  if (id.startsWith("nb2")) return "RUET & RAPL";
  if (id.startsWith("nb3")) return "Professional";
  if (id.startsWith("nb4")) return "Future";
  return "Story";
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
  const safeActive = Math.min(
    Math.max(active, 0),
    Math.max(0, images.length - 1),
  );
  const hero = images[safeActive];

  const era = useMemo(() => eraFromStopId(stop.id), [stop.id]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 md:items-center">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative flex h-[85svh] w-full max-w-3xl flex-col overflow-hidden border border-rule bg-raised shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-rule px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="border border-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                {era}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Esc to close
              </span>
            </div>

            <h2 className="font-mono text-2xl font-medium tracking-tight text-ink md:text-3xl">
              {stop.title}
            </h2>
            {stop.subtitle ? (
              <p className="mt-2 text-sm text-muted md:text-base">
                {stop.subtitle}
              </p>
            ) : null}
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-rule text-ink transition-colors hover:bg-accent hover:text-accent-ink"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Images */}
          {images.length > 0 ? (
            <div className="mb-8">
              <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden border border-rule bg-surface">
                <Image
                  src={hero}
                  alt={stop.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>

              {images.length > 1 ? (
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, idx) => (
                    <button
                      key={src + idx}
                      onClick={() => setActive(idx)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden border-2 bg-surface transition-colors ${
                        idx === safeActive ? "border-accent" : "border-rule"
                      }`}
                      aria-label={`Open image ${idx + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`Thumb ${idx + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mb-8 border border-dashed border-rule p-6 text-sm text-muted">
              No images for this story yet.
            </div>
          )}

          {/* Story Text */}
          <div className="space-y-4 text-[15px] leading-relaxed text-muted">
            {(stop.body ?? []).map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-mono first-letter:text-5xl first-letter:font-medium first-letter:text-accent"
                    : ""
                }
              >
                {p}
              </p>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-10 border-l-2 border-accent bg-surface px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            Explore other houses — each one is a chapter
          </div>
        </div>
      </div>
    </div>
  );
}
