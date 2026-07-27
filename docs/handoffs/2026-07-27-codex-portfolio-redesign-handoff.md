# Codex Portfolio Redesign Handoff

**Date:** 2026-07-27  
**Owner:** Khandoker Sefayet Alam  
**Live site:** https://sefayet-alam.vercel.app/  
**Local app:** http://localhost:3000  
**Status:** Audit and replacement direction complete; implementation not started.

## Executive Summary

The live site is still the older dark portfolio. The local `main` branch contains
Claude's unpushed "Editorial Terminal" redesign, but it does not satisfy the new
brief. It made the name much larger, changed the accent to orange, converted Skills
into moving marquees, and converted Projects into a pinned horizontal rail. Those
changes make important information slower to scan and use motion as a gate.

The replacement direction is **Spatial Dossier**: a recruiter-first portfolio with
cool-toned 2.5D depth, a code-driven animated background, immediate information
density, rounded interactive surfaces, restrained scroll choreography, and
timeline-based proof. No image or video generation is allowed.

## Repository and Deployment State

- Stack: Next.js 16.1.1, React 19.2.3, TypeScript 5, Tailwind CSS 4.
- Existing motion stack: GSAP 3.15, ScrollTrigger, Lenis 1.3.25.
- Content source of truth: `src/content/portfolio.seed.json`.
- Main surfaces:
  - `/` recruiter portfolio.
  - `/fun` Kaboom.js village.
  - Floating "Sef-AI-yet" RAG chat.
- Vercel deploys from GitHub `main`; pushing changes can update the live site.
- Local `main` is 7 commits ahead of and 1 commit behind `origin/main`.
- The origin-only commit is `c0bc27a Encourage users to reach out if project is useful`.
- Preserve the current uncommitted `src/components/layout/Header.tsx` breakpoint
  fix: navigation/actions switch from `lg` to `xl`, the brand is `shrink-0`, and
  the container adds `gap-6`.
- Do not push until the origin-only commit is reconciled and the redesigned site
  passes the verification matrix.

## Safety Note Before Any Push

Claude added `src/app/api/media/route.ts` and `src/lib/media/higgsfield.ts`. The
project notes say `/api/media` is unauthenticated and can spend paid Higgsfield
credits. Do not call it, do not generate images or video, and do not deploy that
endpoint without a separate explicit security decision. Templates or interaction
patterns may be studied and reimplemented locally; generated media is out of scope.

## What Exists Locally

Claude added useful foundations:

- Semantic theme tokens in `src/app/globals.css`.
- GSAP context cleanup in `src/lib/motion/useGsapContext.ts`.
- Central motion constants in `src/lib/motion/config.ts`.
- Lenis/ScrollTrigger integration and font/theme refresh handling.
- Reduced-motion media queries.
- Reusable Reveal, TiltCard, Counter, and ScrollRefresher primitives.
- Desktop-only project pinning with a vertical mobile fallback.

These foundations should be retained selectively. The visual direction and the
marquee/pinned content presentations should be replaced.

## Evidence-Based Audit

### High severity

1. **Hero hierarchy overwhelms the content.**
   - `src/components/sections/Hero.tsx:83` uses `text-[13vw]` and
     `md:text-[7.5rem]`.
   - The name dominates nearly the entire first viewport and pushes the value
     proposition lower.

2. **Skills are hidden behind continuous motion.**
   - `src/components/sections/Skills.tsx:82` renders every category through
     `<Marquee speed={36}>`.
   - `src/components/sections/Skills.tsx:99-103` produces five moving rows.
   - An interviewer must track moving labels instead of seeing the complete skill
     map immediately.

3. **Projects require scroll-driven horizontal traversal.**
   - `src/components/sections/Projects.tsx:126-135` translates and pins the rail.
   - The interaction makes viewers spend vertical scroll to reveal work that could
     be compared in a static grid.

4. **The visual identity is dominated by orange.**
   - `src/app/globals.css:18` and `src/app/globals.css:34` define orange as the
     only accent.
   - The same accent is used for navigation numbers, buttons, icons, pills, lines,
     tabs, and project indices, so almost everything competes for attention.

