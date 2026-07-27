# Portfolio Redesign Progress Tracker

**Last updated:** 2026-07-27  
**Repository:** `Sefayet-Alam/Portfolio`  
**Branch:** `main`  
**Published commit:** `0f5b05ea4fb6e45f19b9e6a0e94d9aa642aefcdd`  
**Live site:** https://sefayet-alam.vercel.app/

## Current State

- [x] Complete portfolio redesign implemented.
- [x] Production build passed.
- [x] Local and GitHub `main` matched after a force-with-lease update.
- [x] Vercel deployment was triggered by the GitHub push.
- [x] Local development server stopped at the owner's request.
- [x] No generated images or videos were used.

## Visual System and Interaction

- [x] Replaced the orange-heavy treatment with a graphite, periwinkle, and cyan
      spatial design system.
- [x] Added the animated neural/network background with restrained depth,
      signal paths, pointer parallax, and reduced-motion handling.
- [x] Reduced the hero-name scale and improved first-viewport information density.
- [x] Added rounded layered surfaces, magnetic actions, pointer tilt, hover lift,
      focus feedback, and short transform-based transitions.
- [x] Replaced the rotating/marquee skill presentation with a scan-friendly
      capability matrix where all skills are visible together.
- [x] Replaced the slow horizontal project experience with a visible bento grid.
- [x] Converted achievements into a chronological milestone presentation.
- [x] Updated the greeting into a dimensional neural-handshake sequence.
- [x] Disabled the bottom-left Next.js development indicator.

## AI/ML Positioning and Content

- [x] Positioned the profile as AI/ML Engineer, NLP Researcher, and Full-Stack
      Developer.
- [x] Featured `UNKNOWNS AgriSense` as the primary project with accurate
      LangGraph, FastAPI, Next.js, PostgreSQL/pgvector, grounding, simulation,
      finance, weather, and alert context.
- [x] Added sourced AgriSense media without generating replacement assets.
- [x] Added the 12th IUT ICT Fest Agentic AI Hackathon milestone: Team UNKNOWNS
      reached the top 20 finalists from 700 teams.
- [x] Corrected Codeforces maximum rating to `1770` in visible content,
      recruiter KB data, plans, and specifications.
- [x] Added the Google Scholar profile:
      https://scholar.google.com/citations?user=xpsciakAAAAJ&hl=en

## Research

- [x] Added the sarcasm-detection NLP thesis as submitted to IEEE Access and
      under review, with a Q2 target stated as an aspiration rather than an
      acceptance claim.
- [x] Added the second active NLP manuscript with a Q1 target and no invented
      title, venue, or publication status.
- [x] Added media-rich research cards using the sourced Wikimedia word-embedding
      visualization with visible attribution.
- [x] Added Scholar actions to the hero, research section, publication page, and
      footer.
- [x] Kept recruiter-facing knowledge-base content synchronized with the visible
      research status.

## Certificates

- [x] Added Ostad Applied NLP & LLM credential:
      https://github.com/Sefayet-Alam/Achivemenets_-_Certificates-/blob/main/Khandoker%20Sefayet%20Alam-Applied_%20NLP_LLM%20.pdf
- [x] Added Ostad Deep Learning credential:
      https://github.com/Sefayet-Alam/Achivemenets_-_Certificates-/blob/main/Sefayet_Alam_DL_Ostad.pdf
- [x] Added a code-driven AI/ML credential visual fallback and updated recruiter
      KB entries for both certificates.

## Fun Site — Memory Atlas

- [x] Upgraded the flat biography village into the `Memory Atlas` 2.5D
      interactive experience.
- [x] Added frame-rate-independent jumping with airborne and landing states.
- [x] Added sprinting, responsive shadows, landing feedback, and obstacle
      clearance while airborne.
- [x] Added four collectible signal fragments across the neighborhoods.
- [x] Added story-progress tracking, nearby interaction feedback, chapter HUD,
      onboarding, and completion feedback.
- [x] Added keyboard controls: WASD/arrows, Space, Shift, and E.
- [x] Added six touch controls with pointer-safe press/release behavior.
- [x] Updated story content with AgriSense and the NLP Research Lab.
- [x] Restyled story and NPC overlays to match the spatial portfolio system.

## Verification Record

- [x] `npx tsc --noEmit`
- [x] Targeted ESLint for all modified app, component, UI, motion, and
      configuration files.
- [x] All four modified JSON data files parsed successfully.
- [x] `npm run build` completed successfully with all static pages generated.
- [x] `/`, `/fun`, and `/publication` returned HTTP 200.
- [x] Jump test observed `Airborne` followed by `Grounded`.
- [x] Mobile touch emulation exposed all six controls at 390×844.
- [x] No horizontal overflow at the tested 390px game viewport.
- [x] Desktop research and greeting visuals were inspected in headless-browser
      screenshots.
- [x] `git diff --check` passed before deployment.

## Known Non-Blocking Notes

- The repository-wide lint command still reports older `no-explicit-any` and
  related warnings in pre-existing API/database files outside this redesign.
  The modified frontend scope passes with zero warnings.
- Lighthouse scoring was not run.
- The GitHub push triggered Vercel, but the resulting production deployment was
  not independently polled after the push.

## Resume Point

The requested implementation is complete. If work resumes, begin by checking the
current Vercel deployment and live-site behavior. Any further work should be
treated as a new polish or maintenance phase rather than continuation of an
unfinished redesign.
