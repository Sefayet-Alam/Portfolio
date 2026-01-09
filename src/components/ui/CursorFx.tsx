"use client";

import { useEffect, useRef } from "react";
import useSound from "use-sound";

export function CursorFx() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  const [play] = useSound("/sounds/tick.mp3", { volume: 0.25 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      const hoverable = t?.closest?.("a,button,[role='button'],input,textarea,select");

      if (ringRef.current) {
        ringRef.current.style.width = hoverable ? "54px" : "34px";
        ringRef.current.style.height = hoverable ? "54px" : "34px";
        ringRef.current.style.opacity = hoverable ? "0.85" : "0.55";
      }
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const clickable = t?.closest?.("a,button,[role='button']");
      if (clickable) play();

      // click pulse
      if (ringRef.current) {
        ringRef.current.animate(
          [{ transform: ringRef.current.style.transform }, { transform: `${ringRef.current.style.transform} scale(0.85)` }, { transform: ringRef.current.style.transform }],
          { duration: 140, easing: "ease-out" }
        );
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver, true);
    window.addEventListener("mousedown", onClick);

    let raf = 0;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16;
      ring.current.y += (pos.current.y - ring.current.y) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver, true);
      window.removeEventListener("mousedown", onClick);
    };
  }, [play]);

  return (
    <>
      {/* dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900 dark:bg-zinc-100"
        style={{ width: 6, height: 6 }}
      />

      {/* ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-900/45 dark:border-zinc-100/35"
        style={{ width: 34, height: 34, opacity: 0.55 }}
      />
    </>
  );
}