5. **A paid media endpoint is unsafe to deploy as-is.**
   - `src/app/api/media/route.ts` is unauthenticated according to `CLAUDE.md`.
   - It is unrelated to the portfolio redesign and must not be exercised.

### Medium severity

1. Buttons, chips, cards, image frames, and icon buttons are mostly sharp
   rectangles (`Hero.tsx:41`, `Hero.tsx:113`, `Projects.tsx:22`, `Projects.tsx:56`).
2. Current "3D" background depth is three large planes moving only on the Y axis
   (`Stage.tsx:22-37`), so it reads as a scrolling grid/gradient rather than an
   intentional spatial scene.
3. Project cards lack rich hover feedback; color changes carry most interaction.
4. Achievement entries already use a vertical line, but the tabs and flat rows do
   not create a memorable milestone narrative.
5. The hero imports standard Lucide icons and uses an all-monospace display,
   reinforcing a familiar AI-generated "terminal portfolio" look.
6. Loading a deep link directly at `/#skills` produced a blank viewport during
   the headless audit. The implementation must verify that JS-set reveal states
   never leave content invisible after anchor navigation or interrupted motion.

### Low severity

1. Repeated one-off button classes should become shared variants.
2. Section numbering is visually louder than some section titles.
3. Continuous background and marquee motion should stop when offscreen or when
   the document is hidden.
4. The design needs clear rules for hover-capable versus touch devices.

## Inspiration Review

Use references as principles, not as templates to copy.

