# Available Skills & Agents

Inventory of everything Claude Code can invoke in this environment.
Generated 2026-07-27. Sources: `~/.claude/skills/`, `~/.claude/agents/`,
`~/.claude/plugins/installed_plugins.json`, and built-in tooling.

---

## 1. Subagents (`Agent` tool)

| Agent | Tools | Use for |
| --- | --- | --- |
| `claude` | all | Catch-all when nothing more specific fits |
| `general-purpose` | all | Multi-step research, open-ended code search |
| `Explore` | read-only | Broad fan-out search across many files; returns conclusions, not dumps |
| `Plan` | read-only | Architecture / implementation planning, trade-offs, critical files |
| `frontend-builder` | Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch, Skill | **Custom.** Implements React/Next + TS UI, GSAP motion, R3F 3D, Magic-MCP components to an anti-slop 60fps standard |
| `frontend-reviewer` | Read, Grep, Glob, Bash, Skill | **Custom.** Read-only audit: animation perf, a11y/reduced-motion, design quality, responsiveness, R3F/GSAP practice |
| `claude-code-guide` | Bash, Read, WebFetch, WebSearch | Questions about Claude Code, Agent SDK, Claude API, Claude in Slack |
| `statusline-setup` | Read, Edit | Configure the status line |

The two custom agents (`frontend-builder`, `frontend-reviewer`) live in
`~/.claude/agents/` and are the most relevant pair for this portfolio repo.

---

## 2. Installed plugins

| Plugin | Version | Scope |
| --- | --- | --- |
| `superpowers@claude-plugins-official` | 6.2.0 | user |
| `superpowers@superpowers-marketplace` | 6.0.3 | user |
| `skill-creator@claude-plugins-official` | — | project (`/Users/sefayet`) |
| `frontend-design@claude-plugins-official` | — | user |
| `context-mode@context-mode` | 1.0.166 | user |
| `claude-mem@thedotmack` | 13.8.0 | user |
| `agents-observe@agents-observe` | 0.9.11 | user |

Marketplaces: `claude-plugins-official`, `superpowers-marketplace`,
`context-mode`, `thedotmack`, `agents-observe`.

---

## 3. Superpowers skills (process — highest priority)

Per the global `CLAUDE.md`, superpowers skills take precedence over
domain-specific skills.

| Skill | Use for |
| --- | --- |
| `superpowers:using-superpowers` | Meta: how to find and invoke skills |
| `superpowers:brainstorming` | Explore intent & requirements **before** any creative work |
| `superpowers:writing-plans` | Write a detailed implementation plan |
| `superpowers:executing-plans` | Execute a written plan in a separate session with checkpoints |
| `superpowers:subagent-driven-development` | Execute independent plan tasks in the current session |
| `superpowers:dispatching-parallel-agents` | Parallelize independent work |
| `superpowers:using-git-worktrees` | Parallel branch dev without conflicts |
| `superpowers:systematic-debugging` | Structured, hypothesis-driven bug fixing |
| `superpowers:test-driven-development` | TDD loop |
| `superpowers:verification-before-completion` | Final sanity check before claiming done |
| `superpowers:requesting-code-review` | Submit work for review |
| `superpowers:receiving-code-review` | Process review feedback |
| `superpowers:finishing-a-development-branch` | Pre-PR checklist |
| `superpowers:writing-skills` | Author new skills |

---

## 4. Frontend, design & motion

**Design taste / visual quality**

| Skill | Use for |
| --- | --- |
| `design-taste-frontend` | Anti-slop landing pages, portfolios, redesigns (v2, current default) |
| `design-taste-frontend-v1` | Original v1, for backward compatibility only |
| `frontend-design` / `frontend-design:frontend-design` | Aesthetic direction, typography, non-templated choices |
| `high-end-visual-design` | Agency-grade fonts, spacing, shadows, cards, animation |
| `ui-ux-pro-max` | 50+ styles, 161 palettes, 57 font pairings, 99 UX guidelines, 25 chart types across 10 stacks |
| `gpt-taste` | Randomized layout variance, AIDA structure, editorial typography, strict GSAP ScrollTriggers |
| `minimalist-ui` | Minimalist aesthetic |
| `industrial-brutalist-ui` | Brutalist aesthetic |
| `stitch-design-taste` | Alternate taste system |
| `redesign-existing-projects` | Structured redesign of an existing app |
| `image-to-code` | Generate design images first, then implement to match |
| `imagegen-frontend-web` / `imagegen-frontend-mobile` | Image-driven frontend generation |
| `ckm-ui-styling` | shadcn/ui + Radix + Tailwind, theming, dark mode, accessible components |
| `dataviz` | **Read before writing any chart code** — charts, dashboards, palettes, stat tiles |

