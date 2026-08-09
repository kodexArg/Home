---
id: "api-python-debo"
title: "API Python DEBO — read-only MSSQL facade for YPF station operations"
visibility: private
importance: high
source_repo: "api-python-debo"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags:
  - "python"
  - "fastapi"
  - "mssql"
  - "pymssql"
  - "read-only"
  - "cqrs"
  - "gas-station"
  - "ypf"
  - "accounting"
  - "bdd"
  - "tdd"
  - "sdd"
  - "hexagonal-architecture"
  - "windows-service"
  - "specification-driven"
problems_solved:
  - "Internal staff must query operational and commercial data locked inside the legacy DEBO MSSQL database without direct SQL access, risking writes or inconsistent interpretations of turn schedules and account balances."
  - "Fuel sales, client balances, portfolio aging, and invoice due-date reports require domain-specific business rules (operational day boundaries, debt-cycle anchors, fuel-type catalogs) that raw DEBO screens do not expose as stable JSON APIs."
  - "A small LAN team needs authenticated, auditable HTTP endpoints that can later run as a native Windows Service on the SQL host with zero OS-level driver dependencies."
technologies:
  - "Python (planned application; greenfield)"
  - "FastAPI + Uvicorn + Pydantic v2"
  - "pymssql (FreeTDS wheels, uv-installable)"
  - "SQLAlchemy Core (engine/pool only, no ORM)"
  - "pytest + pytest-bdd"
  - "Microsoft SQL Server — DEBO database (read-only consul user)"
  - "SQLite (audit.db for request audit trail)"
  - "uv (package manager; no pip)"
  - "Windows Server native service (production target)"
  - "Obsidian markdown vault + markdown-vault-mcp (docs authoring)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# API Python DEBO

