"use client";

import { useEffect, useRef } from "react";
import { MOTION } from "@/lib/motion/config";

// A feed-forward network drawn on canvas. Page scroll runs a "forward pass":
// the active layer moves from input (top of page) to output (bottom of page),
// lighting neurons and sending pulses along the strongest weights.

type Neuron = { x: number; y: number; act: number; phase: number };
type Edge = { from: Neuron; to: Neuron; layer: number; w: number; offset: number };
type Palette = { accent: string; signal: string; ink: string; dark: boolean };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  return {
    accent: css.getPropertyValue("--accent").trim() || "#7c89ff",
    signal: css.getPropertyValue("--signal").trim() || "#55d9e8",
    ink: css.getPropertyValue("--ink").trim() || "#f2f4f8",
    dark: document.documentElement.classList.contains("dark"),
  };
}

function build(width: number, height: number) {
  const narrow = width < 768;
  const sizes = narrow ? [3, 5, 5, 3] : [4, 7, 9, 9, 7, 4];
  const rand = mulberry32(14);
  const left = width * (narrow ? 0.1 : 0.07);
  const span = width - left * 2;
  const top = height * 0.16;
  const tall = height * 0.68;

  const layers: Neuron[][] = sizes.map((count, l) => {
    const x = left + (span * l) / (sizes.length - 1);
    return Array.from({ length: count }, (_, i) => ({
      x: x + (rand() - 0.5) * 18,
      y: top + (tall * (i + 0.5)) / count + (rand() - 0.5) * 14,
      act: 0.25 + rand() * 0.75,
      phase: rand() * Math.PI * 2,
    }));
  });

  const edges: Edge[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (const from of layers[l]) {
      for (const to of layers[l + 1]) {
        edges.push({ from, to, layer: l, w: rand() * 2 - 1, offset: rand() });
      }
    }
  }

  return { layers, edges };
}

export function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia(MOTION.reduced).matches;
    let palette = readPalette();
    let net = build(window.innerWidth, window.innerHeight);
    let width = 0;
    let height = 0;
    let front = 0; // smoothed position of the forward pass, in layers
    let pointerX = 0;
    let pointerY = 0;
    let shiftX = 0;
    let shiftY = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      net = build(width, height);
    };

    const targetFront = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      return progress * (net.layers.length - 1);
    };

    const draw = (time: number) => {
      const t = time / 1000;
      const strength = palette.dark ? 1 : 0.9;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(shiftX, shiftY);

      // Scan band: a soft vertical glow sitting on the layer being computed.
      const columns = net.layers.map((layer) => layer[0].x);
      const lower = Math.min(Math.floor(front), columns.length - 1);
      const upper = Math.min(lower + 1, columns.length - 1);
      const scanX = columns[lower] + (columns[upper] - columns[lower]) * (front - lower);
      const band = ctx.createLinearGradient(scanX - 140, 0, scanX + 140, 0);
      band.addColorStop(0, "transparent");
      band.addColorStop(0.5, palette.signal);
      band.addColorStop(1, "transparent");
      ctx.globalAlpha = (palette.dark ? 0.09 : 0.07) * strength;
      ctx.fillStyle = band;
      ctx.fillRect(scanX - 140, 0, 280, height);

      // Edges: visible everywhere, bright on the layer the pass is crossing.
      for (const e of net.edges) {
        const near = Math.max(0, 1 - Math.abs(e.layer + 0.5 - front) / 1.1);
        const weight = Math.abs(e.w);
        ctx.lineWidth = near > 0.4 && weight > 0.55 ? 1.3 : 1;
        ctx.globalAlpha = (0.05 + weight * 0.08 + near * weight * 0.38) * strength;
        ctx.strokeStyle = near > 0.3 && weight > 0.5 ? palette.signal : palette.ink;
        ctx.beginPath();
        ctx.moveTo(e.from.x, e.from.y);
        ctx.lineTo(e.to.x, e.to.y);
        ctx.stroke();
      }

      // Pulses travel along strong weights out of the active layer.
      ctx.fillStyle = palette.signal;
      for (const e of net.edges) {
        const near = Math.max(0, 1 - Math.abs(e.layer + 0.5 - front) / 0.9);
        if (near <= 0 || Math.abs(e.w) < 0.6 || e.from.act < 0.5) continue;
        const p = reduced ? 0.5 : (t * 0.35 + e.offset) % 1;
        const x = e.from.x + (e.to.x - e.from.x) * p;
        const y = e.from.y + (e.to.y - e.from.y) * p;
        const fade = near * Math.sin(p * Math.PI) * strength;
        ctx.globalAlpha = fade * 0.25;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = fade * 0.95;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Neurons: computed layers keep a low glow, the active layer is brightest.
      net.layers.forEach((layer, l) => {
        const near = Math.max(0, 1 - Math.abs(l - front) / 0.85);
        const done = l < front ? 0.35 : 0;
        for (const n of layer) {
          const breathe = reduced ? 1 : 0.85 + Math.sin(t * 1.3 + n.phase) * 0.15;
          const lit = Math.max(near, done) * n.act * breathe;

          if (lit > 0.15) {
            ctx.globalAlpha = lit * 0.3 * strength;
            ctx.fillStyle = palette.signal;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 12 + lit * 10, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.globalAlpha = (0.38 + lit * 0.62) * strength;
          ctx.fillStyle = lit > 0.3 ? palette.signal : palette.accent;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 3 + lit * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const tick = (time: number) => {
      front += (targetFront() - front) * 0.08;
      shiftX += (pointerX - shiftX) * 0.05;
      shiftY += (pointerY - shiftY) * 0.05;
      draw(time);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf && !reduced && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const redrawStatic = () => {
      front = targetFront();
      draw(0);
    };

    const onResize = () => {
      resize();
      if (reduced) redrawStatic();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / width - 0.5) * -18;
      pointerY = (event.clientY / height - 0.5) * -12;
    };

    // Follow theme switches (next-themes toggles the class on <html>).
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      if (reduced) redrawStatic();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      redrawStatic();
      window.addEventListener("scroll", redrawStatic, { passive: true });
    } else {
      front = targetFront();
      if (window.matchMedia(MOTION.pointer).matches) {
        window.addEventListener("pointermove", onPointer, { passive: true });
      }
      start();
    }

    return () => {
      stop();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", redrawStatic);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}
