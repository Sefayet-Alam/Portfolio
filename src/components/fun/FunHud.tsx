"use client";

import { useEffect } from "react";
import {
  BookOpen,
  Check,
  Footprints,
  Map,
  Sparkles,
  X,
} from "lucide-react";
import type { FunGameStatus } from "@/components/fun/village";

type FunHudProps = {
  status: FunGameStatus;
  onboarding: boolean;
  onStart: () => void;
};

function ProgressDots({
  value,
  total,
}: {
  value: number;
  total: number;
}) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 flex-1 rounded-full ${
            index < value ? "bg-signal" : "bg-rule-strong"
          }`}
        />
      ))}
    </div>
  );
}

export function FunHud({ status, onboarding, onStart }: FunHudProps) {
  useEffect(() => {
    if (!onboarding) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Enter" && event.code !== "Space") return;
      event.preventDefault();
      onStart();
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onStart, onboarding]);

  return (
    <>
      <div className="pointer-events-none absolute inset-x-4 top-20 z-40 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-20">
        <div className="fun-hud-panel min-w-0 max-w-[min(420px,72vw)] px-4 py-3">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-signal">
            <Map size={13} />
            Current chapter
          </div>
          <div className="mt-1 flex items-center gap-2">
            <p className="truncate text-sm font-semibold tracking-[-0.02em] text-ink sm:text-base">
              {status.chapterName}
            </p>
            <span className="rounded-md border border-rule bg-surface/70 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
              {status.isJumping ? "Airborne" : "Grounded"}
            </span>
          </div>
          <p className="mt-1 hidden text-xs text-muted sm:block">
            {status.nearbyLabel ?? "Follow the cyan signals and story beacons."}
          </p>
        </div>

        <div className="fun-hud-panel hidden w-56 px-4 py-3 sm:block">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              <Sparkles size={12} className="text-signal" />
              Signal fragments
            </span>
            <span className="font-mono text-xs font-semibold text-ink">
              {status.collectedSignals}/{status.totalSignals}
            </span>
          </div>
          <div className="mt-3">
            <ProgressDots
              value={status.collectedSignals}
              total={status.totalSignals}
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-40 hidden sm:block">
        <div className="fun-hud-panel flex items-center gap-4 px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-rule bg-signal-soft text-signal">
            {status.completed ? <Check size={17} /> : <BookOpen size={16} />}
          </span>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              Story archive
            </p>
            <p className="mt-0.5 text-sm font-semibold text-ink">
              {status.visitedStories}/{status.totalStories} discovered
            </p>
          </div>
        </div>
      </div>

      {status.completed ? (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
          <div className="fun-hud-panel border-signal/30 px-5 py-3 text-center shadow-[0_0_40px_var(--signal-soft)]">
            <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-signal">
              Atlas synchronized
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">
              All four chapter signals recovered
            </p>
          </div>
        </div>
      ) : null}

      {onboarding ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-[#060810]/72 p-4 backdrop-blur-md">
          <div className="fun-launch-card relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/12 bg-[#0d111e]/95 text-white shadow-2xl">
            <div className="fun-launch-grid absolute inset-0 opacity-50" />
            <div className="relative p-6 sm:p-8">
              <button
                type="button"
                onClick={onStart}
                aria-label="Skip game introduction"
                className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/5 text-white/70 transition-[transform,color,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>

              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#55d9e8]">
                <Sparkles size={13} />
                Interactive biography
              </p>
              <h1 className="mt-5 max-w-[10ch] text-5xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl">
                Memory Atlas
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/66 sm:text-base sm:leading-7">
                Cross four chapters, recover their signal fragments, and open
                the story beacons that shaped Sefayet&apos;s path.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ["Move", "WASD / Arrows"],
                  ["Jump", "Space"],
                  ["Interact", "E"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/42">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onStart}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#7c89ff] px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#090b12] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(124,137,255,0.28)]"
                >
                  <Footprints size={16} />
                  Enter the atlas
                </button>
                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-white/42">
                  Hold Shift to sprint
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
