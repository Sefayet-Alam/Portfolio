# Memory Atlas and Portfolio Polish Design

## Goal

Finish the portfolio as a cohesive AI/ML engineer identity, turn the greeting
from a flat word swap into a short neural-handshake sequence, and rebuild
`/fun` as a playable 2.5D biographical adventure with reliable jumping,
objectives, progress, and mobile controls.

## Chosen Direction

Three approaches were considered:

1. **Memory Atlas adventure (chosen):** preserve the existing village and story
   content, then add game states, jump physics, signal collectibles, chapter
   progress, onboarding, a responsive HUD, and touch controls.
2. **Side-scrolling platformer rewrite:** gives conventional platforming but
   discards the strongest existing asset—the explorable life-story village—and
   carries much higher regression risk.
3. **Mini-game hub:** creates variety but fragments the story and requires more
   content than this portfolio needs.

Memory Atlas gives the highest visual and experiential return without turning
the portfolio into a game-production project.

## Visual System

The existing cool graphite, periwinkle, and cyan system remains the source of
truth. The polish pass adds controlled signal energy rather than a new theme:

- `Graphite void` — `#090B12`
- `Raised slate` — `#111522`
- `Periwinkle signal` — `#7C89FF`
- `Research cyan` — `#55D9E8`
- `Warm memory` — `#F1B86A`, reserved for `/fun` objectives and discoveries

The main portfolio stays precise and technical. `/fun` uses the same shell
language but introduces rounded glass HUD modules, warm quest signals, deeper
vignette lighting, and game-specific typography labels.

## Global Portfolio Polish

- Correct the Codeforces maximum to `1770` everywhere.
- Add Google Scholar to the profile model, hero social rail, research area,
  footer, and recruiter-assistant knowledge bases.
- Give each research card a substantial media band using the CC BY-SA 4.0
  Wikimedia t-SNE projection of a Word2vec embedding by Ewulczyn (WMF).
  The image is decorative context, not research evidence; the source and
  license remain linked.
- Refine the spatial background with a small number of breathing signal nodes
  and a second orbit layer. Continuous motion pauses when the tab is hidden and
  is disabled under reduced motion.

## Greeting: Neural Handshake

The greeting becomes a 1.8-second system handshake:

1. A sparse node field and signal line establish the portfolio world.
2. Multilingual greetings change in place without layout movement.
3. A small status rail advances through `context`, `research`, and `systems`.
4. The final state reads `Welcome, signal acquired` before the overlay exits.

The greeting remains once per browser tab, does not delay deep links, uses only
transform/opacity motion, and collapses to a static 250ms handoff under reduced
motion.

## `/fun`: Memory Atlas

### Core Loop

The player explores four life chapters, reads story beacons, speaks with NPCs,
and collects one signal fragment per chapter. The HUD always communicates:

- current chapter;
- discovered stories / total stories;
- collected fragments / four;
- nearby action;
- controls and objective.

Collecting all four fragments completes the atlas. Story discovery is tracked
independently so the player can continue exploring after completion.

### Player Mechanics

- `WASD` or arrows: normalized eight-direction movement.
- `Space`: frame-independent jump with vertical velocity, gravity, landing, and
  a changing shadow. Jumping clears ponds and wells while houses remain solid.
- `Shift`: sprint at a controlled multiplier.
- `E`: interact with the nearest story beacon or NPC.
- `Escape`: close an overlay.
- Touch: four-way movement pad plus dedicated Jump and Interact buttons.

Keyboard state clears on blur and overlays pause world simulation. No
high-frequency action uses DOM animation.

### Game Architecture

- `village.ts` owns deterministic simulation, drawing, collision, collectibles,
  and the animation loop.
- `FunGame.tsx` owns React state and bridges simulation status into the DOM.
- `FunHud.tsx` owns onboarding, progress, control reference, and completion
  feedback.
- `FunControls.tsx` owns pointer-safe mobile controls and dispatches a typed
  input event consumed by the simulation.
- Story and NPC overlays remain separate, but receive rounded spatial styling.

The canvas targets 60 FPS, caps delta time, culls world objects, avoids
per-frame DOM writes, and emits status only when values change.

## Accessibility and Responsive Behavior

- The canvas has an explicit accessible label.
- All touch controls are at least 48×48px and use pointer capture semantics.
- Onboarding can be dismissed by button, Enter, or Space.
- Reduced motion removes greeting travel, background drift, HUD entrance
  movement, and collectible bobbing while preserving state feedback.
- Mobile keeps the world full-screen and moves HUD/control clusters away from
  each other.

## Verification

- JSON parses; TypeScript and targeted ESLint pass.
- Production build succeeds.
- `/`, `/fun`, and `/publication` return HTTP 200.
- Desktop and mobile screenshots confirm no overlap, clipped controls, or
  unreadable HUD.
- Keyboard smoke test confirms movement, Space jump, Shift sprint, E
  interaction, and Escape close.
- No generated image/video, new paid API call, or Git push is introduced.

