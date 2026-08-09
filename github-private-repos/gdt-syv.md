---
id: "gdt-syv"
title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1"
visibility: private
importance: high
source_repo: "gdt-syv"
org: "kodexArg"
default_branch: "main"
primary_language: "GDScript"
repo_kind: "game"
status: "experimental"
related: []
tags: ["godot", "gdscript", "turn-based", "strategy", "multiplayer", "hex-grid", "authoritative-server", "fog-of-war", "command-chain", "wego", "enet", "steam-networking", "adr", "notion-backlog", "post-apocalyptic", "argentina"]
problems_solved:
  - "Designing a simultaneous (WEGO) turn-based strategy game where command-and-control failure — lost orders, broken radio chains, moral collapse — is a first-class mechanic, not a bug."
  - "Implementing competitive multiplayer fog-of-war without trusting the client: each player must receive only their scoped view of the battlefield, enforced server-side before serialization."
  - "Avoiding dual codebases for game rules by running an authoritative Godot 4.4.1 headless server that shares GDScript logic with the presentation client."
technologies:
  - "Godot Engine 4.4.1 (GL Compatibility renderer)"
  - "GDScript"
  - "Godot MultiplayerAPI / @rpc"
  - "ENet (prototype transport)"
  - "Steam Networking Sockets (planned production transport)"
  - "Markdown ADRs and game manual"
  - "YAML premade squad definitions"
  - "Notion MCP backlog (gdt-notion skill)"
  - "Claude agent skills (godot-best-practices, godot-development, godot-gdscript-patterns, godot-ui)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Subordinación y Valor (SyV)

> **Problem thesis (required):** Subordinación y Valor is a private Godot 4.4.1 project for a simultaneous turn-based strategy game on a multi-level hexagonal grid, set in a post-apocalyptic Argentina (2178). The player is not an omniscient puppeteer but a Commander in a static HQ, issuing orders over a radio chain that can fail, arrive late, or be intercepted. The repository's central engineering bet is an **authoritative headless Godot server** that shares GDScript with the client, enforces **per-player scope** for fog-of-war at the protocol layer, and runs a strict **Briefing → Orders → Resolution** turn cycle. At the time of this summary, the tree is overwhelmingly **design and specification** — twenty-four accepted ADRs, a full game manual, network protocol contracts, and premade squad data — with **no committed Godot source trees** (`shared/`, `client/`, `server/`) yet on `main`.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/gdt-syv` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Turn-based simultaneous hex strategy where command chains, radio interception, and moral degradation matter as much as positioning — built on an authoritative Godot headless backend. |
| Audience | Game designers and implementers on the SyV team; AI coding agents equipped with Godot and Notion backlog skills; future players once a playable prototype exists. Extended lore and world-building live in the separate `kodexArg/syv` companion repo. |

## 2. Problems it solves

### P1 — Command-and-control as gameplay, not UI chrome

- **Who hurts:** Players and designers of military strategy games who want tension from **delegation, delay, and miscommunication** rather than perfect unit control.
- **Pain today:** Most RTS/TBS titles treat the player as a god with instant, lossless orders. SyV's design thesis is the opposite: orders travel as semantic messages through a hierarchical chain (L5 HQ → L4/L3 officers → L2 groups → L1 troops). Transmissions can fail, officers can die before relaying, and late orders execute literally on a battlefield that already changed. Generic orders to officers ("attack at all costs") trade Commander bandwidth for autonomous — and possibly disastrous — interpretation.
- **How this repo answers:** The `docs/manual/` series (especially chapters 06–09, 08, 12, 12b) and ADRs 015–018 formalize mando, communications, triangulation, order pools, generic orders, and Valor degradation. ADR-009 defines the five-level military hierarchy (Sección → Pelotón → Escuadra → Grupo → Tropa) with radio rules (L3+ carry E-UHF; L1/L2 do not, except the special Communications Troop). ADR-015 closes the tactical axis tying `in_command`, `has_radio`, and triangulation to server-computed scope.
- **Out of scope:** Narrative canon, character biographies, and extended world geography — those belong to `kodexArg/syv`. This repo holds game mechanics and implementation contracts only.

### P2 — Trustworthy multiplayer fog-of-war

