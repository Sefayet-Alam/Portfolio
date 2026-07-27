"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { MOTION } from "@/lib/motion/config";

export function PointerTilt({
  children,
  className = "",
  maxTilt = 5,
  lift = 7,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  lift?: number;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);
  const bounds = useRef<DOMRect | null>(null);
  const setters = useRef<{
    rx: (value: number) => void;
    ry: (value: number) => void;
    y: (value: number) => void;
  } | null>(null);

  useEffect(() => {
    const element = inner.current;
    if (!element || !window.matchMedia(MOTION.pointer).matches) return;
    setters.current = {
      rx: gsap.quickTo(element, "rotationX", {
        duration: 0.42,
        ease: MOTION.ease,
      }),
      ry: gsap.quickTo(element, "rotationY", {
        duration: 0.42,
        ease: MOTION.ease,
      }),
      y: gsap.quickTo(element, "y", {
        duration: 0.42,
        ease: MOTION.easeSpring,
      }),
    };
    return () => {
      setters.current = null;
      gsap.killTweensOf(element);
    };
  }, []);

  return (
    <div
      ref={root}
      className={className}
      style={{ perspective: "1200px" }}
      onPointerEnter={() => {
        bounds.current = root.current?.getBoundingClientRect() ?? null;
        setters.current?.y(-lift);
      }}
      onPointerMove={(event) => {
        const rect = bounds.current;
        const quick = setters.current;
        if (!rect || !quick) return;
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        quick.ry(px * maxTilt * 2);
        quick.rx(py * maxTilt * -2);
      }}
      onPointerLeave={() => {
        bounds.current = null;
        setters.current?.rx(0);
        setters.current?.ry(0);
        setters.current?.y(0);
      }}
    >
      <div ref={inner} style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
