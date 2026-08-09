---
id: "sdgd"
title: "SDGD — Healthcare HR Capacity Planning & Scheduling"
visibility: private
importance: high
source_repo: "SDGD"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "active"
related: []
tags: ["healthcare", "hr", "capacity-planning", "scheduling", "astro", "supabase", "postgresql", "vercel", "bun", "ddd", "ley-9539", "hospital-staffing"]
problems_solved:
  - "Hospital HR teams cannot see the gap between required staffing hours (demand/positions) and available staff hours (offer/employees) after legal reductions and assignments."
  - "Manual organigrams and spreadsheets fail to enforce Ley 9539 / Circular 4 work-hour rules, track audit trails, or generate cyclic hospital shift calendars."
  - "Cold-start onboarding of organizational structure and payroll from legacy Excel/CSV sources is slow and error-prone without a governed data model."
technologies:
  - "Astro 5 (SSR, server output)"
  - "Alpine.js 3 (progressive enhancement)"
  - "Tailwind CSS 3"
  - "TypeScript 5"
  - "Supabase / PostgreSQL 17"
  - "Zod validation"
  - "ExcelJS / xlsx (import/export)"
  - "Bun (package manager and dev runtime)"
  - "Vercel adapter (@astrojs/vercel)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# SDGD

> **Problem thesis (required):** SDGD (Sistema de Dimensionamiento y Gestión de Dotación) exists to turn static hospital organigrams into an operational **capacity-planning system** that measures and closes the gap between **demand** (positions defining required hours and skills) and **offer** (employees with contract regimes, reductions, and assignments). It adds a **scheduling module** for cyclic monthly calendars in clinical services, **legal validation** aligned with Ley 9539 and Circular 4, and **immutable audit logging** — all on a server-rendered Astro app backed by Supabase PostgreSQL with Row Level Security.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/SDGD` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Web application for healthcare HR administrators to model organizational units, define staffing demand, assign employees, calculate hour coverage, and generate hospital shift schedules under Argentine public-health labor rules. |
| Audience | RRHH Admin (single superuser role in MVP); internal developers and AI coding agents (Antigravity, Claude Code) maintaining the codebase. |

## 2. Problems it solves

### P1 — Demand vs. offer blindness in hospital staffing

- **Who hurts:** HR administrators, hospital operations planners, and clinical service chiefs who must ensure services are covered without over- or under-staffing.
- **Pain today:** Organigrams count people, not **hours and competencies**. Spreadsheets cannot reliably compute coverage after reductions (Circular 4, lactation, ministerial consignments, union leave), cross-grouping distribution for Régimen 38, or partial/vacant position states.
- **How this repo answers:** A PostgreSQL schema models **positions** (demand), **employees** (offer), and **assignments** (the cross). Generated columns (e.g. `assignments.horas_aporte_reales`) and a DDD hours engine (`EmployeeHoursLedger`, value objects, period strategies) compute real vs. required hours. UI pages (`structure`, `dashboard`, `organigram`, `payroll`) expose CRUD and visual assignment flows with impact preview.
- **Out of scope:** Full payroll processing, bidirectional integration with external SGA systems (only stable IDs for manual reconciliation), and multi-role workflows for department heads (planned post-MVP).

### P2 — Illegal or inconsistent assignments under Ley 9539

- **Who hurts:** HR compliance officers and administrators assigning staff across units, guard shifts, and mixed functions.
- **Pain today:** Rules like maximum assignments per person, UN vs. UT exclusivity, mandatory certifications (ACLS, PALS), and Circular 4 regime determination by majority hours are enforced inconsistently in manual processes.
- **How this repo answers:** `docs/06_LEGAL_RULES.md` and `src/lib/validations/legal-rules.ts` encode rules R-01 through R-04 as blocking errors and warnings. Assignment actions validate before write; scheduling adds `ConflictValidator` for double-booking, rest violations, skill mismatch, and uncovered slots.
- **Out of scope:** Automated legal interpretation beyond configured rules; complex leave management (operator assumes availability).

### P3 — Cyclic hospital scheduling without a governed calendar engine

- **Who hurts:** Anesthesiology, ICU, neonatology, and similar services that need monthly rotation grids with morning slots, guard shifts, and cyclic OR rotations.
- **Pain today:** Excel calendars break when rules change, rotations advance manually, and conflicts (consecutive shifts, hour caps) are caught too late.
- **How this repo answers:** Scheduling tables (`scheduling_slots`, `scheduling_rules`, `schedule_periods`, `schedule_entries`, `schedule_conflicts`, `rotation_sequences`) plus domain services (`RuleMatcher`, `RotationService`, `ScheduleGenerator`, `ExcelExporter`). UI at `src/pages/scheduling/` provides calendar, rules, and conflicts views; generation via Astro Actions and REST API routes.
- **Out of scope:** Full operating-room management module (documented as future `Future_Module_OR_Management.md`).

## 3. Product / idea

SDGD is an **SSR multi-page application** (Astro MPA, no React islands) where every page loads server-rendered HTML from Supabase queries and mutates state through **Astro Actions** (server-side, Zod-validated). The mental model is three intertwined domains:

1. **Structure** — hierarchical `organizational_units` (12 OU types from ministry to unit) containing `positions` that express operational demand (required hours, level N1–N9, load type, scheduling metadata).
2. **Staffing** — `employees` with contract type (`REGIMEN_27`, `REGIMEN_38`, `PRESTADOR`, etc.), reductions, consignments, and home OU; linked to positions via `assignments`.
3. **Scheduling** — per-OU monthly calendars built from JSON rule definitions, slot definitions, and rotation sequences, with conflict detection and Excel export.

Business logic lives in `src/lib/domain/` using DDD patterns (value objects, aggregates, strategies, decorators). Persistence is **server-only** — no client-side business state stores. Security relies on Supabase RLS (deny-by-default, authenticated policies) and audit triggers writing to `audit_logs`.

Deployment target is **Vercel** with the official Astro Vercel adapter (`output: 'server'`). Local development uses Bun and optionally Supabase CLI (`supabase/config.toml`, migrations under `supabase/migrations/`).

### 3.1 North-star use cases

1. **Define structure and demand** — Admin builds OU tree, creates positions (individually, bulk up to 150, or duplicate), views organigram, imports structure CSV (HU-03 partially pending).
2. **Staff and assign** — Admin registers employees with legal attributes, clicks a vacant position, selects from OU-filtered pool, previews hour impact, confirms assignment with legal checks; can move, soft-delete with undo toast.
3. **Schedule a service month** — Admin configures slots and JSON rules for an OU, generates a draft period, reviews conflicts, manually swaps or reassigns entries, exports Excel, advances rotations.

### 3.2 Non-goals

- Jefatura/Dirección roles with scoped write access (future phases).
- HR copilot chatbot (post-MVP).
- Full OR/spaceship-builder surgical scheduling module (spec exists, not implemented).
- Automatic bidirectional SGA sync.
- Client-side SPA routing or React component islands (explicit architectural red line per `docs/Architecture.md`).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Bun; TypeScript 5.9 | `package.json`, `AGENTS.md` |
| Frontend | Astro 5.16 SSR; Alpine.js 3; Tailwind 3; native Astro UI components | `package.json`, `astro.config.mjs`, `src/components/ui/` |
| Backend / API | Astro Actions; Astro API routes under `src/pages/api/` | `src/actions/`, `src/pages/api/` |
| Data | Supabase (PostgreSQL 17); RLS; SQL migrations and seeds | `supabase/`, `src/lib/supabase.ts`, `docs/Data_Model_Schema.md` |
| Infra / deploy | Vercel serverless adapter; no GitHub Actions CI in repo | `astro.config.mjs`, `AGENTS.md` § Despliegue |
| AI / agents | Mirrored skill trees in `.claude/` and `.agent/`; `AGENTS.md` inventory | `.claude/skills/`, `.agent/skills/`, `AGENTS.md` |
| Tests | Bun test runner; domain unit tests in `__tests__` folders | `src/lib/domain/**/__tests__/`, `.claude/skills/bun-test-runner/` |

### 4.1 Notable dependencies (curated)

- `@supabase/supabase-js` — typed client for all server reads/writes.
- `zod` — input validation on every Astro Action.
- `exceljs` / `xlsx` — ministerio ETL scripts and scheduling Excel export (xlsx externalized in Vite build).
- `@astrojs/vercel` — SSR deployment to Vercel.
- `alpinejs` — modals, toasts, light client interactivity without React.
- `astro-icon` — icon integration in layouts.
- `pg` (devDependency) — direct Postgres access in maintenance scripts.
- `supabase` CLI (devDependency) — local stack and migration workflow.

## 5. Repository map (abstraction)

- **Entrypoints (pages):** `src/pages/index.astro` (dashboard), `structure.astro`, `payroll.astro`, `organigram.astro`, `dashboard.astro`, `hours-demo.astro`, `login.astro`, `scheduling/index.astro` and `scheduling/[ouId]/{calendar,rules,conflicts}.astro`.
- **Domain / core:** `src/lib/domain/` — hours ledger, period strategies, scheduling generator/matcher/validator, legal validations, structure validators.
- **Adapters:** `src/lib/supabase.ts` (anon client), `src/lib/supabase-admin.ts` (elevated ops), `src/actions/*` (mutation layer), `src/pages/api/*` (JSON endpoints for scheduling and availability).
- **UI zones:** `src/components/ui/` (design-system primitives), `src/components/domain/` (structure, assignments, organigram), `src/components/layout/`, `src/layouts/Layout.astro`.
- **Docs vaults:** `docs/` (PRD, architecture, schema, scheduling, legal rules, roadmaps, session logs). **No `.docs/` directory present** in this clone.
- **Agent scaffolding:** `.claude/skills/` and `.agent/skills/` — parallel trees with SDGD-custom skills (`astro-mpa-alpine`, `astro-action-patterns`, `database-schema-validator`, `rls-policy-generator`, `prd-compliance-checker`, etc.) plus imported standard skills (frontend-design, supabase-postgres-best-practices, unit-testing). `AGENTS.md` is the human-facing skill index.
- **Database artifacts:** `supabase/migrations/` (30+ incremental SQL files), `supabase/seeds/`, `database/` (schema v2 scripts and migration helpers), `src/types/database.ts` and `database.types.ts`.
- **Operational scripts:** `scripts/` — ETL from ministerio Excel, backups, migration apply, OU/position repair utilities (operator tooling, not user-facing app).
- **Generated / vendor / ignored:** `dist/`, `.astro/`, `node_modules/`, `backups/`, `*.log` per `.gitignore` — not ingested for this summary.

## 6. Configuration & contracts (no secrets)

- **`PUBLIC_SUPABASE_URL`** — Supabase project API endpoint (placeholder in `.env.example`).
- **`PUBLIC_SUPABASE_ANON_KEY`** — Supabase anonymous key for SSR client (placeholder in `.env.example`).
- Supabase local stack ports defined in `supabase/config.toml` (API 54321, DB 54322, Postgres major version 17).
- Auth bootstrap documented in `docs/00_PROJECT_CONTEXT.md`: seed admin user via SQL in Supabase editor before RLS-gated testing; never commit real credentials.
- Vercel deployment expects env vars configured in hosting panel; build command `bun run build`.

### 6.1 HTTP / API endpoints (when applicable)

Astro **file-based API routes** (JSON):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `POST` | `/api/scheduling/generate` | Generate monthly schedule for OU (year/month) | Supabase session implied; not explicitly enforced in route handler |
| `GET` | `/api/scheduling/export` | Export schedule period to Excel | unknown — query params for period |
| `POST` | `/api/scheduling/entries` | Create schedule entry | unknown |
| `PATCH` | `/api/scheduling/entries` | Update schedule entry | unknown |
| `DELETE` | `/api/scheduling/entries` | Remove schedule entry | unknown |
| `POST` | `/api/scheduling/available-employees` | List employees available for slot/date | unknown |
| `GET` | `/api/employees/available` | Query available employees by OU/filters | unknown |

**Astro Actions** (server mutations, invoked from forms/JS; namespaced under `actions.server`):

| Namespace | Actions (high level) |
|-----------|---------------------|
| `units` | `create`, `update`, `delete`, `hardDelete` |
| `positions` | `create`, `createBulk`, `duplicate`, `update`, `delete`, `hardDelete`, `updateBulk`, `restore` |
| `employees` | `create`, `update`, `delete` |
| `assignments` | `create`, `getEmployeesByOU`, `getAssignmentPreview`, `assignEmployee`, `removeAssignment`, `restoreAssignment` |
| `auditLogs` | `getRecentLogs`, `getLogById` |
| `scheduling` | Slot CRUD (`createSlot`, `getSlots`, `updateSlot`, `deleteSlot`, `getSlotsByPosition`); rule CRUD; period (`getOrCreatePeriod`, `updatePeriodStatus`); generation (`generateSchedule`, `getSchedule`); entries (`createEntry`, `cancelEntry`, `reassignEntry`, `swapAssignments`, `assignManually`); rotations (`createRotation`, `advanceRotation`); conflicts (`resolveConflict`); `getEmployeeHours`, `getAvailableEmployees` |

**Page routes (SSR HTML, not JSON API):** `/`, `/login`, `/structure`, `/payroll`, `/organigram`, `/dashboard`, `/hours-demo`, `/scheduling`, `/scheduling/{ouId}/calendar`, `/scheduling/{ouId}/rules`, `/scheduling/{ouId}/conflicts`.

### 6.2 Other interfaces

- **CLI / scripts:** `scripts/etl-ministerio*.ts`, `scripts/backup-*.ts`, `scripts/apply-migration.ts` — one-off data ops run via Bun.
- **Supabase RPC:** SQL functions such as `get_ou_ancestors`, `get_ou_descendants`, `get_employees_in_ou`, `calculate_available_hours` (documented in `docs/Data_Model_Schema.md` and migration SQL).
- **Agent skills:** MCP-style skill markdown under `.claude/skills/*/SKILL.md` instructing agents on patterns (not runtime MCP servers).

## 7. Data & persistence

- **Primary store:** Supabase PostgreSQL with 16+ tables, 15 enums, views, triggers, and RLS policies (`docs/Data_Model_Schema.md` v2.1).
- **Core entities:** `organizational_units`, `positions`, `employees`, `assignments`, `audit_logs`, catalog tables (`catalog_levels`, `catalog_regimes`, `catalog_requirements`), `position_requirements`.
- **Scheduling entities:** `scheduling_slots`, `scheduling_rules`, `schedule_periods`, `schedule_entries`, `schedule_conflicts`, `rotation_sequences`.
- **Important computed fields:** `assignments.horas_aporte_reales` is DB-generated; application must not write it directly.
- **Topology:** Cloud-hosted Supabase for production data; Astro SSR on Vercel calls Supabase over HTTPS; optional local Supabase via CLI for development. No edge KV/vector stores. Audit log is append-only style via triggers.

## 8. Docs & agent memory (required scan)

1. **Root README** — still default Astro minimal starter template; **not representative** of actual product (evidence: `README.md`).
2. **`docs/` vault** — rich SSOT: `00_PROJECT_CONTEXT.md`, `PRD.md` (v2.0, MVP + scheduling), `Architecture.md`, `Data_Model_Schema.md`, `SCHEDULING_MODULE.md`, `HOURS_CALCULATION_ENGINE.md`, `06_LEGAL_RULES.md`, `ROADMAP.md`, `IMPLEMENTATION_PLAN.md`, UI/structure design docs, session summaries.
3. **`.claude/`** — 114 files: SDGD-custom agent skills enforcing Astro MPA + Alpine architecture, Supabase RLS, PRD compliance, CSV importers, bun tests.
4. **`.agent/`** — parallel Antigravity skill tree (~112 files) with high parity to `.claude/`.
5. **`AGENTS.md`** — authoritative agent onboarding: skill inventory table, data model summary, deployment notes.
6. **`SESSION_SUMMARY_2026-01-30.md`** (root) — schema v2.0 migration completion log.
7. **`SUPABASE_SETUP_LOG.md`** (root) — Supabase provisioning notes.
8. **`.docs/`** — **not present** in repository; all hidden docs live under `docs/` instead.

## 9. Security & privacy notes (summary-time)

- Repository is **private**; this summary describes purpose without clone or hosting links.
- Auth model: Supabase Auth with email/password login UI (`login.astro`); RLS policies require authenticated `auth.uid()` for core tables; dev migrations include controlled anon access for local testing (see migration names `dev_anon_access*`).
- All mutations intended to pass through Astro Actions for validation; audit trail on structural and assignment changes.
- **No secrets** in this document. `.env`, `.env.production`, credentials, and `backups/` are gitignored and were not read.

## 10. Operational picture

- **Local dev:** `bun install` → configure `.env` from `.env.example` → `bun dev` (Astro on port 4321 per starter README). Optional: `supabase` CLI for local DB per `supabase/config.toml`.
- **Build:** `bun run build` → `bun preview` for local SSR preview.
- **Deploy:** Vercel import + env vars; native Git push to `main` triggers build (per `AGENTS.md`; no `.github/workflows` present).
- **Data maintenance:** `scripts/backup-via-api.ts`, `scripts/apply-migration.ts`, ministerio ETL scripts for seeding from Excel exports.
- **Tests:** Domain unit tests under `src/lib/domain/**/__tests__/` (hours, scheduling date/generator/rule-matcher); run via Bun per skill docs.

## 11. Open questions / unknowns

- Root `README.md` was never replaced with product documentation — onboarding relies on `docs/README.md` and `AGENTS.md`.
- `docs/ROADMAP.md` (2026-01-28) may lag `docs/PRD.md` (2026-02-11) which marks scheduling MVP complete; sprint tasks for structure dashboard may be partially done (`src/pages/organigram.astro` exists).
- HU-03 CSV mass import is marked **pending** in PRD though sample CSVs (`structure_import.csv`, `staff_import.csv`) and `csv-importer-generator` skill exist.
- Production auth enforcement on `/api/*` routes not verified from manifests alone — handlers use shared Supabase client without obvious middleware gate in sampled files.
- No CI/CD pipeline in repo; quality gates depend on local/agent testing.
- `package.json` name still `temp-astro` at version `0.0.1` — cosmetic drift from product identity.
- React types appear in dependencies (`@types/react`) but architecture explicitly forbids React islands — likely residual or tooling artifact.
