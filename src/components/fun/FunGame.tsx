"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import world from "@/content/fun.world.json";
import { initVillage, type FunNpc, type FunStop } from "@/components/fun/village";
import { FunStoryOverlay } from "@/components/fun/FunStoryOverlay";
import { FunNpcOverlay } from "@/components/fun/FunNpcOverlay";

export default function FunGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [openStop, setOpenStop] = useState<FunStop | null>(null);
  const [openNpc, setOpenNpc] = useState<FunNpc | null>(null);

  const pausedRef = useRef(false);
  pausedRef.current = !!openStop || !!openNpc;

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
        world: world as any,
        isPaused: () => pausedRef.current,
        onOpenStop: (stopId) => setOpenStop(stopById.get(stopId) ?? null),
        onOpenNpc: (npcId) => setOpenNpc(npcById.get(npcId) ?? null),
      });
    })();

    return () => cleanup?.();
  }, [npcById, stopById]);

  return (
    <>
      <canvas ref={canvasRef} className="h-full w-full touch-none" />

      {openStop && (
        <FunStoryOverlay stop={openStop} onClose={() => setOpenStop(null)} />
      )}

      {openNpc && (
        <FunNpcOverlay npc={openNpc} onClose={() => setOpenNpc(null)} />
      )}
    </>
  );
}
