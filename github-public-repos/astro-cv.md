---
id: "astro-cv"
title: "astro-cv — Astro static CV/resume site replacing the legacy SvelteKit portfolio"
visibility: public
importance: normal
source_repo: "astro-cv"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "experimental"
related: []
tags: ["astro", "cv", "resume", "portfolio", "static-site", "tailwindcss", "flowbite", "github-pages", "typescript", "multi-agent", "accessibility", "i18n", "print-css"]
problems_solved:
  - "A personal CV site built on SvelteKit carries framework and deployment complexity that is disproportionate to a mostly static resume — operators need a leaner static-site rebuild with the same visual identity."
  - "CV content embedded in UI components becomes painful to update, translate, and reuse — the site needs a content-driven architecture where profile, experience, skills, and projects live in structured data files decoupled from layout."
  - "Parallel AI-assisted development on a polished public-facing site requires agent scaffolding from day one — conventions, skills, and deployment specs must be present before components land."
technologies:
  - "Astro 6"
  - "Tailwind CSS 4"
  - "Flowbite 4"
  - "TypeScript (strict Astro tsconfig)"
  - "Node.js >= 22.12"
  - "Google Fonts (Oswald, Source Sans Pro, Lato)"
  - "Font Awesome 6 (CDN)"
  - "GitHub Pages (planned via GitHub Actions)"
  - "Agent skills lockfile (skills-lock.json)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# astro-cv

> **Problem thesis (required):** astro-cv exists to rebuild Gabriel Cavedal's personal CV/resume as a modern **static Astro site** that replaces an older SvelteKit implementation while preserving its distinctive two-column Fibonacci layout, mate/pullover color palettes, print-ready styling, and interactive sidebar skill tree. The repository attacks three pains at once: framework weight for a mostly-static document, content trapped inside components, and the need for a multi-agent AI workflow with pre-installed skills and a written constitution (`CLAUDE.md`) before feature work begins. At the time of this summary the codebase is still in **Phase 0 (foundation)** — Astro and Tailwind are initialized, global theme tokens exist, and a placeholder home page renders name and title; the planned data layer, components, CI deploy, and full content port are not yet present.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/astro-cv` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | CV/Resume site built with Astro — a static, content-driven rebuild of Gabriel Cavedal's portfolio CV with GitHub Pages deployment and multi-agent development scaffolding. |
| Audience | Gabriel Cavedal (site owner and primary author); visitors seeking a professional CV; AI coding agents (Claude Code and similar) working in parallel on components and content; future operators maintaining structured CV data without touching layout code. |

## 2. Problems it solves

### P1 — SvelteKit is heavier than a static CV needs

- **Who hurts:** The CV owner and anyone maintaining a personal resume site that changes infrequently but must stay visually polished and deploy reliably.
- **Pain today:** The prior SvelteKit CV couples runtime framework concerns (hydration, adapter config, client bundles) to what is fundamentally a printable document with light interactivity (sidebar toggle, skill tree collapse, maximize mode). That raises build complexity and migration friction for a site whose primary job is to present structured career data.
- **How this repo answers:** Rebuild on **Astro with static output** — pages compile to HTML/CSS with minimal client JavaScript (Flowbite loaded inline for planned interactive controls). `astro.config.mjs` uses default static behavior with Tailwind via the Vite plugin. Deployment target is GitHub Pages (workflow planned, not yet committed).
- **Out of scope:** A dynamic CMS, authenticated admin panel, server-side rendering for personalized views, or replicating a full application shell.

### P2 — CV content locked inside components

