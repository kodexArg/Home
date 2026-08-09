---
id: "template-angular-21-csr-primeng"
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "template"
status: "template"
related: []
tags:
  - "angular"
  - "angular-21"
  - "primeng"
  - "tailwind"
  - "tailwind-v4"
  - "vitest"
  - "csr"
  - "template"
  - "ai-first"
  - "claude-code"
  - "mcp"
  - "signals"
  - "zoneless"
  - "standalone-components"
problems_solved:
  - "New Angular 21 client-side projects start from generic CLI output that omits PrimeNG, Tailwind v4 token bridging, zoneless testing, and modern signal-first patterns—forcing every team to re-integrate the same stack by hand."
  - "PrimeNG and Tailwind v4 do not share a design token space by default; wiring Aura preset, tailwindcss-primeui, and global theme SSOT is easy to get wrong and hard to document consistently for humans and AI agents."
  - "AI-assisted Angular development without enforced conventions produces mixed RxJS/state patterns, Jasmine-era tests, and ad-hoc UI—this template ships linked Claude Code skills that mandate OnPush, signals, Signal Forms, httpResource, Vitest, and PrimeNG-first design."
technologies:
  - "Angular 21.2 (standalone components, OnPush, signals, zoneless-ready)"
  - "PrimeNG 21 with Aura theme preset (@primeuix/themes)"
  - "Tailwind CSS v4 + @tailwindcss/postcss + tailwindcss-primeui bridge"
  - "Vitest + JSDOM (Angular unit-test builder, no Jasmine/Karma)"
  - "TypeScript 5.9 strict"
  - "@angular/build (esbuild application builder)"
  - "Angular CLI MCP server (.mcp.json)"
  - "Claude Code / Cursor agent skills (.claude/skills, .agents/skills)"
  - "Prettier (Angular HTML parser)"
  - "Node 22 (via .nvmrc)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# template-angular-21-csr-primeng

