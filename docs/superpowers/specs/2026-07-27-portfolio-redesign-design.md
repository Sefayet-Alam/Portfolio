# Portfolio Frontend + Fun Site Redesign — Design

**Date:** 2026-07-27
**Scope:** Frontend and `/fun` only. No changes to the RAG/Mongo backend, API route logic, or content JSON schemas.
**Status:** Approved

---

## 1. Goal

Replace the current templated frontend with a distinctive, scroll-driven 2.5D design in which
motion is the product. Modeled on pro studio sites (Studio Freight, Locomotive, Active Theory,
Codrops) rather than on AI-portfolio conventions.

Explicit non-goal: generated imagery. No AI-generated images or video. Higgsfield / `/api/media`
are out of scope.

## 2. Success criteria

1. Every existing deliverable survives, in both themes:
   - Sections: Hero, Experience, Skills, Projects, Achievements, Certifications, Publications, Contact, Footer
   - AI chat ("Sef-AI-yet"): floating widget, `open-chat` event from header, hidden on `/fun`
   - Fun site: WASD/arrow movement, house/stop story overlays, NPC dialogue, back-home
   - Header nav anchors, mobile menu, theme toggle, resume/email/phone/social links,
     Experience tabs, project Live/Repo links, YouTube embeds, intro loader, click sound
2. Scroll motion runs at 60fps on a mid laptop.
3. `prefers-reduced-motion` disables all motion and the site remains fully usable.
4. `npm run build` and `npm run lint` pass clean.
5. Nothing is pushed to GitHub until verified locally by the owner.

## 3. Architectural foundations

These come before any animation work. Both exist to protect criterion 1.

### 3.1 Semantic color tokens

**Problem.** ~200 hardcoded `dark:` variants across ~20 components. Every animated element
multiplies that surface, and any missed variant is an invisible-content bug that reads as
"theme broke the site".

**Solution.** `globals.css` becomes the single source of truth:

```css
:root {
  --surface: #F4F1EA;   --surface-raised: #FFFFFF;
  --ink: #0B0B0C;       --ink-muted: #5A5A5E;
  --rule: rgba(11, 11, 12, 0.14);
  --accent: #D93A00;    --accent-ink: #FFFFFF;
  --plane-1: rgba(11, 11, 12, 0.04);
  --plane-2: rgba(11, 11, 12, 0.07);
  --plane-3: rgba(217, 58, 0, 0.06);
}
.dark {
  --surface: #0B0B0C;   --surface-raised: #141416;
  --ink: #F4F1EA;       --ink-muted: #9A9AA0;
  --rule: rgba(244, 241, 234, 0.14);
  --accent: #FF4D00;    --accent-ink: #0B0B0C;
  --plane-1: rgba(244, 241, 234, 0.04);
  --plane-2: rgba(244, 241, 234, 0.07);
  --plane-3: rgba(255, 77, 0, 0.08);
}
```

Components reference tokens. Theme switching becomes one variable swap that cannot
desynchronize. Contrast ratios are verified once per token pair, not per component.

Consolidate `tailwind.config.mjs` and `tailwind.config.ts` into one file. Split config would
make token resolution unpredictable.

### 3.2 The layer contract

**Problem.** CSS `perspective` and `transform-style: preserve-3d` establish stacking contexts
that trap `position: fixed` descendants. `ChatWidget` is fixed, `Header` is sticky,
`IntroLoader` is fixed at `z-99999`. A 3D wrapper as their ancestor silently breaks them.

**Solution.** Three sibling root layers, never nested:

| Layer | z-index | Contents | Rule |
|---|---|---|---|
| `.stage` | 0 | 3D parallax depth planes | `perspective` lives ONLY here; `pointer-events: none` |
| `.content` | 10 | All page content | No `perspective` on any ancestor |
| `.chrome` | 50+ | Header, chat widget, overlays, intro loader | Fixed/sticky safe |

Per-element 3D (tilting cards) uses `perspective` on the card's own immediate parent —
self-contained, never a page-level wrapper.

## 4. Visual direction — Editorial Terminal

Derived from the owner's actual identity: competitive programmer + full-stack engineer.

| Aspect | Decision |
|---|---|
| Display type | Monospace (JetBrains Mono / Geist Mono), tight tracking, large numerals |
| Body type | Clean grotesque, generous line-height |
| Palette | Bone `#F4F1EA` / near-black `#0B0B0C`, single signal accent |
| Accent | `#FF4D00` dark, `#D93A00` light (contrast-adjusted) |
| Structure | Numbered sections (`01 — EXPERIENCE`), asymmetric editorial grid |
| Separation | Hairline rules, not cards |
| Depth | Parallax planes and real 3D transforms, not `backdrop-blur` |

**Removed:** indigo→fuchsia gradient buttons, aurora/blob/noise/spotlight background stack,
universal frosted glass cards, `hover:-translate-y-0.5` applied uniformly.

