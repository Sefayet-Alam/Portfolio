# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`sefayet-portfolio` — a recruiter-first personal portfolio for Khandoker Sefayet Alam.
Live at **https://sefayet-alam.vercel.app/** (Vercel, auto-deploys from `main`).

Three surfaces in one Next.js app:

1. **`/`** — the portfolio itself, in this order: hero, 01 Experience, 02 Education,
   03 Skills, 04 Projects, 05 Achievements, 06 Certifications.
2. **`/fun`** — a hand-written 2D canvas "village" you walk around; houses open story overlays.
3. **"Sef-AI-yet"** — a floating chat widget backed by RAG over a MongoDB knowledge base.

Design intent: a recruiter should get the picture in 10–20 seconds. Keep the main
site minimal and fast; keep gimmicks confined to `/fun`.

## Commands

```bash
npm run dev      # next dev — http://localhost:3000
npm run build    # next build
npm start        # next start
npm run lint     # eslint (flat config, eslint-config-next)
```

There is no test suite. Verification = `npm run build` + `npm run lint` + clicking through.

## Stack

- **Next.js 16 App Router**, React 19, React Compiler enabled (`reactCompiler: true` in `next.config.ts`, `babel-plugin-react-compiler`)
- **TypeScript strict**, path aliases `@/*` → `src/*` and `@components/*` → `src/components/*`
- **Tailwind CSS v4** via `@tailwindcss/postcss` (note: both `tailwind.config.ts` and `tailwind.config.mjs` exist — v4 is CSS-first, so config files carry little weight; styling lives in `src/app/globals.css`)
- **next-themes** for dark/light (`attribute="class"`, `defaultTheme="dark"`)
- **MongoDB** (`mongodb` driver, no ODM) — knowledge base only, not a general data store
- **LangChain + Groq** (`@langchain/core`, `@langchain/groq`) for the chat assistant
- **Kaboom** is a dependency but the `/fun` village is **not** built on it — `src/components/fun/village.ts` is a from-scratch canvas renderer/game loop (~1600 lines)
- **@higgsfield/client** for AI image/video generation (uncommitted work-in-progress; see `HIGGSFIELD.md`)

## Layout

```
src/
  app/
    layout.tsx          ThemeProvider + SpatialField (bg) + CursorFx + ChatWidgetGate, wraps everything
    page.tsx            home — composes sections from portfolio.seed.json
    fun/page.tsx        full-screen village page (no header)
    publication/page.tsx
    api/
      chat/route.ts     POST — retrieve KB chunks, call Groq, return reply
      admin/route.ts    POST — reseed kb_chunks from portfolio.seed.json (token-gated in prod)
      media/route.ts    POST — Higgsfield image/video generation (UNCOMMITTED, unguarded)
  components/
    layout/             Header, Footer, SpatialField (colour wash + vignette + grain) →
                        NeuralField (canvas neural net; page scroll drives a forward
                        pass input → output with a glowing scan band, static under
                        prefers-reduced-motion, follows the theme class)
    motion/             Reveal (headings), SectionMotion (per-section card entrances:
                        slide=Experience, flip=Education, assemble=Skills, clip=Projects,
                        cascade=Achievements, deal=Certifications; one-shot .beam-run
                        border sweep on each card), PointerTilt, SmoothScroll (Lenis)
    sections/           Hero, Experience, Education, Skills, Projects, Achievements,
                        Certifications, Publications, Contact
    ui/                 ChatWidget, ChatWidgetGate, BackgroundFx, CursorFx, IntroLoader,
                        ThemeToggle, Card, Chip, Section
    fun/                FunGameClient (dynamic, ssr:false) → FunGame → village.ts,
                        plus FunOverlay / FunStoryOverlay / FunNpcOverlay
  content/
    portfolio.seed.json   SOURCE OF TRUTH for all site content
    fun.world.json        village layout: neighborhoods, stops, NPCs
    kb_chunks.seed.json
  lib/
    ai/       groq.ts (model factory), retrieve.ts (Mongo $text search), prompt.ts, seed.ts
    db/       mongo.ts (globalThis-cached client), collections.ts (kb_chunks + index setup)
    media/    higgsfield.ts (server-only, UNCOMMITTED)
    utils/    rateLimit.ts, env.ts — both currently EMPTY files
public/
  projects/ certs/ logos/ images/ Screenshots/ fun/{avatars,stories}/ resume.pdf sounds/
```

## Content changes go in JSON, not JSX

`src/content/portfolio.seed.json` drives the whole home page. To add a project,
certificate, achievement, or change contact details, edit that file and drop the
image in the matching `public/` folder. Do not hardcode content into components.

Its top-level keys: `profile`, `highlights` (achievements + publications),
`projects`, `skills`, `experience` (work + studies), `achievements`, `certifications`.

Experience / Education specifics:
- `experience.work` renders in the **Experience** section (`#experience`), most recent
  first. The "Current" badge is derived from `"Present"` in the entry's `date`.
- `experience.studies` renders in the separate **Education** section (`#education`,
  `Education.tsx`, which reuses the exported `JourneyCard` from `Experience.tsx`).
  It stays under `experience.studies` on purpose: `src/lib/ai/seed.ts` reads that
  path to build the chat KB. Current entries: RUET B.Sc. CSE, New Govt. Degree
  College (HSC), Govt. Laboratory High School (SSC).
- `logo` may be `""`; the card then shows the org's initials instead of an image.
  Logos live in `public/logos/`.
- The résumé is `public/resume.pdf` (linked via `profile.links.resume`). It is the
  source for experience/education content — update the PDF and the JSON together.

