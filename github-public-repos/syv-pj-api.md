---
id: "syv-pj-api"
title: "SyV Personajes API — procedural character engine (FastAPI + Cloudflare Worker)"
visibility: public
importance: high
source_repo: "syv-pj-api"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: ["syv-pj", "syv-character-kit", "syv-docs", "syv-pj-frontend"]
tags: ["syv", "fastapi", "pydantic", "cloudflare-workers", "d1", "procedural-generation", "tdd", "ports-adapters", "game-backend", "python"]
problems_solved:
  - "No single backend could generate, validate, canonize, and evolve SyV character sheets from data-driven rules while staying frontend-agnostic and contract-stable."
  - "Character creation logic was scattered between lore YAML, ad-hoc scripts, and UI prototypes with no reproducible seeded generation or durable persistence seam."
  - "Deploying a Python game API to the edge without Docker required a runtime-compatible architecture (async-only, bundled catalogs, SQLite-shaped storage on D1)."
technologies:
  - "Python 3.13"
  - "FastAPI + Pydantic"
  - "uv (package manager)"
  - "aiosqlite (local dev persistence)"
  - "Cloudflare Python Workers (Pyodide ASGI bridge)"
  - "Cloudflare D1 (production persistence)"
  - "PyYAML (catalog loading)"
  - "pytest + httpx (contract TDD)"
  - "workers-py / pywrangler (Worker deploy)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# syv-pj-api

