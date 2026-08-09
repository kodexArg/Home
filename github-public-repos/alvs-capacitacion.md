---
id: "alvs-capacitacion"
title: "ALVS Capacitación IA — interactive Astro presentation and executive workshop kit"
visibility: public
importance: normal
source_repo: "alvs-capacitacion"
org: "kodexArg"
default_branch: "main"
primary_language: "Astro"
repo_kind: "application"
status: "active"
related: []
tags:
  - "astro"
  - "tailwind"
  - "alpinejs"
  - "aws-amplify"
  - "presentation"
  - "training"
  - "ai-literacy"
  - "executive-education"
  - "claude"
  - "prompting"
  - "alvs"
  - "static-site"
  - "agent-skills"
problems_solved:
  - "Senior executives at ALVS Group lack a shared mental model for generative AI, prompting discipline, and data-governance rules—generic slide decks and ad-hoc demos fail to anchor decisions to real workflows."
  - "An internal instructor must deliver a high-stakes half-day workshop without a professional training background; they need minute-by-minute scripts, pre-built prompts, research briefs, and failure-recovery playbooks—not just a PowerPoint export."
  - "In-room AI literacy sessions need a branded, keyboard-driven presentation surface that works on a single instructor monitor, supports progressive reveal, and deploys as static HTML without standing up a backend."
technologies:
  - "Astro 6 (static output)"
  - "Tailwind CSS 4 (@tailwindcss/vite)"
  - "Alpine.js 3 (CDN deck controller)"
  - "TypeScript (tsconfig, Astro components)"
  - "Node.js >= 22.12"
  - "AWS Amplify Hosting (amplify.yml)"
  - "Agent skills: astro, amplify-workflow, frontend-design"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ALVS Capacitación IA

