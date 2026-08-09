---
id: "cotton-coveris-mvp-main-documentation"
title: "Coveris MVP — interactive ADR study and architecture documentation"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp-main-documentation"
org: "kodexArg"
default_branch: "main"
primary_language: "HTML"
repo_kind: "documentation"
status: "active"
related: []
tags: ["coveris", "adr", "architecture", "documentation", "github-pages", "static-site", "healthcare", "capacity-planning", "django", "angular", "integration-study", "orgunit", "scheduling"]
problems_solved:
  - "Integrating the Coveris-e branch into cotton-coveris-mvp-main risks blindly porting ten incoming ADRs (E-025–E-034) that conflict with 37 existing project ADRs — this repo makes those conflicts visible and actionable before any code merge."
  - "Architecture decisions from Coveris-e were written for a hospital-specific org model; the target project needs domain-agnostic OrgUnit design — the study documents where Coveris-e diverges and how to derive independent rules."
  - "Two high-stakes design questions — whether a unit manager is a special Position vs a role/presentation concern, and whether monthly scheduling introduces a second hours-arithmetic path — lacked a single navigable evidence base for product and engineering decisions."
technologies:
  - "Static HTML (single-file SPA)"
  - "Vanilla JavaScript (no framework)"
  - "Embedded Markdown renderer (client-side)"
  - "GitHub Pages (static hosting)"
  - "Referenced stack: Django 5.2 + DRF, Angular 21, PostgreSQL (from ADR metadata only)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Coveris MVP — interactive ADR study and architecture documentation