> **Problem thesis (required):** This repository is an **opinionated Angular 21 client-side rendering (CSR) starter template** for kodexArg projects that need PrimeNG as the primary UI library, Tailwind CSS v4 as the layout/utility layer, Vitest as the test runner, and a full **AI agent skill suite** so Claude Code and Cursor agents write consistent modern Angular. It exists because cloning `ng new` and then manually integrating PrimeNG 21, the Tailwind v4 PostCSS pipeline, the `tailwindcss-primeui` token bridge, zoneless Vitest setup, and signal-first conventions is repetitive—and without linked skills, agents revert to legacy RxJS, Reactive Forms, Jasmine, and hand-rolled CSS widgets.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/template-angular-21-csr-primeng` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Angular 21 CSR starter with PrimeNG 21, Tailwind v4, Vitest, and baked-in Claude Code skills plus Angular CLI MCP integration for AI-assisted development. |
| Audience | Developers and AI agents bootstrapping new Angular frontends in the kodexArg org; teams that want a single canonical stack (signals, OnPush, PrimeNG-first, no Zone.js testing) without re-deriving conventions from scattered docs. |

## 2. Problems it solves

### P1 — Empty Angular CLI output lacks the kodexArg UI stack

- **Who hurts:** Developers starting a new CSR Angular app who need PrimeNG components, Tailwind utilities, and a coherent theme—not bare `app.component` scaffolding.
- **Pain today:** The default Angular workspace has no PrimeNG provider, no Tailwind v4 `@import`/`@plugin` wiring, no `tailwindcss-primeui` bridge, and no `src/theme.css` SSOT for brand tokens. Each project reinvents `providePrimeNG`, PostCSS config, and global styles.
- **How this repo answers:** Pre-configured `app.config.ts` registers `providePrimeNG({ theme: { preset: Aura } })`, `provideHttpClient()`, `provideAnimationsAsync()`, and router features (`withComponentInputBinding`, `withInMemoryScrolling`). `src/styles.css` imports Tailwind v4 and the PrimeUI plugin; `src/theme.css` centralizes `@theme` tokens and `:root` CSS variables per `AGENTS.md`. A minimal `Home` route proves dark-surface styling via PrimeNG CSS variables (`var(--p-surface-950)`).
- **Out of scope:** Server-side rendering (SSR), backend APIs, authentication, database layers, or deployment IaC—the routing skill *documents* AWS Amplify patterns as guidance for downstream apps but this template ships no `amplify/` tree or CI deploy workflow.

### P2 — PrimeNG and Tailwind v4 token alignment is fragile

- **Who hurts:** Frontend developers and design-system-minded agents who want `bg-primary`, `text-surface-600`, and PrimeNG Aura tokens to interoperate without duplicate color definitions or SCSS ceremony.
- **Pain today:** PrimeNG 21 uses `@primeuix/themes` presets; Tailwind v4 uses `@theme` blocks and PostCSS plugins. Without `tailwindcss-primeui`, teams either ignore Tailwind for component colors or fight conflicting token namespaces.
- **How this repo answers:** The `tailwindcss-primeui` plugin is registered in `src/styles.css` via `@plugin 'tailwindcss-primeui'`. PostCSS uses `@tailwindcss/postcss` per `.postcssrc.json`. Skills (`kdx-design-system-use`, `kdx-tailwind-design-system`) enforce a hierarchy: PrimeNG components and `var(--p-*)` tokens first; Tailwind layout utilities second; `@theme` extensions only when PrimeNG cannot model the need. `src/theme.css` is the SSOT for site colorimetry and typography—hardcoded hex outside that file is prohibited in agent rules.
- **Out of scope:** A living component showcase app, Storybook, or visual regression CI—the template is a skeleton, not a design-system catalog (though skills reference showcase-style decision flows from larger kodexArg apps).

### P3 — AI agents write inconsistent Angular without enforced conventions

- **Who hurts:** Operators using Claude Code, Cursor, or similar agents on Angular repos where mixed patterns (NgModules, BehaviorSubject stores, Reactive Forms, Jasmine) slow reviews and break zoneless assumptions.
- **Pain today:** Generic agent context lacks stack-specific rules; agents hallucinate PrimeNG APIs, skip tests, or import RxJS for state that should be signals.
- **How this repo answers:** Nine linked skills under `.claude/skills/` and a mirrored `.agents/skills/` tree cover components, forms (Signal Forms API), HTTP (`httpResource()`), routing, signals, testing (Vitest + zoneless TestBed), design-system usage, Tailwind extension, and version/CHANGELOG tagging. `AGENTS.md` binds agents to `src/theme.css` as SSOT and defers feature work to skills. `.mcp.json` and `.vscode/mcp.json` wire the **Angular CLI MCP server** (`build`, `devserver`, `test`, `modernize`, `e2e`, documentation search, `ai_tutor`).
- **Out of scope:** Hosting agent orchestration, RAG ingestion, or MCP servers beyond Angular CLI—the template only configures the Angular MCP entrypoint.

## 3. Product / idea

The repository is a **clone-and-customize template**, not a deployed product. Mental model: **one CSR SPA shell + provider graph + style pipeline + agent rulebook**.

```
[src/main.ts] --> bootstrapApplication(App, appConfig)
       |
[app.config.ts] --> Router + HttpClient + Animations + PrimeNG(Aura)
       |
[app.routes.ts] --> lazy-ready route table (default: Home)
       |
[src/styles.css] --> Tailwind v4 + theme.css + tailwindcss-primeui
       |