> **Problem thesis (required):** This repository is the **backend motor** for the tabletop RPG *Subordinación y Valor* (SyV). It centralizes procedural character generation, HTTP contract enforcement, canonical persistence, and milestone-driven sheet mutation behind a **Spanish snake_case HTTP surface** defined in the sibling spec repo `syv-pj`. Frontends (web, desktop, Godot, agents) consume the API; this repo does not render UI. It solves the pain of duplicating game rules in every client, of non-reproducible random draws, and of lacking a swappable persistence layer from local SQLite dev to Cloudflare D1 production on the same domain model.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-pj-api` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | FastAPI engine that procedurally generates SyV character sheets, exposes them via a contract-first HTTP API, and persists canonized characters locally (SQLite) or on Cloudflare D1 when deployed as a Python Worker. |
| Audience | Game developers building SyV clients (`syv-pj-frontend`), agent tooling, internal ALVS automating character workflows, and operators deploying the Cloudflare Worker bundle. |

## 2. Problems it solves

### P1 — Fragmented character logic across clients

- **Who hurts:** Frontend authors, narrative designers, and agent builders who need consistent character data.
- **Pain today:** Faction ladders, attribute tables, weighted tag draws, and derived fields (fatigue caps, morale, affiliation strings) live in YAML/Markdown catalogs and procedural rules that would otherwise be reimplemented—or silently diverge—in every consumer.
- **How this repo answers:** A **ports-and-adapters** Python package (`src/personajes/`) loads catalogs from the `syv-pj` submodule, runs a **seeded multi-phase generation pipeline** (~20 resolvers across affiliation, identity, attributes, training, equipment, bonds, and prose), computes derived fields in the domain layer, and returns payloads matching the HTTP contract. Contract tests (`tests/contract/`) lock behavior to `vendor/syv-pj/API.md` (symlinked as `API.md`).
- **Out of scope:** Rendering character sheets, running ComfyUI jobs end-to-end, or owning the lore encyclopedia (that stays in `syv-docs` and catalog data in `syv-pj`).

### P2 — Ephemeral vs canonical lifecycle without losing reproducibility

- **Who hurts:** Players and GMs who want to preview random characters, then commit a chosen sheet, and later apply campaign milestones.
- **Pain today:** Random generation without stable `(semilla, faccion, rango)` keys produces duplicates; canonization without idempotency creates twin characters; milestone effects (ascensos, tag changes, attribute deltas) need a single authoritative sheet mutation path.
- **How this repo answers:** `GET /personaje` and `GET /generar` produce **efímeros** (no slug, empty history, `estado/disponible`). `POST /canonizar` assigns an opaque eight-character slug, stamps `metadatos.canonizado_en`, and is **idempotent** on seed triples via a `seed_index` table. `POST /personaje/{slug}/evento` applies typed milestone effects (tag add/remove, attribute bumps, specialty changes, loyalty/nemesis tags) and returns the updated sheet. Encounter plates from `GET /meta/encuentro/nuevo` support battle logging without persisting encounters server-side.
- **Out of scope:** Full encounter/battle simulation, Diégesis graph projection, or player authentication.

### P3 — Edge-deployable Python game API with swappable storage

- **Who hurts:** Operators who want a low-ops public API without maintaining containers.
- **Pain today:** Traditional FastAPI + uvicorn + Postgres stacks are heavy for a rules engine; Cloudflare Workers forbid threads and limit which wheels load under Pyodide; catalog YAML/Markdown must ship inside the Worker bundle.
- **How this repo answers:** Production deploy is a **Cloudflare Python Worker** (`worker/`) that reuses the same FastAPI app through the Pyodide `asgi.fetch` bridge. `api/deps.py` selects **D1** (`env.DB`) per request on the Worker and **SQLite** (`aiosqlite`) locally. Catalog files bundle via `wrangler.jsonc` `rules` for `*.yaml` and `*.md`. All FastAPI dependencies are `async def` because workerd rejects sync dependency thread pools. Local dev uses `KDX_PJ_DB` (default `./var/kdx_pj.db`, gitignored).
- **Out of scope:** Workers AI prose generation in production (stub today), R2 portrait storage, and paid Cloudflare Containers escape hatch unless a future ADR authorizes it.

## 3. Product / idea

The mental model is **hexagonal architecture around a generation pipeline**:

1. **Domain** (`domain/`) — `Character`, `Identity`, `Attributes` (cuerpo/mente/alma), `Milestone`, `Metadata`; derived calculators (`derived.py`, `tags.py`).
2. **Generation** (`generation/`) — `Planner` owns phase order; each phase module registers resolvers that read catalog weights and rules from data, not code. `PortableRng` makes draws reproducible from a seed. Only the prose phase awaits an async `ProseProvider` port (LLM boundary).
3. **Ports** (`ports/`) — `CatalogProvider`, `CharacterRepository`, `ProseProvider`, `ImagePromptProvider` (wired but lightly used).
4. **Adapters** (`adapters/`) — `catalog/files.py` reads submodule resources; `storage/{memory,sqlite,d1}.py`; `prose/stub.py`; `image_prompt/{stub,workers_ai}.py`.
5. **API edge** (`api/`) — FastAPI routers mirror Spanish routes; Pydantic contracts use Spanish field aliases; `services.py` orchestrates generation, canonization, and events.

**Efímero flow:** client calls `GET /generar` (or `/personaje`) with optional `faccion`, `rango`, `semilla`, repeated `tag` filters, and optional `campos` pruning → receives a full sheet with `identidad.slug: null` → optionally `POST /canonizar` with that payload.

**Canonizado flow:** persisted sheet keyed by slug → `GET /personaje/{slug}` for current state → `GET /personaje/{slug}/historial` for milestones only → `POST /personaje/{slug}/evento` for campaign updates.

**Meta flow:** clients discover factions, rank attribute tables, tag catalogs (`GET /meta/{categoria}` and subcategory routes like `/meta/equipo/arma`), milestone type hints, and fresh encounter plates.

Production runs the same app module as local dev; the Worker entrypoint (`worker/src/worker.py`) sets `KDX_RUNTIME=worker` and `KDX_RESOURCES_PATH` to bundled resources before importing `personajes.api.app`.

### 3.1 North-star use cases

1. **Player character creation** — pick faction/rank constraints (or tags), generate until satisfied, canonize, then fetch the stable slug for a frontend character sheet.
2. **GM batch generation** — use `semilla` to reproduce the same ephemeral for playtesting; filter with `tag` parameters; prune responses with `campos` for lightweight previews.
3. **Agent/automation path** — contract tests and ADRs in `.claude/rules/` give agents strict rules: English code, Spanish HTTP surface, `uv` only, read-only `API.md`, submodule init required.

### 3.2 Non-goals

- **Real LLM prose in production** — `StubProseProvider` returns placeholder text; Workers AI adapter exists but is not the default wiring (`docs/plan-implementacion-sistema-creacion-personajes.md` tracks LLM integration as future work).
- **Portrait execution** — `GET /personaje/{slug}/workflow` returns ComfyUI API-JSON; nothing in this repo runs ComfyUI or stores PNGs yet (portrait persistence planned in implementation plan).
- **List-all endpoint** — contract SSOT lists 11 core routes; `GET /personajes` list is identified as a planned contract delta in the implementation plan, not implemented here.
- **Editing the HTTP contract from this repo** — `API.md` is a read-only symlink to `syv-pj` (ADR-003).

## 4. Technology stack

Derived from manifests and tree (no lockfile dumps).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python ≥3.13 | `pyproject.toml` `requires-python` |
| Package manager | uv | `pyproject.toml`, ADR-001, `uv.lock` |
| Backend / API | FastAPI ≥0.137, Pydantic, uvicorn (local ASGI) | `pyproject.toml`, `src/personajes/api/` |
| Edge runtime | Cloudflare Python Workers, Pyodide ASGI | `worker/wrangler.jsonc`, `worker/src/worker.py`, ADR-009 |
| Data (prod) | Cloudflare D1 (SQLite API) | `worker/wrangler.jsonc` `d1_databases`, `adapters/storage/d1.py`, `worker/schema.sql` |
| Data (dev) | SQLite via aiosqlite | `pyproject.toml`, `adapters/storage/sqlite.py`, ADR-007 |
| Catalog data | YAML + Markdown frontmatter in submodule | `vendor/syv-pj/resources/`, ADR-008 |
| Infra / deploy | pywrangler deploy from `worker/`; `worker/build.py` stages bundle | `worker/build.py`, ADR-009 |
| AI / agents | Stub prose; Workers AI image prompt adapter present; `.claude/rules/` ADRs | `adapters/prose/stub.py`, `.claude/rules/` |
| Tests | pytest 8, httpx2 dev client | `pyproject.toml`, `tests/contract/`, `tests/domain/` |

### 4.1 Notable dependencies (curated)

- `fastapi` — HTTP edge, router mounting, dependency injection for adapter wiring.
- `aiosqlite` — async SQLite for local durable `CharacterRepository` without blocking workerd.
- `pyyaml` — parses catalog rules and name deposits from submodule resources.
- `httpx2` — ASGI test client for contract-first endpoint tests (dev group only).
- `workers-py` / `workers-runtime-sdk` — Worker entrypoint and Pyodide bridge (worker dev group).

## 5. Repository map (abstraction)

- **Entrypoints**
  - Local ASGI: `personajes.api.app:app` (`src/personajes/api/app.py`) via uvicorn.
  - Worker: `worker/src/worker.py` → `Default.fetch` → `asgi.fetch(app, ...)`.
  - Bundle staging: `worker/build.py` copies `src/personajes` and `vendor/syv-pj/resources` into `worker/src/`.
- **Domain / core**
  - Entities and tags: `src/personajes/domain/`.
  - Generation pipeline: `src/personajes/generation/` (`planner.py`, `phases/*`, `rng.py`, `comfy_workflow.py` for portrait JSON).
  - Application services: `src/personajes/api/services.py`.
- **Adapters**
  - HTTP routers: `src/personajes/api/routers/{personaje,generar,canonizar,meta}.py`.
  - Storage: `src/personajes/adapters/storage/{memory,sqlite,d1,catalog_seed}.py`.
  - Catalog: `src/personajes/adapters/catalog/files.py`.
  - Prose/image stubs: `src/personajes/adapters/prose/stub.py`, `adapters/image_prompt/`.
- **Ports (interfaces)**
  - `src/personajes/ports/{catalog,storage,prose,image_prompt}.py`.
- **Contract models**
  - `src/personajes/api/contracts/` — Pydantic shapes aligned with `API.md`.
- **Docs vaults**
  - `docs/plan-implementacion-sistema-creacion-personajes.md` — master implementation plan (E2E character creation with LLM + ComfyUI + frontend).
  - `README.md`, `FUTURE.md`, `REQUIREMENTS.md`, `CHANGELOG.md`.
  - Spec contract (read-only): `API.md` → `vendor/syv-pj/API.md`.
- **Agent scaffolding**
  - `AGENTS.md` / `CLAUDE.md` — agent operating rules, deploy status, submodule requirement.
  - `.claude/rules/adr-001` through `adr-009` — accepted architecture decisions (stack, TDD, API read-only, English/Spanish split, Cloudflare deploy, package shape, SQLite dev, submodule resources, D1 prod).
- **Vendor / generated (do not treat as SSOT here)**
  - `vendor/syv-pj/` — git submodule (catalog + spec); pin updated via submodule pointer commits.
  - `worker/src/personajes/`, `worker/src/resources/` — generated bundle output (gitignored).
  - `worker/python_modules/`, `worker/.wrangler/` — pywrangler vendored deps and local wrangler state (gitignored).

## 6. Configuration & contracts (no secrets)

Environment variables (names and purpose only):

| Variable | Purpose |
|----------|---------|
| `KDX_PJ_DB` | Path to local SQLite file (default `./var/kdx_pj.db`) |
| `KDX_RESOURCES_PATH` | Override catalog root (default `vendor/syv-pj/resources`; Worker sets bundled `resources/`) |
| `KDX_RUNTIME` | `worker` skips local SQLite catalog seed on lifespan; unset/local uses SQLite seed |
| `KDX_LLM_PROVIDER` / `KDX_LLM_MODEL` / `KDX_LLM_API_KEY` | Planned knobs for real `ProseProvider` (documented in implementation plan, not wired in default `deps.py`) |
| `KDX_PJ_MEDIA` | Planned portrait PNG directory (implementation plan) |

Cloudflare bindings (from `worker/wrangler.jsonc`):

- `DB` — D1 database binding `syv-pj` for `D1CharacterRepository`.

Worker compatibility flags: `python_workers`, `python_dedicated_snapshot`; bundles `*.yaml` and `*.md` as Text modules.

### 6.1 HTTP / API endpoints

Core contract (11 routes from `vendor/syv-pj/API.md` §6) plus one implementation extension:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/personaje` | Generate ephemeral character; optional `faccion`, `rango`, `semilla`, `campos`, `tag` | none |
| `GET` | `/personaje/{slug}` | Current canonical sheet; optional `campos` prune | none |
| `GET` | `/personaje/{slug}/historial` | Milestone history only | none |
| `POST` | `/personaje/{slug}/evento` | Register milestone; apply typed effects; 404/409 on error | none |
| `POST` | `/canonizar` | Persist ephemeral; assign slug; idempotent on seed triple | none |
| `GET` | `/generar` | Full procedural pipeline (semantic twin of `/personaje`) | none |
| `GET` | `/meta/{categoria}` | Curated tag catalog entries for category | none |
| `GET` | `/meta/{categoria}/{subcategoria}` | Catalog filtered by subcategory (e.g. equipo/arma) | none |
| `GET` | `/meta/facciones` | Factions with short lore descriptors | none |
| `GET` | `/meta/rangos` | Ranks with per-faction attribute tables | none |
| `GET` | `/meta/tipos_hito` | Suggested milestone type enumeration | none |
| `GET` | `/meta/encuentro/nuevo` | New unique encounter plate `^[A-Z0-9]{8}$` | none |
| `GET` | `/personaje/{slug}/workflow` | ComfyUI API-JSON portrait workflow (extension beyond §6 table; proposed contract text lives in implementation plan) | none |

FastAPI also exposes OpenAPI at `/docs` and `/openapi.json` by framework default (not part of the game contract SSOT).

### 6.2 Other interfaces

- **CLI / scripts:** `uv run python -m pytest` (test harness); `uv run python worker/build.py` (bundle staging); deploy via `uvx --from workers-py pywrangler deploy` from `worker/`.
- **Library surface:** importable package `personajes` (wheel built via hatchling) for domain/generation if embedded elsewhere—primary surface remains HTTP.
- **MCP / Telegram / systemd:** none.

## 7. Data & persistence

**Stores:**

- **Production:** Cloudflare D1 (`characters` table: `slug` PK + JSON `data` blob; `seed_index` for idempotency). Schema in `worker/schema.sql`; lazy `CREATE TABLE IF NOT EXISTS` in D1 adapter.
- **Local dev:** SQLite file (same two-table schema) via `SqliteCharacterRepository`.
- **Tests:** in-memory repository for domain tests; contract tests use SQLite or in-memory via `tests/conftest.py` wiring.

**Important entities (domain names):** `Character`, `Identity`, `Attributes`, `Milestone`, `Metadata`; tags as categorized slugs (`faccion/*`, `rango/*`, `aspecto/*`, `equipo/*`, etc.) per SyV tag system.

**Catalog data (read-only submodule):** factions, subfactions, rank ladders, specialties, roles, rules (weights/quotas), name deposits, example characters, equipment catalogs—hundreds of Markdown/YAML files under `vendor/syv-pj/resources/`.

**Topology:** Generation reads catalogs from filesystem (bundled on Worker). Persistence is request-scoped D1 on edge or singleton SQLite locally. No separate cache layer; encounter plate uniqueness is in-process (`EncounterPlates` service) for local dev.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

- `README.md` — project charter, stack, contract symlink policy, ecosystem links.
- `AGENTS.md` — current status (307 tests, D1 Worker deploy active), hard rules for agents.
- `FUTURE.md` — phased roadmap (note: partially superseded by implemented state; ADR-009 activated deploy).
- `REQUIREMENTS.md` — SQLite dev persistence requirements (async port ripple).
- `CHANGELOG.md` — recent refactors (submodule resources, attribute rename cuerpo/mente/alma, Comfy workflow stack).
- `docs/plan-implementacion-sistema-creacion-personajes.md` — E2E plan: LLM prose, ComfyUI portraits, frontend integration gaps.
- `vendor/syv-pj/API.md` — HTTP contract SSOT (11 endpoints + semantics).
- `.claude/rules/adr-001` … `adr-009` — architecture decisions governing stack, TDD, API immutability, language split, Worker deploy, package layout, SQLite, submodule, D1.
- **`.docs/`** — not present in this repository.

Agent conventions worth retaining: never edit `API.md` from here; always `git submodule update --init --recursive`; English identifiers in code; Spanish routes/fields verbatim; `uv` not `pip`; async-only dependencies on Worker; data in YAML/Markdown not JSON for editable catalogs.

## 9. Security & privacy notes (summary-time)

- **Visibility:** public repo; catalog submodule `syv-pj` is also public. Character sheets persisted in D1 are operational game data—no built-in multi-tenant auth in the API layer.
- **Auth model:** none on HTTP endpoints (open API surface; protect at network edge if needed).
- **Secrets hygiene:** this summary contains no API keys, D1 credentials, wrangler account tokens, or `.env` contents. Local DB path and binding names only. Do not commit `./var/` SQLite files or `worker/.wrangler/` state.
- **Immutable examples:** certain example characters reject mutations (`EjemploInmutable` → HTTP 409).

## 10. Operational picture

**Local development:**

1. `git submodule update --init --recursive` (required for catalogs).
2. `uv sync` — install dependencies.
3. `uv run uvicorn personajes.api.app:app --host 127.0.0.1 --port 8010` (implementation plan references port 8010 for frontend proxy).
4. `uv run python -m pytest` — **307 passed, 2 xfailed** at time of summary.

**Production deploy (Cloudflare Worker):**

1. From repo root: `uv run python worker/build.py` — stage `personajes` + `resources` into `worker/src/`.
2. From `worker/`: `uvx --from workers-py pywrangler deploy`.
3. Worker name `syv-pj-api` per `worker/wrangler.jsonc`; D1 database name `syv-pj`.

**CI:** no `.github/workflows` in tree at time of scan—deploy appears manual via pywrangler per ADR-009.

**Hardware:** edge Worker (~8.66 MB bundle cited in ADR-009); no GPU requirements in this repo (ComfyUI is external per implementation plan).

## 11. Open questions / unknowns

- **README vs AGENTS.md drift:** README still describes SDD/pre-implementation phase; AGENTS.md and code show full motor with D1 deploy—treat README warning as stale.
- **FUTURE.md vs reality:** deploy and D1 are active (ADR-009) though FUTURE.md still lists Cloudflare as deferred in places.
- **Real LLM prose:** `ProseProvider` remains stub; Workers AI prose path documented but not production-default.
- **Portrait pipeline:** workflow JSON exists; ComfyUI execution, PNG persistence, and `GET /personaje/{slug}/retrato` are planned—not implemented.
- **`GET /personajes` list endpoint:** identified as contract gap for frontend navigation—pending `syv-pj` PR per implementation plan.
- **`docs/prompt-imagen.md`:** referenced by spec for image prompts but noted missing in implementation plan audit.
- **Automated CI/CD:** no GitHub Actions workflow found in this clone; release cadence unknown.
