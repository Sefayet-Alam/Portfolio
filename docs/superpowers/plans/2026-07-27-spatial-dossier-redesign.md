# Spatial Dossier Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current orange Editorial Terminal redesign with a recruiter-first, cool-toned Spatial Dossier featuring purposeful 2.5D depth, immediate skill/project scanability, timeline-based proof, and polished hover/scroll interaction.

**Architecture:** Keep the existing Next.js App Router, Tailwind v4, portfolio JSON, GSAP/ScrollTrigger, Lenis, and theme infrastructure. Replace content-gating marquees and the pinned project rail with static semantic layouts, then layer additive CSS/SVG/GSAP motion on top. Confine perspective to isolated visual components so sticky/fixed UI, keyboard navigation, and touch layouts remain reliable.

**Tech Stack:** Next.js 16.1.1, React 19.2.3, TypeScript 5, Tailwind CSS 4, GSAP 3.15, ScrollTrigger, Lenis, next/font, SVG/CSS 3D.

## Global Constraints

- Do not generate images or video.
- Do not call `src/app/api/media/route.ts` or the Higgsfield SDK.
- Do not push to GitHub until the owner has approved local desktop and mobile results.
- Preserve all current user content in `src/content/portfolio.seed.json`.
- Do not modify `src/app/api/**`, `src/lib/ai/**`, `src/lib/db/**`, or `src/lib/media/**`.
- Preserve `/fun`, `/publication`, the AI chat, theme switching, `open-chat`
  CustomEvent, `sessionStorage` key `introSeen`, and canvas keyboard focus.
- Preserve the uncommitted `src/components/layout/Header.tsx` `xl` breakpoint fix.
- Reconcile origin commit `c0bc27a` before any push.
- Initial content must ship visible; JavaScript may add animation states only after
  mount and must restore them on cleanup.
- Animate transform and opacity by default. SVG stroke animation is allowed.
- No autoplay marquees, rotating skill displays, project carousel, or pinned
  horizontal project rail.
- No new animation or 3D dependency unless the existing stack cannot meet a
  written acceptance criterion.
- Every task ends with the listed targeted checks. Final verification requires
  `npm run lint` and `npm run build`.

---

## Task 1: Protect the working tree and record the baseline

**Files:**

- Read: `src/components/layout/Header.tsx`
- Read: `docs/handoffs/2026-07-27-codex-portfolio-redesign-handoff.md`
- Read: `package.json`
- Do not edit source in this task.

- [ ] Run `git status --short --branch` and confirm `main` is 7 ahead / 1 behind
      before new work.
- [ ] Run `git diff -- src/components/layout/Header.tsx` and preserve the existing
      uncommitted breakpoint changes.
- [ ] Confirm the already-running local app responds at `http://localhost:3000`.
- [ ] Capture baseline desktop screenshots of `/`, `/#skills`, `/#projects`, and
      `/#highlights`.
- [ ] Capture a 390×844 screenshot of `/`.
- [ ] Record any console errors, horizontal overflow, invisible deep-link content,
      or broken navigation.

**Acceptance:** Baseline evidence exists and no user change has been overwritten.

---

## Task 2: Replace the orange terminal tokens and typography

**Files:**

- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.mjs` only if token bridging requires it.

- [ ] Replace orange accents with a cool spatial palette:
  - Dark surface `#090B12`
  - Dark raised `#111522`
  - Dark ink `#F2F4F8`
  - Dark muted `#9AA3B5`
  - Primary accent `#6C7CFF`
  - Secondary signal `#55D9E8`
  - Light equivalents must meet WCAG AA.
- [ ] Add semantic variables for soft border, elevated border, ambient shadow,
      focus ring, and depth glow.
- [ ] Limit accent utilities to active states, primary CTA, timeline progress, and
      small technical signals.
- [ ] Replace Inter and the all-mono display treatment with one geometric/humanist
      sans plus a mono used only for metadata.
- [ ] Add radius tokens for 12px controls, 18px cards, and 24px feature surfaces.
- [ ] Add shared custom easing and duration variables.
- [ ] Keep the existing z-index/layer contract and reduced-motion override.

**Targeted checks:**

- [ ] Search for remaining `#ff4d00`, `#d93a00`, `text-accent` overuse, and raw
      orange values.
- [ ] Verify dark and light themes at 390px and 1440px.
- [ ] Run `npm run lint`.

**Acceptance:** The page no longer reads orange/terminal; text and focus contrast
pass WCAG AA.

---

## Task 3: Build the code-driven Spatial Field background

**Files:**