Navbar labels (`src/components/layout/Header.tsx`, `nav` array) are deliberately
formal: About, Experience, Education, Skills, Projects, Achievements, Certifications.
Each `id` must match a section `id`. Section kickers are numbered 01–06 in page
order; renumber them if a section is added or moved.

The village is driven by `src/content/fun.world.json`
(`seed`, `size`, `playerSpawn`, `neighborhoods[].stops[]`, `npcs[]`) with types
declared at the top of `src/components/fun/village.ts`. Note the README references
`public/fun/world.json` — that path is stale; the live file is in `src/content/`.

## The AI assistant

Flow: `ChatWidget` → `POST /api/chat` → `retrieveKb()` runs a MongoDB `$text`
search over `kb_chunks` (top 6) → chunks are injected as a system message
alongside `systemPrompt()` → Groq (`GROQ_MODEL`, default `openai/gpt-oss-20b`,
temp 0.2) → reply string. Last 10 messages only, for cost.

- Retrieval is **keyword text search, not embeddings**. No vector store.
- `kb_chunks` documents are upserted by key from `portfolio.seed.json` via
  `seedKbFromPortfolio()` — so updating the portfolio JSON and then calling
  `POST /api/admin` keeps the assistant in sync. That is the intended workflow.
- `src/lib/ai/prompt.ts` deliberately forbids Markdown in answers (plain `-` bullets)
  and mandates a phone/email fallback when the KB has no answer. Keep both rules
  if you touch the prompt.
- Indexes (`key` unique, plus the compound text index) are created lazily on first
  `getCollections()` call, guarded by an in-process `indexed` flag.

### Exploring the API in Swagger UI

There is no OpenAPI spec or Swagger route in the repo. For ad-hoc testing, a
throwaway Swagger UI was run outside the repo: a hand-written `openapi.json`
covering `POST /api/chat`, `/api/admin`, `/api/media`, plus a tiny Node server
on `:4000` that serves the UI and proxies `/api/*` to `TARGET` (default
`http://localhost:3000`) so there are no CORS issues. Recreate it the same way if
needed; don't add it to the app. Never "Try it out" on `/api/media` casually — it
spends paid credits. Running `/api/admin` writes to whatever DB `MONGODB_URI`
points at (may be the production Atlas DB).

## Environment

`.env.local` (git-ignored; `.env.example` is empty):

| Var | Purpose |
| --- | --- |
| `MONGODB_URI` | local `mongodb://127.0.0.1:27017/sefayet_portfolio` or an Atlas SRV string |
| `MONGODB_DB` | optional, defaults to `sefayet_portfolio` |
| `GROQ_API_KEY` | required by `/api/chat` |
| `GROQ_MODEL` | optional, defaults to `openai/gpt-oss-20b` |
| `ADMIN_TOKEN` | `x-admin-token` header for `/api/admin` — enforced **only in production** |
| `HIGGSFIELD_CREDENTIALS` | `KEY_ID:KEY_SECRET`, server-only, for `/api/media` |

`src/lib/db/mongo.ts` throws at module load if `MONGODB_URI` is missing, so any
route importing it fails hard without env. Vercel env changes need a redeploy.

## Conventions

- Server-first: components are RSC unless they need state/effects/browser APIs.
  `"use client"` is on `ChatWidget`, `ChatWidgetGate`, `CursorFx`, `BackgroundFx`,
  `IntroLoader`, `ThemeToggle`, `providers.tsx`, and everything under `fun/`.
- Named exports for components (`export function Hero`); default exports only where
  Next requires them (pages, `FunGame`, `FunGameClient`).
- Styling is Tailwind utility classes inline. Dark mode is always `dark:` paired —
  when adding a color, add its `dark:` counterpart.
- API routes return `{ ok: true, ... }` / `{ ok: false, error }` and set
  `runtime = "nodejs"` + `dynamic = "force-dynamic"`. Follow that shape.
- `src/lib/media/higgsfield.ts` is **server-only** — it throws if `window` exists.
  Never import it from a `"use client"` file.

## Known rough edges

Do not "fix" these silently; they are noted so you recognize them, and worth
raising before changing.

- **`/api/media` is unauthenticated** and each call spends paid Higgsfield credits.
  The route's own comment flags this. It should get auth + rate limiting before
  it goes anywhere near production.
- **`src/lib/utils/rateLimit.ts` and `src/lib/utils/env.ts` are empty files**, as is
  `scripts/seed.ts` and `.env.example`.
- **`/api/admin` skips the token check outside production** — fine for local dev,
  worth knowing.
- `/api/chat` and `/api/media` have no rate limiting at all.
- `sefayet-portfolio.kb_chunks.json` sits at the repo root (a Compass export) and
  duplicates `src/content/kb_chunks.seed.json`.
- Two Tailwind config files; `providers.tsx` is defined but unused (`layout.tsx`
  instantiates `ThemeProvider` directly).
- Several `any` casts in `page.tsx`, `seed.ts`, and `retrieve.ts` around the JSON
  content and Mongo `$meta` projections.

## Deployment

Push to `main` → Vercel builds and deploys. Database is MongoDB Atlas M0.
Content updates are a JSON edit + commit; KB updates additionally need
`POST /api/admin` with the `x-admin-token` header against the deployed URL.
Until that reseed runs, Sef-AI-yet answers from the old KB (e.g. it will not
know about new roles).

Do not push without the owner's explicit go-ahead for that push — verify with
`npm run build` and `npm run dev` first.
