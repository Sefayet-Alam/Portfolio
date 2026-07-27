"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import world from "@/content/fun.world.json";
import {
  initVillage,
  type FunGameStatus,
  type FunNpc,
  type FunStop,
  type FunWorld,
} from "@/components/fun/village";
import { getVillagePalette } from "@/components/fun/palette";
import { FunStoryOverlay } from "@/components/fun/FunStoryOverlay";
import { FunNpcOverlay } from "@/components/fun/FunNpcOverlay";
import { FunControls } from "@/components/fun/FunControls";
import { FunHud } from "@/components/fun/FunHud";

const INITIAL_STATUS: FunGameStatus = {
  chapterId: "nb1",
  chapterName: "Roots",
  visitedStories: 0,
  totalStories: 0,
  collectedSignals: 0,
  totalSignals: 4,
  nearbyLabel: null,
  isJumping: false,
  completed: false,
};

export default function FunGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [openStop, setOpenStop] = useState<FunStop | null>(null);
  const [openNpc, setOpenNpc] = useState<FunNpc | null>(null);
  const [started, setStarted] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem("memoryAtlasStarted") === "1",
  );
  const [status, setStatus] = useState<FunGameStatus>(INITIAL_STATUS);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const startGame = () => {
    window.sessionStorage.setItem("memoryAtlasStarted", "1");
    setStarted(true);
    window.requestAnimationFrame(() => canvasRef.current?.focus());
  };

  // Writing a ref during render is a React correctness violation — the
  // compiler can reorder or skip it. Keep it in an effect instead.
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = !started || !!openStop || !!openNpc;
  }, [openStop, openNpc, started]);

  const stopById = useMemo(() => {
    const map = new Map<string, FunStop>();
    for (const nb of world.neighborhoods ?? []) {
      for (const s of nb.stops ?? []) map.set(s.id, s as FunStop);
    }
    return map;
  }, []);

  const npcById = useMemo(() => {
    const map = new Map<string, FunNpc>();
    for (const n of world.npcs ?? []) map.set(n.id, n as FunNpc);
    return map;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    let cleanup: undefined | (() => void);
    (async () => {
      cleanup = await initVillage({
        canvas: canvasRef.current!,
        world: world as unknown as FunWorld,
        palette: getVillagePalette(isDark),
        isPaused: () => pausedRef.current,
        onOpenStop: (stopId) => setOpenStop(stopById.get(stopId) ?? null),
        onOpenNpc: (npcId) => setOpenNpc(npcById.get(npcId) ?? null),
        onStatus: setStatus,
      });
    })();

    return () => cleanup?.();
  }, [npcById, stopById, isDark]);

  // keep keyboard focus on the canvas (Windows needs this)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    // make sure nothing else has focus (e.g., caret in text)
    (document.activeElement as HTMLElement | null)?.blur();
    c.focus();

    const refocus = (e: PointerEvent) => {
      // Don't steal focus from overlay controls or the theme toggle.
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select")) return;
      c.focus();
    };
    window.addEventListener("pointerdown", refocus);

    return () => window.removeEventListener("pointerdown", refocus);
  }, []);

  // stop arrow/space from scrolling the page
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const block = new Set([
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Space",
      ]);
      if (block.has(e.code)) e.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        className="h-full w-full touch-none outline-none"
        aria-label="Memory Atlas interactive village. Use WASD or arrow keys to move, Space to jump, Shift to sprint, and E to interact."
      />

      <FunHud
        status={status}
        onboarding={!started}
        onStart={startGame}
      />
      {started && !openStop && !openNpc ? <FunControls /> : null}

      {openStop && (
        <FunStoryOverlay stop={openStop} onClose={() => setOpenStop(null)} />
      )}

      {openNpc && (
        <FunNpcOverlay npc={openNpc} onClose={() => setOpenNpc(null)} />
      )}
    </>
  );
}