> **Problem thesis (required):** This repository specifies and will implement a **read-only API facade** (CQRS-style read model) over the transactional MSSQL database **DEBO**, which backs two YPF-branded fuel stations under a single legal entity. Today the repo is **specification-complete but code-absent** (`src/`, `tests/`, and `pyproject.toml` do not exist yet). The pain it attacks: internal analysts, collections staff, and commercial users cannot safely or consistently pull fuel-volume reports, client balances, portfolio summaries, and invoice-aging data without opening DEBO directly — where turn boundaries cross midnight, balances are computed not stored, and naming is ambiguous across ~28k clients. The planned service exposes Spanish JSON endpoints with Bearer API-key auth, never mutates DEBO, and deploys eventually as a Windows Service co-located with SQL.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/api-python-debo` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | A specification-driven, read-only Python API that transforms DEBO MSSQL rows into internal JSON endpoints for YPF station fuel sales and accounts-receivable workflows. |
| Audience | Internal operators at KM 1107 stations (commercial, collections, admin); AI coding agents following `CLAUDE.md` and the BDD→TDD→BUILD chain; future PydanticAI tool consumers (post-MVP). |

## 2. Problems it solves

### P1 — Safe read access to a live transactional DEBO database

- **Who hurts:** Internal staff who need reports without DB credentials or SQL literacy; operators who must not risk writes on the station management system's live database.
- **Pain today:** DEBO is the system of record written by the station POS/back-office stack. Direct SQL access is dangerous, credentials are sensitive, and even read queries can lock or contend with live operations if done carelessly.
- **How this repo answers:** Four-layer read-only defense (ADR 007): (1) MSSQL user `consul` with `db_datareader` only; (2) TLS connection without write autocommit; (3) application repository exposing only parameterized SELECT paths; (4) server-side aggregation with `READ UNCOMMITTED` / `NOLOCK` to avoid locking the operational DB. Code policy: **only SELECT**, never `INSERT/UPDATE/DELETE/EXEC`. Tests isolate DEBO via injectable fakes; integration tests are opt-in against the LAN SQL host.
- **Out of scope:** Any write path, schema migration, replication, or replacement of DEBO as system of record.

### P2 — Correct business semantics for fuel sales and account balances

- **Who hurts:** Commercial analysts comparing shift performance; collections staff reconciling client debt; anyone who mis-reads DEBO's midnight turn boundaries or naïve balance sums.
- **Pain today:** Fuel liters live in planilla tables (`ATURNOSS`/`ATURNOST`) with operational-day rules when night shifts cross midnight. Client balances are **calculated** (`Σ debits − Σ credits`), not stored in `CLIENTES.MCC` (that field is credit limit). Naïve historical sums diverge wildly from DEBO screens (verified: client 27 full-history sum +2,500.93 vs real −122,242.07). Names are non-unique (~28k clients, ~27k distinct names).
- **How this repo answers:** Extensive live documentation in `docs/MSSQL-MODEL.md` with verified SQL, operational-day CASE rules, MTN→turn mapping, debt-cycle anchor ("last point without debt"), and open-item logic for aging. User stories US-001–US-004 encode acceptance criteria, Gherkin scenarios, and TDD test maps. Hexagonal architecture keeps domain rules pure and testable without the database.
- **Out of scope:** Real-time intraday dispatch union (`HSURTIDO` ∪ `ESURTIDO`) for US-001 (planilla-closed liters only); full historical balance without anchor strategy.

### P3 — Repeatable, agent-friendly delivery of internal HTTP APIs

- **Who hurts:** Developers and LLM agents implementing endpoints without drifting from agreed behavior; ~5 LAN users needing per-person audit trails.
- **Pain today:** Ad-hoc scripts would duplicate queries, diverge from DEBO UI semantics, and lack auth. No single SSOT for route names — known drift between BDD Gherkin (`/ventas/turno-dia`) and TDD/API (`/ventas/semana`) flagged as blocking reconciliation.
- **How this repo answers:** Specification-Driven Development (ADR 004): **BDD → documentation → TDD → BUILD**, with `docs/API.md` as endpoint SSOT (ADR 008). Static Bearer API keys per person with roles (`admin`, `cobranzas`, `comercial`) and SQLite audit middleware (ADR 009). Agent hooks enforce API.md sync, TDD-first prompts, and BDD close-loop review. Skills (`bdd-usecase-review`, `tdd-test-review`, `mssql`) guide iteration closure.
- **Out of scope:** External IdP/SSO, JWT login flows, Docker orchestration, public internet exposure.

## 3. Product / idea

The central idea is an **API facade** — not a protocol proxy. The service **reads** DEBO, **applies business rules**, and **publishes JSON** for internal consumers. It is the query side of a lightweight CQRS split: DEBO remains authoritative for writes; this service is read-only.

### Business context

Two YPF "Full" stations share legal entity **KM 1107**:

| Trade name | Default? | Notes |
|------------|----------|-------|
| KM 1151 | Yes | Uspallata, Mendoza — default when docs say "the station" |
| Las Bóvedas | No | Same legal entity |

Operations run 24/7 in three canonical shifts (Night, Morning, Afternoon) with approximate hours (ADR 003). Sectors: **Tienda** (convenience store) and **Playa** (fuel: Pesados / Livianos). Fuel types are static constants mapped from DEBO product codes: INFINIA, NS XXI, GO-INFINIA DIESEL, D.DIESEL500; everything else is `OTROS` (liters apply only to the four fuels).

### Architecture mental model (planned)

```
[Internal client] --Bearer API key--> [FastAPI inbound adapter]
                                              |
                                    [Application use cases]
                                              |
                         +--------------------+--------------------+
                         |                    |                    |
                   [Domain rules]      [Ports/Protocols]    [Auth + audit]
                         |                    |
                         +--------> [MSSQL read adapter: pymssql + SA Core]
                                              |
                                         [DEBO READ ONLY]
