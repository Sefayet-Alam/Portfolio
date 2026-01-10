"use client";

import { useEffect } from "react";
import useSound from "use-sound";

export function CursorFx() {
  const [play] = useSound("/sounds/tick.mp3", {
    volume: 0.25,
    interrupt: true,
  });

  useEffect(() => {
    let lastPlay = 0;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // left click only

      const now = Date.now();
      if (now - lastPlay < 40) return; // tiny cooldown
      lastPlay = now;

      play();
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [play]);

  return null;
}