[.claude/skills/*] --> mandatory HOW/WHAT rules for agents
```

After cloning, a developer replaces the placeholder `Home` component, adds feature routes and standalone components, and extends `src/theme.css` for brand tokens. Agents are expected to invoke `kdx-design-system-use` before any UI work, then delegate to domain skills (`kdx-angular-component`, `kdx-angular-forms`, etc.). Every new component should ship with a co-located `*.spec.ts` using `provideZonelessChangeDetection()`.

The default landing page (`src/app/home/home.ts`) is intentionally minimal: centered Spanish welcome text on a near-black PrimeNG surface background—visual proof that Aura tokens, host styling, and Tailwind layout classes coexist.

### 3.1 North-star use cases

1. **Bootstrap a new frontend:** Clone template, run install and dev server, confirm black/white smoke-test home page, begin adding routed feature components under `src/app/`.
2. **Agent-driven feature work:** Agent reads `kdx-design-system-use` → picks PrimeNG primitives → implements standalone OnPush component with signal I/O → writes Vitest spec with PrimeNG test providers.
3. **HTTP-heavy feature:** Agent uses `kdx-angular-http` patterns (`httpResource()`, status switch templates with PrimeNG `ProgressSpinner`/`Message`) atop the pre-wired `provideHttpClient()`.
4. **Release hygiene:** Operator invokes `kdx-version` to draft `CHANGELOG.md` entries and annotated git tags (CHANGELOG is empty in the template seed).

### 3.2 Non-goals

- **SSR or hybrid rendering** — CSR only; routing skill text mentions Amplify CSR hosting but no SSR adapters ship here.
- **NgModules, NgRx, NGXS** — skills explicitly forbid module-based architecture and RxJS-first state (RxJS reserved for HTTP interop only).
- **Jasmine, Karma, Jest** — Vitest is the sole unit-test runner (`angular.json` uses `@angular/build:unit-test`).
- **Reactive Forms / template-driven forms / ngModel** — Signal Forms API is mandatory per `kdx-angular-forms`.
- **TanStack Query or alternate data libraries** — `httpResource()` and `resource()` are the prescribed fetch primitives.
- **Production deploy pipeline in-repo** — no `.github/workflows`; `.gitignore` anticipates future AWS Amplify artifacts but none are committed.
- **Bundled `docs/` vault** — skills reference `docs/08-primeng.md` and `docs/09-tailwind4.md` from sibling kodexArg projects; those files are **not present** in this template tree (see §11).

## 4. Technology stack

Derived from `package.json`, `angular.json`, `.nvmrc`, `.postcssrc.json`, and `README.md`.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node 22.22.2; TypeScript 5.9 strict; ES2022 target | `.nvmrc`, `tsconfig.json`, `package.json` |
| Frontend framework | Angular 21.2 — standalone, OnPush, signals, zoneless-ready tests | `package.json`, `src/app/app.ts`, `src/app/app.spec.ts` |
| UI library | PrimeNG 21.1.x, Aura preset via `@primeuix/themes` | `package.json`, `src/app/app.config.ts` |
| Styling | Tailwind CSS 4.1.x, `@tailwindcss/postcss`, `tailwindcss-primeui` | `package.json`, `src/styles.css`, `.postcssrc.json` |
| HTTP client | `HttpClient` + `httpResource()` ready (no sample resource in seed) | `src/app/app.config.ts`, skills `kdx-angular-http` |
| Build | `@angular/build:application` (esbuild), `@angular/build:dev-server` | `angular.json` |
| Tests | Vitest 4.x + JSDOM, `@angular/build:unit-test` | `package.json`, `angular.json`, `tsconfig.spec.json` |
| Formatter | Prettier 3.8 with Angular HTML parser | `.prettierrc` |
| Package manager | npm 10.8.2 (declared in `packageManager` field) | `package.json` |
| AI / agents | Claude skills (9), Angular CLI MCP | `.claude/skills/`, `.agents/skills/`, `.mcp.json` |
| Infra / deploy | Not configured (Amplify paths gitignored for future use) | `.gitignore`, routing skill prose |

### 4.1 Notable dependencies (curated)

- `primeng` + `@primeuix/themes` — component library and Aura/Lara-style preset system; core UI surface for all features.
- `tailwindcss-primeui` — bridges PrimeNG semantic tokens into Tailwind utility classes (`bg-surface-*`, shared primary palette).
- `@angular/build` — modern esbuild-based application builder replacing legacy `@angular-devkit/build-angular` browser builder in this template.
- `vitest` — unit test runner integrated via Angular 21's unit-test architect target (replaces Karma/Jasmine default).
- `rxjs` — present as Angular peer dependency; skills restrict usage to HTTP/stream interop, not application state stores.

## 5. Repository map (abstraction)

**Entrypoints**

- `src/main.ts` — `bootstrapApplication(App, appConfig)`.
- `src/index.html` — shell document with `<app-root>`.
- `public/favicon.ico` — static asset copied by build.

**Application core (`src/app/`)**

- `app.ts` — root standalone OnPush component with `<router-outlet />` only.
- `app.config.ts` — global providers (router, HTTP, animations, PrimeNG).
- `app.routes.ts` — route table; seed route maps `''` → `Home`.
- `home/home.ts` — placeholder landing component demonstrating PrimeNG surface tokens and Tailwind layout on host.
- `app.spec.ts`, `home/home.spec.ts` — Vitest + zoneless TestBed examples.

**Styling SSOT**

- `src/styles.css` — Tailwind import, theme import, PrimeUI plugin registration.
- `src/theme.css` — `@theme` block (fonts, semantic colors) and `:root` native CSS variables; **SSOT per `AGENTS.md`**.

**Agent scaffolding**

- `.claude/skills/` — nine `kdx-*` skills (canonical for Claude Code).
- `.agents/skills/` — mirrored copy of the same skills (Cursor / other agent hosts).
- `AGENTS.md` — global agent constitution: theme SSOT + defer to skills.
- `.mcp.json` — repo-level Angular CLI MCP config with explicit enabled tools.
- `.vscode/mcp.json` — VS Code/Cursor MCP server stub for `angular-cli`.

**Tooling / editor**

- `.vscode/tasks.json`, `launch.json`, `extensions.json` — editor integration (not gitignored).
- `.editorconfig`, `.prettierrc`, `.postcssrc.json`, `.nvmrc`.

**Docs vaults**

- Root `README.md` — human-oriented stack overview, skill table, MCP section, getting-started commands.
- `CHANGELOG.md` — empty seed; version history SSOT once releases begin.
- **No `docs/` directory** in the cloned tree.
- **No `.docs/` hidden vault** in the cloned tree.

**Generated / vendor (existence only; not ingested)**

- `dist/`, `node_modules/`, `.angular/cache`, `coverage/`, `out-tsc/` — gitignored build and test artifacts per `.gitignore`.

## 6. Configuration & contracts (no secrets)

**Environment variables:** None defined in-repo. `.gitignore` blocks `.env` and `.env.*` (with `!.env.example` allowance) but no `.env.example` file is committed—downstream apps add their own.

**Angular build budgets (production):** initial bundle warning 500 kB / error 1 MB; per-component styles warning 4 kB / error 8 kB — `angular.json` production configuration.

**Router contract:** Functional routes array exported from `app.routes.ts`; component input binding enabled so route params can bind to signal `input()` on routed components.

**PrimeNG contract:** `providePrimeNG({ theme: { preset: Aura } })` — downstream apps may swap preset or extend via skills' customization hierarchy (prop > token > `[dt]` > `[pt]`).

**MCP contract:** Angular CLI MCP invoked via `npx` with tools enabled for `build`, `devserver`, `test`, `modernize`, `e2e` — see `.mcp.json` args.

**AWS Amplify (anticipated, not committed):** `.gitignore` lists standard Amplify backend and config artifact paths; routing skill describes CSR on Amplify Hosting with API rewrites—template does not ship `amplify/` configuration.

### 6.1 HTTP / API endpoints (when applicable)

This repository **does not expose a backend HTTP API**. It is a pure CSR SPA template. The dev server serves static Angular bundles and client routes.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | — | **N/A — no server routes in this template** | — |

Client-side routing only:

| Pattern | Purpose | Auth |
|---------|---------|------|
| `''` (empty path) | `Home` placeholder landing component | none |

When downstream apps add APIs, skills (`kdx-angular-http`, `kdx-angular-routing`) expect same-origin or proxied REST JSON—not part of this template seed.

### 6.2 Other interfaces

- **npm scripts:** `start` (`ng serve`), `build` (`ng build`), `watch` (dev build watch), `test` (`ng test` → Vitest via Angular builder).
- **Angular CLI MCP tools:** `build`, `devserver_start`/`devserver_stop`, `test`, `modernize`, `e2e`, `list_projects`, `get_best_practices`, `search_documentation`, `ai_tutor` — per README and `.mcp.json`.
- **Agent skills:** nine `kdx-*` SKILL.md entrypoints under `.claude/skills/` — invoked by name in agent sessions; not runtime CLI binaries.

## 7. Data & persistence

**No persistence layer** in the template. No database, KV, or object storage bindings. `provideHttpClient()` is registered for future REST consumption via `httpResource()` but no services, interceptors, or stores are implemented in the seed.

Topology: **browser-only CSR** — all state lives in component/signal stores once features are added. Deployment target is unspecified in committed files; skills reference AWS Amplify CSR as a common kodexArg pattern for derivative apps.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`README.md`** — stack table, PrimeNG+Tailwind integration explanation, project structure, skill inventory, MCP setup, cross-platform Node install steps, MIT license.
2. **`AGENTS.md`** — `src/theme.css` as SSOT for colorimetry/typography; skills in `.agents/skills/` as primary instruction source for feature development.
3. **`CHANGELOG.md`** — empty file; version skill expects future annotated tags and changelog entries.
4. **`.claude/skills/` (9 skills)** — comprehensive agent conventions:
   - `kdx-design-system-use` — mandatory UI entry point; PrimeNG-first decision flow; references external PrimeNG LLM docs and absent local `docs/08-primeng.md` / `docs/09-tailwind4.md`.
   - `kdx-angular-component` — standalone OnPush anatomy, signal I/O, PrimeNG imports, host bindings.
   - `kdx-angular-signals` — `signal`, `computed`, `linkedSignal`, `effect`; no RxJS state stores.
   - `kdx-angular-forms` — Signal Forms API + PrimeNG inputs; bans Reactive Forms and `p-password` with `[formField]`.
   - `kdx-angular-http` — `httpResource()`, interceptors, pagination patterns with PrimeNG status UI.
   - `kdx-angular-routing` — lazy loading, functional guards, Amplify CSR deployment narrative, signal route params.
   - `kdx-angular-testing` — Vitest-only, zoneless TestBed, PrimeNG test providers, MCP Playwright visual validation references.
   - `kdx-tailwind-design-system` — Tailwind v4 `@theme`/`@utility` extension rules subordinate to PrimeNG.
   - `kdx-version` — CHANGELOG + annotated tag workflow.
5. **`.agents/skills/`** — content mirrors `.claude/skills/` (duplicate tree for non-Claude agent hosts).
6. **`.mcp.json`**, **`.vscode/mcp.json`** — Angular CLI MCP server configuration.
7. **`LICENSE`** — MIT, Copyright 2026 Gabriel Cavedal (kodexArg).

**Not present (scanned, absent):**

- `.docs/` — directory does not exist in clone.
- `docs/` — directory does not exist (skills reference sibling-project doc paths).
- `.github/workflows/` — no CI definitions.
- ADRs, PRDs, constitution files beyond `AGENTS.md`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `public` template on GitHub under `kodexArg`; safe to reference as an org starter; no private credentials in tree.
- **Auth model:** None in seed app; routing skill describes future auth interceptors and guards for derivative deployments.
- **Secrets hygiene:** `.gitignore` excludes `.env*`, PEM/keys, Amplify secret artifacts, and AWS export JSON files. This summary contains no secrets, tokens, or environment values.
- **Dependency surface:** Standard npm Angular/PrimeNG stack; agents should not paste lockfile blobs into RAG corpora—versions are declared in `package.json` only.

## 10. Operational picture

**Local development**

1. Use Node version from `.nvmrc` (v22.22.2).
2. `npm install` — package manager pinned to npm 10.8.2 in `package.json`.
3. `npm start` — Angular dev server (default port 4200 per README prose).
4. `npm test` — Vitest unit tests via `ng test`.
5. `npm run build` — production-optimized esbuild output to `dist/` (gitignored).

**Deployment**

- No committed CI/CD. Downstream repos typically target AWS Amplify Hosting per skill guidance; `.gitignore` pre-registers Amplify artifact paths.
- Production build uses `angular.json` production configuration with output hashing and bundle budgets.

**Hardware constraints**

- None specific; standard Node 22 developer machine. Testing uses JSDOM (no browser farm required for unit tests). Visual testing skill references MCP Playwright workflows for optional UI validation.

## 11. Open questions / unknowns

- **`docs/08-primeng.md` and `docs/09-tailwind4.md`** — referenced repeatedly in skills but **not included** in this template; likely copied from fuller kodexArg Angular apps (`cf-ng-eurotrip2026`, etc.). Agents may need those docs added or skills trimmed when using only this template.
- **`kdx-design-system-use` theme table** mentions Lara/Noir/Zinc/Verona-inspired layout and `frontend/src/app/theme.config.ts` — **not present** in this template (Aura preset in `app.config.ts` is the actual seed; skill prose may lag the template).
- **AWS Amplify deployment** — described in `kdx-angular-routing` but no `amplify/` directory or `amplify.yml` committed; deployment path is unknown for clones until configured.
- **E2E testing** — MCP and `angular.json` do not show a default Playwright/Cypress target in the shallow clone; `e2e` is an MCP-enabled CLI capability but not pre-wired with spec files.
- **Internationalization** — home component uses Spanish UI strings; README and code comments mix English and Spanish; no i18n pipeline (`@angular/localize`) configured.
- **Package manager policy** — template declares `npm`; kodexArg sibling repos sometimes standardize on `bun`; clones may need alignment.
- **CHANGELOG / version** — `package.json` version `0.0.0`; `CHANGELOG.md` empty; no git tags in shallow clone history to infer release cadence.