- **Who hurts:** The author updating experience entries, certifications, or project metadata; future i18n work for Spanish/English toggles; agents tasked with content edits without breaking layout.
- **Pain today:** In the legacy SvelteKit CV, career data lives inside component markup. Adding a project or certification requires editing UI files, increasing diff noise and merge conflicts when multiple agents work in parallel.
- **How this repo answers:** `CLAUDE.md` defines a **content-driven architecture** — all CV data will live under `src/data/` as structured TypeScript/JSON/YAML modules (`profile.ts`, `experience.ts`, `education.ts`, `skills.ts`, `projects.ts`). Components become pure presenters. This directory does not exist in the tree yet; porting content from SvelteKit is an explicit Phase 0 checklist item.
- **Out of scope:** A headless CMS integration, database-backed CV, or real-time collaborative editing.

### P3 — Multi-agent development needs scaffolding before features

- **Who hurts:** AI agents and human reviewers coordinating parallel feature branches for layout, sidebar, print CSS, accessibility, and deployment.
- **Pain today:** Starting a greenfield UI repo without agent instructions leads to inconsistent conventions, missed a11y/i18n requirements, and ad-hoc CI specs.
- **How this repo answers:** `CLAUDE.md` acts as the project constitution (goals, design reference, phased plan, deployment requirements). Three mirrored agent skill trees (`.claude/`, `.agents/`, `.agent/`) ship seven locked skills via `skills-lock.json`: Astro usage, Tailwind patterns, accessibility, i18n localization, GitHub Actions workflow specification, technical writing, and TypeScript best practices. Workflow spec: feature branches per component, isolated worktrees when possible, main context coordinates reviews.
- **Out of scope:** A general-purpose agent framework; runtime MCP servers inside the CV site itself.

## 3. Product / idea

astro-cv is a **single-page static CV** (primary route: `src/pages/index.astro`) designed to look like an A4 paper document floating on a fixed gradient background. The mental model is: **structured data → Astro components → static HTML**, with optional light client interactivity for sidebar/skill-tree UX and print CSS for PDF-friendly output.

### Planned layout architecture (from `CLAUDE.md`)

