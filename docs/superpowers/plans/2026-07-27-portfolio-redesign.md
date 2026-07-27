# Editorial Terminal Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the templated portfolio frontend with a scroll-driven 2.5D "Editorial Terminal" design, and theme the `/fun` village, without losing a single existing feature.

**Architecture:** Semantic CSS custom properties drive both themes from one place. A three-layer root contract (`.stage` / `.content` / `.chrome`) keeps CSS `perspective` away from `position: fixed` UI. GSAP ScrollTrigger + Lenis provide scroll motion; all initial animation states are set in JavaScript so the site is fully usable if JS fails.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, `gsap@3.15.0`, `lenis@1.3.25`, next-themes.

## Global Constraints

- **Never `git push`.** Pushing auto-deploys to Vercel. Commit locally only; the owner verifies via `npm run dev`.
- Scope is frontend and `/fun` only. Do not modify `src/app/api/**`, `src/lib/ai/**`, `src/lib/db/**`, `src/lib/media/**`, or any file in `src/content/`.
- No AI-generated images or video. Use only assets already in `public/`.
- No React Three Fiber / Three.js. Depth is CSS 3D + GSAP only.
- **Initial animation states are set in JavaScript, never CSS.** Content ships visible; animation is additive only.
- Accent color: `#FF4D00` in dark, `#D93A00` in light.
- Every task ends with `npm run build` passing.
- **There is no test framework in this repo.** Verification is `npm run build`, `npm run lint`, and the explicit manual checks written into each task. Do not add a test runner — that is out of scope.
- Preserve these exact public behaviors: the `open-chat` CustomEvent contract, `sessionStorage` key `introSeen`, the `--header-offset: 92px` scroll offset, and canvas `tabIndex={0}` focus handling on `/fun`.

---

## File Structure

**Created**

| Path | Responsibility |
|---|---|
| `src/lib/motion/config.ts` | Durations, eases, distances, breakpoints — one source of truth |
| `src/lib/motion/lenis.ts` | Lenis singleton + GSAP ticker sync + `scrollToId` helper |
| `src/lib/motion/useGsapContext.ts` | Hook wrapping `gsap.context()` for guaranteed cleanup |
| `src/lib/motion/splitLines.ts` | Hand-rolled line splitter (avoids the SplitText dependency) |
| `src/components/motion/SmoothScroll.tsx` | Mounts Lenis; disabled on `/fun` and under reduced-motion |
| `src/components/motion/ScrollRefresher.tsx` | Calls `ScrollTrigger.refresh()` on theme change and font load |
| `src/components/motion/Plane.tsx` | Decorative parallax depth plane |
| `src/components/motion/Reveal.tsx` | Clip-path line reveal wrapper |
| `src/components/motion/TiltCard.tsx` | Self-contained perspective + rotateX entry |
| `src/components/motion/Counter.tsx` | Odometer counter for CP stats |
| `src/components/motion/Marquee.tsx` | Velocity-reactive marquee |
| `src/components/layout/Stage.tsx` | The `.stage` background depth layer |
| `src/components/fun/palette.ts` | Village day/night palette tokens |

**Modified**

| Path | Change |
|---|---|
| `src/app/globals.css` | Token definitions, `@theme` bridge, layer contract; delete aurora/blob/noise CSS |
| `tailwind.config.mjs` | Becomes the single config |
| `src/app/layout.tsx` | Mount `SmoothScroll`, `ScrollRefresher`, `Stage`; apply layer classes |
| `src/app/page.tsx` | Wrap content in `.content` layer |
| `src/components/layout/Header.tsx` | Tokens + Lenis anchor rewiring |
| `src/components/layout/Footer.tsx` | Tokens + editorial layout |
| `src/components/sections/*.tsx` | Tokens + per-section motion |
| `src/components/ui/*.tsx` | Tokens |
| `src/components/fun/village.ts` | Accept a `palette` arg; replace color literals |
| `src/components/fun/FunGame.tsx` | Pass theme-derived palette; refresh on theme change |
| `src/components/fun/FunStoryOverlay.tsx`, `FunNpcOverlay.tsx` | Restyle to Editorial Terminal |
| `src/app/fun/page.tsx` | Restyled HUD and back-home button |

**Deleted**

| Path | Reason |
|---|---|
| `tailwind.config.ts` | Duplicate config; `globals.css` `@config`s the `.mjs` |
| `src/components/ui/BackgroundFx.tsx` | Replaced by `Stage.tsx` |
| `src/components/fun/FunOverlay.tsx` | Dead code — `FunGame` imports `FunStoryOverlay`/`FunNpcOverlay`; its `FunStop` type conflicts |
| `src/components/ui/Card.tsx` | Unused, light-mode only |

---

# Stage 1 — Foundation

### Task 1: Install dependencies and consolidate Tailwind config

**Files:**
- Modify: `package.json`
- Delete: `tailwind.config.ts`
- Modify: `tailwind.config.mjs`

**Interfaces:**
- Produces: `gsap` and `lenis` importable; a single Tailwind config at `tailwind.config.mjs`.

- [ ] **Step 1: Install the two runtime dependencies**

```bash
npm install gsap@3.15.0 lenis@1.3.25
```

- [ ] **Step 2: Delete the duplicate Tailwind config**

`src/app/globals.css` line 1 is `@config "../../tailwind.config.mjs";`, so the `.ts` file is dead weight and a source of drift.

```bash
git rm tailwind.config.ts
```

- [ ] **Step 3: Point the surviving config at all source directories**

Replace the entire contents of `tailwind.config.mjs`:

```js
/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};

export default config;
```

Note: `src/content/**` was in the old `content` array but holds only `.json` data files with no class names. Dropping it speeds up scanning.

- [ ] **Step 4: Verify the build still passes**

Run: `npm run build`
Expected: build completes, no "Cannot find config" error.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tailwind.config.mjs
git rm --cached tailwind.config.ts 2>/dev/null || true
git commit -m "build: add gsap + lenis, consolidate tailwind config"
```

---

### Task 2: Define semantic color tokens and the layer contract

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: Tailwind utilities `bg-surface`, `bg-raised`, `text-ink`, `text-muted`, `border-rule`, `bg-accent`, `text-accent`, `text-accent-ink`; CSS vars `--plane-1/2/3`; classes `.layer-stage`, `.layer-content`, `.layer-chrome`; font vars `--font-mono`, `--font-sans`.

- [ ] **Step 1: Replace `src/app/globals.css` entirely**

The old file's aurora / blob / noise / vignette rules are deleted with it — they belong to the design being replaced.

```css
@config "../../tailwind.config.mjs";
@import "tailwindcss";

/* ---------------------------------------------
   Semantic tokens — the ONLY place colors live.
   Theme switching swaps these; components never
   reference raw palette values or dark: variants.
---------------------------------------------- */
:root {
  --header-offset: 92px;
  color-scheme: light;

  --surface: #f4f1ea;
  --raised: #ffffff;
  --ink: #0b0b0c;
  --muted: #5a5a5e;
  --rule: rgba(11, 11, 12, 0.14);
  --accent: #d93a00;
  --accent-ink: #ffffff;

  --plane-1: rgba(11, 11, 12, 0.04);
  --plane-2: rgba(11, 11, 12, 0.07);
  --plane-3: rgba(217, 58, 0, 0.06);
}

.dark {
  color-scheme: dark;

  --surface: #0b0b0c;
  --raised: #141416;
  --ink: #f4f1ea;
  --muted: #9a9aa0;
  --rule: rgba(244, 241, 234, 0.14);
  --accent: #ff4d00;
  --accent-ink: #0b0b0c;

  --plane-1: rgba(244, 241, 234, 0.04);
  --plane-2: rgba(244, 241, 234, 0.07);
  --plane-3: rgba(255, 77, 0, 0.08);
}