> **Problem thesis (required):** This repository packages everything needed to run an AI literacy workshop for ALVS Group senior leadership: a branded Astro slide deck for the room, exhaustive instructor cue cards, chapter scripts, research briefs, and copy-paste prompts. It exists because four executives with decision power but near-zero AI background need a structured, Socratic half-day—not a generic vendor deck—and because the instructor (an internal systems lead, not a professional trainer) must walk in with turn-key materials, live-demo contingencies, and governance framing ready. The Astro app is the presentation shell; the markdown corpus in `capitulos/`, `plan/`, and `research/` is the pedagogical engine.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/alvs-capacitacion` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Interactive ALVS-branded Astro presentation plus a complete executive AI workshop kit—scripts, prompts, research, and slide components—for internal capacitación. |
| Audience | Primary: ALVS Group senior executives (~4 decision-makers in the designed workshop). Secondary: the internal instructor / systems lead who operates the keyboard and directs live demos. Tertiary: AI agents maintaining the deck and curriculum via `.claude/` and `.agents/` skill trees. |

## 2. Problems it solves

### P1 — Executive AI literacy without technical prerequisites

- **Who hurts:** Jefes and alta dirección at ALVS Group—high decision authority, heavy dashboard consumers, minimal prior exposure to LLMs, prompting, or corporate AI governance.
- **Pain today:** AI is discussed in boardrooms as hype, threat, or magic box. Leaders cannot distinguish prediction from reasoning, cannot evaluate vendor claims, and cannot articulate what data must never enter a public chatbot. One-shot vendor demos do not connect to their Excel-and-email reality.
- **How this repo answers:** A six-chapter curriculum (`capitulos/01-hook.md` through `capitulos/06-gobernanza-cierre.md`) installs a minimal mental model ("brilliant intern who read the internet but hallucinates with confidence"), teaches the CQR prompting framework (Contexto / Consulta / Resultado), runs a live Excel-to-dashboard demo with Claude Artifacts, builds per-role system prompts, and closes with governance, objection handling, and a 90-day pilot proposal. Research briefs (`research/01-pedagogia-adultos.md` through `research/04-hallazgos-clave-v2.md`) ground choices in andragogy and April 2026 tool realities.
- **Out of scope:** Hands-on practice on attendees' own laptops (format is instructor-operated monitor), deep automation tooling (Zapier/n8n explicitly deferred), or certifying participants as prompt engineers.

### P2 — Instructor preparation burden for a live, failure-prone demo format

- **Who hurts:** The internal instructor delivering the session—explicitly not a professional capacitador but the company's systems lead (`plan/00-plan-maestro.md`, `answers.md`).
- **Pain today:** Live AI demos fail unpredictably (hallucinations, rate limits, artifact render errors, messy production Excel files). Without scripts, the instructor improvises under pressure and loses credibility with skeptical executives.
- **How this repo answers:** `capitulos/00-guion-minuto-a-minuto.md` provides anchor phrases and screen actions for every five-minute block from 10:00–14:00. `capitulos/00-prompts-prearmados.md` holds copy-paste prompts for the opening failure demo, CQR comparisons, Excel analysis, dashboard generation, and system-prompt templates. `research/04-hallazgos-clave-v2.md` documents artifact failure modes and recovery lines. `capitulos/04-datos-excel.md` includes a mandatory 60-minute pre-workshop checklist (simplify Excel, test upload, screenshot backup, disable ad blockers).
- **Out of scope:** Automated demo orchestration, LMS integration, or attendee assessment scoring.

### P3 — Branded in-room presentation infrastructure

- **Who hurts:** Anyone presenting AI content on a corporate monitor who needs fullscreen keyboard navigation, ALVS visual identity, and slide components reusable across workshop iterations.
- **Pain today:** PowerPoint exports are static; reveal animations and logo grids for vendor landscapes are tedious to maintain; deploying a deck to a shareable URL requires ad-hoc hosting choices.
- **How this repo answers:** `src/layouts/Presentation.astro` implements a single-page deck with Alpine.js: arrow keys, space, and swipe advance slides; `F` toggles fullscreen; a progress bar and slide counter persist. Slide components (`Cover`, `Content`, `Stat`, `Closing`) accept props for titles, accent highlighting, KPI stats, and closing contact. `src/styles/global.css` defines the ALVS palette (dark navy, cyan accent, Space Grotesk typography) via Tailwind v4 `@theme`. `amplify.yml` builds static output to `dist/` for AWS Amplify Hosting. `PLAN-PROPUESTA.md` specifies four additional components (`Pause`, `Takeaway`, `LogoGrid`, `Flow`) and a `data-fragment` progressive-reveal feature for a 21-slide "El presente de la AI" narrative—roadmap beyond the current minimal `index.astro`.
- **Out of scope:** Multi-user collaboration, presenter notes synced to attendee devices, or server-side analytics on slide views.

## 3. Product / idea

The repository is a **dual-layer product**: (1) a static Astro presentation app and (2) a markdown-based workshop operating system.

**Layer 1 — Astro deck:** `astro.config.mjs` sets `output: 'static'`. `src/pages/index.astro` composes slides inside `Presentation.astro` via Astro's slot pattern. Each slide is a `<section data-slide>`; the Alpine `deck()` controller shows one active slide, hides exited slides, and supports touch swipe. Current shipped deck has five slides (cover, agenda, stat, strengths grid, closing). Brand tokens live in CSS variables; Tailwind utility classes handle responsive typography with `clamp()`-based slide font sizes.

**Layer 2 — Workshop corpus:** `plan/00-plan-maestro.md` is the authoritative 4-hour schedule (hook → mental model + tool tour → CQR → Excel/dashboard star demo → system prompts → governance). `answers.md` captures the design questionnaire (audience of four executives, Spanish rioplatense, Claude Desktop primary, instructor-only keyboard). `capitulos/` expands each block into facilitator-ready prose. `research/` holds synthesized briefs on adult learning, curriculum design, tool selection, and executive objections. `PLAN-PROPUESTA.md` is a parallel, more ambitious 21-slide keynote script ("El presente de la AI") with vendor logo grids and speaker warnings about fast-moving model names—intended to extend the Astro component library.

**Mental model for the whole repo:** clone → `npm install` → `npm run dev` to iterate slides; read `plan/` and `capitulos/` to run the workshop; deploy `dist/` via Amplify for a stable presentation URL in the training room.

### 3.1 North-star use cases

1. **Workshop day:** Instructor opens Claude Desktop tabs, follows `00-guion-minuto-a-minuto.md`, runs the Excel dashboard wow moment, and each executive leaves with a personalized system prompt saved in a Claude Project.
2. **Deck iteration:** Developer or agent edits `src/components/slides/` and `index.astro`, previews locally, pushes to Amplify for the next capacitación session.
3. **Agent-assisted maintenance:** `.claude/skills/astro` guides Astro changes; `frontend-design` steers distinctive UI; `amplify-workflow` documents Amplify deploy phases if backend is ever added (currently frontend-only static hosting).

### 3.2 Non-goals

- Not a general-purpose LMS or course marketplace.
- Not hands-on attendee laptops—the Socratic format keeps executives in director role while the instructor types (`answers.md` Block A4).
- Not deep coverage of automation platforms (explicitly scoped out in `PLAN-PROPUESTA.md` slide S12).
- Root `README.md` is still the Astro minimal starter template—not project-specific documentation; real intent lives in `plan/`, `capitulos/`, and `answers.md`.

## 4. Technology stack

Derived from manifests and tree structure only (no lockfile dump).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node.js >= 22.12 | `package.json` engines, `.nvmrc` |
| Frontend framework | Astro 6.1.x, static SSG | `package.json`, `astro.config.mjs` |
| Styling | Tailwind CSS 4 via Vite plugin | `package.json`, `src/styles/global.css` |
| Client interactivity | Alpine.js 3 (CDN, deck controller) | `src/layouts/Presentation.astro` |
| TypeScript | Strict project config | `tsconfig.json` |
| Icons / assets | SVG brand icons (AI vendors, UI glyphs) | `src/assets/icons/` |
| Infra / deploy | AWS Amplify Hosting (static `dist/`) | `amplify.yml` |
| AI / agents | Claude-oriented workshop content; agent skills for Astro, Amplify, frontend design | `.claude/`, `.agents/`, `skills/`, `skills-lock.json` |
| Tests | None evident | no test config in tree |

### 4.1 Notable dependencies (curated)

- `astro` — static site generator; all slides are `.astro` components compiled to HTML.
- `@tailwindcss/vite` + `tailwindcss` — v4 theme tokens for ALVS brand colors and slide typography scale.
- Alpine.js (CDN, not npm) — lightweight state for slide index, fullscreen, and touch navigation without a heavy JS framework.
- Agent skills (`astro`, `amplify-workflow`, `frontend-design`) — pinned in `skills-lock.json` from upstream GitHub skill packs; duplicated under `.claude/`, `.agents/`, and `skills/` for multi-tool agent compatibility.

## 5. Repository map (abstraction)

- **Entrypoints:** `src/pages/index.astro` (sole route, `/`); `package.json` scripts `dev`, `build`, `preview`.
- **Presentation shell:** `src/layouts/Presentation.astro` — HTML document, Alpine deck, progress UI, keyboard bindings.
- **Slide components:** `src/components/slides/` — `Cover.astro`, `Content.astro`, `Stat.astro`, `Closing.astro` (implemented); `Pause`, `Takeaway`, `LogoGrid`, `Flow` specified in `PLAN-PROPUESTA.md` but not yet in tree.
- **Styling:** `src/styles/global.css` — Tailwind import, `@theme` brand palette, slide layout CSS.
- **Static assets:** `public/` favicons; `src/assets/icons/` extensive SVG set for AI vendor and UI icon grids planned in the 21-slide deck.
- **Workshop curriculum:** `capitulos/` — per-chapter facilitator guides plus `00-guion-minuto-a-minuto.md` and `00-prompts-prearmados.md`.
- **Planning & design intake:** `plan/00-plan-maestro.md`, `answers.md`, `PLAN-PROPUESTA.md`.
- **Research vault:** `research/` — four synthesized briefs (pedagogy, curriculum, tools/demos, executive findings).
- **Agent scaffolding:** `.claude/skills/`, `.agents/skills/`, `skills/` (mirrored), `skills-lock.json`.
- **Deploy contract:** `amplify.yml` — `npm ci`, `npm run build`, artifact `dist/**`.
- **Generated / vendor:** `node_modules/`, `dist/`, `.astro/` — gitignored; not ingested.

**`.docs/` scan:** not present in repository.

## 6. Configuration & contracts (no secrets)

- **Node engine:** `>=22.12.0` per `package.json`; `.nvmrc` pins `22`.
- **Astro:** `output: 'static'` — no SSR adapter, no server routes. Vite plugin registers Tailwind only.
- **Amplify build:** preBuild `npm ci`, build `npm run build`, publish `dist/` with `node_modules` cache path.
- **Environment variables:** `.gitignore` excludes `.env` and `.env.production`; no env-driven feature flags in committed config. Workshop content references external AI tools (Claude, ChatGPT, Gemini, etc.) via browser sessions—not via API keys in this repo.
- **Brand tokens:** CSS custom properties `--color-alvs-*` and `--text-slide-*` in `global.css`; no secrets.

### 6.1 HTTP / API endpoints (when applicable)

This repository produces a **static site with no server-side HTTP API**. There are no Workers, Django routes, or OpenAPI specs.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| N/A | N/A | Static HTML/CSS/JS only; all routes are prerendered files under `dist/` after build | none |

The built site is a single-page presentation (`index.html`); navigation is client-side via Alpine slide index, not URL routing.

### 6.2 Other interfaces

- **CLI:** `npm run dev` (local dev server, default Astro port 4321 per starter README), `npm run build`, `npm run preview`, `npm run astro` for Astro CLI passthrough.
- **Deck keyboard contract:** Right arrow / Space → next slide; Left arrow → previous; `F` → fullscreen toggle; touch swipe horizontal >50px threshold.
- **Planned fragment contract:** `PLAN-PROPUESTA.md` requires `[data-fragment]` elements revealed by `next()` before advancing slides—**not yet implemented** in current `Presentation.astro` (only whole-slide navigation exists).
- **Workshop tool surface (external):** Instructor operates Claude Desktop, browser tabs for competing chat tools, and local Excel files—these are documented in `capitulos/` but are not interfaces exposed by this repo's code.

## 7. Data & persistence

- **In-repo stores:** None. No database, KV, or vector index.
- **Runtime data:** Slide content is hardcoded in `index.astro` props and markdown files; workshop prompts live in `capitulos/00-prompts-prearmados.md`.
- **Workshop demo data:** Excel files for live demos are **not committed** (prepared ad hoc, anonymized, per `capitulos/04-datos-excel.md` checklist); instructors supply their own `.xlsx` at session time.
- **Deploy artifact:** `dist/` static files on AWS Amplify CDN edge; no server-side persistence.
- **Claude Projects / Artifacts:** Used during the workshop for system prompts and dashboards—state lives in Anthropic's product, not in this repository.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **Root README** (`README.md`) — Astro minimal starter boilerplate only; does not describe ALVS workshop purpose. Evidence: `README.md`.
2. **Design questionnaire** (`answers.md`) — audience size (~4 executives), modality (instructor monitor only), Claude Desktop primary, CQR framework, deliverables checklist. Evidence: `answers.md`.
3. **Master plan** (`plan/00-plan-maestro.md`) — 4-hour schedule, Socratic principle, chapter objectives, artifact production table, pre-workshop checklist. Evidence: `plan/00-plan-maestro.md`.
4. **Slide deck proposal** (`PLAN-PROPUESTA.md`) — 21-slide "El presente de la AI" script, new component specs, fragment feature requirement, speaker warnings. Evidence: `PLAN-PROPUESTA.md`.
5. **Chapter corpus** (`capitulos/*.md`) — facilitator scripts for hook, mental model, CQR, Excel/dashboard, system prompts, governance; minute-by-minute guion and pre-built prompts. Evidence: `capitulos/`.
6. **Research briefs** (`research/*.md`) — andragogy, AI literacy curriculum, tool comparison, executive objections and demo recovery. Evidence: `research/`.
7. **`.claude/` and `.agents/`** — three skills mirrored: `astro` (Astro CLI, project structure, adapters), `amplify-workflow` (Amplify Gen 2 phased backend/frontend/deploy orchestration with prereq script), `frontend-design` (distinctive UI aesthetics, anti-generic-AI-slop guidance). Evidence: `.claude/skills/`, `.agents/skills/`, `skills-lock.json`.
8. **`.docs/`** — directory not found; scan attempted, nothing to summarize.

### Agent conventions (from `.claude/skills/`)

- **astro:** Consult official Astro docs for API changes; `src/pages` is required for routes; static deploy needs no adapter unless SSR is added later.
- **amplify-workflow:** Run `scripts/prereq-check.sh` before Amplify work; phase-gated plan (backend → sandbox → frontend → production); stop if AWS credentials missing. Relevant if the project grows beyond static hosting.
- **frontend-design:** Commit to bold aesthetic direction; avoid generic Inter/purple-gradient tropes; match complexity to vision—note tension with current Space Grotesk choice in `global.css`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public GitHub repo; workshop content discusses corporate AI governance and mentions ALVS Group branding—no private credentials committed.
- **Auth model:** The Astro app has no authentication. Workshop governance content teaches executives what never to paste into public chatbots (`capitulos/06-gobernanza-cierre.md`).
- **Data handling in curriculum:** Emphasizes Claude's default no-training-on-data vs ChatGPT/Gemini opt-out requirements; Copilot M365 tenant isolation for in-file Excel work (`research/04-hallazgos-clave-v2.md`).
- **This summary:** Contains no secrets, API keys, `.env` values, or live connection strings. Contact email appears in `index.astro` `Closing` props but is omitted here per RAG hygiene.

## 10. Operational picture

- **Local dev:** `npm install` (or `bun install` per org conventions elsewhere), `npm run dev` — Astro dev server for slide editing.
- **Production build:** `npm run build` → `./dist/`; `npm run preview` for local static preview.
- **Deploy:** AWS Amplify per `amplify.yml` (Git-connected CI assumed; no `.github/workflows` in repo). Phases: `npm ci`, `npm run build`, publish `dist/**`.
- **Workshop runbook:** Instructor prepares 60 minutes ahead per `capitulos/04-datos-excel.md`; opens browser tabs listed in `plan/00-plan-maestro.md` checklist; follows `00-guion-minuto-a-minuto.md` on a single notebook connected to room monitor.
- **Hardware:** Standard instructor laptop + external monitor; no GPU or edge-device requirements for the Astro app itself. Curriculum discusses local LLMs (Ollama, LM Studio) as optional executive takeaway in `PLAN-PROPUESTA.md`, not as repo runtime deps.

## 11. Open questions / unknowns

- **Deck vs workshop alignment:** `index.astro` ships a short generic ALVS deck; `PLAN-PROPUESTA.md` describes a much larger 21-slide narrative with four unbuilt components and fragment navigation—implementation gap unknown (intentional phased delivery vs stale plan).
- **Amplify app URL:** Hosting target is evident from `amplify.yml` but no committed Amplify app identifier or branch mapping in tree.
- **CI/CD:** No GitHub Actions workflow in repo; deploy trigger mechanism (Amplify console connect vs external pipeline) not documented in committed files.
- **Copilot demo status:** `research/04-hallazgos-clave-v2.md` and `plan/00-plan-maestro.md` v2 elevate Copilot M365 to co-protagonist; `00-guion-minuto-a-minuto.md` still lists Copilot as "mention only, not demo" in one row—internal doc version drift.
- **Package manager:** `amplify.yml` and README use `npm`; sibling kodexArg repos often standardize on `bun`—no conflict resolution documented here.
- **Primary language on GitHub:** Listed as Astro; substantial markdown corpus is Spanish instructional content—not reflected in GitHub language stats.
