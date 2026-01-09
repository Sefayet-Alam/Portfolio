"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type FunStop = {
  id: string;
  neighborhoodId: string;
  title: string;
  subtitle: string;
  year: string;
  image?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  bullets: string[];
  story: string;
};

type Props = {
  open: boolean;
  stop: FunStop | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function FunOverlay({ open, stop, onClose, onPrev, onNext }: Props) {
  if (!open || !stop) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center">
      {/* Backdrop */}
      <button
        aria-label="Close overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        type="button"
      />

      {/* Panel */}
      <div className="relative w-[calc(100vw-24px)] max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 shadow-2xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
        {/* Image */}
        {stop.image ? (
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={stop.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 640px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          </div>
        ) : null}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <div className="min-w-0">
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{stop.title}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{stop.subtitle}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{stop.year}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/60 text-zinc-700 shadow-sm hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-zinc-900"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            {stop.bullets.map((b) => (
              <div key={b} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                <span className="leading-relaxed">{b}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
            {stop.story}
          </p>

          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/60 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <ChevronLeft size={18} /> Prev
            </button>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/60 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>

          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Move: WASD / Arrows • Interact: E
          </p>
        </div>
      </div>
    </div>
  );
}