- **Who hurts:** Multiplayer strategy developers who cannot rely on client-side filtering to hide enemy positions — any leaked state is exploitable.
- **Pain today:** Client-side fog-of-war is trivially bypassed by memory inspection or packet sniffing. Broadcasting full state and hiding it in UI is insecure.
- **How this repo answers:** ADR-005 mandates **scope server-side**: the server never serializes information outside a player's scope. Briefing messages (`S→C*`) are **individualized per peer** via `rpc_id(peer, …)` — not a broadcast of the same packet. Enemy contacts appear only as opaque IDs with fidelity stamps (`FIRM`, `STALE`, `CONTACT`), never with true composition or morale. The `protocol/` directory is the auditable contract: every server→client message declares a **Nota de scope** clause. Triangulation intelligence (post–"El Fin de los Secretos" setting) is computed server-side and scoped per receiving player (ADR-015, ADR-020).
- **Out of scope:** Anti-cheat for modified clients beyond architectural non-leakage; matchmaking and player authentication (future production concerns per `docs/ARCHITECTURE.md`).

### P3 — Single codebase for client presentation and authoritative server

- **Who hurts:** Small teams building turn-based multiplayer who would otherwise maintain parallel rule implementations (e.g., GDScript client + Python/Rust server) that inevitably diverge.
- **Pain today:** Split stacks double every rule change and multiply test surface. Hybrid proxy architectures add premature ops complexity.
- **How this repo answers:** ADR-003 commits to **Godot 4.4.1 headless** as the authoritative backend, sharing `shared/` GDScript with the client. ADR-008 defines the intended layout: `shared/` (rules, hex grid, units), `client/` (UI, rendering, input), `server/` (headless arbiter, turn resolution), `protocol/` (message contract). ADR-007 allows a listen-server prototype on localhost with ENet (ADR-006), migrating later to Steam Networking Sockets without renaming RPCs. Turn phases are discrete — the server is idle during the local Orders phase (ADR-004).
- **Out of scope:** Actual Godot project scaffolding on `main` at summary time — directories are specified but not yet present in the clone. Containerized production deploy and Steam SDK integration are documented as future phase only.

## 3. Product / idea

SyV is a **two-player, simultaneous (WEGO)** hex strategy game. Each turn represents four hours of operations. Before the first turn, both players deploy forces simultaneously and hidden in their deployment zones; the server validates and only then starts the turn cycle.

The mental model:

```
[Client A] —orders intent→ [Headless Godot Server] ←orders intent— [Client B]
                                    ↓
                         computes rules + scope
                                    ↓
[Client A] ←scoped state— [Server] —scoped state→ [Client B]
```

**Briefing:** Server computes world state and delivers a **different payload per player** — own force in full, enemy only as detected contacts, map deltas visible to that player, command-chain coverage (BFS from HQ per ADR-009).

**Orders:** Entirely local on each client. Undo/reset freely. One `submit_orders` message closes the phase.

**Resolution:** Server executes both players' validated orders in initiative order (ADR-012), streaming `resolution_delta` events per scoped peer. Cycle repeats until victory (ADR-014, manual chapter 11).

### 3.1 North-star use cases

1. **Deploy and fight on the Franja de Alsina** — Choose Confederación (regular, church-integrated command) or Los Rojos (flatter hierarchy, special Infernales cavalry on electric ATVs). Same rules for both factions; asymmetry is compositional (which squad types each faction may field), not mechanical bonuses.
2. **Fight through command failure** — Issue specific orders to squads or generic directives to officers; watch orders fail to transmit, arrive late from prior turns, or execute under changed conditions; manage radio triangulation risk in a world where all signals can eventually be decrypted.
3. **Agent-assisted implementation** — Use locked Notion backlog (`gdt-notion` skill), ADR corpus, and `protocol/` contracts to incrementally build `shared/`, `client/`, and `server/` without re-deciding architecture.

### 3.2 Non-goals

- Real-time action or continuous simulation ticks — turn phases are discrete (ADR-003, ADR-004).
- Client authority over game state — clients send intention only (ADR-003, ADR-005).
- Faction-specific combat bonuses — balance via squad composition and scenario design (vision doc, manual 03).
- HTTP REST API for game logic — networking is Godot RPC over ENet/Steam, not a web service.
- Lore encyclopedia — extended universe is external (`kodexArg/syv`).