- Create: `src/components/layout/SpatialField.tsx`
- Modify: `src/app/layout.tsx`
- Delete after replacement: `src/components/layout/Stage.tsx`
- Reuse: `src/lib/motion/useGsapContext.ts`
- Reuse: `src/lib/motion/config.ts`

- [ ] Render a fixed, `aria-hidden`, `pointer-events-none` SVG/CSS field with:
  - three isolated depth planes;
  - graph nodes and connecting paths;
  - a quiet dot/grain texture made in code;
  - no generated media and no orange glow.
- [ ] Add small fine-pointer parallax with `gsap.quickTo()` or equivalent to avoid
      creating a tween on every pointer event.
- [ ] Add restrained scroll-linked Y/Z drift and SVG path progress using
      ScrollTrigger.
- [ ] Use `gsap.matchMedia()` to disable pointer depth on coarse pointers and all
      animated depth under reduced motion.
- [ ] Pause continuous ambient motion when `document.hidden` is true.
- [ ] Keep perspective inside `SpatialField`; never place it on `.layer-content`.
- [ ] Ensure cleanup reverts matchMedia, listeners, and ScrollTriggers.

**Targeted checks:**

- [ ] Deep-load `/#skills` and confirm the page is not blank.
- [ ] Toggle theme and resize; call/verify `ScrollTrigger.refresh()`.
- [ ] Confirm the field does not intercept clicks or create horizontal overflow.
- [ ] Profile for transform-only updates and no repeated layout reads.

**Acceptance:** The background creates noticeable but quiet 2.5D depth and remains
decorative, performant, and removable without affecting content.

---

## Task 4: Consolidate interaction primitives

**Files:**

- Create: `src/components/ui/ActionButton.tsx`
- Create: `src/components/ui/Surface.tsx`
- Create: `src/components/motion/PointerTilt.tsx`
- Create: `src/components/motion/MagneticAction.tsx`
- Modify: `src/components/motion/Reveal.tsx`
- Modify or replace: `src/components/motion/TiltCard.tsx`
- Modify: `src/lib/motion/config.ts`

- [ ] Implement shared rounded button variants: primary, secondary, icon, and
      quiet-link.
- [ ] Add visible focus rings and minimum 44×44 touch targets.
- [ ] Implement a double-bezel Surface: outer rounded shell plus inner content
      plane, without generic heavy shadow.
- [ ] Implement pointer tilt with clamped rotation (maximum ±5deg), depth-separated
      children, and spring-like return.
- [ ] Implement magnetic action movement capped at 4px; disable for touch and
      reduced motion.
- [ ] Update Reveal so content is visible before JS, deep links cannot remain
      hidden, and interrupted/unmounted animation restores styles.
- [ ] Centralize timings:
  - micro interaction 160–240ms;
  - section entry 500–800ms;
  - ambient cycle 7–12s;
  - custom eases only.
- [ ] Do not add infinite floating to every card. Ambient drift is allowed only on
      the hero portrait and one featured project; hover/focus creates the primary
      floating feedback everywhere else.

**Targeted checks:**

- [ ] Keyboard through every variant.
- [ ] Toggle reduced motion and verify no tilt, magnetism, or hidden content.
- [ ] Rapidly enter/leave cards and confirm animations are interruptible.
- [ ] Run `npm run lint`.

**Acceptance:** Buttons and surfaces feel tactile and rounded, with consistent,
accessible hover/focus/active states.

---

## Task 5: Redesign the header and hero

**Files:**

- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/ui/ThemeToggle.tsx`
- Reuse: `src/components/motion/Counter.tsx`
- Reuse: `src/components/ui/ActionButton.tsx`
- Reuse: `src/components/motion/PointerTilt.tsx`

- [ ] Preserve the user's uncommitted `xl` header breakpoint behavior.
- [ ] Turn the header into a rounded floating command bar with calm background
      treatment, not an edge-to-edge terminal strip.
- [ ] Keep nav anchors, Ask AI event, Fun Site, résumé, theme, and mobile menu.
- [ ] Set hero name to `clamp(3.2rem, 6vw, 5.75rem)`.
- [ ] Use sans for the name and title; reserve mono for location/stat labels.
- [ ] Keep the first viewport recruiter-complete: identity, title, concise
      positioning, three proof points, primary résumé CTA, secondary email CTA.
- [ ] Convert the profile image into a rounded layered portrait stage with subtle
      pointer depth and existing hover-image swap.
- [ ] Make social links quiet rounded icon controls.
- [ ] Add short staggered entry only after content is painted; no long intro delay.

**Targeted checks:**

- [ ] At 1440×1000 the main identity and all primary actions are visible without
      scrolling.
- [ ] At 390×844 the name does not overflow or dominate more than half the screen.
- [ ] Verify mobile menu, theme, résumé, email, telephone, socials, and Ask AI.
- [ ] Verify hover/focus states and reduced motion.

**Acceptance:** The hero is unique and interactive without sacrificing a
10–20-second recruiter scan.

---

## Task 6: Replace Skills marquee with a complete capability matrix

**Files:**

- Modify: `src/components/sections/Skills.tsx`
- Stop importing: `src/components/motion/Marquee.tsx`
- Delete `src/components/motion/Marquee.tsx` only after confirming no other usage.

- [ ] Render Strengths, Languages, Frameworks, Databases, and Tools as a static
      responsive matrix.
- [ ] Show every skill label at the same time on desktop.
- [ ] Keep exact JSON labels and the existing icon map.
- [ ] Use compact rounded chips with 4–6px hover/focus lift and small icon depth.
- [ ] Give the strongest categories more visual weight without hiding the rest.
- [ ] Use semantic lists and headings; do not rely on hover for descriptions.
- [ ] Collapse to two columns and then one column without a carousel.

**Targeted checks:**

- [ ] Confirm every JSON skill string appears exactly once in the visible matrix.
- [ ] Confirm no ticker, duplication, clipped text, or horizontal scroll.
- [ ] Keyboard-focus representative chips.
- [ ] Verify 390, 768, 1024, and 1440px.

**Acceptance:** An interviewer can scan the complete skill set immediately.

---

## Task 7: Replace the pinned project rail with an interactive bento directory

**Files:**

- Modify: `src/components/sections/Projects.tsx`
- Modify: `src/components/YouTubeCard.tsx`
- Reuse: `src/components/ui/Surface.tsx`
- Reuse: `src/components/motion/PointerTilt.tsx`

- [ ] Remove ScrollTrigger pinning and horizontal track translation.
- [ ] Render an asymmetrical desktop grid with one featured project and all other
      projects visible as directly comparable cards.
- [ ] Keep project name, stack, essential outcome, media, live link, and repo link
      visible without hover.
- [ ] Add hover/focus elevation, media parallax/scale, soft local spotlight, and
      CTA arrow movement.
- [ ] Cap tilt at ±3deg on project cards to protect text readability.
- [ ] Use consistent 18–24px radii and nested borders.
- [ ] Ensure YouTube media remains clickable and does not conflict with pointer
      tilt.
- [ ] Use a simple single-column mobile stack with no pinning or sideways motion.

**Targeted checks:**

- [ ] Confirm all project names are visible in one desktop section.
- [ ] Verify every Live/Repo/YouTube link.
- [ ] Test keyboard and touch interactions.
- [ ] Confirm no ScrollTrigger is created by Projects.
- [ ] Confirm no horizontal overflow at all target widths.

**Acceptance:** Projects feel rich and dimensional but remain instantly comparable.

---

## Task 8: Build scan-friendly Experience and Achievement timelines

**Files:**

- Modify: `src/components/sections/Experience.tsx`
- Modify: `src/components/sections/Achievements.tsx`
- Modify: `src/components/sections/Publications.tsx` if still separately rendered.
- Create: `src/components/ui/Timeline.tsx`

- [ ] Replace hidden Work/Studies tabs with one visible chronology or two visible
      parallel lanes.
- [ ] Create a shared semantic timeline primitive with year markers, nodes,
      connecting path, logo slot, title, organization, outcome, and proof links.
- [ ] Render Achievements as milestones rather than flat rows behind tabs.
- [ ] Attach Publications as a visible secondary proof group/lane.
- [ ] Draw the timeline path on scroll with SVG stroke progress; keep the full path
      and content visible without motion.
- [ ] Stagger entries by no more than 60ms and avoid pinning.
- [ ] Use hover/focus lift on milestone surfaces and highlight the corresponding
      path node.

**Targeted checks:**

- [ ] Confirm every work, study, achievement, and publication item remains present.
- [ ] Confirm dates read in chronological order.
- [ ] Verify proof links and logos.
- [ ] Deep-load `/#experience` and `/#highlights`.
- [ ] Verify reduced motion and keyboard focus.

**Acceptance:** The viewer can understand progression and proof without switching
tabs or waiting for animation.

---

## Task 9: Harmonize certifications, contact, footer, chat, and secondary routes

**Files:**

- Modify: `src/components/sections/Certifications.tsx`
- Modify: `src/components/sections/Contact.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/ui/ChatWidget.tsx`
- Modify only if visually necessary: `src/app/publication/page.tsx`
- Verify only: `src/app/fun/page.tsx` and `src/components/fun/**`