```
┌─────────────────────────────────────────────┐
│  Gradient background (#B8BAB7 → mate-300)   │
│  ┌───────────────────────────────────────┐  │
│  │  A4 paper container (shadow, max-width) │  │
│  │  ┌──────────┬────────────────────────┐ │  │
│  │  │ Sidebar  │ Main content           │ │  │
│  │  │ (fib-5)  │ (fib-8)                │ │  │
│  │  │ Avatar   │ Title, contact, about  │ │  │
│  │  │ Skill    │ Experience, education  │ │  │
│  │  │ tree     │ Projects, footer       │ │  │
│  │  └──────────┴────────────────────────┘ │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Design tokens already implemented** in `src/styles/global.css`: mate and pullover color scales (50–900), custom font families (Oswald headings, Source Sans Pro body, Lato general), and Fibonacci width variables (`--width-fib-5` ≈ 38.46%, `--width-fib-8` ≈ 61.54%). **Interactive behaviors planned:** maximize toggle, sidebar toggle, collapsible three-level skill tree, responsive auto-maximize below 1024px, sidebar hidden below 768px.

### Current implementation state

The live tree is a **minimal Astro starter** plus early styling:

- `src/pages/index.astro` — Spanish `lang`, placeholder `<main>` with name "Gabriel Cavedal" and title "Lider Tecnico de Soporte e Infraestructura IT", Flowbite script from CDN.
- `src/styles/global.css` — Tailwind 4 `@theme` block, Flowbite plugin, font and icon CDN imports.
- `public/` — `favicon.svg`, `favicon.ico` only (planned `gabriel-cavedal.jpg`, `favicon.png` not yet present).
- **Missing vs plan:** `src/data/`, `src/components/`, `src/layouts/`, GitHub Actions workflow, print CSS, full content port.

Root `README.md` is still the generic Astro minimal template and does **not** reflect project-specific goals — `CLAUDE.md` is the authoritative product document.

### 3.1 North-star use cases

1. **Visitor reads CV:** Open the deployed static page, scan two-column layout with work history, education (including Platzi certifications), hierarchical skills, and 12+ projects — no login, no API.
2. **Author updates content:** Edit structured files under `src/data/`, run `npm run build`, push to `main` — layout components unchanged (planned workflow).
3. **Visitor prints or saves PDF:** Print-ready CSS produces clean A4 output without broken sidebars (planned Phase 2).
4. **Agent builds a section in parallel:** Check out a feature branch, implement one component (e.g. collapsible skill tree) following `CLAUDE.md` design reference and accessibility skill guidance, open PR for main-context review.
5. **Dual deploy path:** Site reachable at both the `astro-cv` repo path and a shorter `cv` path on GitHub Pages (redirect or dual deploy — planned Phase 3).

### 3.2 Non-goals

- Replacing the kodexArg Home RAG corpus CV packs (`corpus/cv/` in the separate Home repo) — astro-cv is a standalone public portfolio site, not the conversational RAG destination.
- Dark mode, PDF export button, and i18n toggle — listed as Phase 4 enhancements post-launch.
- Backend API, form submissions, or analytics server — static site only.
- Cloudflare Workers or edge SSR — deployment plan is GitHub Pages, not Workers (despite Astro skill documenting Cloudflare adapter as an option).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node.js >= 22.12, ESM (`"type": "module"`) | `package.json` `engines`, `type` |
| Framework | Astro ^6.0.2 (static output, default) | `package.json`, `astro.config.mjs` |
| Frontend styling | Tailwind CSS ^4.2.1 via `@tailwindcss/vite` | `package.json`, `astro.config.mjs`, `src/styles/global.css` |
| UI kit / interactivity | Flowbite ^4.0.1 (Tailwind plugin + CDN script) | `package.json`, `global.css` `@plugin`, `index.astro` script tag |
| TypeScript | Strict Astro tsconfig | `tsconfig.json` extends `astro/tsconfigs/strict` |
| Fonts | Oswald, Source Sans Pro, Lato (Google Fonts CDN) | `src/styles/global.css` `@import` |
| Icons | Font Awesome 6.4.2 (CDN) | `src/styles/global.css` |
| Infra / deploy | GitHub Pages via GitHub Actions (planned, not in tree) | `CLAUDE.md` Deployment + Phase 3 checklist |
| AI / agents | Mirrored skill trees + `skills-lock.json` | `.claude/`, `.agents/`, `.agent/`, `skills-lock.json` |
| Tests | None configured | No test runner in `package.json` |
| Package name | `home-kodex-dev-astro-cv` | `package.json` `name` |

### 4.1 Notable dependencies (curated)

- `astro` — Static site generator; pages in `src/pages/` become routes; zero JS by default except opted-in islands (none yet).
- `@tailwindcss/vite` + `tailwindcss` — Tailwind v4 CSS-first configuration with `@theme` custom properties for mate/pullover palettes and Fibonacci widths.
- `flowbite` — Component patterns and JS behaviors for planned collapsible skill tree and interactive controls; loaded via CDN in the page shell for now.

## 5. Repository map (abstraction)

Describe **zones** of the repository as it exists today, plus planned zones from `CLAUDE.md`:

- **Entrypoints:** `src/pages/index.astro` — sole route, imports global CSS, renders placeholder CV shell.
- **Styles / theme:** `src/styles/global.css` — Tailwind entry, custom `@theme` tokens, external font/icon imports.
- **Static assets:** `public/` — favicons only today; portrait image planned.
- **Configuration:** `astro.config.mjs` (Vite + Tailwind plugin), `tsconfig.json`, `.vscode/launch.json` (Astro dev launch), `.vscode/extensions.json` (recommends `astro-build.astro-vscode`).
- **Domain / core (planned, absent):** `src/data/` — structured CV modules; `src/components/` — sidebar, skill tree, experience blocks; `src/layouts/` — two-column Fibonacci page shell.
- **Docs vaults:** No `docs/` or `.docs/` directory. Product spec lives in `CLAUDE.md`. Root `README.md` is still the upstream Astro minimal boilerplate.
- **Agent scaffolding:** `.claude/skills/`, `.agents/skills/`, `.agent/skills/` — seven skills each (mirrored trees); `skills-lock.json` records upstream sources and content hashes. Skills cover Astro CLI/structure, Tailwind v4 patterns, WCAG a11y, i18n/L10n, GitHub Actions workflow specification authoring, technical writing, and TypeScript best practices.
- **Generated / vendor (gitignored, do not ingest):** `dist/`, `.astro/`, `node_modules/` per `.gitignore`.
- **CI/CD (planned, absent):** No `.github/workflows/` directory yet; Phase 3 explicitly calls for a Pages deploy workflow and dual-URL verification.

## 6. Configuration & contracts (no secrets)

### Environment variables

`.gitignore` excludes `.env` and `.env.production`. No `.env.example` is present. The static site has **no runtime secrets** in the planned architecture — GitHub Pages serves prebuilt HTML from `dist/`.

### Astro configuration shape

`astro.config.mjs` exports `defineConfig` with only a Vite plugins array containing `tailwindcss()`. Not yet set: `site` (canonical deployed URL), `base` (important for GitHub Pages project sites), output adapter (defaults to static).

### Agent skills lockfile

`skills-lock.json` version 1 maps skill names to upstream GitHub sources and `computedHash` integrity values. Skills are installed from external community repos (mindrally, astrolicious, github/awesome-copilot, sickn33, giuseppe-trisciuoglio, onewave-ai, 0xbigboss) — no credentials in the lockfile.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no server-side HTTP API**. It is a static site generator project. After `npm run build`, Astro emits static files to `dist/` for hosting.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| N/A | N/A | No application HTTP routes — static HTML/CSS/JS only | none |

**Planned static routes (file-based routing):**

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/` | Single-page CV (from `src/pages/index.astro`) | none |