## 4. Technology stack

Derived from `README.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, ADRs, and `skills-lock.json`. No `package.json`, `Cargo.toml`, or `project.godot` on `main` at summary time.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Godot 4.4.1, GDScript | `README.md`, `AGENTS.md`, ADR-002, ADR-003 |
| Renderer | GL Compatibility | `AGENTS.md` |
| Frontend (planned) | Godot client scenes — UI, hex presentation, input | `docs/ARCHITECTURE.md` § Estructura |
| Backend (planned) | Godot headless `--headless`, same GDScript | ADR-003, `docs/ARCHITECTURE.md` |
| Networking | ENet localhost (prototype); Steam Networking Sockets (production) | ADR-006, ADR-007, `docs/ARCHITECTURE.md` |
| Data / content | YAML premade squads; ADR-defined entity model | `docs/premade-squads/`, ADR-009 |
| Docs / decisions | Markdown ADRs 001–024, game manual, vision synthesis | `docs/adr/`, `docs/manual/`, `docs/vision/` |
| AI / agents | Claude skills: godot-*, gdt-notion, gdt-notion-backlog-review, kdx-agent-changelog | `.claude/skills/`, `skills/`, `AGENTS.md` |
| Backlog | Notion database via MCP (10-field locked schema) | `.claude/skills/gdt-notion/SKILL.md` |
| License | GPL v3 | `LICENSE` |
| Tests | Not present in tree | — |

### 4.1 Notable dependencies (curated)

- **Godot MultiplayerAPI / `@rpc`** — Native transport-agnostic RPC layer; mapped in `protocol/rpc.md` with `solicitar_*`, `notificar_*`, `entregar_*` naming (ADR-006).
- **ENet** — Prototype transport bundled with Godot; zero-config localhost (ADR-006, ADR-007).
- **Steam Networking Sockets** — Planned production relay, NAT traversal, DDoS protection (ADR-006; not integrated in tree).
- **External agent skills** (pinned in `skills-lock.json`) — `godot-best-practices`, `godot-development`, `godot-gdscript-patterns`, `godot-ui` vendored from community skill repos for agent guidance.
- **Notion MCP** — Backlog CRUD for implementation tasks (`gdt-notion` skill); schema locked at 10 fields.

## 5. Repository map (abstraction)

Current `main` is a **specification-first** repository. Planned Godot code zones are documented but not yet committed.

- **Entrypoints (planned):** `client/` — player-facing Godot project entry; `server/` — headless authoritative entry; both share `shared/`. Neither directory exists on `main` yet.
- **Domain / core (planned):** `shared/` — hex grid, turn phases, unit model, combat resolution, fog-of-war computation (ADR-008). Referenced throughout ADRs 009–024.
- **Adapters (planned):** Godot `MultiplayerAPI` RPC handlers in `client/` and `server/` implementing `protocol/rpc.md`.
- **Network contract (present):** `protocol/` — `messages.md` (message catalog), `rpc.md` (Godot RPC mapping + session state machine), `schema/` (payload shapes: `types.md`, `briefing.md`, `orders.md`, `resolution.md`).
- **Game design corpus (present):** `docs/manual/` — 17-chapter player-facing rules (intro through victory, communications, triangulation). `docs/vision/` — narrative synthesis tying ADRs and manual together. `docs/adr/` — 24 accepted architectural decisions. `docs/premade-squads/` — YAML squad rosters for Confederación and Rojos factions plus `_template.yaml`.
- **Agent scaffolding (present):** `.claude/skills/` — `gdt-notion`, `gdt-notion-backlog-review`, Godot skill packs, plus `worktrees/` from prior agent sessions (duplicate snapshots; not authoritative over root). `.agents/skills/` — mirror of Godot skills. Root `skills/` — `kdx-agent-changelog` and symlinks to Godot skills. `AGENTS.md` / `CLAUDE.md` — agent directives, ADR summary table, Notion backlog etiquette, 75-char table width rule.
- **Generated / vendor:** `.godot/` is gitignored (Godot editor cache). `.claude/worktrees/` contains agent worktree copies — treat as ephemeral, not SSOT.
- **No `.docs/` vault** — scanned; directory absent.

## 6. Configuration & contracts (no secrets)

No `.env`, `wrangler.jsonc`, or credential files in the tracked tree. `.gitignore` contains only `.godot/`.

**Agent / tooling configuration (non-secret):**

- Godot binary expected at `~/.local/bin/godot` per `AGENTS.md` (local dev path, not a repo secret).
- Notion resource UUIDs are embedded in `gdt-notion` and `gdt-notion-backlog-review` skills (page and database IDs for the SyV backlog) — these are integration identifiers, not authentication tokens; actual Notion auth is via MCP at runtime.
- `skills-lock.json` pins external skill package hashes for reproducibility.

**Game protocol constants (from ADR-001, ADR-023, ADR-024):**

- Faction IDs: `confederacion`, `rojos`.
- Spatial: axial hex coords; 1 hex = 100 m; E-UHF tactical radio = 5 hexes.
- MVP map invariants (ADR-024): procedural blob map with band zones (Azul q≤-15, Rojo q≥15), HQ positions at mirrored coordinates, symmetric force composition (1 HQ + 3 infantry L3 per side for MVP).

### 6.1 HTTP / API endpoints (when applicable)

This repository defines **no HTTP surface**. There is no OpenAPI spec, no Workers routes, no Django `urls.py`, and no web server configuration. Game networking is exclusively **Godot RPC over ENet (prototype) or Steam Networking Sockets (planned)**.

All remote interaction is documented as logical messages in `protocol/messages.md`, not REST paths.

### 6.2 Other interfaces

**Godot RPC contract** (`protocol/rpc.md`) — transport-agnostic, reliable except heartbeat:

| RPC name | Direction | Phase | Purpose |
|----------|-----------|-------|---------|
| `solicitar_handshake` | C→S | Handshake | Protocol version + player identity |
| `entregar_bienvenida` | S→C (peer) | Handshake | Session assignment |
| `entregar_rechazo_handshake` | S→C (peer) | Handshake | Rejection with error code |
| `entregar_estado_lobby` | S→C* (peer) | Lobby | Faction/deployment zone for self |
| `solicitar_seleccion_faccion` | C→S | Lobby | Faction choice intent |
| `solicitar_despliegue` | C→S | Lobby | Initial force placement |
| `entregar_ack_despliegue` | S→C (peer) | Lobby | Deployment validation result |
| `notificar_inicio_partida` | S→C broadcast | Lobby→Briefing | Public match start metadata |
| `entregar_briefing` | S→C* (peer) | Briefing | Scoped world state per player |
| `solicitar_ack_briefing` | C→S | Briefing | Client ready acknowledgment |
| `solicitar_envio_ordenes` | C→S | Orders | Submit turn orders (closes local phase) |
| `entregar_validacion_ordenes` | S→C (peer) | Orders | Order acceptance/rejection |
| `entregar_espera_oponente` | S→C (peer) | Orders | Waiting for opponent submission |
| `notificar_inicio_resolucion` | S→C broadcast | Resolution | Resolution phase start |
| `entregar_delta_resolucion` | S→C* (peer, sequenced) | Resolution | Scoped combat/movement events |
| `entregar_fin_resolucion` | S→C (peer) | Resolution | Turn resolution complete |
| `notificar_latido` | bidirectional | Any | Unreliable heartbeat |
| `solicitar_reanudar_sesion` | C→S | Any | Reconnect; server recomputes fresh briefing |
| `entregar_cierre_sesion` | S→C (peer) | Any | Session termination |

**Session state machine** (server): `NUEVO → HANDSHAKE → LOBBY → BRIEFING → ORDERS → RESOLUTION → (loop or FIN)`; disconnect → `SUSPENDIDA` with resume via fresh briefing (no historical delta replay — ADR-005).

**Order types** (from `protocol/messages.md` §4.1): `MOVE`, `ATTACK`, `HOLD`, `REGROUP`, `GENERIC`, and extensible set; params reference `HexCoord` or opaque enemy contact IDs from briefing only.

**CLI / editor:** Planned Godot editor launch and `godot --headless` server run — commands not yet scripted in repo.

**Agent skills (invocable):** `/gdt-notion` (backlog CRUD), `/gdt-notion-backlog-review` (parallel backlog orchestrator), `kdx-agent-changelog` (on explicit git tag only).

## 7. Data & persistence

**In-repo data (present):**

- **Premade squads** — `docs/premade-squads/*.yaml` define faction squads (infantry, mortars, recon, engineers, HQ platoons, Infernales cavalry, etc.) using `_template.yaml` schema: `squad.id`, `faction`, `type`, `squad_level`, `leader`, `groups[]`, `direct_members[]`, `cost`.
- **ADR-defined entities** (ADR-009) — `Seccion`, `Peloton`, `Escuadra`, `Grupo`, `Tropa` with fields for rank, level (L1–L5), `has_radio`, `alive`, `equipment[]`, hex position on `Escuadra`, aggregated `strength`/`moral` (ADR-021).
- **Protocol schemas** — `protocol/schema/` describes serializable payload shapes for briefing, orders, and resolution events.

**Persistence (not implemented):**

- No database migrations, save files, or cloud persistence in tree. `docs/ARCHITECTURE.md` marks match persistence and matchmaking as TBD for production.
- Game state lives in server memory during a session; reconnection recomputes scope from authoritative state (ADR-005, `protocol/rpc.md`).

**Topology:** Prototype = all processes on localhost (listen server, ADR-007). Future = Linux container + Godot headless + `.pck` on Steam; hosting provider undecided.

## 8. Docs & agent memory (required scan)

### 8.1 Root documentation

- `README.md` — One-paragraph pitch: turn-based hex strategy, post-apocalyptic 2020–2178, Godot 4.4.1, GPL v3.
- `AGENTS.md` / `CLAUDE.md` — Spanish agent brief: engine version, ADR summary table (001–008 listed inline; 009–024 in `docs/adr/`), 75-char table width rule, proactive Notion backlog suggestions (ask before adding).
- `CHANGELOG.md` — Semantic versioning; v0.1.0 (2026-05-18) design-closure batch; unreleased ADR-024 procedural map MVP.
- `docs/ARCHITECTURE.md` — Authoritative server model, three-phase turn cycle, security, planned directory layout, transport phases.

### 8.2 Game manual (`docs/manual/`)

Seventeen chapters from `00-index.md` through `12b-triangulacion-y-sigilo.md`, covering: introduction and philosophy, battlefield and distances, factions and force composition, units and character sheets, turn structure, orders, combat, command and subordination, Valor, fog-of-war, victory, communications, triangulation and stealth. Evidence: `docs/manual/01-introduccion.md` establishes HQ-static Commander, simultaneous multiplayer, four-hour turns, three phases.

### 8.3 Vision synthesis (`docs/vision/`)

- `VISION-GENERAL.md` — Narrative walkthrough of how the game would work per existing specs; marks open decisions explicitly; describes Confederación vs Rojos, "El Fin de los Secretos", erosion-style victory, WEGO flow. Evidence: `docs/vision/VISION-GENERAL.md`.
- `ESTRUCTURA-EJERCITO.md` — Army structure reference.

### 8.4 ADRs (`docs/adr/`)

Twenty-four accepted ADRs (001–024 plus 001-01 grados militares). Highlights:

| ADR | Topic |
|-----|-------|
| 001 / 001-01 | Canonical glossary and military ranks per faction |
| 002 | Godot conventions (living document) |
| 003 | Headless authoritative backend |
| 004 | Briefing → Orders → Resolution cycle |
| 005 | Per-player scope security / fog-of-war |
| 006 | ENet → Steam Networking Sockets migration path |
| 007 | Listen-server prototyping |
| 008 | Project directory structure |
| 009 | Military force data model |
| 010 | Network protocol contract |
| 011–012 | Per-soldier combat resolution; initiative ordering |
| 013–022 | Stats, scenarios, terrain, Valor, orders, detection, revelation, squad aggregation, special squads |
| 023 | Spatial coordinates and distance |
| 024 | Procedural map generation MVP |

### 8.5 `.claude/` agent skills (scanned)

- **`gdt-notion`** — Notion MCP backlog manager; 10-field locked schema (Task, Status, Priority, Category, Scope, Effort, Description, Dependencies, Nodes/Scenes, Started); maps categories to planned `shared/`, `client/`, `protocol/` zones; fixed Notion page/database UUIDs.
- **`gdt-notion-backlog-review`** — Orchestrator that dispatches up to 6 parallel worker agents in isolated worktrees to process open backlog items; does not fix issues itself.
- **`godot-best-practices`, `godot-development`, `godot-gdscript-patterns`, `godot-ui`** — Community Godot agent guidance (architecture, GDScript patterns, UI).
- **`worktrees/`** — Prior agent session snapshots; duplicate of root docs/protocol — not authoritative.

### 8.6 `.agents/` and root `skills/`

- `.agents/skills/` — Same Godot skill packs as `.claude/skills/` (minus gdt-notion skills).
- `skills/kdx-agent-changelog/SKILL.md` — Writes `CHANGELOG.md` entries only on explicit git version tags.
- `skills-lock.json` — Pins external skill sources and content hashes.

### 8.7 `.docs/` vault

**Not present** — no hidden docs vault in this repository.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository. This summary contains no clone URLs or live credentials. Related public lore repo is referenced by name only (`kodexArg/syv`).
- **Auth model:** Prototype uses opaque `player_token` in handshake (may be a nick); production Steam auth undecided. Server validates `multiplayer.get_remote_sender_id()` against session `player_id` on every `solicitar_*` RPC (ADR-003, `protocol/rpc.md`). No OIDC, session cookies, or API keys in tree.
- **Information security design:** Fog-of-war enforced by non-serialization of out-of-scope data (ADR-005), not client filtering. Triangulation intelligence is per-receiver scoped. `resume_session` never replays historical deltas — recomputes fresh briefing to prevent reconstruction leaks.
- **This summary:** Contains no secrets, PEM keys, `.env` values, or connection strings with passwords. Notion UUIDs in skills are resource identifiers, not auth tokens.

## 10. Operational picture

**Current phase (per `docs/ARCHITECTURE.md` and ADR-007):** Local prototype — Godot headless server + clients on same machine, ENet localhost, no Steam SDK, no containers. Architecture client/server separation is specified from day one even if physically colocated.

**Local dev (intended, from `AGENTS.md`):**

- Godot 4.4.1 at `~/.local/bin/godot`, GL Compatibility renderer.
- Planned: run headless server scene from `server/`; run client from `client/` — **not yet available in committed tree**.

**Agent workflow:**

- Proactive backlog suggestions via `AGENTS.md` rules; confirm before `/gdt-notion` writes.
- Table output max 75 characters wide in agent-generated markdown for this project.
- Backlog review orchestration via `/gdt-notion-backlog-review` for batch open-item processing.

**Deployment (future):**

- Steam distribution + Steam Networking Sockets transport.
- Linux container with Godot headless + `.pck`.
- AWS or cost-effective alternative for server hosting — undecided.
- CI/CD: not evident in cloned tree (no `.github/workflows/` on `main`).

**Hardware constraints:** Turn-based discrete phases — minimal continuous CPU. No GPU requirement for headless server. Client uses GL Compatibility (broader hardware support than Vulkan).

## 11. Open questions / unknowns

- **No Godot implementation on `main`:** `shared/`, `client/`, `server/`, `project.godot`, and `.gd` source files are absent. The repo is design-complete for many mechanics but implementation has not landed in the tracked tree.
- **Production hosting, matchmaking, persistence:** Explicitly TBD in `docs/ARCHITECTURE.md`.
- **Some tactical mechanics still marked open** in vision doc and ADR-015 (e.g., exact Communications Troop amplification range, HQ loss succession rules, E-VHF vs E-UHF distinctions, single-enemy triangulation edge cases) — manual marks these as pending before full server implementation.
- **Steam SDK integration:** Planned (ADR-006) but no SDK artifacts or bindings in tree.
- **CI/CD pipelines:** Not found on `main`.
- **`.docs/` vault:** Does not exist in this repo (unlike some sibling kodexArg projects).
- **Test harness:** No automated test configs observed.
- **Exact Godot scene graph and node naming:** ADR-002 is a living conventions doc; concrete scene files not yet committed.