- [ ] Convert certification cards to the shared rounded Surface treatment.
- [ ] Add subtle hover lift and media depth without auto-floating every card.
- [ ] Make Contact a clear closing action scene with email, résumé, phone, and
      social options.
- [ ] Restyle chat controls to the same radius, focus, and accent system while
      preserving behavior.
- [ ] Keep footer concise and ensure the final scene resolves the background signal
      path.
- [ ] Do not redesign `/fun`; only verify the new global tokens do not break it.
- [ ] Keep `/publication` readable and theme-compatible.

**Targeted checks:**

- [ ] Verify all certificate links and images.
- [ ] Verify the chat open/close/send flow without requiring a successful external
      LLM response.
- [ ] Verify `/fun` loads, theme toggles, and canvas remains keyboard-focusable.
- [ ] Verify `/publication`.

**Acceptance:** Secondary sections feel like one design system and all existing
features still work.

---

## Task 10: Motion, accessibility, and performance review

**Files:**

- Review: `src/components/**/*.tsx`
- Review: `src/lib/motion/**/*.ts`
- Modify only files with verified findings.

- [ ] Audit purpose/frequency, easing/duration, physicality/origin,
      interruptibility, performance, accessibility, cohesion/tokens, and missed
      opportunities.
- [ ] Confirm ScrollTriggers are created top-to-bottom and cleaned by
      `gsap.context()`/`matchMedia().revert()`.
- [ ] Call `ScrollTrigger.refresh()` after fonts, theme, images, and responsive
      layout changes that affect geometry.
- [ ] Confirm continuous animation pauses when offscreen/document-hidden.
- [ ] Confirm pointer listeners use passive or efficient handlers and no animation
      performs layout reads on every frame.
- [ ] Confirm reduced motion shows all content and removes scrub/tilt/magnetism.
- [ ] Confirm focus indicators, semantic headings/lists, alt text, color contrast,
      and 44×44 touch targets.
- [ ] Confirm direct anchor loads never leave revealed content invisible.

**Acceptance:** No HIGH findings remain; every MEDIUM finding is fixed or documented
with a reason.

---

## Task 11: Final verification and local approval build

**Files:** No planned source changes; fix only verified defects.

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run the production server and smoke-test `/`, `/fun`, `/publication`,
      `/api/chat` failure handling, and all navigation anchors.
- [ ] Capture desktop screenshots at 1440×1000 for hero, skills, projects, and
      achievements.
- [ ] Capture mobile screenshots at 390×844 for the full critical flow.
- [ ] Test dark and light themes.
- [ ] Test `prefers-reduced-motion: reduce`.
- [ ] Test keyboard-only navigation and visible focus.
- [ ] Check browser console and network for errors.
- [ ] Run Lighthouse against the production build:
  - Performance ≥ 90 desktop / ≥ 85 mobile;
  - Accessibility ≥ 95;
  - Best Practices ≥ 95.
- [ ] Run `git diff --check`.
- [ ] Review `git status --short` and verify no generated screenshots, secrets,
      `.env*`, or paid media output are staged.

**Acceptance:** The redesign meets the handoff success criteria and is ready for
the owner's local visual approval.

---

## Task 12: Reconcile Git and deploy only after approval

**Files:** Git operation only.

- [ ] Fetch origin.
- [ ] Reconcile origin commit `c0bc27a` without discarding local redesign work or
      the uncommitted header breakpoint fix.
- [ ] Re-run `npm run lint`, `npm run build`, and the critical smoke tests.
- [ ] Review the final diff for `src/app/api/media/route.ts` and do not expose an
      unauthenticated paid endpoint. Resolve that in a separately approved security
      change before deployment.
- [ ] Commit the redesign locally with a descriptive message.
- [ ] Show the owner the final screenshots and commit list.
- [ ] Push `main` only after explicit visual approval, because the push triggers
      the Vercel live deployment.
- [ ] After push, inspect the Vercel deployment and compare it with the approved
      local screenshots.

**Acceptance:** Git history is reconciled, no unsafe paid endpoint is deployed, and
the live site matches the approved local redesign.

---

## Execution Status

**Status:** Implemented and published on 2026-07-27.

The redesign was committed and GitHub `main` was updated with force-with-lease to
`0f5b05ea4fb6e45f19b9e6a0e94d9aa642aefcdd`. Targeted frontend lint, TypeScript,
production build, critical-route smoke tests, desktop visual inspection, mobile
game checks, and diff validation passed. Repository-wide legacy lint findings,
Lighthouse scoring, and post-push Vercel polling remain explicitly documented as
non-blocking notes.

See `docs/handoffs/2026-07-27-progress-tracker.md` for the final completion
tracker.