```

Hexagonal layout (from `docs/PLAN-IMPLEMENTACION.md`): `domain/` (pure, no Pydantic), `application/` + `ports/` (use cases, contracts), `adapters/` + `infrastructure/` (FastAPI, pymssql, SQLite audit). Open/Closed + Strategy patterns isolate query strategies and partial debt-anchor algorithms behind ports; integration tests act as oracle for unresolved balance anchors.

### 3.1 North-star use cases

1. **US-001 — Weekly fuel sales:** `GET /ventas/semana` returns liters grouped by operational date, shift, and fuel type for the current Monday–now window.
2. **US-002 — Single-client AR:** Resolve client by code or name; return balance, total debt (balance + pending delivery notes), or running account statement anchored at last debt-free point.
3. **US-003 — Portfolio balances:** Paginated all-clients balance report matching DEBO's "Saldos de Clientes" export semantics.
4. **US-004 — Invoice aging:** Per-client or portfolio overdue invoices with mora interest, aging buckets (Corriente, 1-30, 31-60, 61-90, +90).
5. **US-000 — Cross-cutting auth:** Every endpoint requires `Authorization: Bearer <token>`; audit log per request.

### 3.2 Non-goals

- Writing to DEBO or any downstream system.
- Docker-based deployment (explicitly rejected in ADR 002).
- `pyodbc` / OS-level ODBC driver installation (rejected in ADR 007).
- PydanticAI agent layer in MVP (noted as future; stack chosen to reuse Pydantic models).
- Exposing the service on the public internet.
- Replacing DEBO UI workflows entirely — this complements, not supplants, the station system.

## 4. Technology stack

Derived from ADRs and `docs/PLAN-IMPLEMENTACION.md`. **No `pyproject.toml` exists yet** — versions are architectural decisions, not locked manifests.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.x (target); `uv` for env/deps | `docs/adrs/007-stack-tecnico-y-acceso-a-datos.md`, `CLAUDE.md` |
| HTTP / API | FastAPI, Uvicorn, Pydantic v2 | ADR 007, `docs/TDD.md` |
| Database driver | pymssql (wheels with embedded FreeTDS) | ADR 007 |
| DB pooling | SQLAlchemy Core engine only | ADR 007, `docs/PLAN-IMPLEMENTACION.md` §5 |
| Data store (read) | MSSQL `DEBO` on Windows Server LAN host | `docs/PRD.md` §6–7, ADR 002 |
| Data store (audit) | SQLite `audit.db` (git-ignored) | ADR 009, `docs/TDD.md` US-000 |
| Auth | Static Bearer API keys from `.env` | ADR 009 |
| Tests | pytest, pytest-bdd; `@pytest.mark.integration` for live DEBO | ADR 006, `docs/TDD.md` |
| Docs tooling | Obsidian vault conventions, markdown-vault-mcp | `.mcp.json`, `.obsidian/snippets/` |
| Deploy (prod) | Native Windows Server service | ADR 002, `docs/PRD.md` §8 |
| Deploy (MVP) | Debian Linux on LAN, host override to SQL IP | ADR 002 |

### 4.1 Notable dependencies (curated, planned)

- **FastAPI** — HTTP surface, OpenAPI `/docs`, `HTTPBearer` security scheme.
- **pymssql** — MSSQL access without OS ODBC drivers; portable Linux→Windows.
- **Pydantic / pydantic-settings** — Request/response contracts and `.env` loading.
- **SQLAlchemy Core** — Connection pooling only; queries remain explicit parameterized SQL.
- **pytest-bdd** — Gherkin scenarios from `docs/bdd/*.md` drive tests.
- **python-dotenv** — Environment configuration (keys and DB creds git-ignored).

## 5. Repository map (abstraction)

The tree is **documentation- and agent-scaffolding-heavy**; application code is not yet present.

- **Agent SSOT:** `CLAUDE.md` — project rules, doc index, invariant READ ONLY policy, MSSQL-MODEL live-doc protocol.
- **Product specs:** `docs/PRD.md` (business scope), `docs/BDD.md` + `docs/bdd/000–004-*.md` (user stories + Gherkin), `docs/TDD.md` (technical design per US), `docs/API.md` (endpoint SSOT — only US-001 declared today).
- **Architecture decisions:** `docs/adrs/000–009-*.md` — glossary, deployment, temporal model, dev flow, BDD/TDD templates, stack, API format, auth.
- **Implementation plan:** `docs/PLAN-IMPLEMENTACION.md` — hexagonal structure, BUILD sequencing, open design debt register (~1.1k lines, no production code).
- **Data model live doc:** `docs/MSSQL-MODEL.md` — verified DEBO tables, queries, findings (planillas, ledger, aging).
- **Reference exports:** `context/*.xlsx` — sample DEBO Excel reports for reconciliation (not ingested as code).
- **Agent scaffolding (`.claude/`):**
  - `rules/` — mirrors ADRs for in-session agent context.
  - `hooks/` — `api_md_sync.sh` (post-edit API.md check), `tdd_first_prompt.sh` (endpoint work nudge), `bdd_close_loop.sh` (iteration BDD review).
  - `skills/mssql/` — read-only SQL query skill with `connections.example.json` pattern (real `connections.json` git-ignored).
  - `settings.json` — hook wiring.
- **Shared agent skills (`.agents/skills/`):** `bdd-usecase-review`, `tdd-test-review` — end-of-iteration doc hygiene.
- **Editor / MCP:** `.mcp.json` (markdown-vault-mcp read-only), `.vscode/settings.json`, Obsidian CSS snippet.
- **Missing (planned):** `src/` (hexagonal packages), `tests/` (unit/integration/bdd), `pyproject.toml`, root `README`.
- **`.docs/`:** not present; all vault docs live under `docs/`.

## 6. Configuration & contracts (no secrets)

Configuration is **specified** to live in git-ignored `.env`. Values must never be committed or quoted in summaries.

### Environment variables (names + purpose)

| Variable pattern | Purpose |
|------------------|---------|
| `MSSQL_HOST` | SQL host (`localhost` in prod on SQL server; overridden at runtime on dev Linux) |
| `MSSQL_USER` | Read-only DB user (documented name: `consul`) |
| `MSSQL_PASS` | DB password |
| `MSSQL_DB` | Database name (`DEBO`) |
| `API_KEY_<PERSONA>` | Opaque Bearer token per user (e.g. `API_KEY_ADMIN`, `API_KEY_MAURICIO`) |
| `AUTH_PERSONA_<PERSONA>` | Role assignment (`admin`, `cobranzas`, `comercial`) |
| `AUDIT_DB_PATH` | SQLite audit database path (default `./audit.db` or `/data/audit.db`) |

Startup **fail-fast** if any expected `API_KEY_*` or `AUTH_PERSONA_*` is missing or if token collision occurs.

### 6.1 HTTP / API endpoints (when applicable)

Auth for all business routes: `Authorization: Bearer <token>`. Roles currently flat (all roles access all endpoints); architecture supports per-route restriction.

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/ventas/semana` | Weekly fuel liters by day, shift, fuel type (US-001) | Bearer |
| `GET` | `/clientes` | Resolve client candidates by name query (`?nombre=`) — 0/1/N results (US-002) | Bearer |
| `GET` | `/clientes/{cod}/saldo` | Client balance for debt cycle window (US-002) | Bearer |
| `GET` | `/clientes/{cod}/deuda` | Total debt = balance + pending delivery notes (US-002) | Bearer |
| `GET` | `/clientes/{cod}/estado-cuenta` | Running account statement (US-002) | Bearer |
| `GET` | `/clientes/saldos` | All-clients portfolio balance report, paginated (US-003) | Bearer |
| `GET` | `/clientes/{cod}/vencimientos` | Client invoice aging / due dates (US-004) | Bearer |
| `GET` | `/vencimientos` | Portfolio-wide aging report (US-004) | Bearer |
| `GET` | `/openapi.json` | OpenAPI schema with `BearerAuth` | none for schema fetch |
| `GET` | `/docs` | FastAPI Swagger UI | none (LAN-internal assumption) |

**SSOT gap:** `docs/API.md` currently declares **only** `GET /ventas/semana`. US-002–US-004 and US-003 pagination envelope (`pagina`, `page_size`, `total`) are designed in TDD/PLAN but must be added to `API.md` before BUILD per ADR 004/008.

**Known route inconsistency (blocking):** US-000 BDD Gherkin references `GET /ventas/turno-dia` while TDD integration tests and `API.md` use `GET /ventas/semana`. Canonical name must be decided in `API.md` first, then propagated.

### 6.2 Other interfaces

- **CLI (mssql skill):** `.claude/skills/mssql/scripts/query.py` — agent-invoked read-only SQL against configured connections (development/scouting only; not the production API surface).
- **MCP:** `markdown-vault-mcp` serves the docs tree read-only for agent navigation.
- **Claude hooks:** shell hooks on edit/prompt/stop events — not user-facing APIs.
- **Windows Service:** planned production interface (no systemd unit in repo yet).

## 7. Data & persistence

### DEBO (MSSQL, read-only)

Primary transactional store. Key table groups documented in `docs/MSSQL-MODEL.md`:

| Domain | Tables (names only) | Role |
|--------|---------------------|------|
| Fuel / shifts | `ATURNOSS`, `ATURNOST`, `ATURNOSH`, `HSURTIDO`, `ESURTIDO`, `ARTICULOS`, `ATANQUES` | Planilla liters, shift catalog, optional dispatch history |
| Accounts receivable | `ACOBYPAG`, `CLIENTES`, `AMAEFACT`, `ARECIBOS`, `RCUECLI` | Ledger, client master, durable docs, UI buffer (verify only) |
| Aging config | `ACONF_DIAS_VENC` | Due-day tiers and daily mora rate |

Important entities: client `COD`, movement types `TCO` (FT/ND debit, RC/AC/NC credit), planilla `PLA`, shift code `MTN`, product `PRO` (1–4 = liquid fuels).

### SQLite (local, write)

`audit.db` — per-request audit rows (`timestamp`, `persona`, `rol`, `method`, `path`, `status_code`). Auto-created on startup.

### Topology

- **MVP:** Debian dev machine on LAN → TCP 1433 to Windows SQL Server hosting DEBO.
- **Production:** Windows Service on same host as SQL → `localhost` loopback, no network hop.
- **Edge/offline:** none; service requires LAN SQL reachability.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`CLAUDE.md`** — Agent SSOT: READ ONLY absolutism, `uv`/`gh` tooling rules, doc roles, BDD→TDD→BUILD pointer, MSSQL-MODEL multi-agent edit protocol.
2. **`docs/PRD.md`** — Business identity (KM 1107 / KM 1151 default), fuel magnitudes (ARS + liters), scope, environments, phased delivery.
3. **`docs/BDD.md` + `docs/bdd/000–004-*.md`** — Five user stories with Gherkin, SQL sketches, acceptance criteria.
4. **`docs/TDD.md`** — Per-US technical contracts, auth module design, test maps, planned `src/`/`tests/` layout.
5. **`docs/API.md`** — Endpoint SSOT (US-001 only so far).
6. **`docs/PLAN-IMPLEMENTACION.md`** — Full hexagonal BUILD plan, open reconciliations, DoD per milestone.
7. **`docs/MSSQL-MODEL.md`** — Extensive verified DEBO schema findings and production SQL for US-001 and AR/aging.
8. **`docs/adrs/001–009`** — Authoritative decisions on glossary, deployment, time model, dev flow, stack, API doc format, API keys.
9. **`.claude/rules/`** — ADR mirrors for session context.
10. **`.claude/hooks/*.sh`** — Automation: API.md sync guard, TDD-first nudge, BDD close-loop.
11. **`.claude/skills/mssql/SKILL.md`** — Read-only scouting skill; `connections.json` excluded from git.
12. **`.agents/skills/bdd-usecase-review/SKILL.md`** and **`.agents/skills/tdd-test-review/SKILL.md`** — Iteration review playbooks.
13. **`.mcp.json`** — markdown-vault-mcp configuration (paths only; no secrets reproduced).

**`.docs/`:** directory not found in repository; documentation vault is `docs/` at repo root.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` — internal kodexArg specification and future service; no public clone or deployment URLs in related frontmatter.
- **Auth model:** Static per-person Bearer API keys in `.env`; roles `admin` | `cobranzas` | `comercial`; O(1) in-memory lookup; no DEBO-backed users.
- **DB credentials:** Read-only SQL login; `.env` and `.claude/skills/mssql/connections.json` are git-ignored.
- **Audit:** SQLite trail of authenticated (and 401) requests — supports accountability on LAN.
- **Data exposure:** Responses are internal business data (sales, client balances); intended only for authorized staff on private network.
- **This summary contains no secrets, keys, passwords, or live connection strings.**

## 10. Operational picture

### Current state (Aug 2026)

Repository is **pre-implementation greenfield**: rich `docs/` corpus, agent harness, and DEBO research, but **no runnable application**. `.env` may exist locally (git-ignored) with `MSSQL_*` and `API_KEY_*` placeholders per PLAN — not in the cloned tree.

### Planned local development

1. `uv` sync (once `pyproject.toml` exists).
2. Configure `.env` with MSSQL read credentials and API keys.
3. On Linux MVP: override `MSSQL_HOST` to LAN SQL IP without editing committed `.env`.
4. `uv run` uvicorn (exact module path TBD — likely `src` entrypoint from PLAN).
5. Unit tests: `uv run pytest` without DEBO; integration: opt-in marker against LAN SQL.

### Planned deployment

- **Stage 1:** Debian Linux on LAN validates endpoints against remote DEBO.
- **Stage 2:** Package as native **Windows Server service** on SQL host; `MSSQL_HOST=localhost`.
- **CI/CD:** not evident in repository tree (no `.github/workflows` in shallow clone).

### Agent development workflow

ADR 004 mandates per user story: write/adjust BDD → add supporting docs → write failing TDD tests → declare endpoint in `API.md` → implement BUILD. Hooks reinforce API.md consistency and BDD/TDD hygiene at agent session boundaries.

### Hardware / network constraints

- Requires LAN access to Windows SQL Server (documented internal IP in PRD/ADR 002 — not repeated here per RAG hygiene).
- No GPU or special hardware.
- Windows production target must install stack via `uv` only — no OS-level ODBC drivers.

## 11. Open questions / unknowns

- **No application code yet** — `src/`, `tests/`, `pyproject.toml`, and root README are absent; BUILD phase not started.
- **API.md incomplete** — US-002/003/004 endpoints designed in TDD/PLAN but not declared in SSOT `docs/API.md`.
- **Route name drift** — `/ventas/turno-dia` (BDD US-000) vs `/ventas/semana` (API/TDD); must reconcile before implementation.
- **Debt anchor strategy partial** — "last point without debt" for US-002/US-003; `TCO='SA'` unreliable; integration oracle client 27 = −122,242.07 vs US-003 portfolio figure 4,732,395.92 flagged as blocking reconciliation in PLAN §11.
- **Pending delivery notes formula** — `TIP='R'` remitos pendientes exact aggregation marked PARCIAL in MSSQL-MODEL.
- **US-003 additions** — `signo` column and pagination envelope beyond BDD core seven columns — must be explicitly declared in API.md before BUILD.
- **CI/CD pipeline** — unknown; no workflow files observed.
- **PydanticAI agent layer** — mentioned as future; no ADR closure for prompt→use-case routing.
- **`.docs/` vault** — not present; only `docs/` used.