**Animation & motion**

| Skill | Use for |
| --- | --- |
| `gsap-core` | `gsap.to/from/fromTo`, easing, stagger, `matchMedia`, reduced motion |
| `gsap-timeline` | Sequencing, position parameter, nesting, playback |
| `gsap-scrolltrigger` | Scroll-linked animation, pinning, scrub, parallax |
| `gsap-performance` | Transform-first, avoid layout thrash, `will-change`, 60fps |
| `framer-motion-animator` | Page transitions, gestures, scroll animation, micro-interactions |
| `improve-animations` | Read-only motion audit + implementation plans for other agents |
| `review-animations` | Review animation code |
| `animation-vocabulary` | Reverse lookup: describe a motion effect → get its real name |
| `flutter-animations` | Flutter implicit/explicit/Hero/staggered animation |

**React Three Fiber (3D)** — load `r3f-fundamentals` first, then as the scene needs:
`r3f-animation`, `r3f-shaders`, `r3f-lighting`, `r3f-materials`,
`r3f-postprocessing`, `r3f-geometry`, `r3f-physics`, `r3f-interaction`,
`r3f-loaders`, `r3f-textures`.

---

## 5. Frameworks & languages

**Web frameworks**

`react-expert` · `nextjs-developer` · `vue-expert` · `vue-expert-js` ·
`angular-architect` · `svelte` (via `ui-ux-pro-max` stacks) · `rails-expert` ·
`laravel-specialist` · `django-expert` · `fastapi-expert` · `nestjs-expert` ·
`spring-boot-engineer` · `dotnet-core-expert` · `wordpress-pro` ·
`shopify-expert` · `salesforce-developer`

**Languages**

`typescript-pro` · `javascript-pro` · `python-pro` · `golang-pro` ·
`rust-engineer` · `cpp-pro` · `java-architect` · `kotlin-specialist` ·
`swift-expert` · `csharp-developer` · `php-pro` · `sql-pro`

**Mobile / game / embedded**

`react-native-expert` · `flutter-expert` · `game-developer` · `embedded-systems`

**Data**

`pandas-pro` · `spark-engineer` · `postgres-pro` · `database-optimizer`

---

## 6. AI / LLM

| Skill | Use for |
| --- | --- |
| `claude-api` | **Read before touching any Claude/Anthropic code** — model IDs, pricing, params, streaming, tool use, caching |
| `langchain-expert` | LangChain chains, tools, integrations |
| `langgraph-expert` | LangGraph stateful agent workflows |
| `rag-architect` | RAG pipelines, vector stores, retrieval strategy |
| `prompt-engineer` | Prompt design & optimization |
| `fine-tuning-expert` | LoRA/QLoRA, PEFT, dataset prep, DPO/RLHF |
| `ml-pipeline` | ML/LLM workflow design |
| `mcp-developer` | Build MCP servers |

Directly relevant to this repo: `langchain-expert` and `rag-architect` for the
Sef-AI-yet assistant, `prompt-engineer` for `src/lib/ai/prompt.ts`.

---

## 7. Architecture, API & infra

`architecture-designer` · `api-designer` · `graphql-architect` ·
`microservices-architect` · `websocket-engineer` · `cloud-architect` ·
`devops-engineer` · `kubernetes-specialist` · `terraform-engineer` ·
`sre-engineer` · `monitoring-expert` · `chaos-engineer` · `cli-developer` ·
`legacy-modernizer` · `fullstack-guardian`

---

## 8. Quality, review & security

| Skill | Use for |
| --- | --- |
| `code-reviewer` | Broad PR review: correctness, perf, maintainability, test coverage |
| `security-reviewer` | Security-focused review |
| `secure-code-guardian` | Security audit before shipping |
| `debugging-wizard` | Stack traces, log correlation, root cause |
| `test-master` | Test suite design |
| `playwright-expert` | E2E browser tests |
| `code-documenter` | Docstrings, OpenAPI/JSDoc, doc portals |
| `spec-miner` | Extract specs from existing code |
| `feature-forge` | Requirements workshops, user stories, EARS specs, acceptance criteria |
| `simplify` | Apply reuse/simplification/efficiency cleanups to changed code |
| `review` / `security-review` | Built-in review commands |
| `full-output-enforcement` | Ban truncation/placeholders in generated output |
| `karpathy-guidelines` | Coding-style guidelines |
| `the-fool` | Contrarian/adversarial perspective |

