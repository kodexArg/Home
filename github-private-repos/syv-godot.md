---
id: "syv-godot"
title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI)"
visibility: private
importance: normal
source_repo: "syv-godot"
org: "kodexArg"
default_branch: "master"
primary_language: "GDScript"
repo_kind: "game"
status: "experimental"
related: []
tags: ["godot", "gdscript", "fastapi", "wego", "turn-based", "hex-grid", "tactical", "multiplayer", "docker", "redis", "postgresql", "traefik", "enet", "hot-seat", "kenney-assets", "uv", "python"]
problems_solved:
  - "A simultaneous-turn (WEGO) tactical hex strategy game needs a thin client that renders and captures input while an authoritative server validates orders, resolves combat deterministically, and prevents clients from cheating."
  - "Local development for a Godot + Python microservice stack is painful without a unified launcher, health-checked Docker Compose, and repeatable setup scripts."
  - "Hex-grid coordinate math, order serialization, and turn-phase state machines must be testable in isolation before full multiplayer and backend migration land."
technologies:
  - "Godot Engine 4.4 (GL Compatibility renderer)"
  - "GDScript"
  - "FastAPI 0.115+"
  - "Python 3.12 + uv"
  - "PostgreSQL 16"
  - "Redis 7"
  - "Traefik v2.11"
  - "Docker Compose v2"
  - "SQLAlchemy 2 (async) + asyncpg"
  - "Pydantic v2 + pydantic-settings"
  - "pytest + pytest-asyncio"
  - "ENet multiplayer (Godot native, interim transport)"
  - "Kenney CC0 assets (hex tiles, board icons, fonts)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Subordinación y Valor (SyV-Godot)