## 5. Motion architecture

New dependencies: `gsap` (~40KB; ScrollTrigger is free) and `lenis` (~5KB). The text splitter is
hand-written rather than depending on SplitText.

```
src/lib/motion/
  config.ts           durations, eases, distances — one source of truth
  lenis.ts            singleton + GSAP ticker sync
  useGsapContext.ts   hook wrapping gsap.context() for guaranteed cleanup
  splitLines.ts       hand-rolled line/char splitter
src/components/motion/
  SmoothScroll.tsx    mounts Lenis; disabled on /fun and under reduced-motion
  Plane.tsx           parallax depth plane (decorative, pointer-events: none)
  Reveal.tsx          clip-path line reveal
  TiltCard.tsx        self-contained perspective, rotateX entry
  Counter.tsx         odometer for CP stats
  Marquee.tsx         direction reverses with scroll velocity
```

### 5.1 The additive-motion rule

**Initial animation states are set in JavaScript, never in CSS.** Content ships visible. If GSAP
fails to load, throws, or is blocked, every element renders fully visible and every control still
works. Animation is strictly additive.

This is deliberately the opposite of the common `opacity-0` + `animate-in` pattern, which leaves
a blank, unusable page when JS fails.

### 5.2 Responsive and accessibility gating

All animation is wrapped in `gsap.matchMedia()`:

- `prefers-reduced-motion: reduce` → no animation, no Lenis, instant states
- `< 1024px` → horizontal rail becomes a vertical stack; all pinning disabled
- `>= 1024px` → full choreography

### 5.3 Lenis integration

- Remove CSS `scroll-behavior: smooth`; Lenis owns scrolling
- Sync to GSAP ticker; `ScrollTrigger.scrollerProxy` where needed
- Rewire all 6 header anchors, the mobile menu, and back-to-top through
  `lenis.scrollTo(target, { offset: -92 })` preserving the existing header offset
- Explicitly disabled on `/fun` so canvas WASD input is unaffected
- `ScrollTrigger.refresh()` on: theme change, font load, tab switch, route change

## 6. Section designs

| # | Section | Motion |
|---|---|---|
| 1 | Hero | Three parallax planes; oversized mono name; CP stats as odometer counters (1770, 3500+, 8th/120+). Image hover-swap preserved inside a tilting frame. |
| 2 | Experience | Sticky stacking cards with scale + rotate offsets. Work/Studies tabs preserved; tab switch triggers `ScrollTrigger.refresh()`. |
| 3 | Skills | Velocity-reactive marquee rows, one per category, reversing on scroll-up. Icon map preserved. |
| 4 | Projects | Pinned horizontal rail; cards rotate through 3D crossing centre. YouTube embeds and Live/Repo buttons preserved. **Iframe `pointer-events` restored at rest** — known rail hazard. |
| 5 | Achievements / Certifications / Publications | Clip-path line reveals on an editorial hairline grid. |
| 6 | Header / Footer | Anchors via Lenis. Mobile menu and `open-chat` CustomEvent untouched. |

## 7. Fun site

`src/components/fun/village.ts` game loop, collision, and interaction logic is **untouched**.

Changes:
- Village palette read from a theme-derived object; village is currently hardcoded white
- Story overlay, NPC dialogue, HUD, and back-home button restyled to Editorial Terminal
- Proper entry transition
- Lenis explicitly disabled on this route

## 8. Sequencing

Each stage independently shippable and verifiable; the site is never left half-broken.

1. **Foundation** — tokens, layer contract, Tailwind consolidation, motion infra, deps
2. **Hero** — proves the depth system end to end
3. **Sections** — Experience, Skills, Projects, remaining sections
4. **Fun site** — palette, overlays, HUD
5. **Verification** — full matrix, build, lint

## 9. Verification matrix

Every item below is checked in **light and dark**, plus reduced-motion and mobile:

1. Theme toggle (including mid-scroll and mid-animation)
2. All 6 header anchor links land correctly with header offset
3. Mobile menu opens, closes on selection, closes on hashchange
4. "Ask AI" button → chat widget opens (desktop and mobile)
5. Chat widget send/receive round trip
6. Chat widget hidden on `/fun`, present elsewhere
7. Intro loader shows once per session, releases body scroll
8. Click sound fires
9. Hero image hover-swap; resume, Gmail compose, `tel:` links
10. Experience Work/Studies tab switching
11. Project YouTube embeds playable; Live/Repo links open
12. Achievements, Certifications, Publications render fully
13. `/fun`: WASD/arrow movement, house story overlays, NPC dialogue, back-home
14. `/publication` route intact

Then `npm run build` and `npm run lint`.

## 10. Constraints

- **No push to GitHub.** Pushing auto-deploys to Vercel. Local verification by the owner first.
- Frontend and `/fun` only.
- No AI-generated images or video.
- No React Three Fiber; CSS 3D + GSAP only.