/* Bridge tokens into Tailwind v4 utilities. Because each maps to a
   var(), `bg-surface` etc. re-resolve automatically on theme change. */
@theme inline {
  --color-surface: var(--surface);
  --color-raised: var(--raised);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-rule: var(--rule);
  --color-accent: var(--accent);
  --color-accent-ink: var(--accent-ink);

  --font-mono: var(--font-mono);
  --font-sans: var(--font-sans);
}

/* ---------------------------------------------
   Layer contract.

   CSS `perspective` and `transform-style: preserve-3d`
   create stacking contexts that trap `position: fixed`
   descendants. ChatWidget is fixed, Header is sticky,
   IntroLoader is fixed. So perspective is confined to
   .layer-stage, which contains no interactive content.
   NEVER add perspective to .layer-content or an ancestor.
---------------------------------------------- */
.layer-stage {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  perspective: 1000px;
  perspective-origin: 50% 40%;
}

.layer-content {
  position: relative;
  z-index: 10;
}

.layer-chrome {
  position: relative;
  z-index: 50;
}

html {
  scroll-padding-top: var(--header-offset);
}

/* NOTE: `scroll-behavior: smooth` is deliberately absent.
   Lenis owns scrolling; both together fight each other. */

section {
  scroll-margin-top: var(--header-offset);
}

body {
  background: var(--surface);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Lenis */
html.lenis,
html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-stopped {
  overflow: hidden;
}

/* Intro loader — token-driven */
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: grid;
  place-items: center;
  background: var(--surface);
  transition: opacity 350ms ease, transform 350ms ease;
  opacity: 1;
}

.intro-leave {
  opacity: 0;
  transform: translateY(-6px);
}

.intro-hello {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: clamp(40px, 9vw, 96px);
  font-weight: 500;
  letter-spacing: -0.04em;
  color: var(--ink);
}

.intro-sub {
  margin-top: 12px;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--muted);
}

/* Accessibility: motion off means motion off. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify tokens resolve in both themes**

Run: `npm run dev`, open `http://localhost:3000`, open DevTools console:

```js
getComputedStyle(document.body).backgroundColor
```

Expected: `rgb(11, 11, 12)` in dark. Click the theme toggle, re-run. Expected: `rgb(244, 241, 234)`.

The page will look broken at this point — components still reference `zinc-*`. That is expected and fixed in Task 4.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: semantic color tokens + 3D layer contract"
```

---

### Task 3: Motion infrastructure

**Files:**
- Create: `src/lib/motion/config.ts`, `src/lib/motion/lenis.ts`, `src/lib/motion/useGsapContext.ts`, `src/lib/motion/splitLines.ts`
- Create: `src/components/motion/SmoothScroll.tsx`, `src/components/motion/ScrollRefresher.tsx`

**Interfaces:**
- Produces:
  - `MOTION: { fast: number; base: number; slow: number; ease: string; easeOut: string; distance: number; desktop: string; reduced: string }`
  - `getLenis(): Lenis | null`
  - `scrollToId(id: string): void`
  - `useGsapContext(fn: (ctx: gsap.Context) => void, deps: unknown[], scopeRef: React.RefObject<HTMLElement | null>): void`
  - `splitLines(el: HTMLElement): HTMLElement[]`
  - `<SmoothScroll />`, `<ScrollRefresher />`

- [ ] **Step 1: Create the motion config**

`src/lib/motion/config.ts`:

```ts
// Single source of truth for motion feel. Change it here, not per component.
export const MOTION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  ease: "power3.out",
  easeOut: "expo.out",
  distance: 48,
  // gsap.matchMedia() query keys
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
```

- [ ] **Step 2: Create the Lenis singleton**

`src/lib/motion/lenis.ts`:

```ts
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Starts Lenis and wires it to GSAP's ticker. Returns a teardown fn. */
export function startLenis(): () => void {
  if (typeof window === "undefined") return () => {};
  if (lenis) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Touch devices keep native scrolling — smoothing it fights the OS.
    syncTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

/**
 * Scrolls to an element by id, honoring the sticky header offset.
 * Falls back to native scrolling when Lenis is not running
 * (reduced-motion, or the /fun route).
 */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const offsetVar = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-offset",
  );
  const offset = -(parseInt(offsetVar, 10) || 92);

  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2 });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "auto" });
  }
}
```

- [ ] **Step 3: Create the GSAP context hook**

`src/lib/motion/useGsapContext.ts`:

```ts
"use client";