- [Bruno Simon](https://bruno-simon.com/): interaction is memorable because the
  3D metaphor has a purpose. Borrow spatial coherence, not a full game on `/`.
- [Maël Ruffini](https://www.maelruffini.com/): cinematic project media remains
  readable and project-oriented. Borrow clear work indexing and transitions.
- [Aristide Benoist](https://aristidebenoist.com/folio-v1): dense work lists make
  the full body of work discoverable. Borrow the immediate index.
- [Benjamin Simon](https://www.benjamin-simon.dev/): depth and atmosphere can
  support technical storytelling. Avoid generic sci-fi copy and excessive
  spectacle.

## Explored Directions

### A. Full WebGL world

High visual novelty, but expensive, slower to load, harder to make accessible, and
too close to duplicating the purpose of `/fun`. Rejected for the main portfolio.

### B. Restrained editorial redesign

Fast and safe, but too close to Claude's current terminal direction and unlikely to
feel materially unique. Rejected as the primary direction.

### C. Spatial Dossier — selected

CSS 3D, SVG, GSAP, and ScrollTrigger create a coherent depth system without adding
Three.js. All essential information remains visible and usable without animation.
Depth is reserved for hierarchy, hover feedback, and section transitions.

## Approved Design Direction: Spatial Dossier

### Visual language

- Base: midnight graphite, cool charcoal, and soft mineral white.
- Primary accent: electric periwinkle/cobalt.
- Secondary signal: restrained ice cyan for active technical states only.
- Accent coverage target: under 8% of the viewport.
- Typography: a humanist/geometric sans for display and body plus a mono only for
  metadata, stats, dates, and code-like labels.
- Surfaces: 16–24px radii, subtle double-bezel construction, soft ambient shadows,
  and thin cool-toned borders.
- Composition: asymmetrical bento sections connected by a recurring "signal path"
  motif.

### Background

Replace `Stage` with a fixed **Spatial Field**:

- A lightweight SVG graph of nodes and paths inspired by algorithms and network
  traversal.
- Three transform-only depth planes with small pointer parallax on fine pointers.
- Scroll changes plane depth, node illumination, and path progress.
- A faint grain or dot texture may be CSS/SVG code only.
- No generated image, generated video, blob stack, or permanent orange glow.
- Static fallback under reduced motion and on low-power/mobile layouts.

### Hero

- Name size: `clamp(3.2rem, 6vw, 5.75rem)`.
- Keep name, title, location, three proof points, résumé, email, and social links
  visible in the first desktop viewport.
- Profile image becomes a rounded layered portrait stage with a subtle pointer
  tilt and depth-separated frame; no slow reveal gate.
- Add one concise positioning line that connects competitive programming,
  full-stack work, and AI integration.
- Use one primary CTA and one secondary CTA. Other links become quiet icon actions.

### Skills

- Replace every marquee with a static capability matrix.
- Show all skills simultaneously on desktop in five compact category groups.
- Keep all labels present in DOM and visible without hover.
- Hover/focus raises one skill chip by 4–6px, adds a small highlight, and subtly
  shifts its icon depth.
- Mobile uses a two-column or single-column wrapped matrix, never a carousel.

### Projects

- Replace the pinned rail with an asymmetrical bento grid.
- Every project name, role/stack summary, and thumbnail is visible in the section
  without horizontal traversal.
- Feature the strongest project at larger scale; keep the rest directly
  comparable.
- Hover/focus uses 2.5D elevation, media parallax, a soft spotlight, and clear CTA
  movement. No information may exist only on hover.
- Project cards should settle instantly when the pointer leaves and remain flat on
  touch/reduced-motion devices.

### Experience and Achievements

- Experience becomes a single scan-friendly chronology; Work and Study may use
  parallel lanes but not hidden tabs.
- Achievements become a milestone timeline with year markers, logos, outcome,
  scope, and proof links.
- Publications attach to the same proof system as a secondary lane or indexed
  group, rather than competing tabs.
- Scroll draws the connecting path while entries enter with short staggered
  reveals. The full content remains visible if JavaScript or motion is unavailable.

### Motion contract

- Hover: 160–240ms; entry: 500–800ms; long ambient drift: 7–12s maximum.
- Use custom `power3.out`, `expo.out`, or tuned cubic-bezier eases.
- Scroll-linked animation uses `ease: "none"` and small transform ranges.
- Animate only transform, opacity, filter in limited media cases, or SVG stroke.
- No infinite marquee, no rotating skill wheel, no pinned project rail.
- Continuous decorative motion pauses offscreen and when the document is hidden.
- `prefers-reduced-motion: reduce` produces a complete static experience.
- Keyboard focus receives the same visual affordance as hover.

## Success Criteria

- A recruiter can identify role, strongest proof, all skill groups, and all project
  names within 10–20 seconds.
- All skills are simultaneously visible at 1440px without animation.
- No desktop-only horizontal project journey.
- Hero name no larger than 5.75rem.
- Cards and controls have deliberate rounded geometry and visible hover/focus
  feedback.
- Achievement chronology is understandable without opening tabs.
- No generated images/videos and no request to `/api/media`.
- No content/API/RAG regressions.
- No horizontal overflow at 390, 768, 1024, and 1440px.
- Production Lighthouse targets: Performance ≥ 90 desktop / ≥ 85 mobile;
  Accessibility ≥ 95; Best Practices ≥ 95.

## Recommended Execution Order

Use the new implementation plan:
`docs/superpowers/plans/2026-07-27-spatial-dossier-redesign.md`.

Do not continue from Claude's old `Editorial Terminal` plan. Reuse its motion
infrastructure only where it satisfies this handoff.

## 2026-07-27 AI/ML Positioning Addendum

- Preserve the implemented graphite/periwinkle neural-field theme.
- Position the profile as `AI/ML Engineer • NLP Researcher • Full-Stack
  Developer`.
- Feature `UNKNOWNS AgriSense` first. Verified stack and scope: LangGraph,
  FastAPI, Next.js, PostgreSQL/pgvector, grounded agricultural data and live
  weather, deterministic intake gates, explainable recommendations, finance,
  schedules, alerts, and scenario simulation.
- Use the AgriSense repository's credited Bangladesh paddy image; do not
  generate project media or imply that an unrelated video is a demo.
- Present two active NLP research tracks:
  1. sarcasm-detection thesis submitted to IEEE Access, targeting a Q2 outcome;
  2. a second ongoing NLP manuscript targeting Q1, with title/venue withheld.
- Neither research item may be described as accepted or published until the
  source data changes.
- Keep recruiter-facing KB entries aligned with the visible portfolio.