> **Problem thesis (required):** This repository is the **playable implementation workspace** for *Subordinación y Valor* (SyV), a 1v1 simultaneous-turn (WEGO) tactical strategy game on a hexagonal board. It exists to prove the core loop — secret order planning, simultaneous resolution, and state sync — with a **Godot 4.4 thin client** (rendering and input only) backed by an **authoritative server** that owns rules, validation, and deterministic combat. The target architecture is FastAPI + Redis + PostgreSQL behind Traefik; at summary time the tree is in **transitional MVP**: game logic and ENet RPCs run inside Godot headless server scripts, while the Python backend is scaffolded with health endpoints and dependency wiring but not yet the full game API described in the PRD.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-godot` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Turn-based WEGO hex strategy with simultaneous secret orders, authoritative server resolution, and a Godot client that carries zero rule logic. |
| Audience | Game developers on the SyV team; AI agents using `.agent/` skills for Godot, FastAPI, and Docker setup; future players on PC (Steam/Linux target per PRD). Design lore and platform-agnostic rules live in sibling repos (`syv-game-system`, `gdt-syv`). |

## 2. Problems it solves

### P1 — Authoritative WEGO without trusting the client

- **Who hurts:** Multiplayer strategy developers building simultaneous-turn games where both players plan in secret and orders resolve at once — any client-side rule logic is exploitable.
- **Pain today:** Thin-client architectures often stall at prototype because transport, order schemas, phase machines, and conflict resolution are intertwined in UI code. WEGO specifically requires hiding opponent orders during planning, then applying all committed orders in one deterministic pass.
- **How this repo answers:** The PRD (`.agent/docs/PRD.md`) defines a five-phase server state machine — LOBBY → PLANNING → PROCESSING → OUTCOME → END — with `OrderResolver` validating and applying moves. Godot scripts already implement this loop in `scripts/server/server_game_manager.gd` and `scripts/server/order_resolver.gd`: orders queue during PLANNING, both players commit, PROCESSING runs resolver logic, OUTCOME broadcasts new state. `NetworkManager` exposes RPCs (`submit_order_rpc`, `commit_turn_rpc`, `sync_state_rpc`, `notify_phase_change_rpc`) so clients only send intents and receive scoped state. The long-term plan moves this logic into FastAPI with Redis cache and PostgreSQL persistence; `backend/pyproject.toml` already lists SQLAlchemy, asyncpg, redis, python-jose, and websockets for that migration.
- **Out of scope:** Full SyV rule depth from the design vault (squad hierarchies, tag pipelines, radio interception, fog-of-war scoping). Attack orders return "not implemented yet" in `order_resolver.gd`. Victory conditions and turn counter are stubbed (`turn: 1` hardcoded in state broadcast).

### P2 — Repeatable local dev for Godot + backend services

- **Who hurts:** Solo or small-team developers who must run Godot, a Python API, Redis, PostgreSQL, and a reverse proxy together every session.
- **Pain today:** Manual container orchestration, missing health checks, and "did I start the server?" friction block iteration on a game that needs both GUI and headless processes.
- **How this repo answers:** `docker/docker-compose.yml` defines `syv-api`, `syv-redis`, `syv-db`, and `syv-traefik` with healthchecks and Traefik routing for `/api`. `Makefile` wraps `make dev`, `make test`, `make health`, `make psql`, `make redis-cli`. `scripts_py/setup.py` verifies Docker, uv, Godot; copies `docker/.env.example` → `docker/.env`; builds containers. `scripts_py/run_client.py` (via `run_client.sh`) is a smart launcher: starts Docker if needed, waits for healthy services, launches Godot, optionally tears down on exit. Shell wrappers `setup.sh` and `run_client.sh` delegate to Python for single source of truth.
- **Out of scope:** Production deployment, CI/CD pipelines (no `.github/` workflows in tree), Steam packaging, or cloud hosting. Dev secrets in compose use placeholder values only.

### P3 — Hex grid and order primitives as tested building blocks

- **Who hurts:** Implementers who need correct axial/cubic hex math and serializable order models before building board UI and combat.
- **Pain today:** Hex coordinate bugs silently break movement validation; order dictionaries from RPCs need tolerant parsing across editor, hot-seat, and future HTTP clients.
- **How this repo answers:** `scripts/utils/hex_utils.gd` implements axial ↔ cubic conversion, distance, neighbors, flat-top pixel mapping, and rounding. `tests/test_hex_utils.gd` is a headless MainLoop self-test. `scripts/models/unit_data.gd`, `order_data.gd`, `hex_data.gd`, and `scripts/engine/game_state.gd` define Resource-based domain types (unit types Infantry/Officer/Captain, order types MOVE/ATTACK/DEPLOY/DEFEND/CANCEL, map keyed by Vector2i). `server_game_manager.gd` parses heterogeneous `target_coords` (strings, arrays, dicts, Vector2i) from RPC payloads. `scripts/tests/test_game_loop.gd` simulates two-player connect → order → commit → resolution without a live network.
- **Out of scope:** Full map generation, terrain modifiers, pathfinding beyond single-step moves, or gdUnit4 integration (mentioned in PRD as future; current Godot tests are lightweight scripts).

## 3. Product / idea

SyV-Godot is a **1v1 WEGO hex tactics game** branded *Subordinación y Valor* (`project.godot` config name). Players issue secret orders during a planning phase; when both commit, the server resolves all orders simultaneously and pushes the new battlefield state. The MVP supports **hot-seat** play on one machine: the client manages player handoff locally while the server treats connections uniformly (`PRD.md` §9).

The **target mental model** (from README and PRD):

```
[Godot Client]  HTTP/WS (planned)     [Traefik :80]
       |                                    |
       +--- ENet RPCs (current MVP) ------> [Godot headless server OR FastAPI :8000]
                                                    |
                                          [Redis cache] <-> [PostgreSQL]
