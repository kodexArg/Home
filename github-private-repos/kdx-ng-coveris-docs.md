---
id: "kdx-ng-coveris-docs"
title: "Coveris Documentation Portal — Angular docs site and QA harness"
visibility: private
importance: normal
source_repo: "kdx-ng-coveris-docs"
org: "kodexArg"
default_branch: "master"
primary_language: "TypeScript"
repo_kind: "documentation"
status: "active"
related: []
tags: ["coveris", "angular", "documentation", "primeng", "healthcare", "capacity-planning", "qa", "python", "django", "aws", "adr", "design-system"]
problems_solved:
  - "Coveris product knowledge (PRD, ADRs, API contract, stack, dev/prod runbooks) was scattered across markdown files and sibling repos with no unified, bilingual, navigable reader for humans and agents."
  - "QA engineers lacked a standardized, repeatable audit workflow with scoring, finding IDs, and HTML report generation for Coveris-related frontends."
  - "The PrimeNG Lara design system for Coveris needed a live component showcase separate from production app screens."
technologies:
  - "Angular 21.2 CSR"
  - "TypeScript 5.9"
  - "PrimeNG 21 Lara (Noir primary, Zinc surface)"
  - "Tailwind CSS 4"
  - "marked + Mermaid (markdown rendering)"
  - "Vitest 4"
  - "Python 3.13 audit scripts (httpx, BeautifulSoup)"
  - "Node 22+"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# kdx-ng-coveris-docs