import { useLayoutEffect, useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// useLayoutEffect warns during SSR; useEffect is the correct no-op there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs GSAP setup inside a gsap.context() scoped to `scopeRef`, so every
 * tween and ScrollTrigger created inside is reverted on unmount. Without
 * this, ScrollTriggers survive navigation and corrupt scroll positions.
 */
export function useGsapContext(
  fn: (ctx: gsap.Context) => void,
  deps: unknown[],
  scopeRef: RefObject<HTMLElement | null>,
) {
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context((self) => fn(self), scopeRef.current ?? undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
```

- [ ] **Step 4: Create the line splitter**

`src/lib/motion/splitLines.ts`:

```ts
/**
 * Splits an element's text into per-line wrappers so each line can be
 * revealed independently. Hand-rolled to avoid a SplitText dependency.
 *
 * Each line becomes:  <span class="line"><span class="line-inner">…</span></span>
 * `.line` has overflow:hidden so `.line-inner` can slide up from behind it.
 *
 * Returns the `.line-inner` elements, which are what you animate.
 */
export function splitLines(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  // Measure by laying out one span per word and grouping by offsetTop.
  el.textContent = "";
  const probes = words.map((w) => {
    const s = document.createElement("span");
    s.textContent = w;
    s.style.display = "inline-block";
    el.appendChild(s);
    el.appendChild(document.createTextNode(" "));
    return s;
  });

  const rows = new Map<number, string[]>();
  probes.forEach((p, i) => {
    const top = Math.round(p.offsetTop);
    if (!rows.has(top)) rows.set(top, []);
    rows.get(top)!.push(words[i]);
  });

  el.textContent = "";
  const inners: HTMLElement[] = [];

  for (const lineWords of rows.values()) {
    const line = document.createElement("span");
    line.className = "line";
    line.style.display = "block";
    line.style.overflow = "hidden";

    const inner = document.createElement("span");
    inner.className = "line-inner";
    inner.style.display = "block";
    inner.textContent = lineWords.join(" ");

    line.appendChild(inner);
    el.appendChild(line);
    inners.push(inner);
  }

  return inners;
}
```

- [ ] **Step 5: Create the SmoothScroll provider**

`src/components/motion/SmoothScroll.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startLenis } from "@/lib/motion/lenis";

/**
 * Mounts Lenis everywhere except /fun, where the canvas owns input and
 * smooth scrolling would interfere with WASD movement.
 * Also skipped entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/fun")) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const stop = startLenis();
    return stop;
  }, [pathname]);

  return null;
}
```

- [ ] **Step 6: Create the ScrollRefresher**

`src/components/motion/ScrollRefresher.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Layout shifts invalidate ScrollTrigger's cached start/end positions.
 * Theme changes swap fonts and borders; webfont loading reflows text.
 * Both need an explicit refresh or pinned sections drift.
 */
export function ScrollRefresher() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [resolvedTheme]);

  useEffect(() => {
    if (!document.fonts) return;
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return null;
}
```

- [ ] **Step 7: Verify it compiles**

Run: `npm run build`
Expected: build succeeds. Nothing is mounted yet, so the site is unchanged.

- [ ] **Step 8: Commit**

```bash
git add src/lib/motion src/components/motion
git commit -m "feat: motion infrastructure — lenis, gsap context, line splitter"
```

---

### Task 4: Wire the layout, add fonts, replace BackgroundFx with Stage

**Files:**
- Create: `src/components/layout/Stage.tsx`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`
- Delete: `src/components/ui/BackgroundFx.tsx`, `src/components/ui/Card.tsx`

**Interfaces:**
- Consumes: `MOTION`, `<SmoothScroll />`, `<ScrollRefresher />` (Task 3); layer classes (Task 2)
- Produces: `<Stage />` mounted as the `.layer-stage` background

- [ ] **Step 1: Create the Stage depth layer**

`src/components/layout/Stage.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

/**
 * Fixed background depth. Three planes translate on Z and drift at
 * different rates on scroll, producing parallax.
 *
 * This is the ONLY element tree allowed to carry `perspective` — see the
 * layer contract in globals.css. It is inert: pointer-events: none, aria-hidden.
 */
export function Stage() {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        gsap.to(".plane-a", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.6 },
        });
        gsap.to(".plane-b", {
          yPercent: -26,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.9 },
        });
        gsap.to(".plane-c", {
          yPercent: -40,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 1.2 },
        });
        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
      });

      return () => mm.revert();
    },
    [],
    root,
  );

  return (
    <div ref={root} aria-hidden className="layer-stage">
      {/* Hairline grid, deepest plane */}
      <div
        className="plane-c absolute inset-[-20%]"
        style={{
          transform: "translateZ(-600px) scale(1.6)",
          backgroundImage:
            "linear-gradient(to right, var(--plane-1) 1px, transparent 1px), linear-gradient(to bottom, var(--plane-1) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />
      {/* Accent wash, mid plane */}
      <div
        className="plane-b absolute inset-[-20%]"
        style={{
          transform: "translateZ(-300px) scale(1.3)",
          background:
            "radial-gradient(60% 50% at 78% 18%, var(--plane-3), transparent 70%)",
        }}
      />
      {/* Soft tonal plane, nearest */}
      <div
        className="plane-a absolute inset-[-20%]"
        style={{
          transform: "translateZ(-120px) scale(1.12)",
          background:
            "radial-gradient(50% 40% at 18% 82%, var(--plane-2), transparent 72%)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/layout.tsx`**

Adds the two fonts, mounts the motion providers, and applies the layer contract. `CursorFx` and `ChatWidgetGate` move into `.layer-chrome` so they can never be trapped by the Stage's perspective.

```tsx
import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import { Stage } from "@/components/layout/Stage";
import { CursorFx } from "@/components/ui/CursorFx";
import { ChatWidgetGate } from "@/components/ui/ChatWidgetGate";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollRefresher } from "@/components/motion/ScrollRefresher";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sefayet-Alam",
  description: "Full-Stack Developer (MERN) • Flutter • Competitive Programmer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${mono.variable} ${sans.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-surface font-sans text-ink">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll />
          <ScrollRefresher />

          {/* z-0 — decorative 3D only */}
          <Stage />

          {/* z-10 — page content, never inside a perspective context */}
          <div className="layer-content">{children}</div>

          {/* z-50 — fixed/sticky UI, siblings of the stage */}
          <div className="layer-chrome">
            <CursorFx />
            <ChatWidgetGate />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Delete the replaced components**

`BackgroundFx` is superseded by `Stage`. `Card.tsx` is unused and light-mode only.

```bash
git rm src/components/ui/BackgroundFx.tsx src/components/ui/Card.tsx
```

- [ ] **Step 4: Verify no dangling imports**

Run: `grep -rn "BackgroundFx\|ui/Card" src/`
Expected: no output.

- [ ] **Step 5: Build and check the layer contract holds**

Run: `npm run build && npm run dev`

In the browser console, confirm the chat bubble is not trapped in a 3D stacking context:

```js
const el = document.querySelector('[aria-label="Open AI chat"]');
console.log(getComputedStyle(el.closest('.layer-chrome')).perspective);
```

Expected: `none`. If it prints a pixel value, the layer contract is broken — the chrome layer must be a sibling of `.layer-stage`, not a descendant.

- [ ] **Step 6: Manual check — chat still opens**

With `npm run dev` running: click the floating chat bubble. Expected: panel opens. Click "Ask AI" in the header. Expected: panel opens. Navigate to `/fun`. Expected: no chat bubble.

- [ ] **Step 7: Commit**

```bash
git add -A src/app/layout.tsx src/components/layout/Stage.tsx src/app/page.tsx
git commit -m "feat: layer contract in layout, Stage depth planes, drop BackgroundFx"
```

---

# Stage 2 — Hero

### Task 5: Counter and Reveal motion components

**Files:**
- Create: `src/components/motion/Counter.tsx`, `src/components/motion/Reveal.tsx`

**Interfaces:**
- Consumes: `useGsapContext`, `MOTION`, `splitLines`
- Produces:
  - `<Counter value={number} suffix?={string} className?={string} />`
  - `<Reveal as?={"div"|"p"|"h2"|"h3"} delay?={number} className?={string}>{children}</Reveal>`

- [ ] **Step 1: Create the odometer Counter**

`src/components/motion/Counter.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
};

/**
 * Counts up to `value` when scrolled into view.
 *
 * The element renders the FINAL value in markup. If JS never runs, the
 * correct number is still on screen — the animation only rewinds and
 * replays it. This is the additive-motion rule.
 */
export function Counter({ value, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useGsapContext(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        const obj = { n: 0 };
        gsap.to(obj, {
          n: value,
          duration: MOTION.slow,
          ease: MOTION.easeOut,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.n).toLocaleString()}${suffix}`;
          },
          onComplete: () => {
            el.textContent = `${value.toLocaleString()}${suffix}`;
          },
        });
      });

      return () => mm.revert();
    },
    [value, suffix],
    ref,
  );

  return (
    <span ref={ref} className={className}>
      {`${value.toLocaleString()}${suffix}`}
    </span>
  );
}
```

- [ ] **Step 2: Create the Reveal wrapper**

`src/components/motion/Reveal.tsx`:

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";
import { splitLines } from "@/lib/motion/splitLines";

type Props = {
  children: ReactNode;
  as?: "div" | "p" | "h1" | "h2" | "h3";
  delay?: number;
  className?: string;
  /** Split into lines and stagger. Only valid for plain-text children. */
  lines?: boolean;
};

/**
 * Reveals content on scroll. Content is visible in markup; gsap.from()
 * animates *from* a hidden state, so a JS failure leaves it readable.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  lines = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useGsapContext(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        const targets = lines ? splitLines(el as HTMLElement) : [el];
        if (targets.length === 0) return;

        gsap.from(targets, {
          yPercent: lines ? 110 : 0,
          y: lines ? 0 : MOTION.distance,
          opacity: lines ? 1 : 0,
          duration: MOTION.base,
          ease: MOTION.ease,
          stagger: lines ? 0.08 : 0,
          delay,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      return () => mm.revert();
    },
    [delay, lines],
    ref,
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/motion/Counter.tsx src/components/motion/Reveal.tsx
git commit -m "feat: Counter and Reveal motion components"
```

---

### Task 6: Rebuild the Hero

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Create: `src/components/motion/TiltCard.tsx`

**Interfaces:**
- Consumes: `<Counter />`, `<Reveal />`, tokens
- Produces: `<TiltCard className?>{children}</TiltCard>`

**Preserved behaviors (verify each in Step 5):** profile image hover-swap, resume link, Gmail compose link, `tel:` link, GitHub/LinkedIn/Codeforces links.

- [ ] **Step 1: Create TiltCard**

`src/components/motion/TiltCard.tsx`:

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

/**
 * Rotates up from a reclined position as it enters view.
 *
 * Perspective is applied to THIS wrapper only, never to a page-level
 * ancestor — a page-level perspective would trap the fixed chat widget
 * and sticky header. See the layer contract in globals.css.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.firstElementChild;
      if (!inner) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION.desktop, () => {
        gsap.from(inner, {
          rotateX: 18,
          y: 60,
          opacity: 0,
          transformOrigin: "50% 100%",
          duration: MOTION.slow,
          ease: MOTION.ease,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      return () => mm.revert();
    },
    [],
    ref,
  );

  return (
    <div ref={ref} className={className} style={{ perspective: "1200px" }}>
      <div style={{ transformStyle: "preserve-3d" }}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite the Hero**

Replace `src/components/sections/Hero.tsx` entirely:

```tsx
import Image from "next/image";
import { Github, Linkedin, Mail, Phone, Trophy, FileText } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { TiltCard } from "@/components/motion/TiltCard";

type HeroProps = {
  profile: {
    name: string;
    title: string;
    tagline: string;
    location: string;
    email: string;
    phone: string;
    images: { primary: string; hover: string };
    links: { github: string; linkedin: string; codeforces: string; resume: string };
  };
};

function IconBtn({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center border border-rule text-ink transition-colors hover:bg-accent hover:text-accent-ink"
    >
      {children}
    </a>
  );
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="border-t border-rule pt-3">
      <p className="font-mono text-4xl font-medium tracking-tighter text-ink md:text-5xl">
        <Counter value={value} suffix={suffix} />
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
    </div>
  );
}

export function Hero({ profile }: HeroProps) {
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email,
  )}&su=${encodeURIComponent("Hello Sefayet")}`;

  return (
    <section id="about" className="pb-20 pt-16 md:pb-28 md:pt-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
        {profile.location}
      </p>

      <Reveal as="h1" lines className="mt-6 font-mono text-[13vw] font-medium leading-[0.86] tracking-tighter text-ink md:text-[7.5rem]">
        {profile.name}
      </Reveal>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div>
          <Reveal as="p" className="text-xl text-ink md:text-2xl">
            {profile.title}
          </Reveal>

          <Reveal as="p" delay={0.08} className="mt-4 max-w-xl leading-relaxed text-muted">
            {profile.tagline}
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
            <Stat value={1770} label="Codeforces max" />
            <Stat value={3500} suffix="+" label="Problems solved" />
            <Stat value={2019} label="CodeChef max" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={profile.links.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-sm font-medium uppercase tracking-wider text-accent-ink transition-opacity hover:opacity-90"
            >
              <FileText size={16} />
              Résumé
            </a>

            <a
              href={gmail}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border border-rule px-5 py-3 font-mono text-sm uppercase tracking-wider text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              <Mail size={16} />
              Email
            </a>

            <a
              href={`tel:${profile.phone}`}
              className="inline-flex items-center gap-2 border border-rule px-5 py-3 font-mono text-sm text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              <Phone size={16} />
              {profile.phone}
            </a>

            <div className="flex items-center gap-2">
              <IconBtn href={profile.links.github} label="GitHub">
                <Github size={18} />
              </IconBtn>
              <IconBtn href={profile.links.linkedin} label="LinkedIn">
                <Linkedin size={18} />
              </IconBtn>
              <IconBtn href={profile.links.codeforces} label="Codeforces">
                <Trophy size={18} />
              </IconBtn>
            </div>
          </div>
        </div>

        <TiltCard className="justify-self-center md:justify-self-end">
          {/* group/hover swap preserved exactly */}
          <div className="group relative h-64 w-64 overflow-hidden border border-rule md:h-80 md:w-80">
            <Image
              src={profile.images.primary}
              alt="Profile"
              fill
              className="object-cover grayscale transition-all duration-300 group-hover:opacity-0 group-hover:grayscale-0"
              sizes="320px"
              priority
            />
            <Image
              src={profile.images.hover}
              alt="Profile hover"
              fill
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              sizes="320px"
              priority
            />
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
```

Note: the three CP chips from the old hero (`UIU IUPC 2025 — 8th`, `AtCoder Cyan`) are not lost — they are hardcoded strings that already appear in the Achievements timeline from `portfolio.seed.json`. The hero now shows the three numeric stats that animate.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Manual verification — hero behaviors**

Run `npm run dev`, then confirm all six:
1. Scroll down and back up — name reveals line-by-line, stats count up once
2. Hover the profile image — swaps to the second image
3. Click "Résumé" — opens `/resume.pdf` in a new tab
4. Click "Email" — opens Gmail compose addressed to `sefayetalam14@gmail.com`
5. Click the phone number — triggers the `tel:` handler
6. Click each of GitHub / LinkedIn / Codeforces — opens the right profile

- [ ] **Step 5: Verify the reduced-motion path**

In DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", reload.
Expected: name, tagline, and all three stat numbers are immediately visible and correct; nothing is stuck hidden.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/motion/TiltCard.tsx
git commit -m "feat: editorial hero with counters, line reveal, tilt card"
```

---

# Stage 3 — Remaining sections

### Task 7: Header with Lenis-aware navigation

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `scrollToId` (Task 3)

**Preserved behaviors:** 6 anchor links, mobile menu open/close, close-on-hashchange, `open-chat` CustomEvent (desktop and mobile), theme toggle, Fun Site link, resume link.

- [ ] **Step 1: Rewrite the Header**

Key change: anchors call `scrollToId` and `preventDefault`, because Lenis does not intercept native hash jumps. The `open-chat` dispatch is byte-identical to the current code.

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { scrollToId } from "@/lib/motion/lenis";

type HeaderProps = { resumeHref: string };

const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "highlights", label: "Highlights" },
  { id: "certifications", label: "Certificates" },
];

export function Header({ resumeHref }: HeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Lenis does not honor native hash navigation, so intercept and delegate.
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  const openChat = () => window.dispatchEvent(new CustomEvent("open-chat"));

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-surface/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          onClick={go("about")}
          className="font-mono text-sm font-medium uppercase tracking-[0.18em] text-ink"
        >
          Sefayet
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={go(item.id)}
              className="group font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
            >
              <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>{" "}
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />

            <button
              type="button"
              onClick={openChat}
              className="border border-rule px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              Ask AI
            </button>

            <Link
              href="/fun"
              className="bg-accent px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-accent-ink transition-opacity hover:opacity-90"
            >
              Fun Site
            </Link>

            <a
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
              className="border border-rule px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-accent hover:text-accent-ink"
            >
              Résumé
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={openChat}
              className="border border-rule px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink"
            >
              Ask AI
            </button>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center border border-rule text-ink"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-rule bg-surface px-6 pb-6 md:hidden">
          <div className="mx-auto max-w-6xl pt-4">
            <div className="grid">
              {nav.map((item, i) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className="border-b border-rule py-4 font-mono text-sm uppercase tracking-wider text-ink"
                >
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>{" "}
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/fun"
                onClick={() => setOpen(false)}
                className="bg-accent px-4 py-3 text-center font-mono text-xs font-medium uppercase tracking-wider text-accent-ink"
              >
                Fun Site
              </Link>

              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="border border-rule px-4 py-3 text-center font-mono text-xs uppercase tracking-wider text-ink"
              >
                Résumé
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Manual verification — every nav path**

Run `npm run dev`. On desktop, click all 6 nav links. Expected: each scrolls smoothly and lands with the section heading clear of the sticky header (92px offset), not hidden underneath.

Resize below 768px. Open the mobile menu, click each of the 6 links. Expected: menu closes and scrolls correctly.

Click "Ask AI" on both desktop and mobile. Expected: chat panel opens.

- [ ] **Step 3: Verify offset in reduced-motion mode**

Emulate `prefers-reduced-motion: reduce` and reload — Lenis will not start. Click a nav link.
Expected: still lands at the right offset via the `window.scrollTo` fallback in `scrollToId`.

- [ ] **Step 4: Build, lint, commit**

```bash
npm run build && npm run lint
git add src/components/layout/Header.tsx
git commit -m "feat: editorial header with lenis-aware anchor navigation"
```

---

### Task 8: Experience — sticky stacking cards

**Files:**
- Modify: `src/components/sections/Experience.tsx`

**Preserved behaviors:** Work/Studies tab switching, all bullets, logos, dates.

- [ ] **Step 1: Rewrite Experience**

Critical detail: switching tabs changes content height, which invalidates ScrollTrigger's cached positions. The `useEffect` calling `ScrollTrigger.refresh()` on `tab` is not optional — without it, cards mis-stack after a tab switch.

```tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

type Item = {
  logo: string;
  title: string;
  org: string;
  date: string;
  bullets: string[];
};

type ExperienceProps = { experience: { work: Item[]; studies: Item[] } };

function CardItem({ item, index }: { item: Item; index: number }) {
  return (
    <div
      className="exp-card sticky top-28 border border-rule bg-raised p-6 md:p-8"
      style={{ zIndex: index + 1 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden border border-rule">
            <Image src={item.logo} alt="" fill className="object-cover" sizes="44px" />
          </div>
          <div>
            <p className="text-lg font-medium text-ink">{item.title}</p>
            <p className="text-sm text-muted">{item.org}</p>
          </div>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
          {item.date}
        </p>
      </div>

      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
        {item.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-2 h-px w-4 shrink-0 bg-accent" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Experience({ experience }: ExperienceProps) {
  const [tab, setTab] = useState<"work" | "studies">("work");
  const root = useRef<HTMLElement | null>(null);

  const items = useMemo(
    () => (tab === "work" ? experience.work : experience.studies),
    [tab, experience.work, experience.studies],
  );

  useGsapContext(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.desktop, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.94,
            opacity: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 140px",
              end: "bottom 120px",
              scrub: true,
            },
          });
        });
      });

      return () => mm.revert();
    },
    [tab, items.length],
    root,
  );

  // Tab switching changes document height; stale trigger positions
  // would leave cards stacked at the wrong scroll offsets.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => window.clearTimeout(id);
  }, [tab]);

  return (
    <section ref={root} id="experience" className="py-20 md:py-28">
      <div className="flex items-end justify-between border-b border-rule pb-5">
        <h2 className="font-mono text-sm uppercase tracking-[0.22em] text-ink">
          <span className="text-accent">01</span> — Experience
        </h2>

        <div className="flex gap-1">
          {(["work", "studies"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                "px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
                tab === t
                  ? "bg-accent text-accent-ink"
                  : "border border-rule text-muted hover:text-ink",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {items.map((it, i) => (
          <CardItem key={`${it.title}-${it.date}`} item={it} index={i} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Manual verification**

Run `npm run dev`. Scroll through Experience.
Expected: cards stack, earlier ones scaling back slightly.

Click "Studies". Expected: content swaps, and scrolling still stacks correctly with no jump or overlap. Click back to "Work". Expected: same.

- [ ] **Step 3: Build and commit**

```bash
npm run build
git add src/components/sections/Experience.tsx
git commit -m "feat: experience section with sticky stacking cards"
```

---

### Task 9: Skills — velocity-reactive marquee

**Files:**
- Create: `src/components/motion/Marquee.tsx`
- Modify: `src/components/sections/Skills.tsx`

**Interfaces:**
- Produces: `<Marquee speed?={number} reverse?={boolean}>{children}</Marquee>`

**Preserved behaviors:** all five categories, the full `iconMap`, every skill label.

- [ ] **Step 1: Create the Marquee**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

/**
 * Continuously scrolling strip whose direction flips with scroll direction
 * and whose speed rises with scroll velocity.
 *
 * Children are rendered twice so the loop has no visible seam.
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
}) {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    () => {
      const track = root.current?.querySelector(".marquee-track");
      if (!track) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION.motionOk, () => {
        const dir = reverse ? 1 : -1;
        const tween = gsap.to(track, {
          xPercent: dir * 50,
          repeat: -1,
          duration: speed,
          ease: "none",
        });

        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            // Flip playback direction to match scroll direction, and
            // briefly speed up proportional to velocity.
            const v = Math.abs(self.getVelocity());
            tween.timeScale(
              (self.direction === 1 ? 1 : -1) * gsap.utils.clamp(1, 4, 1 + v / 1200),
            );
          },
        });

        return () => {
          tween.kill();
          st.kill();
        };
      });

      return () => mm.revert();
    },
    [speed, reverse],
    root,
  );

  return (
    <div ref={root} className="overflow-hidden">
      <div className="marquee-track flex w-max gap-4">
        {children}
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite Skills**

Keep the `iconMap` from the current file **verbatim** — it is a working label→icon mapping keyed to exact strings in `portfolio.seed.json`. Only the presentation changes.

```tsx
import {
  SiReact, SiExpress, SiDjango, SiFlutter, SiMongodb, SiFirebase,
  SiMysql, SiPostman, SiGithub, SiJavascript, SiPython, SiCplusplus, SiDart,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { Marquee } from "@/components/motion/Marquee";

type SkillsProps = {
  skills: {
    strengths: string[];
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  };
};

const iconMap: Record<string, React.ReactNode> = {
  JavaScript: <SiJavascript size={18} />,
  Python: <SiPython size={18} />,
  "C/C++": <SiCplusplus size={18} />,
  Java: <FaJava size={18} />,
  Dart: <SiDart size={18} />,
  React: <SiReact size={18} />,
  "Express.js": <SiExpress size={18} />,
  Django: <SiDjango size={18} />,
  DRF: <SiDjango size={18} />,
  Flutter: <SiFlutter size={18} />,
  LangChain: <Sparkles size={18} />,
  MongoDB: <SiMongodb size={18} />,
  "Firebase (Auth/Firestore)": <SiFirebase size={18} />,
  "MySQL (basic)": <SiMysql size={18} />,
  "Git/GitHub": <SiGithub size={18} />,
  Postman: <SiPostman size={18} />,
};

function SkillChip({ label }: { label: string }) {
  const icon = iconMap[label];
  return (
    <span className="inline-flex shrink-0 items-center gap-2 border border-rule px-4 py-2 font-mono text-sm text-ink">
      {icon ? <span className="text-accent">{icon}</span> : null}
      <span>{label}</span>
    </span>
  );
}

function Row({ title, items, reverse }: { title: string; items: string[]; reverse?: boolean }) {
  return (
    <div className="border-t border-rule py-6">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {title}
      </p>
      <Marquee reverse={reverse} speed={36}>
        {items.map((x) => (
          <SkillChip key={x} label={x} />
        ))}
      </Marquee>
    </div>
  );
}

export function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="py-20 md:py-28">
      <h2 className="border-b border-rule pb-5 font-mono text-sm uppercase tracking-[0.22em] text-ink">
        <span className="text-accent">02</span> — Skills
      </h2>

      <div className="mt-4">
        <Row title="Strengths" items={skills.strengths} />
        <Row title="Languages" items={skills.languages} reverse />
        <Row title="Frameworks" items={skills.frameworks} />
        <Row title="Databases" items={skills.databases} reverse />
        <Row title="Tools" items={skills.tools} />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Manual verification**

Run `npm run dev`. Scroll to Skills.
Expected: five rows scroll horizontally, alternating direction; scrolling the page faster speeds them up; scrolling up reverses them. Every skill label from `portfolio.seed.json` appears, icons included.

- [ ] **Step 4: Build and commit**

```bash
npm run build
git add src/components/motion/Marquee.tsx src/components/sections/Skills.tsx
git commit -m "feat: skills as velocity-reactive marquee rows"
```

---

### Task 10: Projects — pinned horizontal rail

**Files:**
- Modify: `src/components/sections/Projects.tsx`

**Preserved behaviors:** YouTube embeds playable, image fallback, Live and Repo links, stack pills, all bullets.

**Known hazard:** while a horizontal rail is animating, an `<iframe>` under a transformed ancestor can stop receiving pointer events. Step 2 guards this by only disabling pointer events *during* scrub and restoring them at rest.

- [ ] **Step 1: Rewrite Projects**

```tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import YouTubeCard from "@/components/YouTubeCard";
import { useGsapContext } from "@/lib/motion/useGsapContext";
import { MOTION } from "@/lib/motion/config";

type Project = {
  name: string;
  image?: string;
  video?: string;
  stack: string[];
  bullets: string[];
  repo?: string;
  live?: string;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-rule px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
      {children}
    </span>
  );
}

function LinkBtn({
  href,
  label,
  solid,
}: {
  href: string;
  label: string;
  solid?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
        solid
          ? "bg-accent text-accent-ink hover:opacity-90"
          : "border border-rule text-ink hover:bg-accent hover:text-accent-ink",
      ].join(" ")}
    >
      {label}
    </a>
  );
}

function Card({ p, index }: { p: Project; index: number }) {
  return (
    <article className="project-card w-[86vw] shrink-0 border border-rule bg-raised md:w-[46vw] lg:w-[38vw]">
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-rule">
        {p.video ? (
          <YouTubeCard url={p.video} title={p.name} />
        ) : p.image ? (
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 86vw, 46vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-surface" />
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-medium text-ink">
            <span className="mr-2 font-mono text-sm text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            {p.name}
          </h3>
          <div className="flex shrink-0 gap-2">
            {p.live ? <LinkBtn href={p.live} label="Live" solid /> : null}
            {p.repo ? <LinkBtn href={p.repo} label="Repo" /> : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>

        <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted">
          {p.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-2 h-px w-4 shrink-0 bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement | null>(null);

  useGsapContext(
    () => {
      const track = root.current?.querySelector<HTMLElement>(".rail-track");
      const pinWrap = root.current?.querySelector<HTMLElement>(".rail-pin");
      if (!track || !pinWrap) return;

      const mm = gsap.matchMedia();

      // Desktop only. Below 1024px the rail is a normal vertical stack,
      // because pinning + horizontal scroll is hostile on touch.
      mm.add(MOTION.desktop, () => {
        const distance = () => track.scrollWidth - window.innerWidth + 96;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinWrap,
            start: "top 88px",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            // Iframes swallow pointer events unpredictably mid-transform.
            // Disable them only while actively scrubbing, restore at rest.
            onUpdate: (self) => {
              track.style.pointerEvents = self.isActive && Math.abs(self.getVelocity()) > 1 ? "none" : "auto";
            },
            onLeave: () => { track.style.pointerEvents = "auto"; },
            onLeaveBack: () => { track.style.pointerEvents = "auto"; },
          },
        });

        return () => {
          tween.kill();
          track.style.pointerEvents = "auto";
          gsap.set(track, { clearProps: "x" });
        };
      });

      return () => mm.revert();
    },
    [projects.length],
    root,
  );

  return (
    <section ref={root} id="projects" className="py-20 md:py-28">
      <h2 className="border-b border-rule pb-5 font-mono text-sm uppercase tracking-[0.22em] text-ink">
        <span className="text-accent">03</span> — Projects
      </h2>

      <div className="rail-pin mt-10">
        <div className="rail-track flex flex-col gap-6 lg:w-max lg:flex-row lg:gap-8">
          {projects.map((p, i) => (
            <Card key={p.name} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Manual verification — desktop rail**

Run `npm run dev` at ≥1024px wide. Scroll to Projects.
Expected: the section pins and cards travel sideways; the section unpins cleanly at the end and normal scrolling resumes.

Stop scrolling on a card with a YouTube embed and click play. Expected: video plays. This is the pointer-events guard working.

Click a "Live" and a "Repo" button. Expected: both open in new tabs.

- [ ] **Step 3: Manual verification — mobile fallback**

Resize below 1024px and reload.
Expected: no pinning, cards stack vertically, everything scrolls normally, links and embeds still work.

- [ ] **Step 4: Build and commit**

```bash
npm run build
git add src/components/sections/Projects.tsx
git commit -m "feat: projects pinned horizontal rail with mobile fallback"
```

---

### Task 11: Achievements, Certifications, Footer, and remaining UI

**Files:**
- Modify: `src/components/sections/Achievements.tsx`, `src/components/sections/Certifications.tsx`, `src/components/sections/Publications.tsx`, `src/components/sections/Contact.tsx`, `src/components/layout/Footer.tsx`, `src/components/ui/ChatWidget.tsx`, `src/components/ui/ThemeToggle.tsx`, `src/components/ui/Chip.tsx`, `src/components/ui/Section.tsx`, `src/components/ui/IntroLoader.tsx`, `src/app/publication/page.tsx`, `src/app/page.tsx`

**Preserved behaviors:** Achievements/Publications tabs, `LinkChips` incl. the legacy `it.link` fallback and `DOMAIN_LABELS` map, certificate "View" links, footer contact links, chat widget send/receive and suggestion chips, intro loader `sessionStorage` gate.

- [ ] **Step 1: Convert every remaining component to tokens**

Mechanical substitution across the files listed above:

| Replace | With |
|---|---|
| `border-zinc-200 dark:border-zinc-800` | `border-rule` |
| `bg-white/55 dark:bg-zinc-950/45` (and all `bg-white/*` card variants) | `bg-raised` |
| `text-zinc-900 dark:text-zinc-50` | `text-ink` |
| `text-zinc-600 dark:text-zinc-300`, `text-zinc-500 dark:text-zinc-400` | `text-muted` |
| `bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black` | `bg-accent text-accent-ink` |
| `rounded-2xl`, `rounded-3xl`, `rounded-xl` on cards | *(remove — Editorial Terminal uses square corners)* |
| `backdrop-blur` on cards | *(remove)* |
| `hover:-translate-y-0.5` | `transition-colors hover:bg-accent hover:text-accent-ink` |

Two specific fixes while in these files:
- `Footer.tsx` `IconLink`: the glow `<span>` is `absolute` inside a non-`relative` parent, so it positions against an unintended ancestor. Delete the glow span entirely — it also carries a hardcoded `dark:bg-indigo-500/25` that violates the token rule.
- `Footer.tsx`: replace both `bg-gradient-to-r from-transparent via-zinc-200 to-transparent` rules with `bg-rule`.

- [ ] **Step 2: Add section numbering and reveals**

In `Achievements.tsx` and `Certifications.tsx`, replace the bare `<h2>` with the numbered form used in Tasks 8–10:

```tsx
<h2 className="border-b border-rule pb-5 font-mono text-sm uppercase tracking-[0.22em] text-ink">
  <span className="text-accent">04</span> — Highlights
</h2>
```

Use `05` for Certificates. Wrap each timeline entry and certificate card in `<Reveal>`.

- [ ] **Step 3: Update the page container width**

In `src/app/page.tsx`, change `max-w-5xl px-4` to `max-w-6xl px-6` to match the header, and confirm the section order is unchanged.

- [ ] **Step 4: Verify no hardcoded colors remain**

Run: `grep -rn "zinc-\|indigo-\|fuchsia-\|dark:bg-\|dark:text-\|dark:border-" src/components src/app --include=*.tsx`
Expected: no output. Any hit is a component that will break in one theme.

- [ ] **Step 5: Manual verification — full functional sweep, both themes**

Run `npm run dev`. In **dark**, then again in **light**:
1. Achievements ↔ Publications tabs switch
2. Link chips render with correct labels and open correctly
3. Certificate "View" buttons open
4. Footer email, phone, GitHub, LinkedIn, Codeforces links work
5. Chat: open, click a suggestion, get a reply, type and send, close
6. Reload — intro loader shows once, then not again in the same tab
7. All text is legible; nothing is invisible

- [ ] **Step 6: Build, lint, commit**

```bash
npm run build && npm run lint
git add -A src/components src/app
git commit -m "feat: convert remaining sections and UI to semantic tokens"
```

---

# Stage 4 — Fun site

### Task 12: Village palette extraction and theming

**Files:**
- Create: `src/components/fun/palette.ts`
- Modify: `src/components/fun/village.ts`, `src/components/fun/FunGame.tsx`
- Delete: `src/components/fun/FunOverlay.tsx`

**Interfaces:**
- Produces: `type VillagePalette`, `getVillagePalette(isDark: boolean): VillagePalette`
- `initVillage` gains a required `palette: VillagePalette` field on `InitVillageArgs`

**Constraint:** do not alter the game loop, collision logic, input handling, or interaction detection in `village.ts`. This task changes colors only.

- [ ] **Step 1: Delete the dead overlay**

`FunGame.tsx` imports `FunStoryOverlay` and `FunNpcOverlay`. `FunOverlay.tsx` is imported nowhere and declares a conflicting `FunStop` type.

```bash
grep -rn "FunOverlay" src/    # expect: only the file itself
git rm src/components/fun/FunOverlay.tsx
```

- [ ] **Step 2: Create the palette module**

Dark theme is a dusk village rather than a recolored day village — `village.ts` already draws lit windows, so night is the natural fit.

`src/components/fun/palette.ts`:

```ts
export type VillagePalette = {
  sky: [string, string];
  grass: string;
  grassTuft: string;
  path: string;
  shadow: string;
  roof: [string, string];
  wall: [string, string];
  wood: string;
  door: string;
  windowGlass: string;
  windowLit: string;
  trunk: string;
  canopy: string;
  water: string;
  stone: string;
  outline: string;
  signText: string;
  signBg: string;
  hintBg: string;
  hintText: string;
  vignette: string;
};

const DAY: VillagePalette = {
  sky: ["#dbeafe", "#eff6ff"],
  grass: "rgba(120, 170, 96, 1)",
  grassTuft: "rgba(16, 90, 50, 0.18)",
  path: "rgba(204, 160, 96, 0.95)",
  shadow: "rgba(15, 23, 42, 0.16)",
  roof: ["#b4553a", "#8c3f2c"],
  wall: ["#f1e4cd", "#e0cfae"],
  wood: "rgba(101, 70, 35, 0.85)",
  door: "rgba(120, 74, 40, 0.95)",
  windowGlass: "rgba(226, 232, 240, 0.8)",
  windowLit: "rgba(250, 204, 21, 0.10)",
  trunk: "rgba(101, 70, 35, 1)",
  canopy: "rgba(56, 122, 66, 1)",
  water: "rgba(147, 197, 253, 0.55)",
  stone: "rgba(148, 163, 184, 1)",
  outline: "rgba(15, 23, 42, 0.85)",
  signText: "#0b0b0c",
  signBg: "rgba(255, 255, 255, 0.88)",
  hintBg: "rgba(11, 11, 12, 0.82)",
  hintText: "#f4f1ea",
  vignette: "rgba(0, 0, 0, 0.16)",
};

const NIGHT: VillagePalette = {
  sky: ["#0d1425", "#141c30"],
  grass: "rgba(34, 62, 48, 1)",
  grassTuft: "rgba(120, 200, 150, 0.10)",
  path: "rgba(96, 78, 54, 0.9)",
  shadow: "rgba(0, 0, 0, 0.42)",
  roof: ["#5a2f26", "#3d1f1a"],
  wall: ["#4a4438", "#38332b"],
  wood: "rgba(60, 44, 26, 0.9)",
  door: "rgba(70, 44, 24, 0.95)",
  windowGlass: "rgba(70, 80, 96, 0.7)",
  windowLit: "rgba(255, 179, 71, 0.85)",
  trunk: "rgba(52, 38, 22, 1)",
  canopy: "rgba(28, 62, 44, 1)",
  water: "rgba(64, 104, 150, 0.55)",
  stone: "rgba(84, 92, 106, 1)",
  outline: "rgba(0, 0, 0, 0.85)",
  signText: "#f4f1ea",
  signBg: "rgba(11, 11, 12, 0.8)",
  hintBg: "rgba(244, 241, 234, 0.9)",
  hintText: "#0b0b0c",
  vignette: "rgba(0, 0, 0, 0.55)",
};

export function getVillagePalette(isDark: boolean): VillagePalette {
  return isDark ? NIGHT : DAY;
}
```

- [ ] **Step 3: Thread the palette into `village.ts`**

Add to the `InitVillageArgs` type near the top of the file:

```ts
import type { VillagePalette } from "@/components/fun/palette";

type InitVillageArgs = {
  canvas: HTMLCanvasElement;
  world: FunWorld;
  palette: VillagePalette;
  isPaused: () => boolean;
  onOpenStop: (stopId: string) => void;
  onOpenNpc: (npcId: string) => void;
};
```

Then inside `initVillage`, destructure it alongside the existing args:

```ts
const { canvas, world, palette, isPaused, onOpenStop, onOpenNpc } = args;
```

All draw functions are closures inside `initVillage`, so `palette` is already in scope for every one of them.

- [ ] **Step 4: Replace the color literals**

Work through the `fillStyle` / `strokeStyle` assignments (roughly 60, between lines 394 and 1230) and swap each hardcoded `rgba(...)` for the matching palette field. Map by drawing function:

| Function | Fields to use |
|---|---|
| ground/grass (≈394–405) | `palette.grass`, `palette.grassTuft` |
| `drawShadowEllipse` (419) | `palette.shadow` |
| `drawHut` (539–710) | `palette.roof`, `palette.wall`, `palette.wood`, `palette.door`, `palette.windowGlass`, `palette.windowLit`, `palette.outline` |
| `drawKnight` (720) | `palette.outline`, `palette.stone` |
| `drawTree` (744) | `palette.trunk`, `palette.canopy` |
| `drawPond` (779) | `palette.water` |
| `drawWell` (811) | `palette.stone`, `palette.wood`, `palette.water` |
| `drawNpc` (1042) | `palette.outline` for linework; leave skin/hair/shirt tones as-is so characters stay recognizable |
| `drawHint` (1185) | `palette.hintBg`, `palette.hintText` |
| `drawVignette` (1225) | `palette.vignette` |
| `drawNeighborhoodSigns` (1242) | `palette.signBg`, `palette.signText` |

Where a literal is a gradient stop, keep the gradient and substitute the stop colors.

- [ ] **Step 5: Pass the palette from FunGame and re-init on theme change**

In `src/components/fun/FunGame.tsx`, add the theme hook and include `isDark` in the init effect's dependency array so the canvas is torn down and rebuilt when the theme flips:

```tsx
import { useTheme } from "next-themes";
import { getVillagePalette } from "@/components/fun/palette";

// inside the component, before the init effect:
const { resolvedTheme } = useTheme();
const isDark = resolvedTheme !== "light";

useEffect(() => {
  if (!canvasRef.current) return;

  let cleanup: undefined | (() => void);
  (async () => {
    cleanup = await initVillage({
      canvas: canvasRef.current!,
      world: world as any,
      palette: getVillagePalette(isDark),
      isPaused: () => pausedRef.current,
      onOpenStop: (stopId) => setOpenStop(stopById.get(stopId) ?? null),
      onOpenNpc: (npcId) => setOpenNpc(npcById.get(npcId) ?? null),
    });
  })();

  return () => cleanup?.();
}, [npcById, stopById, isDark]);
```

Leave the two focus effects and the arrow-key `preventDefault` effect untouched.

- [ ] **Step 6: Manual verification**

Run `npm run dev`, go to `/fun`.
1. Village renders in day colors in light theme
2. Walk with WASD and arrows — movement works
3. Walk into a house — story overlay opens
4. Talk to an NPC — dialogue opens
5. Toggle the theme (via the home page, then return, or add the toggle in Task 13) — village re-renders as dusk with lit windows
6. Repeat 2–4 in dark. Expected: movement, houses, and NPCs all still work

- [ ] **Step 7: Build and commit**

```bash
npm run build
git add -A src/components/fun
git commit -m "feat: theme-aware village palette, remove dead FunOverlay"
```

---

### Task 13: Fun site shell, HUD, and overlays

**Files:**
- Modify: `src/app/fun/page.tsx`, `src/components/fun/FunStoryOverlay.tsx`, `src/components/fun/FunNpcOverlay.tsx`

**Preserved behaviors:** back-home link, canvas focus-on-mount and focus-on-pointerdown, overlay close, story image/text rendering, NPC avatar and message.

- [ ] **Step 1: Restyle the fun page shell**

Replace the styling in `src/app/fun/page.tsx`. Keep the `rootRef` focus logic and the `onMouseDown` / `onTouchStart` handlers exactly as they are — they fix real Windows caret-browsing bugs.

Changes: `bg-white` → `bg-surface`; back-home and instruction bar restyled to square, monospace, token-driven; add a `ThemeToggle` in the top-right so the village day/night can be switched without leaving the page.

```tsx
{/* Back home — top left */}
<div className="pointer-events-none absolute left-6 top-6 z-50">
  <Link
    href="/"
    className="pointer-events-auto inline-flex items-center gap-2 border border-rule bg-surface/90 px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-ink"
  >
    ← Back Home
  </Link>
</div>

{/* Theme toggle — top right */}
<div className="pointer-events-none absolute right-6 top-6 z-50">
  <div className="pointer-events-auto">
    <ThemeToggle />
  </div>
</div>

{/* Instruction bar — top center */}
<div className="pointer-events-none absolute left-1/2 top-6 z-40 -translate-x-1/2">
  <div className="select-none border border-rule bg-surface/85 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted backdrop-blur-sm">
    Move WASD / Arrows · Enter a house to read a story
  </div>
</div>
```

Add the import: `import { ThemeToggle } from "@/components/ui/ThemeToggle";`

The old instruction text told users to disable hardware acceleration — drop that; it is a workaround note, not user-facing copy.

- [ ] **Step 2: Restyle the two overlays**

In `FunStoryOverlay.tsx` and `FunNpcOverlay.tsx`, apply the same token substitution table from Task 11 Step 1. Specifically: backdrop `bg-black/45` → `bg-surface/70`; panel `bg-white/90 dark:bg-zinc-950/85` → `bg-raised`; drop `rounded-2xl`; headings to `font-mono uppercase tracking-wider`; close button to the square bordered style.

Do not change the `onClose` wiring or the props these components receive.

- [ ] **Step 3: Manual verification**

Run `npm run dev`, go to `/fun`:
1. Back-home link returns to `/`
2. Theme toggle flips the village between day and dusk without breaking movement
3. WASD and arrows move the character in both themes
4. House overlays open, read correctly, and close
5. NPC dialogue opens, shows the avatar, and closes
6. Chat widget is absent on this route
7. Page does not scroll — Lenis is off here

- [ ] **Step 4: Build, lint, commit**

```bash
npm run build && npm run lint
git add -A src/app/fun src/components/fun
git commit -m "feat: editorial fun-site shell, HUD, and overlays"
```

---

# Stage 5 — Verification

### Task 14: Full verification matrix

**Files:** none modified unless a defect is found.

- [ ] **Step 1: Clean build and lint**

```bash
rm -rf .next
npm run build
npm run lint
```

Expected: both succeed with no errors.

- [ ] **Step 2: Confirm no hardcoded theme colors survive anywhere**

```bash
grep -rn "zinc-\|indigo-\|fuchsia-\|slate-" src/ --include=*.tsx --include=*.ts
```

Expected: no output outside `src/components/fun/palette.ts` (which intentionally holds literal canvas colors).

- [ ] **Step 3: Run the 14-point matrix**

Start `npm run dev`. Run every row in **dark**, then **light**. Record pass/fail.

| # | Check |
|---|---|
| 1 | Theme toggle works — including mid-scroll and while a section is animating |
| 2 | All 6 header anchors land with the heading clear of the sticky header |
| 3 | Mobile menu opens, closes on selection, closes on hashchange |
| 4 | "Ask AI" opens the chat, on desktop and mobile |
| 5 | Chat sends a message and renders a reply |
| 6 | Chat is hidden on `/fun`, present elsewhere |
| 7 | Intro loader appears once per session and releases body scroll |
| 8 | Click sound plays |
| 9 | Hero image hover-swap; résumé, Gmail, `tel:` links |
| 10 | Experience Work/Studies tabs switch and re-stack correctly |
| 11 | Project YouTube embeds play; Live/Repo links open |
| 12 | Achievements/Publications tabs, link chips, certificate View links |
| 13 | `/fun`: WASD + arrows, house stories, NPC dialogue, back-home |
| 14 | `/publication` route renders |

- [ ] **Step 4: Run the accessibility and responsive passes**

- DevTools → Rendering → `prefers-reduced-motion: reduce`, reload: all content visible, no motion, every link and button still works, nav still lands correctly.
- Resize to 375px: no horizontal body overflow, projects stack vertically, marquees still contained, mobile menu works.
- Disable JavaScript entirely and reload: all text and images are visible and links work. This proves the additive-motion rule held.

- [ ] **Step 5: Check for leaked ScrollTriggers on navigation**

Navigate `/` → `/fun` → `/`, then in the console:

```js
ScrollTrigger.getAll().length
```

Expected: a stable number that does not grow with each round trip. Growth means a `gsap.context()` is not reverting.

- [ ] **Step 6: Commit any fixes and hand off**

```bash
git add -A
git commit -m "fix: verification matrix corrections"
```

**Do not push.** Report results to the owner and leave `npm run dev` running for their review.

---

## Self-Review Notes

- **Spec coverage:** §3.1 tokens → Task 2; §3.2 layer contract → Tasks 2, 4, 6; §4 visual direction → Tasks 4–11, 13; §5 motion architecture → Tasks 3, 5; §5.1 additive rule → enforced in Tasks 5, 6 and verified in Task 14 Step 4; §5.2 gating → `MOTION.desktop` / `MOTION.motionOk` throughout; §5.3 Lenis → Tasks 3, 7; §6 sections → Tasks 6–11; §7 fun site → Tasks 12, 13; §8 sequencing → stage structure; §9 matrix → Task 14.
- **Type consistency:** `VillagePalette` is defined in Task 12 Step 2 and consumed in Steps 3–5. `MOTION` keys (`desktop`, `motionOk`, `base`, `slow`, `ease`, `easeOut`, `distance`) are defined in Task 3 Step 1 and used unchanged thereafter. `scrollToId` is defined in Task 3 Step 2 and consumed in Task 7.
- **Known scope note:** Task 12 Step 4 is the single largest mechanical edit (~60 color literals). It is deliberately one task because splitting it would leave the village half-recolored and unreviewable.