```

**Current implementation split:**

- **Godot client path:** `scripts/main.gd` detects `--client` / `--server` / headless mode. Client loads `scenes/game/game_screen.tscn`, connects via `NetworkManager` ENet to port 7777. `client_game_manager.gd` bridges UI actions to RPCs.
- **Godot server path:** `scenes/server/server_main.tscn` hosts `server_game_manager.gd`. Can run headless with `--server` or spawn as child process (export builds only; editor warns to run server manually).
- **Python backend path:** `backend/src/main.py` exposes FastAPI with CORS for Godot, lifespan logging, and health routes only. Package layout reserves `api/`, `core/`, `models/`, `schemas/`, `services/` but modules are empty `__init__.py` stubs.

The game ships Kenney CC0 assets under `assets/hexagons/`, `assets/kenney_hexagon-kit/`, `assets/kenney_board-game-icons/`, and `assets/fonts/` for MVP visuals.

### 3.1 North-star use cases

1. **Hot-seat MVP:** Two players alternate on one PC — P1 plans orders, commits; transition screen; P2 plans and commits; server processes WEGO turn; both see resolution animation and updated unit positions.
2. **Online 1v1 (planned):** Two Godot clients connect to FastAPI-backed game room via JWT-authenticated WebSocket; Redis holds active game state; PostgreSQL persists matches and accounts.
3. **Agent-assisted development:** Coding agents use `.agent/skills/godot-tools` to validate scripts headlessly, inspect scenes, and run `.agent/scripts/verify_setup.sh` to confirm Godot, directory structure, and Kenney assets.

### 3.2 Non-goals

- Client-side rule enforcement (explicit PRD rule: server rejects illegal actions).
- Distinguishing hot-seat from online at the server layer (client UX only).
- Full combat system (attack resolution stubbed).
- Narrative / lore content (lives in `syv-game-system` design vault).
- Production auth hardening (JWT flow specified in PRD but not implemented in `backend/src/`).

## 4. Technology stack

Derived from manifests and project config; lockfiles used for version signal only.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Godot 4.4 GDScript; Python 3.12 | `project.godot` features `4.4`; `backend/pyproject.toml` `requires-python = ">=3.12"` |
| Frontend | Godot 4.4, GL Compatibility, 1920×1080 | `project.godot` rendering and display sections |
| Backend / API | FastAPI + uvicorn (scaffold) | `backend/pyproject.toml`, `backend/src/main.py` |
| Data | PostgreSQL 16, Redis 7 | `docker/docker-compose.yml` images |
| Infra / deploy | Docker Compose, Traefik v2.11 | `docker/docker-compose.yml`, `Makefile` |
| AI / agents | `.agent/` skills (Godot, FastAPI, Docker) | `.agent/skills/`, `.agent/docs/PRD.md` |
| Tests | pytest (backend); GDScript MainLoop tests (client) | `backend/tests/`, `tests/test_hex_utils.gd`, `scripts/tests/test_game_loop.gd` |

### 4.1 Notable dependencies (curated)

- `fastapi` / `uvicorn` — planned authoritative HTTP + WebSocket game server.
- `sqlalchemy[asyncio]` + `asyncpg` — async Postgres ORM (not yet wired to models).
- `redis` — game state cache and pub/sub per PRD key patterns.
- `python-jose` + `passlib` — JWT auth planned for `/api/auth/*`.
- `pydantic-settings` — typed config from env (`backend/src/config.py`).
- `ENetMultiplayerPeer` (Godot built-in) — interim 1v1 transport on port 7777.
- Kenney Hexagon Kit / Board Game Icons — CC0 art pipeline for hex board MVP.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - Godot: `project.godot` → `scenes/main.tscn` (`scripts/main.gd` routes client vs server).
  - Godot server scene: `scenes/server/server_main.tscn`.
  - FastAPI: `backend/src/main.py` (uvicorn via Docker CMD).
  - Dev launchers: `setup.sh`, `run_client.sh`, `scripts_py/setup.py`, `scripts_py/run_client.py`.
- **Domain / core:**
  - Godot models: `scripts/models/` (`unit_data.gd`, `order_data.gd`, `hex_data.gd`).
  - Godot engine state: `scripts/engine/game_state.gd`.
  - Server logic: `scripts/server/server_game_manager.gd`, `order_resolver.gd`, `states/`.
  - Python packages (stubs): `backend/src/core/`, `models/`, `schemas/`, `services/`.
- **Adapters:**
  - Godot networking: `scripts/networking/network_manager.gd` (ENet + RPC layer).
  - Client controller: `scripts/client/client_game_manager.gd`.
  - Docker: `docker/docker-compose.yml`, `backend/Dockerfile`.
- **Docs vaults:**
  - `.agent/docs/PRD.md` — full architecture, protocol, Redis schema, hot-seat flow.
  - Root `README.md` — quick start and stack diagram.
  - No `docs/` or `.docs/` directory in tree.
- **Agent scaffolding:**
  - `.agent/skills/godot-dev-setup/` — initial environment install (Godot, Kenney assets).
  - `.agent/skills/godot-tools/` — CLI validation, scene inspect, autoload listing.
  - `.agent/skills/godot-best-practices/` — GDScript patterns, state machines, project structure references.
  - `.agent/skills/fastapi/` — template FastAPI project with auth router stubs.
  - `.agent/skills/docker-composer/`, `docker-expert/` — container guidance.
  - `.agent/skills/git-sync/` — repo sync helper.
  - `.agent/scripts/verify_setup.sh`, `install_godot_manual.sh`.
  - `.claude/` is listed in `.gitignore` and **not present in the clone** — cannot summarize contents.
- **Generated / vendor:**
  - `assets/kenney_hexagon-kit/Models/OBJ format/` — 3D source meshes (not ingested for logic).
  - `.godot/` ignored (editor cache).
  - `backend/uv.lock` — dependency lock (not summarized).

## 6. Configuration & contracts (no secrets)

### Environment variables (names + purpose)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Async Postgres DSN for SQLAlchemy |
| `REDIS_URL` | Redis connection for game cache / pub-sub |
| `SECRET_KEY` | JWT signing secret (dev placeholder in compose) |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Postgres container bootstrap |
| `DEBUG` | API debug flag |
| `API_HOST` / `API_PORT` | Godot client API target (`.env.example`) |
| `WS_URL` | WebSocket base for game channel (planned) |
| `host` / `port` | Uvicorn bind (`backend/src/config.py`, defaults `0.0.0.0:8000`) |
| `algorithm` | JWT algorithm (default HS256) |
| `access_token_expire_minutes` | Token TTL (default 1440) |

Real `.env` files are gitignored; only `docker/.env.example` is in tree. Compose embeds dev-only placeholder credentials — not production values.

### 6.1 HTTP / API endpoints

**Implemented today** (`backend/src/main.py`):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/health` | Liveness for Docker healthcheck | none |
| `GET` | `/api/health` | API health behind Traefik `/api` prefix | none |

**Specified in PRD (not yet implemented in source)**:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `POST` | `/api/auth/register` | Create account | none |
| `POST` | `/api/auth/login` | Obtain JWT | credentials |
| `GET` | `/api/games` | List games | JWT |
| `POST` | `/api/games` | Create game | JWT |
| `POST` | `/api/games/{id}/join` | Join game | JWT |
| `WS` | `/api/game/{game_id}/ws` | Real-time orders and state sync | JWT query token |

FastAPI OpenAPI will be available at `/docs` when the API container runs (standard FastAPI behavior; not custom-routed in current code).

### 6.2 Other interfaces

**Godot ENet RPC contract** (`scripts/networking/network_manager.gd`, port 7777, max 2 clients):

| Direction | RPC / action | Purpose |
|-----------|--------------|---------|
| C→S | `submit_order_rpc(order_data)` | Queue unit order during PLANNING |
| C→S | `commit_turn_rpc()` | Signal player ready to resolve |
| C→S | `ping_rpc(timestamp)` | Latency check |
| S→C | `sync_state_rpc(state_data)` | Full unit positions + phase |
| S→C | `notify_phase_change_rpc(phase)` | LOBBY / PLANNING / PROCESSING / OUTCOME |
| S→C | `pong_rpc(timestamp)` | Ping echo |

**CLI / process flags:**

- `godot --headless --server` — dedicated headless server mode.
- `godot` (default) — client mode with optional local server spawn.
- `make dev` / `make test` / `make godot-editor` — Makefile dev surface.
- `./run_client.sh [--no-stop] [--editor] [--skip-docker]` — smart launcher options.

**WebSocket message types (PRD contract, not wired in backend yet):** `SUBMIT_ORDER`, `COMMIT_TURN`, `PING` (client→server); `SYNC_STATE`, `PHASE_CHANGE`, `ERROR` (server→client).

## 7. Data & persistence

**Planned topology (PRD + compose):**

- **PostgreSQL** — durable users, game records, match history (ORM stubs only; no migrations in tree).
- **Redis** — hot game state (`game:{id}:state`), per-turn order buffers (`game:{id}:orders:{turn}`), session tokens (`session:{token}`), pub/sub channel `game:{id}`.
- **Godot in-memory** — current MVP stores `game_state.units` dict in `server_game_manager.gd` with no persistence across server restart.

**Entities (Godot models, by name):**

- `UnitData` — `unit_id`, `owner_id`, `type` (INFANTRY/OFFICER/CAPTAIN), `status`, axial `q`/`r`.
- `OrderData` — `order_id`, `unit_id`, `type`, `target_coords`, `owner_id`, `turn_issued`.
- `HexData` — hex tile occupancy (referenced in `game_state.gd`; map generation not active in server MVP).
- `GameState` — `map_data`, `units`, `active_orders`, `current_phase`, `active_player`, `turn_number`.

Offline vs cloud: entirely local Docker Compose for development; no edge deployment configured.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **Root README** — `README.md` — stack diagram, quick start, Makefile commands, project structure.
2. **PRD v0.0** — `.agent/docs/PRD.md` — vision, target stack, state machine, REST/WebSocket protocol, Redis key patterns, hot-seat MVP, asset requirements.
3. **Godot project config** — `project.godot` — engine 4.4, autoload `NetworkManager`, main scene, display settings.
4. **Agent skills:**
   - `.agent/skills/godot-dev-setup/SKILL.md` — one-time Godot + Kenney asset install workflow.
   - `.agent/skills/godot-tools/SKILL.md` — headless script validation, scene run, inspect, autoload list.
   - `.agent/skills/godot-best-practices/SKILL.md` — GDScript architecture references (state machines, node communication).
   - `.agent/skills/fastapi/SKILL.md` — FastAPI template with auth router pattern for future migration.
5. **Verify script** — `.agent/scripts/verify_setup.sh` — checks OS, Godot, optional system deps, directory layout, Kenney asset counts.
6. **Backend manifest** — `backend/pyproject.toml`, `backend/src/config.py`, `backend/src/main.py`.
7. **Core Godot logic** — `scripts/server/server_game_manager.gd`, `order_resolver.gd`, `network_manager.gd`, `hex_utils.gd`.

**Scan results for required hidden dirs:**

- **`.claude/`** — listed in `.gitignore`; **absent from repository clone**. No agent instruction tree available to summarize.
- **`.docs/`** — **not present** in tree.
- **`docs/`** — **not present** at repo root (PRD lives under `.agent/docs/` instead).

## 9. Security & privacy notes (summary-time)

- Repository is **private**; this summary describes mechanics without clone or deploy links.
- Auth model is **planned JWT** (python-jose + passlib in dependencies; register/login routes in PRD only). Current ENet MVP has **no authentication** — any peer connecting to port 7777 can submit orders.
- CORS is wide open (`allow_origins=["*"]`) in FastAPI for Godot dev convenience.
- Compose and `.env.example` contain **dev placeholder** database passwords and `SECRET_KEY` strings — documented by name only, never copied as live secrets.
- Traefik dashboard runs with `--api.insecure=true` in dev compose.
- This file contains **no** scraped `.env` contents, PEM keys, or API tokens.

## 10. Operational picture

**Local development:**

```bash
./setup.sh          # or: uv run scripts_py/setup.py
make dev            # Docker Compose foreground with API hot reload
./run_client.sh     # start services + Godot client; stops Docker on exit unless --no-stop
make godot-editor   # open Godot editor
make test           # pytest inside api container
make health         # curl API + redis ping + pg_isready
```

**Services (Docker Compose):**

| Container | Role |
|-----------|------|
| `syv-api` | FastAPI on port 8000 |
| `syv-redis` | Redis 7 with AOF |
| `syv-db` | PostgreSQL 16 |
| `syv-traefik` | Reverse proxy ports 80 and 8080 (dashboard) |

**Hardware:** PC target (Steam/Linux per PRD). Godot GL Compatibility renderer — no GPU-specific requirements documented. Kenney 2D assets at 64px hex tiles.

**Deployment:** No GitHub Actions or production IaC in tree. README states intent to develop locally via Docker; production path not defined in clone.

## 11. Open questions / unknowns

- **Backend migration timeline:** Game logic remains in Godot `server_game_manager.gd` / `order_resolver.gd` while FastAPI `api/`, `core/`, `models/` packages are empty — order of migration and shared schema ownership unclear.
- **Transport cutover:** PRD specifies HTTP/WebSocket to FastAPI; MVP uses ENet on 7777. Whether ENet is retired or kept for LAN play is undocumented.
- **Database schema:** No SQLAlchemy models, Alembic migrations, or `database.py` in `backend/src/` despite dependencies declared.
- **Auth implementation:** JWT endpoints documented in PRD but no `auth` router in committed backend code (templates exist only under `.agent/skills/fastapi/templates/`).
- **Board UI completeness:** `scenes/game/game_screen.tscn` referenced by client; full rendering/input loop maturity not verified without running Godot.
- **CI/testing:** No `.github/workflows/`; backend has two health tests only; no integration test for WebSocket or game loop against FastAPI.
- **`.claude/` contents:** Gitignored — may exist locally for some developers but is not part of the published tree.
- **Relation to `gdt-syv`:** Sibling repo holds extensive ADRs and protocol specs for a more ambitious authoritative Godot server with fog-of-war; how `syv-godot` converges with or replaces that effort is not stated in this repo.