No OpenAPI, Workers routes, or backend `urls.py` present.

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| npm scripts | `dev` (Astro dev server), `build` (production build to `dist/`), `preview` (local preview of build), `astro` (CLI passthrough) |
| VS Code launch | "Development server" runs `./node_modules/.bin/astro dev` |
| Agent skills | Invoked by compatible AI tooling reading `SKILL.md` files under `.agents/skills/*/` |
| i18n checker script | `i18n-localization` skill includes `scripts/i18n_checker.py` (supporting tooling for future Phase 4 i18n — not wired into CI) |

## 7. Data & persistence

- **Stores used:** None. No database, KV, or vector index. All CV content will be **build-time static data** in `src/data/` TypeScript modules (planned).
- **Important entities (planned, from `CLAUDE.md`):** profile (name, title, contact links, about), experience (work history), education (degrees, technical school, Platzi certs), skills (three-level hierarchical tree), projects (12+ entries with metadata).
- **Topology:** Pure static edge — `npm run build` produces `dist/` artifacts uploaded to GitHub Pages. No server runtime, no edge functions, no client-side persistence beyond optional UI state (sidebar open/closed).

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **`CLAUDE.md`** — Primary product constitution: goals, tech stack, design reference (Fibonacci layout, color palettes, interactivity, responsive breakpoints), planned `src/data/` schema, phased development plan (Phases 0–4), multi-agent workflow conventions, deployment targets.
2. **`README.md`** — Generic Astro minimal starter text only; does not document astro-cv-specific goals. Superseded by `CLAUDE.md` for product intent.
3. **`.claude/skills/` / `.agents/skills/` / `.agent/skills/`** — Seven mirrored agent skills with `SKILL.md` manifests: `astro` (CLI, project structure, adapters), `accessibility-a11y` (WCAG, semantic HTML, ARIA patterns — aligns with Phase 2 a11y checklist), `tailwind-css-patterns` (v4 utility-first styling), `i18n-localization` (future ES/EN toggle in Phase 4), `create-github-action-workflow-specification` (template for documenting future Pages CI workflow), `technical-writer`, `typescript-best-practices`.
4. **`skills-lock.json`** — Skill provenance and hash lock for reproducible agent tooling.
5. **`package.json`** — Package identity, Node engine floor, dependency versions, script names.
6. **`src/pages/index.astro`** — Current placeholder page structure and Spanish default language.
7. **`src/styles/global.css`** — Implemented design tokens and Tailwind/Flowbite setup.