> **Problem thesis (required):** This repository is a **read-only architecture documentation vault** spun out of the main Coveris MVP codebase (`cotton-coveris-mvp-main`). It exists because the team is integrating features from the Coveris-e branch without linearly migrating its ADRs. The pain is decision paralysis: ten incoming ADRs (E-025 through E-034) touch org structure, weekly design boards, hours semantics, monthly scheduling, rotation, and holidays — and several **directly conflict** with accepted ADRs on the target branch (ADR-018, ADR-024, ADR-001-c, ADR-011, ADR-017). This repo delivers an interactive ADR map, three deep-dive research findings, and a priority-ranked theme analysis so architects can derive **their own** rules rather than copy Coveris-e wholesale.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/cotton-coveris-mvp-main-documentation` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Interactive, mobile-friendly ADR study site plus markdown research reports for reconciling Coveris-e architecture decisions with the agnostic OrgUnit vision of cotton-coveris-mvp-main. |
| Audience | Coveris architects, backend/frontend engineers evaluating the Coveris-e integration, product owners deciding org-model and scheduling semantics, and AI agents tasked with writing new project-specific ADRs. |

## 2. Problems it solves

### P1 — Incoming ADRs collide with accepted project ADRs

- **Who hurts:** Engineers on `coveris-b-integration` (target) merging code from Coveris-e (`cotton-coveris-mvp`, source branch) without a conflict map.
- **Pain today:** Coveris-e shipped ten accepted ADRs (E-025–E-034, skipping E-033) that reshape OrgUnit taxonomy, assignment hour semantics, weekly design boards, and monthly scheduling. The target branch already has 37 ADRs including ADR-011 (weekly-only hours), ADR-018 (Positions only on UNIT leaves), ADR-024 (`is_reinforcement` bar semantics), and ADR-001-c (five-color hour vocabulary). Adopting Coveris-e code without reconciling these produces incompatible models on the same API surface — e.g., `hours_source` (3-value enum, 3-band bar) vs `is_reinforcement` (boolean, blue-only extras).
- **How this repo answers:** `index.html` catalogs all 37 "here" ADRs and 9 "incoming" ADRs with side badges, status, verdicts (`ACCEPT`, `ACCEPT+MODS`, `NEEDS-DISCUSSION`, `DISCARD`, `KEEP-histórico`), conflict flags, searchable sidebar, filter chips (side/status/verdict/conflict), and three view tabs (ADRs, Themes by priority, Conflicts table). `source/coveris-e-adr-study.md` expands the eight priority themes with reconciliation tables mapping each conflict to a required decision. Full ADR texts for key incoming and conflicting "here" ADRs are embedded inline in the HTML for offline reading.
- **Out of scope:** Implementing any of the studied changes, maintaining live sync with the main repo's `docs/adr/` tree, or replacing the main project's ADR workflow. This is study material, not the SSOT for new ADR authoring.

### P2 — Coveris-e org model is hospital-specific; target vision is domain-agnostic

- **Who hurts:** Architects defining OrgUnit rules for a product meant to serve clinics, retail chains, or government hierarchies equally.
- **Pain today:** Coveris-e ADR E-027 replaced a configurable org-level catalog (E-026, superseded) with a **fixed five-level Spanish hospital taxonomy** (`CLINICA → AREA → DEPTO → SERVICIO → UNIDAD`), plus a `manager_position` OneToOne hack (`0.01h` for zero-hour managers, hard-delete on clear). The target project's north star is **OrgUnit agnostic** — generic depth levels with editable labels, English code identifiers (ADR-001-b), and no "clinic" baked into the schema.
- **How this repo answers:** Theme 1 in both `index.html` and `source/coveris-e-adr-study.md` is explicitly titled around the agnostic opportunity: take E-027's good ideas (depth derived from parent, manager as unit attribute not sibling node) while rejecting the fixed hospital enum. `source/jefatura-tratamiento-especial.md` is a dedicated finding that evaluates four options and recommends **rejecting** Coveris-e's `manager_position` model — a manager is not demand to cover, and forcing it into `Position` created all the hacks. The interactive banner in `index.html` states the governing decision: OrgUnit agnostic, manager is role/attribute not Position, weekly hours arithmetic is sacred (ADR-011).
- **Out of scope:** Final ADR text for the agnostic OrgUnit model (that belongs in the main repo once decided). Legal reconciliation of Argentine LCT four-level framing (ADR-021) with open depth levels is flagged as open but not resolved here.

### P3 — Weekly vs monthly backend boundary is easy to violate during integration

- **Who hurts:** Backend engineers porting Coveris-e's `scheduling` app and `Assignment` field extensions without breaking ADR-011.
- **Pain today:** Monthly scheduling (E-029) adds `ShiftInstance` snapshots and `AssignmentException` date divergences — architecturally sound as read-time projection over weekly assignments. But Coveris-e also introduced `Assignment.effective_weekly_hours = effective_hours × (_weeks_of_month / 4)`, reintroducing the exact "4 weeks per month" scaling artifact ADR-011 explicitly eliminated. This creates **two competing weekly-hour definitions**: the ledger uses `effective_hours`; coverage and capacity use the month-averaged field — they diverge for recurrent assignments.
- **How this repo answers:** `source/semanal-vs-mensual-backend.md` is a full research report with a persistence-vs-projection table, the protected invariant ("weekly is the only hours arithmetic"), documented Coveris-e violations, and five design recommendations including "do NOT port `effective_weekly_hours`." Theme 4 in the interactive map marks E-029 as `ACCEPT+MODS` with the modification called out. ADR-011 is flagged as an invariant (`isKey: true`) in the ADR catalog.
- **Out of scope:** Implementing `scheduling` app tables, payroll export source selection, or timesheet (`actual_hours`) dimension — all deferred with open questions listed in the finding.

## 3. Product / idea

The repository is **not an application** — it is a **documentation product** consisting of one self-contained static web page and three companion markdown research reports. The mental model is a **decision-support atlas** for a larger integration effort:

1. **Browse** the ADR landscape (what exists on the target branch vs what Coveris-e proposes).
2. **Filter** by conflict, verdict, or topic to find blockers.
3. **Read** priority-ranked themes (8 topics from OrgUnit agnosticism through StaffingPlanLine).
4. **Drill into** full ADR text for the highest-risk items without cloning the main repo.
5. **Consult** standalone findings for the two most contentious design questions (manager modeling, weekly/monthly boundary).

The interactive page (`index.html`, ~104 KB) is a zero-dependency single-file SPA: dark-theme CSS, responsive sidebar with mobile drawer, client-side Markdown renderer (`md()` function), expandable ADR cards, accordion for full texts, and JavaScript data structures (`ADRS`, `THEMES`, `CONFLICTS_DATA`, `ADR_TEXT`) holding all catalog metadata. It references ADR files in the main repo by relative path (`docs/adr/adr-*.md`) for entries without embedded full text — those links assume co-deployment context but the page is self-sufficient for the 15+ ADRs with inline `ADR_TEXT` blocks.

The three `source/*.md` files are the **authoritative long-form analysis**; the HTML is the navigable index built from that analysis plus metadata from the main project's ADR tree.

Relationship to sibling repos:
- **`cotton-coveris-mvp-main`** — the target application branch (`coveris-b-integration`) whose ADRs are cataloged as "here."
- **`cotton-coveris-mvp`** (Coveris-e branch) — the source of incoming ADRs E-025–E-034 and the Django apps (`weekly_structure`, `scheduling`) under study.
- **`coveris`** — the broader product family; this doc repo is a narrow integration-study slice.

### 3.1 North-star use cases

1. **Architect onboarding** — A new team member opens the interactive map, filters `conflict: yes`, and reads the seven documented ADR collisions before touching integration code.
2. **ADR authoring** — Before writing "our" OrgUnit ADR, the architect reads Theme 1 + `source/jefatura-tratamiento-especial.md` and records the decision to use presentation-pure management (ADR-018) or promote to role/relationship (Option 3), never Coveris-e's OneToOne Position hack.
3. **Integration scoping** — Engineering lead uses verdict badges to build a phased port plan: accept E-030/E-031/E-034 outright; accept E-029/E-032 with modifications; block E-027/E-028 pending ADR rewrites of ADR-018/024/001-c.

### 3.2 Non-goals

- Not a build artifact, npm package, or deployable API service.
- Not a live mirror of the main repo's `docs/adr/` directory (37 ADRs are summarized/metadata-only except selected full texts embedded in HTML).
- Not credential storage — explicitly states no personal data or secrets (`README.md`).
- Does not prescribe final product features; it frames **decisions to make** (five design questions listed in `source/coveris-e-adr-study.md`).
- StaffingPlanLine (Theme 8) is flagged "radar only" — no formal verdict because Coveris-e never wrote a dedicated ADR for it.

## 4. Technology stack

This repo itself is minimal static content. The **studied** application stack is inferred from ADR metadata embedded in `index.html` and cross-referenced in markdown findings (not from manifests in this repo — there is no `package.json`, `pyproject.toml`, or CI config here).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language (this repo) | Static HTML + vanilla JS | `index.html` (sole executable artifact) |
| Frontend (studied project) | Angular 21, PrimeNG, Tailwind v4, Vitest | `index.html` ADR-002-b, ADR-012 entries |
| Backend (studied project) | Python 3.13, Django 5.2, DRF, PostgreSQL 16, pytest | `index.html` ADR-002-a; `source/semanal-vs-mensual-backend.md` code path refs |
| Data (studied project) | PostgreSQL; apps `demand`, `assignments`, `offer`, `weekly_structure`, `scheduling` | `source/coveris-e-adr-study.md`; findings reference model paths |
| Infra / deploy (this repo) | GitHub Pages static hosting | `README.md` (mentions published interactive report) |
| Infra / deploy (studied project) | Docker Compose local; AWS App Runner + Amplify + RDS (MVP target, out of scope) | `index.html` ADR-003 entries |
| AI / agents | ADR-007 Agent Architecture referenced in studied project | `index.html` ADR-007 entry; no `.claude/` in this repo |
| Tests | Vitest (FE), pytest (BE) — studied project only | `index.html` ADR-009 entries (draft) |

### 4.1 Notable dependencies (curated)

- **None in this repo** — zero `package.json`, lockfiles, or Python manifests. The page has no external CDN dependencies; all CSS and JS are inline.
- **`holidays` PyPI package** — referenced in studied E-029/E-031 context for national holiday cache (`source/coveris-e-adr-study.md`, Theme 7); not a dependency of this documentation repo.
- **Embedded `ADR_TEXT` object** — the interactive page's primary "dependency" is its own ~50 KB of inline ADR full texts and metadata arrays, making it fully offline-capable once loaded.

## 5. Repository map (abstraction)

- **Entrypoints:** `index.html` — the entire interactive application; open in browser or serve via GitHub Pages as site root.
- **Domain / core:** `source/coveris-e-adr-study.md` — the master 8-theme integration analysis (E-025–E-034 → project rules); this is the intellectual core of the repo.
- **Adapters:** None — no HTTP server, no build pipeline, no API clients.
- **Docs vaults:** `source/` holds three specialized findings; `README.md` is the index card. No `docs/`, `.docs/`, or `ADR*` directory in this repo (ADRs live in the main app repo).
- **Agent scaffolding:** **Not present.** Scanned: no `.claude/`, `.agents/`, `SKILL.md`, or harness files. Agent-related content exists only as **metadata about** ADR-007 in the studied project's ADR catalog inside `index.html`.
- **Generated / vendor:** `.git/` only; no `node_modules`, `dist`, or build artifacts.

### Zone summary

| Zone | Path | Role |
|------|------|------|
| Interactive atlas | `index.html` | SPA: search, filter, 37+9 ADR cards, 8 themes, 7 conflicts, embedded full texts |
| Master study | `source/coveris-e-adr-study.md` | Priority-ranked analysis of all Coveris-e ADR themes |
| Manager finding | `source/jefatura-tratamiento-especial.md` | Four-option evaluation; recommends against E-027 manager_position |
| Weekly/monthly finding | `source/semanal-vs-mensual-backend.md` | Invariant protection; anti-patterns in Coveris-e scheduling |
| Index | `README.md` | Contents list and publication pointer |

## 6. Configuration & contracts (no secrets)

This repo has **no environment variables, no secrets, no build configuration, and no runtime configuration files**. The studied project's configuration is documented abstractly through ADR references:

- **ADR-006** — env var conventions for the main app (`.env` local, `.env.example` committed, no secrets in repo).
- **ADR-008** — JWT httpOnly cookies (dev) vs Cognito (prod target).
- **Business rule severities** — BLOCKING / WARNING / INFO per ADR-010; `MAX_WEEKLY_HOURS=60` BLOCKING per ADR-021.

No `.env`, `wrangler.jsonc`, `docker-compose`, or credentials files exist in this documentation repo.

### 6.1 HTTP / API endpoints (when applicable)

**This repository exposes no HTTP API.** It is a static documentation site. When served via GitHub Pages, it delivers:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` (or `/index.html`) | Interactive ADR study SPA | none (static public page when Pages enabled) |
| `GET` | `/source/*.md` | Raw markdown findings (if Pages serves them) | none |

**Studied project API surface** (documented in findings, not implemented here) — key endpoints referenced in the integration analysis:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `POST` | `/org-units/:id/manager` | Coveris-e manager slot upsert (recommended: do NOT port) | session (studied app) |
| `DELETE` | `/org-units/:id/manager` | Coveris-e manager slot clear with hard-delete | session (studied app) |
| `GET` | `/employees/{id}/capacity/` | Hours capacity breakdown (E-028) | session (studied app) |
| `GET` | `/demand/{id}/eligible-employees/` | Staffing eligibility preview (E-028) | session (studied app) |
| `GET` | `/scheduling/{ou}/{y}/{m}/` | Monthly projection view (E-029) | session (studied app) |
| `POST` | `/scheduling/{ou}/{y}/{m}/publish/` | Materialize ShiftInstance snapshot (E-029) | session (studied app) |
| `GET` | `/calendar/holidays/` | National holidays cache (E-029/E-031) | session (studied app) |

### 6.2 Other interfaces

- **Browser UI contract:** Sidebar search (`#searchInput`), filter buttons (side/status/verdict/conflict), view tabs (`adrs` / `themes` / `conflicts`), expandable ADR cards (`toggleCard`), accordion full-text reader (`toggleAccordion`), mobile drawer (`openDrawer`/`closeDrawer`).
- **Markdown source files:** Plain markdown with optional YAML frontmatter (`source/coveris-e-adr-study.md` has `title`/`tags` frontmatter); readable directly or rendered by the HTML page's `md()` parser.
- **Cross-repo ADR links:** Cards without embedded text link to `docs/adr/{filename}` paths expected in the main application repository.

## 7. Data & persistence

**This repo persists nothing at runtime.** All content is static files in git.

Conceptual data model (documented, not stored here):

- **ADR catalog** — 46 entries (37 target + 9 incoming) with fields: `id`, `num`, `title`, `side` (here/incoming), `status`, `verdict`, `topic`, `summary`, `conflicts[]`, `fullText` key, `file` path, optional `isKey`/`isConflict` flags (`index.html` `ADRS` array).
- **Theme index** — 8 priority themes linking here/incoming ADR ids with verdict summaries (`THEMES` array).
- **Conflict registry** — 7 pairwise conflicts with type and recommended action (`CONFLICTS_DATA` array).
- **OrgUnit model (studied)** — migration from `OrgUnitType` enum to `depth` integer; agnostic vs hospital-fixed taxonomy debate.
- **Scheduling model (studied)** — `AssignmentException` (date divergences, persist) + `ShiftInstance` (publish snapshot, persist) vs virtual monthly projection (no persist).
- **Hours model (studied)** — weekly ISO ledger as sole arithmetic; monthly as read-time aggregation only (ADR-011 invariant).

Topology: static edge-hosted documentation (GitHub Pages) with no database, no KV, no vector index. The studied application's PostgreSQL models are referenced for architectural context only.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **`README.md`** — Repo purpose, file manifest, publication note, no-secrets declaration.
2. **`index.html`** — Full interactive structure: ADR catalog (46 entries), 8 themes, 7 conflicts, embedded ADR texts (E-025–E-034, ADR-011/018/020/024/001c), UI behavior, governing banner decisions.
3. **`source/coveris-e-adr-study.md`** — Master 8-theme integration analysis with reconciliation table, design questions, supersession notes.
4. **`source/jefatura-tratamiento-especial.md`** — Manager-as-Position vs role/presentation finding with four options and recommendation.
5. **`source/semanal-vs-mensual-backend.md`** — Weekly-only invariant, persistence table, Coveris-e `effective_weekly_hours` anti-pattern.

### Scans with negative results (confirmed absent)

- **`.claude/`** — not present in repository tree.
- **`.docs/`** — not present.
- **`docs/`** — not present (ADR files referenced by path point to main repo).
- **`.agents/`, `SKILL.md`, harness/constitution files** — not present.
- **`package.json`, `pyproject.toml`, CI workflows, `wrangler.jsonc`** — not present.

Agent-relevant content is **indirect**: ADR-007 ("Agent Architecture") appears as a catalog entry in `index.html` describing the studied project's AI agent patterns, skills, and context tiers — but this documentation repo does not contain agent instruction trees itself.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` GitHub repo. This summary contains no clone URLs or live credentials. The interactive site may be published to GitHub Pages (per `README.md`); that is a separate public-surface decision for static HTML with no backend secrets.
- **Auth model:** None for this repo's content. The studied application uses JWT httpOnly cookies (dev) and targets Cognito/OIDC (prod) per embedded ADR-008 metadata.
- **Data sensitivity:** Documentation explicitly states no credentials or personal data (`README.md`). Research findings reference code paths and ADR line numbers from the studied repos but contain no `.env` values, tokens, or connection strings.
- **Hard-delete concern:** Finding documents that Coveris-e's manager slot clear violates studied ADR-017 (append-only audit) — flagged as integration risk, not practiced in this repo.

## 10. Operational picture

### Local use

- Open `index.html` directly in a browser, or serve the repo root with any static file server.
- Read `source/*.md` in any markdown viewer or editor.
- No install step, no `bun install`, no build command.

### Deployment

- **GitHub Pages** from this repository's `main` branch serving `index.html` at repo root — indicated in `README.md` as the published interactive report location. No GitHub Actions workflow file exists in this repo; Pages is likely configured via repository settings (branch/folder publish).
- No Docker, no Cloudflare Workers, no server process.

### Hardware constraints

None. Static HTML runs on any modern browser; mobile-responsive layout with touch-optimized controls (44px min tap targets, drawer navigation under 768px breakpoint per `index.html` CSS).

## 11. Open questions / unknowns

1. **GitHub Pages workflow** — No `.github/workflows/` or Pages config file in repo; exact publish mechanism (branch vs Actions) unknown from tree alone.
2. **Sync cadence with main repo** — Unknown whether `index.html` ADR metadata is manually updated or generated from `cotton-coveris-mvp-main/docs/adr/`; no generator script present here.
3. **E-033** — Number skipped in Coveris-e sequence; no ADR exists (noted in study, reason unknown).
4. **StaffingPlanLine** — Code-level entity in Coveris-e `demand` app without dedicated ADR; Theme 8 flagged for future ADR if adopted.
5. **Final OrgUnit depth model** — Open: fixed 5 levels vs open N vs configurable labels only; product decision pending.
6. **`hours_source` vs `is_reinforcement`** — Unresolved unification; ADR-024 rewrite required if E-028 adopted.
7. **Weekly board auto-reconcile vs explicit publish** — E-025 wanted sandbox; E-026/E-027 made tablero→Position automatic; target must choose consciously.
8. **FE derivation of manager badge** — Option 4 (presentation-pure) requires confirming FE can resolve "who heads this unit" from existing tags/assignments without new backend fields.
9. **Payroll export source** — When built, snapshot (`ShiftInstance`) vs aggregated weekly balance — deferred per E-029 scope notes in finding.
10. **Related repo `coveris`** — Broader product repo exists in same org; relationship to this narrow integration-study repo is contextual, not encoded in `related:` frontmatter (private repo constraint: `related: []`).