> **Problem thesis (required):** This private repository is the **documentation and quality-assurance companion** for Coveris — a healthcare capacity-planning SaaS for private clinics. It solves two intertwined pains: (1) product and architecture knowledge for Coveris (PRD, 19+ ADRs, API SSOT, stack guides, AI agent registry) must be **published in one browsable, bilingual portal** that agents and humans can navigate by section; and (2) **repeatable QA audits** (security, accessibility, performance, SEO, compliance, operations) need shared scripts, scoring rules, and report templates. The Angular app in `kdx-coveris-docs/` is the reader and design-system showcase; the Python scripts and `AGENTS.md` at repo root are the audit harness. The markdown vault under `public/docs/` describes the **full Coveris product** (Angular + Django + PostgreSQL on AWS), not only this docs repo.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/kdx-ng-coveris-docs` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Private Coveris documentation portal (bilingual markdown browser + PrimeNG showcase) bundled with a senior-QA audit toolkit and agent skill lockfile. |
| Audience | Coveris developers, technical writers, AI coding agents (`coveris-adr-editor`, `coveris-prd-editor`, `prd-adr-expert`, `prd-inspector`), and QA engineers running structured audits against Coveris or related frontends. |

## 2. Problems it solves

### P1 — Fragmented Coveris product knowledge

- **Who hurts:** Engineers, product owners, and AI agents implementing or reviewing Coveris (`cotton-coveris-mvp` and related repos) need a single authoritative narrative for capacity planning domain logic, API contracts, and architectural decisions.
- **Pain today:** Knowledge lived across predecessor projects (SDGD v2, Coveris v4 spec), markdown files, and mental models. ADRs, PRD sections, and API.md could drift from implementation. Agents lacked a structured, sectioned docs tree with stable doc IDs.
- **How this repo answers:** Ships a curated markdown corpus (~44 files per locale) under `kdx-coveris-docs/public/docs/{en,es}/`, registered in `DocsService` with seven navigation sections (Overview, API Contract, ADRs, Tech Stack, Development, Production, AI & Tooling). An Angular 21 SPA loads markdown via HTTP, strips YAML frontmatter, renders with `marked`, and exposes EN/ES language toggle. `02-api.md` is explicitly the SSOT for HTTP between Angular frontend and Django backend. Nineteen ADRs document conventions, stacks, auth, FSM rules, design system, and business logic.
- **Out of scope:** This repo does **not** implement the Coveris backend, database, or production deployment of the SaaS app itself. It documents and showcases; implementation lives in sibling application repos.

### P2 — Inconsistent QA audit methodology

- **Who hurts:** QA engineers and agents tasked with pre-release quality gates on Coveris or similar Angular/marketing sites.
- **Pain today:** Ad-hoc checklists, non-reproducible findings, no shared severity taxonomy or weighted scoring, and manual report assembly.
- **How this repo answers:** Root `AGENTS.md` defines a **10-area audit framework** (Security/OWASP, Accessibility/WCAG 2.2 AA, Performance/Core Web Vitals, SEO, Code Quality, Functional Testing, Dependencies, Compliance/GDPR, Operations/CI, Framework-Specific). Finding ID prefixes (`S-xx`, `A-xx`, …), severity levels, evidence requirements, and a weighted scoring formula produce READY / READY WITH RESERVES / NOT READY verdicts. Nine Python scripts in `scripts/` automate HTTP security scans, link checks, SEO audits, dependency audits, operations checks, browser auth tests, finding extraction, test generation, and HTML report compilation via `generate-report.py`. `skills-lock.json` pins third-party agent skills (`qa-test-planner`, `scoutqa-test`) for intake and browser workflows.
- **Out of scope:** Scripts are utilities for authorized audits; they do not modify target sites. Reports directory and cloned target repos are gitignored. No CI workflow is checked into this repo.

### P3 — Design system discoverability for Coveris UI

- **Who hurts:** Frontend developers adopting PrimeNG Lara with Coveris-specific theme tokens (Noir primary on Zinc surface).
- **Pain today:** ADR-012 mandates PrimeNG as the sole design system, but developers need live examples of buttons, forms, data tables, overlays, and advanced patterns without spelunking production screens.
- **How this repo answers:** `/showcase` route tree with 14 lazy-loaded showcase pages (colors, typography, buttons, forms, data, feedback, layout, overlays, menus, widgets, advanced variants). `theme.config.ts` centralizes the KDX preset (Lara + Noir + Zinc). Component naming and accessibility rules are cross-referenced in ADR-012 and ADR-013 within the docs vault.
- **Out of scope:** Not a Storybook replacement for arbitrary third-party projects; scoped to Coveris/KDX PrimeNG patterns.

## 3. Product / idea

The repository is a **two-layer artifact**:

1. **Documentation browser (`kdx-coveris-docs/`)** — A client-side Angular 21 application that serves static markdown from `public/docs/` and renders it inside a PrimeNG shell with sidebar navigation, mobile drawer, skip links, and bilingual toggle. Hash-based routing (`withHashLocation`) supports static hosting. Default landing redirects to `00-home` (“How Coveris Works”), a conceptual guide for non-technical readers explaining the coverage equation and organizational layers.

2. **QA harness (repo root)** — Operational reference (`AGENTS.md`) plus Python scripts invoked with `uv run` (inline PEP 723 dependencies). The full audit workflow spans intake → Brave CDP browser check → recon → ten parallel audit agents → terminal score table → optional HTML report.

The **Coveris product** documented inside this portal is a SaaS **capacity planning platform for private clinics** (20–100 employees, multiple services). It replaces spreadsheet chaos when answering four staffing questions in real time: who has available hours, who holds required certifications, whether assignment triggers overtime, and post-assignment service coverage. The domain model centers on three pillars — **Demand** (org-unit tree with positions and required weekly hours), **Supply** (employees with contracts, tags, and lifecycle FSM), and **Bridge** (assignments linking people to positions with preview and balance math). Coverage and balance formulas drive all UI and API semantics.

Mental model for the **documented application stack** (not built in this repo):

```
Angular 21 CSR ── PrimeNG Lara ── Signals ── Signal Forms
        │
        │  /api/* (dev proxy, prod Amplify rewrite)
        ▼
Django 5.2 DRF ── SimpleJWT (dev) / Cognito (prod)
        │
        ▼
PostgreSQL 16 ── Docker Compose (dev) / RDS (prod)
```

Production topology (from `prod-aws.md`): Amplify hosts the CSR build with `/api/*` rewrite to App Runner (Uvicorn ASGI), RDS PostgreSQL, Cognito RS256 auth, S3 for media, Secrets Manager for credentials — deliberately avoiding Kubernetes/Lambda for operational simplicity.

### 3.1 North-star use cases

1. **Developer onboarding** — Clone related Coveris app repos, open this docs portal locally (`ng serve`), read `dev-setup.md`, `stack-overview.md`, and ADR index before writing code.
2. **Contract-first API work** — Edit `02-api.md` first, then implement Django serializers/views and Angular `httpResource()` consumers; API.md wins on conflict.
3. **Agent-assisted documentation** — Invoke `coveris-adr-editor` or `coveris-prd-editor` (per `ai-registry.md`) while viewing rendered ADRs/PRD in the portal.
4. **Pre-release QA** — Run the AGENTS.md workflow against a staging or production Coveris frontend; collect categorized markdown findings and optional HTML report.
5. **Design system QA** — Browse `/showcase` routes to validate PrimeNG Lara token usage before shipping UI in the main app.

### 3.2 Non-goals

- **Not the Coveris MVP codebase** — Implementation is referenced as `cotton-coveris-mvp` (Angular 21 + Django 5.2 clean-room build inheriting SDGD v2 business logic and Coveris v4 architecture).
- **No SSR/SSG** — CSR only; documented and enforced in stack ADRs.
- **No alternative stacks** — AI agents are explicitly forbidden from suggesting React, FastAPI, NgRx, etc. (`ai-context.md` immutable stack table).
- **Cloud auth and advanced scheduling** — Documented as designed-but-not-built in PRD out-of-scope; tag-based requirements (ADR-019) moved some certification tracking in-scope.
- **Tracked QA reports and cloned sandboxes** — `reports/` and `github-repositories/` are gitignored; outputs live outside this repo.

## 4. Technology stack

Evidence drawn from manifests and docs in this clone only (no lockfile dumps).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node 22+, TypeScript 5.9 | `kdx-coveris-docs/package.json` engines |
| Frontend | Angular 21.2.4 CSR, standalone components, signals, hash routing | `package.json`, `app.config.ts`, `app.routes.ts` |
| UI | PrimeNG 21.1.3, PrimeIcons, Lara preset (Noir/Zinc), Tailwind 4 utilities | `package.json`, `theme.config.ts` |
| Markdown | marked 17, mermaid 11 | `package.json`, `docs.service.ts` |
| Tests | Vitest 4 via `@angular/build:unit-test` | `package.json`, `angular.json`, `vitest.config.ts` |
| QA scripts | Python 3.13+, httpx, BeautifulSoup (inline script deps) | `scripts/*.py` headers, `AGENTS.md` |
| Documented backend (Coveris app) | Django 5.2, DRF 3.15, uvicorn, django-fsm-2, PostgreSQL 16 | `public/docs/es/stack-overview.md` |
| Documented auth | SimpleJWT + httpOnly cookies (dev), AWS Cognito RS256 (prod) | `public/docs/es/stack-auth.md`, `02-api.md` |
| Documented deploy | AWS Amplify, App Runner, RDS, Cognito, S3, ECR, Secrets Manager | `public/docs/es/prod-aws.md` |
| AI / agents | Agent registry, ADR-007 agent architecture, skills-lock for QA skills | `public/docs/es/ai-registry.md`, `skills-lock.json` |
| Package manager (app) | npm 11.9 (declared); docs mention Bun for main Coveris monorepo | `package.json` packageManager field |

### 4.1 Notable dependencies (curated)

- `@angular/*` 21.2 — Application framework; signal-first, no NgModules.
- `primeng` + `@primeuix/themes` — Sole UI component library per ADR-012; Lara preset customized in `theme.config.ts`.
- `marked` — Server-free markdown-to-HTML in `DocsService.loadDoc()`.
- `mermaid` — Diagram rendering support in documentation content.
- `tailwindcss` 4 + `tailwindcss-primeui` — Layout utilities only; colors from PrimeNG CSS variables.
- `vitest` + `jsdom` — Unit tests for showcase rules and shared components.
- `httpx` (scripts) — HTTP security header analysis and authenticated crawling.
- `skills-lock.json` — Pins `qa-test-planner` and `scoutqa-test` agent skills from external GitHub sources (actual skill trees gitignored under `.claude/skills/`).

## 5. Repository map (abstraction)

- **Entrypoints (Angular app):** `kdx-coveris-docs/src/main.ts` → `app.config.ts` → `app.routes.ts`. Build via `ng build` / `ng serve` (`package.json` scripts).
- **Documentation zone:** `kdx-coveris-docs/public/docs/en/` and `public/docs/es/` — parallel markdown vaults (00-home, readme, PRD, API SSOT, ADR-001 through ADR-019, stack-*, dev-*, prod-*, ai-*). Also `public/docs/fsm-report.html` (static FSM visualization). `public/sitemap.xml`, `robots.txt`, `_headers` for static hosting security headers.
- **Docs UI layer:** `src/app/docs/` — `docs-shell.component.ts` (layout, lang toggle, nav), `doc-viewer.component.ts` (renders loaded HTML), `docs.service.ts` (doc registry, section metadata, HTTP fetch + marked).
- **Design system showcase:** `src/app/showcase/` — shell component + `showcase.routes.ts` with 14 category pages under `pages/`.
- **Shared UI:** `src/app/shared/` — `not-found.component.ts`, `cookie-consent`, `stat-cards`.
- **Legal stubs:** `src/app/legal/privacy.component.ts`, `terms.component.ts` (present; not wired in current `app.routes.ts`).
- **Pricing stub:** `src/app/features/pricing/pricing-plans.component.ts` (present; not in active routes).
- **Core infrastructure:** `src/app/core/` — global error handler, canonical service, title strategy, selective preloading.
- **QA harness (repo root):** `AGENTS.md` (detailed audit reference), `scripts/` (nine Python utilities), `skills-lock.json`.
- **Agent scaffolding:** No `.claude/` or `.docs/` directory in clone. `.gitignore` excludes `.agent/`, `.agents/`, and specific `.claude/skills/*` paths for third-party QA skills. Product agent rules live in `public/docs/es/ai-context.md` and `ai-registry.md`.
- **Gitignored zones (not read):** `github-repositories/`, `reports/`, `context/`, `kdx-coveris-docs/en`, `kdx-coveris-docs/es` (symlink placeholders to main Coveris docs repo per `.gitignore` comment), `.venv/`, `node_modules/`, `dist/`.

## 6. Configuration & contracts (no secrets)

### Angular app configuration

- **Routing:** Hash location (`withHashLocation`), in-memory scroll restoration, selective preloading, component input binding.
- **Security headers (dev server):** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` — mirrored in `public/_headers` for static deploy.
- **Theme:** `kdxThemeOptions` from `theme.config.ts` — Lara preset, Noir primary mapping to surface palette, Zinc surfaces, `.app-dark` selector.
- **Docs language:** `DocsService.lang` signal (`'en' | 'es'`), fetches `docs/{lang}/{filename}` relative to public assets.
- **No `.env` in this repo** — environment configuration applies to the documented Coveris application (`SUPERUSER_PASSWORD`, database DSN, etc. described abstractly in `dev-setup.md` / ADR-006).

### Documented Coveris application env (abstract)

Per ADR-006 and dev docs (names only, no values):

- Database connection variables for PostgreSQL
- `SUPERUSER_PASSWORD` for local Django admin bootstrap
- JWT/Cognito-related settings for auth mode switching
- AWS Secrets Manager secret names: `coveris/db`, `coveris/django`, `coveris/cognito` (prod)

### 6.1 HTTP / API endpoints (when applicable)

**This repository's Angular app** exposes no backend API. Client-side routes (hash-based):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | `#/` | Redirect to docs home | none |
| — | `#/docs/:docId` | Render markdown doc by stable ID (e.g. `00-home`, `02-api`, `adr-007`) | none |
| — | `#/showcase` | Design system overview | none |
| — | `#/showcase/colors` … `#/showcase/widgets` | Component category demos | none |
| — | `#/**` | Not-found page | none |

Static assets served from `public/`, including `docs/{en,es}/*.md` fetched as text by the SPA.

**Coveris product API** (documented in `02-api.md`, implemented in sibling Django repo, summarized here for RAG context):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/health/` | Liveness + DB connectivity | none |
| `POST` | `/api/v1/auth/login/` | Authenticate, set httpOnly cookies | none |
| `POST` | `/api/v1/auth/logout/` | Blacklist refresh, clear cookies | session cookies |
| `POST` | `/api/v1/auth/token/refresh/` | Rotate access cookie | refresh cookie |
| `GET` | `/api/v1/auth/me/` | Current user profile (OIDC-shaped claims) | session cookies |
| `DELETE` | `/api/v1/auth/account/` | GDPR Art. 17 account deactivation | session cookies |
| `GET` | `/api/v1/auth/export/` | GDPR Art. 20 data export JSON | session cookies |
| `GET` | `/api/v1/employees/` | List employees (paginated, searchable) | role-based |
| `GET` | `/api/v1/employees/{id}/` | Employee detail | role-based |
| `POST` | `/api/v1/employees/{id}/activate/` | FSM transition | role-based |
| `POST` | `/api/v1/employees/{id}/terminate/` | FSM transition | role-based |
| `GET` | `/api/v1/org-units/` | Organizational tree units | role-based |
| `POST` | `/api/v1/org-units/{id}/move/` | Structural move | role-based |
| `GET` | `/api/v1/positions/` | Demand positions (filterable) | role-based |
| `GET` | `/api/v1/assignments/` | Assignments (filterable) | role-based |
| `POST` | `/api/v1/assignments/preview/` | Dry-run assignment impact | role-based |
| `POST` | `/api/v1/positions/{id}/duplicate/` | Clone position | role-based |

Full resource list, pagination envelope, error codes, and rate limits are in `02-api.md`. Convention: `/api/v1/` versioned resources, kebab-case paths, trailing slashes, `snake_case` JSON fields, CSRF on mutating requests with cookie JWT auth.

### 6.2 Other interfaces

- **CLI (Angular):** `ng serve`, `ng build`, `ng test` — standard Angular CLI via `package.json` scripts (`start`, `build`, `test`).
- **CLI (QA scripts):** `python scripts/generate-report.py <audit-dir>`, plus specialized scanners (`http_security_scan.py`, `check_links.py`, `comprehensive_seo_audit.py`, `dependency_audit.py`, `operations_check.py`, `browser_auth_test.py`, `extract_findings.py`, `generate_tests.py`) — all expect `uv run` with inline dependencies.
- **Agent skills (external, gitignored):** `qa-test-planner` (intake/config), `scoutqa-test`, `qa-browser` (Brave CDP on port 9222) — referenced in `AGENTS.md` and `skills-lock.json`.
- **Audit output contract:** Markdown files per category (`security.md`, `accessibility.md`, …) plus `config.json` in a dated audit directory; optional HTML via `reports/template.html` (template path referenced by script; `reports/` directory gitignored and not present in clone).

## 7. Data & persistence

**This docs repo:** No database. All content is static markdown and compiled Angular assets. Doc metadata (IDs, titles, section groupings) is hardcoded in `DocsService` `DOC_ORDER` array. Language-specific content loaded at runtime from `public/docs/{en,es}/`.

**Documented Coveris application (sibling repo):**

- **PostgreSQL 16** — primary store for org units, employees, positions, assignments, tags, audit events, users.
- **Key entities (by name):** `Employee` (lifecycle FSM), `OrgUnit` (hierarchical demand tree), `Position` (weekly hour requirements + tag requirements), `Assignment` (supply-demand bridge FSM), `User` (ADR-014, OIDC-mapped fields), typed tags for contracts/certifications (ADR-019).
- **Auth tokens:** httpOnly cookies in dev (SimpleJWT HS256); Cognito-issued RS256 JWTs in prod — frontend never reads token values.
- **Media (planned):** S3 presigned uploads, bypassing backend binary proxy.
- **Topology:** Local Docker Compose (Postgres + Django); production same-origin via Amplify rewrite to App Runner + RDS in a single AWS region pattern described in `prod-aws.md`.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **Root agent reference** — `AGENTS.md`: QA role, 10 audit areas, finding prefixes, severity, parallel agent table, scoring formula, Brave CDP rules, script conventions.
2. **Angular app README** — `kdx-coveris-docs/README.md`: standard Angular CLI 21.2 scaffolding (serve, build, test).
3. **Product overview (ES)** — `public/docs/es/00-readme.md`: Coveris vision, four staffing questions, demand/supply/bridge domain, coverage equation.
4. **Conceptual guide (ES)** — `public/docs/es/00-home.md`: non-technical layer cake (org structure → roster → assignments → hour ledger → coverage analysis).
5. **PRD (ES)** — `public/docs/es/01-prd.md`: MVP scope, roles (MANAGER, SUPERVISOR, VIEWER, EMPLOYEE), in/out of scope, predecessor project lineage.
6. **API SSOT (ES)** — `public/docs/es/02-api.md`: URL conventions, auth cookie flow, resource endpoints, pagination, GDPR endpoints.
7. **ADR index (ES)** — `public/docs/es/adr-index.md`: Nygard format, 19 ADRs grouped by theme (conventions, stacks, API, auth, business rules, design system).
8. **Stack overview (ES)** — `public/docs/es/stack-overview.md`: full technology table, rejected alternatives, signal-first Angular rules.
9. **Production AWS (ES)** — `public/docs/es/prod-aws.md`: Amplify/App Runner/RDS/Cognito architecture, same-origin rewrite rationale, cost estimates.
10. **Dev setup (ES)** — `public/docs/es/dev-setup.md`: Docker Compose backend, frontend install/start, health-check verification table.
11. **AI context (ES)** — `public/docs/es/ai-context.md`: immutable stack table, API.md-first rule, Angular-as-thin-client, organigram as system core.
12. **AI registry (ES)** — `public/docs/es/ai-registry.md`: project agents (`coveris-adr-editor`, `coveris-prd-editor`, `prd-adr-expert`, `prd-inspector`) with model tiers.
13. **Docs service registry** — `kdx-coveris-docs/src/app/docs/docs.service.ts`: authoritative list of navigable doc IDs and sections.
14. **Skills lock** — `skills-lock.json`: pinned QA skill hashes from external sources.
15. **English locale** — `public/docs/en/` mirrors Spanish vault (confirmed present with parallel filenames).

### `.claude/` scan

**Not present in clone.** `.gitignore` lists `.claude/skills/qa-test-planner` and `.claude/skills/scoutqa-test` as third-party skill paths to exclude from version control. Agent instructions for Coveris development are instead embedded in `public/docs/es/ai-context.md` and `ai-registry.md`. Root `AGENTS.md` covers QA-agent behavior only.

### `.docs/` scan

**Not present in clone.** No hidden docs vault at repo root. All documentation content lives in `kdx-coveris-docs/public/docs/{en,es}/`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — summary describes content without clone URLs. Related public repos array intentionally empty per template rules.
- **Auth model (documented app):** Cookie-based JWT (dev) / Cognito OIDC (prod); CSRF on mutations; role-based access (MANAGER, SUPERVISOR, VIEWER, EMPLOYEE); ADMIN role exists internally but is not customer-facing.
- **Auth model (this docs portal):** No authentication on the SPA itself in current routes — documentation is intended for authorized viewers of the private repo or deployed private instance.
- **Security headers:** Configured for Angular dev server and static `_headers` file (frame denial, nosniff, referrer policy, permissions policy, XSS protection disabled per modern best practice).
- **QA scripts:** Read-only analysis; credentials only in `/tmp/` during audits per `AGENTS.md`; rate limiting expected.
- **This summary contains no secrets**, no `.env` values, no PEM keys, no connection strings with passwords, and no contents of gitignored paths.

## 10. Operational picture

### Local development (this repo)

```bash
cd kdx-coveris-docs
npm install   # or bun install per team preference on main Coveris monorepo
npm start     # ng serve — default port 4200
npm run build # production build to dist/
npm test      # Vitest unit tests
```

Documentation markdown is served as static assets; no separate docs server required.

### Documented Coveris full-stack local dev (sibling repos)

Per `dev-setup.md`: `docker compose up -d` for Postgres + Django on port 8000; frontend with Bun on port 4200; API proxy verified via `/api/health/`.

### Deployment

- **This docs Angular app:** No `.github/workflows` in clone. Static build output (`dist/frontend/browser` per prod docs) suitable for Amplify or any static host. `public/_headers` supports Cloudflare-style header injection.
- **Documented Coveris production:** Amplify (frontend CSR + CDN), App Runner (Docker/Uvicorn), RDS, ECR image pipeline, Cognito — manual or CI-driven deploy described in prod docs; not configured in this repo.

### QA audit operations

1. Run `qa-intake` skill → `config.json`
2. Verify Brave CDP on port 9222
3. Write `recon.md`
4. Spawn 10 parallel audit agents → category markdown files
5. Score and verdict in terminal
6. Optionally `python scripts/generate-report.py reports/<date>_<slug>/`

## 11. Open questions / unknowns

- **CI/CD for this repo:** No GitHub Actions workflows found in clone; deploy path for the docs portal itself is unknown.
- **`reports/template.html`:** Referenced by `generate-report.py` but `reports/` is gitignored and absent from clone — template may exist only in local working copies.
- **Root `kdx-coveris-docs/en` and `es` symlinks:** Gitignored per `.gitignore` (intended symlink to `kdx-ng-coveris/docs/`); actual symlink targets not present in shallow clone. Tracked content is under `public/docs/{en,es}/` instead.
- **Legal and pricing components:** `privacy.component.ts`, `terms.component.ts`, and `pricing-plans.component.ts` exist but are not registered in `app.routes.ts` — may be future routes or leftover scaffolding.
- **Default docs language:** `DocsService.lang` defaults to `'en'` but redirect lands on `00-home`; both locales appear complete (~44 files each).
- **Relationship to `kdx-ng-coveris` main app repo:** Docs describe `cotton-coveris-mvp` as active implementation; exact sync mechanism between main app repo and this docs repo's markdown vault is not defined in tree (symlink comment suggests manual or scripted sync).
- **Some QA scripts embed example target constants** (e.g. hardcoded external site in `http_security_scan.py`) — likely audit fixtures, not production endpoints for Coveris itself.