### Directories scanned but absent

- **`.docs/`** — Not present in the repository.
- **`docs/`** — Not present.
- **ADR / PRD / constitution files** — No `ADR*` or separate constitution beyond `CLAUDE.md`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; the CV is intended for open web publication of professional information (name, title, career history, project list).
- **Auth model:** None — fully public static content. No sessions, OIDC, or API keys in the application surface.
- **Secrets hygiene:** `.env` and `.env.production` are gitignored; this summary contains no secrets, tokens, PEM material, or environment values. CDN imports in CSS reference public font/icon libraries only.
- **Third-party scripts:** Flowbite loaded from a public CDN in `index.astro` — consider pinning/subresource integrity or bundling for production hardening (not yet addressed).
- **Personal data:** The site will publish the owner's professional CV data by design; operators should not commit private credentials alongside public resume content.

## 10. Operational picture

### Local development

```bash
npm install    # or compatible package manager
npm run dev    # Astro dev server (default port 4321 per Astro conventions)
npm run build  # Output to ./dist/
npm run preview
```

VS Code users can launch "Development server" from `.vscode/launch.json`.

### Deployment (planned, not yet implemented)

`CLAUDE.md` specifies GitHub Actions building and deploying to GitHub Pages on push to `main`, with the site accessible at two GitHub Pages paths (the `astro-cv` project site and a shorter `cv` alias via redirect or dual deploy). **No workflow file exists in the tree at summary time** — Phase 3 checklist items remain open. `astro.config.mjs` does not yet set `site` or `base`, which GitHub Pages project sites typically require.

### Development phases (from `CLAUDE.md`)

| Phase | Status (approximate) |
|-------|----------------------|
| 0 — Foundation | Partial: repo created, `CLAUDE.md` written, Astro + Tailwind initialized; data files, structure, content port pending |
| 1 — Core components | Not started |
| 2 — Polish (typography, print, responsive, a11y) | Not started |
| 3 — Deployment (Actions, dual URL) | Not started |
| 4 — Enhancements (i18n, dark mode, PDF export) | Post-launch backlog |

### Hardware constraints

None — standard Node.js build environment. No GPU, embedded, or mobile-native targets.

## 11. Open questions / unknowns

- **Exact SvelteKit source repo** for content port — `CLAUDE.md` references replacing "the existing SvelteKit CV" but does not name the source repository path in-tree; porting is a manual Phase 0 task.
- **`site` and `base` Astro config** for GitHub Pages — not set; final URL structure for dual-path deploy (`astro-cv` vs `cv`) unresolved until Phase 3.
- **GitHub Actions workflow** — specified in plan but absent; no CI logs or deploy automation to summarize.
- **`src/data/` schema** — filenames and shapes are named in `CLAUDE.md` but no implementation exists yet; exact TypeScript interfaces unknown.
- **Flowbite vs custom components** — unclear how much of the sidebar/skill-tree will use Flowbite primitives vs hand-rolled Astro components.
- **README drift** — root `README.md` still describes the generic Astro minimal template; may confuse contributors until updated.
- **GitHub language statistic** — API reports `Python` (likely from `i18n_checker.py` in agent skills); application source is TypeScript/Astro.
- **Relationship to kodexArg Home CV corpus** — both concern Gabriel Cavedal's CV, but astro-cv is a standalone static site while Home maintains RAG corpus packs; integration or cross-link strategy not documented here.
