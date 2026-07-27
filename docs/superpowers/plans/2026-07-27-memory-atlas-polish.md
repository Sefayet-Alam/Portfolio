# Memory Atlas and Portfolio Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the AI/ML portfolio, add research identity and media, replace
the flat greeting with a neural handshake, and turn `/fun` into a structured
2.5D adventure with reliable jump mechanics.

**Architecture:** Keep the existing Next.js and canvas village foundations.
React owns UI state and accessibility while the canvas engine owns simulation,
collision, collectibles, and rendering. Global motion continues through GSAP
and existing semantic tokens.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Canvas 2D,
GSAP, next-themes.

## Global Constraints

- Do not generate images or video.
- Preserve the graphite/periwinkle/cyan theme.
- Keep every important fact visible without waiting for animation.
- Honor `prefers-reduced-motion`.
- Animate only transform and opacity in DOM UI.
- Do not push to GitHub; push deploys production.

---

### Task 1: Research Identity and Data Corrections

**Files:**
- Modify: `src/content/portfolio.seed.json`
- Modify: `src/content/kb_chunks.seed.json`
- Modify: `sefayet-portfolio.kb_chunks.json`
- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/Achievements.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: `profile.links.scholar: string`
- Consumes: Google Scholar URL supplied by the owner

- [ ] Set every Codeforces maximum to `1770`.
- [ ] Add the Google Scholar URL to visible profile links and both KB exports.
- [ ] Add the Wikimedia Word2vec embedding media band and attribution to the
      research cards.
- [ ] Permit the Wikimedia image host in Next image configuration.
- [ ] Parse all modified JSON and run targeted ESLint plus TypeScript.

### Task 2: Spatial Background and Greeting Handshake

**Files:**
- Modify: `src/components/layout/SpatialField.tsx`
- Modify: `src/components/ui/IntroLoader.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing motion tokens from `src/lib/motion/config.ts`
- Produces: `.spatial-packet`, `.intro-network`, and `.intro-progress` visual
  hooks with reduced-motion fallbacks

- [ ] Add a restrained packet pulse and second orbit without changing the base
      palette.
- [ ] Rebuild the intro markup as a neural handshake with real status labels.
- [ ] Add GPU-only CSS transitions and static reduced-motion behavior.
- [ ] Verify the intro dispatches `intro-complete` and restores body overflow.

### Task 3: Typed Game State and Reliable Jump Physics

**Files:**
- Modify: `src/components/fun/village.ts`

**Interfaces:**
- Produces: `FunGameStatus`
- Produces: `FunInputDetail`
- Extends: `initVillage({ onStatus })`

- [ ] Add vertical position, velocity, gravity, jump impulse, grounded state,
      and sprint multiplier to the player simulation.
- [ ] Keep houses solid while allowing a sufficiently high jump to clear ponds
      and wells.
- [ ] Add four deterministic signal fragments, one per neighborhood.
- [ ] Track visited story IDs and emit status only when serialized state changes.
- [ ] Consume keyboard and `fun-game-input` custom events.
- [ ] Draw the elevated player, responsive shadow, fragments, landing ring, and
      chapter-aware objective feedback.

### Task 4: Game HUD, Onboarding, and Mobile Controls

**Files:**
- Create: `src/components/fun/FunHud.tsx`
- Create: `src/components/fun/FunControls.tsx`
- Modify: `src/components/fun/FunGame.tsx`
- Modify: `src/app/fun/page.tsx`

**Interfaces:**
- Consumes: `FunGameStatus`
- Dispatches: `CustomEvent<FunInputDetail>("fun-game-input")`

- [ ] Add a first-visit onboarding panel with objective and controls.
- [ ] Add chapter, story, fragment, and nearby-action HUD modules.
- [ ] Add pointer-safe movement, jump, and interact controls on touch layouts.
- [ ] Pause simulation while onboarding or story/NPC overlays are open.
- [ ] Add an explicit canvas accessible label and focus restoration.

### Task 5: Story Overlay and World Presentation Polish

**Files:**
- Modify: `src/components/fun/FunStoryOverlay.tsx`
- Modify: `src/components/fun/FunNpcOverlay.tsx`
- Modify: `src/components/fun/palette.ts`
- Modify: `src/content/fun.world.json`
- Modify: `src/app/globals.css`

- [ ] Replace sharp overlay geometry with the portfolio’s rounded spatial
      surfaces and stronger hierarchy.
- [ ] Replace placeholder story copy with current AI/ML and AgriSense context
      where appropriate.
- [ ] Improve dusk grading, warm quest accents, and HUD/world separation.
- [ ] Confirm overlays remain keyboard and touch accessible.

### Task 6: Motion Review and Final Verification

**Files:** Review all modified frontend files.

- [ ] Search the diff for `transition: all`, `ease-in`, layout-property
      animations, and missing reduced-motion behavior.
- [ ] Run JSON parsing, targeted ESLint, and `npx tsc --noEmit`.
- [ ] Run `npm run build`.
- [ ] Smoke-test `/`, `/fun`, and `/publication`.
- [ ] Capture and inspect desktop and mobile screenshots.
- [ ] Run `git diff --check` and leave `npm run dev` running.