---

## 9. Brand, content & presentation

`ckm-design` (logos, CIP, mockups, slides, banners, icons, social) ·
`ckm-design-system` (three-layer tokens) · `ckm-brand` (voice, identity,
messaging) · `ckm-slides` (HTML decks with Chart.js) · `ckm-banner-design` ·
`brandkit` (premium brand-guideline boards)

---

## 10. Tooling & harness

| Skill | Use for |
| --- | --- |
| `init` | Generate `CLAUDE.md` (used to produce this repo's) |
| `skill-creator` | Author new skills |
| `find-skills` | Discover & install skills |
| `update-config` | Edit `settings.json` — hooks, permissions, env vars |
| `keybindings-help` | Customize `~/.claude/keybindings.json` |
| `fewer-permission-prompts` | Build a project allowlist from transcript history |
| `run` | Launch/drive this project's app to verify a change |
| `loop` | Run a prompt on a recurring interval |
| `schedule` | Cron-scheduled cloud agents |
| `artifact-design` | **Required before publishing any Artifact** |
| `artifact-capabilities` | Runtime capabilities for published Artifact pages |
| `claude-in-chrome` | **Required before any `mcp__claude-in-chrome__*` call** — browser automation |
| `atlassian-mcp` | Jira/Confluence via MCP |

**context-mode** (context-window protection):
`context-mode:context-mode` · `ctx-search` · `ctx-index` · `ctx-insight` ·
`ctx-stats` · `ctx-doctor` · `ctx-purge` · `ctx-upgrade`

**claude-mem** (persistent memory):
`claude-mem:learn-codebase` · `mem-search` · `smart-explore` · `pathfinder` ·
`knowledge-agent` · `make-plan` · `do` · `babysit` · `standup` ·
`timeline-report` · `weekly-digests` · `oh-my-issues` · `what-the` ·
`design-is` · `how-it-works` · `version-bump` · `wowerpoint`

**agents-observe**: `agents-observe:observe` — dashboard & server management.

---

## 11. MCP servers connected

| Server | Provides |
| --- | --- |
| `claude-in-chrome` | Browser automation — navigate, click, forms, screenshots, console/network logs, GIF recording |
| `claude_ai_Vercel` | Deployments, build logs, runtime errors/logs, web analytics, domains — **directly useful for the live site** |
| `claude_ai_Gmail` | Read/search threads, drafts, labels |
| `claude_ai_Google_Drive` | Search/read/create files |
| `claude_ai_Whimsical` | Flowcharts, mind maps, sequence diagrams, wireframes, boards, docs |
| `claude_ai_Hugging_Face` | Hub repo search/details, HF filesystem, spaces |
| `claude_ai_Mermaid_Chart`, `claude_ai_Excalidraw`, `claude_ai_tldraw` | Diagramming (require auth) |
| `magic` | 21st.dev component generation, logo search, component catalog |
| `ide` | Diagnostics, execute code |
| `plugin_context-mode` | Sandboxed batch execute, search, fetch-and-index |
| `plugin_claude-mem` | Memory & observation search, corpora, timeline |

---

## Recommended routing for *this* repo

| Task | Route |
| --- | --- |
| Any feature idea | `superpowers:brainstorming` → `superpowers:writing-plans` |
| Portfolio UI work | `frontend-builder` agent → `frontend-reviewer` agent |
| Visual polish / redesign | `design-taste-frontend` + `high-end-visual-design` |
| Next.js / React changes | `nextjs-developer`, `react-expert`, `typescript-pro` |
| Sef-AI-yet assistant | `rag-architect`, `langchain-expert`, `prompt-engineer` |
| MongoDB / retrieval perf | `database-optimizer` |
| `/fun` village (canvas) | `game-developer`, `gsap-performance` |
| Securing `/api/media` & `/api/chat` | `secure-code-guardian`, `security-reviewer` |
| Live-site debugging | `claude_ai_Vercel` MCP (runtime logs, build logs) |
| Before shipping | `superpowers:verification-before-completion` |

> Per the global `CLAUDE.md`: **ask before auto-loading any skill**, and answer
> simple questions directly without loading one.
