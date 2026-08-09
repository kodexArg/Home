---
id: "syv-character-kit"
title: "SyV Character Kit — PRD, canonical sheets, and character mocks"
visibility: private
importance: high
source_repo: "syv-character-kit"
org: "kodexArg"
default_branch: "main"
primary_language: "Markdown"
repo_kind: "documentation"
status: "active"
related: []
tags:
  - syv
  - character-kit
  - game-design
  - squad-combat
  - tags
  - api-contract
  - obsidian
  - markdown
  - python
  - lore
problems_solved:
  - "Downstream SyV implementations lacked a single, stack-agnostic contract for character sheets, tag vocabulary, procedural generation, and squad-level combat — causing schema drift between battle engines, lore sites, and narrative tools."
  - "Character and squad state in the SyV universe (Subordinación y Valor) is inherently temporal — canonized fighters evolve via milestones — but teams had no shared model for mutability, opaque slugs, ephemeral vs canonized lifecycles, or squad aggregation rules."
  - "Game designers and AI agents editing SyV content needed curated fixtures, editorial policy, and Obsidian-native workflows without coupling to any one runtime, database, or UI framework."
technologies:
  - "Markdown + YAML frontmatter (canonical data notes)"
  - "Python 3 (reference validation and sampling scripts)"
  - "Obsidian Bases (.base view definitions)"
  - "HTTP API contract (documented, not implemented)"
  - "Tag dot-notation schema (multiset, extensible catalog)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# SyV Character Kit

> **Problem thesis (required):** This private repository is **documentation, not an application**. It is the authoritative design kit for *Subordinación y Valor* (SyV) character sheets, tag catalogs, squad fixtures, procedural creation rules, and a stack-agnostic HTTP API contract. Any team building a battle engine, lore site, scenario generator, or narrative pipeline can implement against these specs without inheriting a particular language, framework, database, or deployment target. The kit solves the fragmentation of character/squad design across the SyV ecosystem by centralizing schemas, mocks, game-design decision records (GDDRs), and editorial policy in one rolling-release document tree.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-character-kit` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | SyV — Character Kit: PRD, canonical character sheet, tag catalog, squad mocks, and battle-motor design for squad-vs-squad combat in a dieselpunk Patagonian war setting (year 2178). |
| Audience | Game designers, narrative writers, API implementers, battle-motor developers, QA pipelines, and AI agents curating SyV canon; not end players directly. |

## 2. Problems it solves

### P1 — No portable, stack-agnostic character contract for SyV

- **Who hurts:** Teams building battle engines, lore galleries, scenario generators, and narrative tooling across the SyV ecosystem.
- **Pain today:** Each consumer invented its own character shape, tag vocabulary, and persistence rules. Stats, ranks, equipment, and squad membership diverged silently between repos. Integrations required ad-hoc translation layers and broke when one side renamed a field.
- **How this repo answers:** Publishes synchronized contracts in `PRD.md`, `API.md`, `MODEL.md`, and `docs/*` — character sheet schema (`hoja-modelo`), tag system (`tag-modelo`), squad schema (`escuadra-modelo`), attribute vocabulary (`atributos-y-efectos`), and 28 mapped user stories (`docs/user-stories.md`). The HTTP surface is specified but not implemented here; implementers choose their own stack.
- **Out of scope:** Running API server, database, authentication, UI, or deployment. Those belong to downstream application repos.

### P2 — Temporal character state and squad tactics without a shared lifecycle model

- **Who hurts:** Writers and systems that must track fighters who change over time (promotions, injuries, equipment capture, squad transfers) while also running squad-level combat with derived aggregates (force, cohesion, morale, movement).
- **Pain today:** Flat character records cannot express append-only `historial[]` milestones, ephemeral vs canonized lifecycles, opaque 8-character slugs separate from display names, or volatile combat state (`iniciativa`) that lives on the squad mirror rather than the character sheet.
- **How this repo answers:** Defines six structural blocks plus flat `tags[]`, milestone-driven mutability, deterministic stats-by-rank at creation, seed-reproducible ephemerals, canonization freeze of `historia` prose, squad entity with embedded members and derived fields, and GDDR-02 initiative grid rules. Provides 22+ immutable mock characters and 2 squad fixtures as living templates.
- **Out of scope:** Full battle resolution (GDDR-02 still in active design), hito reversal, arbitrary canon editing outside milestones, generating full squads in one API call.

### P3 — Curated canon and agent-safe editorial workflow

- **Who hurts:** AI agents and human editors maintaining tags, mocks, and lore fidelity without corrupting irreplacable narrative prose or inventing non-canonical terminology.
- **Pain today:** Schema changes orphan fixtures; Obsidian graph needs conflict with portable YAML; agents duplicate changelog/version noise into living contracts; lore leaks from non-canonical sibling repos.
- **How this repo answers:** `AGENTS.md` enforces rolling-release docs (no version stamps in PRD), strict API↔MODEL sync, mock migration scripts on schema change, lore read-only pointer to the main SyV universe docs vault, Obsidian-specific skills (`skills/kdx-obsidian-bases`, `skills/kdx-backlog`, `skills/manejo_tags_proyecto`), and `kit_tags` frontmatter convention to avoid Obsidian's reserved `tags` field.
- **Out of scope:** Writing or modifying the external SyV universe lore repo; validating tags at schema level (custom tags are accepted by design).

## 3. Product / idea

The central idea is a **documentation product** that fully specifies how SyV characters and squads exist, are created, evolve, and fight — without shipping runtime code. Cloning this repo gives a designer or implementer:

1. **Schemas** — field-by-field character sheet, tag catalog entry, and squad models with YAML templates.
2. **Contracts** — HTTP routes and persistence entities kept in strict sync.
3. **Game design** — GDDR-01 mandatory creation flow (phases 1–3 defined; phase 4 pending) and GDDR-02 squad-vs-squad battle motor (initiative subsystem substantially drafted).
4. **Data** — ~156 tag catalog notes under `tags/`, 24 character mock notes under `mock/personajes/` (22 core squad fighters plus NPC examples), 2 squad fixtures under `mock/escuadras/`, and name pools under `resources/nombres/`.
5. **Tooling hints** — Python scripts for validation, name sampling, slug migration, and initiative simulation; Obsidian Bases for tabular views.

Mental model: **tags are first-class**. Almost everything discrete (skills, traits, perks, equipment, health, mental state, faction, rank, squad membership) is a dot-notation tag in a multiset (`faccion.ejercito_rojo`, `equipo.arma.rifle_militar`). Structural blocks hold identity, three base attributes (`fis`, `tac`, `men`), frozen biography prose, append-only history, ally/nemesis links with prose, and metadata. Squads are first-class entities with members, history, and computed tactical aggregates; combat-volatile `iniciativa` state attaches to squad members, not character sheets.

The SyV setting assumes the **Anatema Mecánico** — no advanced tech in the field; coordination is voice, gesture, and flag. Two playable factions in MVP: Confederación Argentina (blue, formal chain of command) and Ejército Rojo (red, worker militias). War year 2178, stalemate at the Zanja de Alsina in Patagonia.

### 3.1 North-star use cases

1. **Implementer** reads `API.md` + `MODEL.md` + `docs/hoja-modelo.md` and builds a REST service that serves ephemeral characters, canonizes them, records milestones, and manages squads — seeding `tag_catalogo` from `tags/**/*.md` at startup.
2. **Battle motor developer** reads `gddr/02-motor-batalla.md`, `docs/atributos-y-efectos.md`, and `docs/escuadra-modelo.md` to resolve squad-vs-squad encounters using portable percentage/delta modifiers, loading the two canonical squads (`cazadores_de_ricardo`, `columna_mansilla`) as fixtures.
3. **Narrative curator / AI agent** edits mock character notes or tag catalog entries under `AGENTS.md` rules, runs `scripts/validar_escuadras.py` for consistency, and uses Obsidian Bases in `bases/` to browse rosters — without touching forbidden lore repos.

### 3.2 Non-goals

- No application server, UI, CLI for end users, or concrete persistence engine.
- No authentication, authorization, or rate limiting in the contract.
- Secondary lore factions (Pueblos del Pantango, Salvajes, Poseídos) excluded from MVP.
- No full-squad generation in one API call; no milestone reversal; no versioned biography prose.
- Scripts under `scripts/` are provisional reference tooling, explicitly subject to future removal per `PRD.md`.
- Sibling repos (`syv-battle-game-system`, `syv-obsidian`) are explicitly **not** canonical for mechanics — kit sovereignty is local.

## 4. Technology stack

Derived from tree and manifests only. No `package.json`, `pyproject.toml`, `wrangler.jsonc`, or CI workflows present in the shallow clone.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | None shipped; docs in Markdown; utilities in Python 3 | `scripts/*.py`, `PRD.md` §1 |
| Data format | Markdown notes with YAML frontmatter; dot-notation tags | `mock/personajes/**/*.md`, `tags/**/*.md`, `docs/*.yaml` templates |
| Knowledge base UI | Obsidian (Bases, wikilinks, graph) | `bases/*.base`, `skills/kdx-obsidian-bases/SKILL.md`, `.gitignore` lists `.obsidian/` |
| Backend / API | Contract only (REST-style paths documented) | `API.md`, `MODEL.md` |
| Data | Specified entities: `personaje`, `tag_catalogo`, `escuadra`, `faccion` — implementer chooses store | `MODEL.md` |
| Infra / deploy | None in repo; private GitHub source | no `.github/workflows/` in clone |
| AI / agents | Agent editorial policy + Cursor-style skills | `AGENTS.md`, `skills/` |
| Tests | Validation script, not a test framework | `scripts/validar_escuadras.py` |

### 4.1 Notable dependencies (curated)

- **PyYAML** — used by Python scripts to load frontmatter and legacy YAML paths (`scripts/validar_escuadras.py`, `scripts/sample_name.py`).
- **Obsidian Bases** — declarative `.base` files filter `mock/personajes`, `mock/escuadras`, `tags`, and `backlogs` into table/card views (`bases/personajes.base`, `bases/escuadras.base`, `bases/tags.base`, `backlogs/backlog.base`).
- **No runtime npm/pip lockfile** — dependencies are implicit (stdlib + PyYAML assumed for scripts).

## 5. Repository map (abstraction)

Describe zones, not every file:

- **Entrypoints / top-level contracts:** `PRD.md` (vision and artifact map), `API.md` (HTTP routes), `MODEL.md` (persistence entities), `AGENTS.md` (editorial policy), `CHANGELOG.md` (structured change groups; not duplicated inside PRD per policy).
- **Domain / core schemas:** `docs/hoja-modelo.{md,yaml}` (character), `docs/tag-modelo.{md,yaml}` (tags), `docs/escuadra-modelo.{md,yaml}` (squads), `docs/atributos-y-efectos.md` (combat vocabulary), `docs/tag-requeridos-por-categoria.md`, `docs/tag-modelo-ejemplos.yaml`.
- **Game design (GDDR):** `gddr/01-flujo-obligatorio-creacion.md` (creation phases 1–3; phase 4 pending), `gddr/02-motor-batalla.md` (squad combat; active design, initiative chapter substantial).
- **Catalog data:** `tags/` — 17 top-level tag categories (`trait`, `skill`, `perk`, `rasgo`, `rango`, `faccion`, `subfaccion`, `equipo/*`, `salud`, `mental`, `estado`, `escuadra`, `efecto`, `mando`, `rol/*`, etc.) as one Markdown note per tag (~156 files).
- **Fixtures:** `mock/personajes/{faccion}/{subfaccion}/{SLUG}.md` — patent-named character notes; `mock/escuadras/{faccion}/{slug}.md` — two squads with member tables in body.
- **Reference resources:** `resources/nombres/` — curated Argentine name/apellido pools for procedural identity.
- **Adapters / utilities:** `scripts/` — `validar_escuadras.py` (squad/personaje consistency), `sample_name.py` (name sampler), `simular_iniciativa.py`, `regenerar_slugs.py`, `migrate_slug_to_patente.py`.
- **Docs vaults:** `docs/` (public path; authoritative schema docs). **`.docs/` not present** in tracked tree.
- **Agent scaffolding:** `skills/` — `manejo_tags_proyecto.md`, `kdx-backlog/SKILL.md`, `kdx-obsidian-bases/SKILL.md`. **`.claude/` not present** in clone (listed in `.gitignore` for local harness only). **`.agents/`** also gitignored and absent from clone.
- **Obsidian views:** `bases/` — three collection views; `backlogs/` — issue template and Bases view (no `BL-*.md` issues in clone at scan time).
- **Generated / vendor / local-only (gitignored):** `.obsidian/`, `.vistas_obsidian/`, `.antigravitycli/`, `skills-lock.json` — do not ingest per `.gitignore`.

## 6. Configuration & contracts (no secrets)

No `.env`, credentials, or deployment bindings in repo. Configuration is documentary:

- **Character identity:** `identidad.slug` = opaque patent `^[A-Z0-9]{8}$`; tag slugs = lowercase underscore; YAML fields = `snake_case_castellano`.
- **Tag notation:** `<categoria>[.<subcategoria>].<slug>` multiset on `kit_tags` in frontmatter (not `tags:` — Obsidian reserved).
- **Creation determinism:** `(seed, faccion, rango)` reproduces ephemeral characters; stats from rank table are deterministic (no randomness in `fis`/`tac`/`men`); LLM prose for `historia` generated once at creation, frozen on canonize.
- **Mock immutability:** `POST /character/{slug}/event` returns 409 for mock fixtures.
- **Squad template:** `tipo: escuadra_de_infanteria` — 11 members with fixed role composition (1+1+1+1+4+3), total FZA 15 when complete.
- **Portable randomness:** probabilities as percentages; modifiers as integer deltas on canonical stats (`(+1) MENTAL`, `(-1) INICIATIVA`) per `AGENTS.md`.

### 6.1 HTTP / API endpoints (when applicable)

Documented contract in `API.md` — **not implemented in this repo**. Full route table:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/character` | Generate ephemeral character; query: `faccion`, `rango`, `seed`, `fields`, repeated `tag` (AND filter) | none (contract silent) |
| `GET` | `/character/{slug}` | Fetch canonized or mock character by patent; optional `fields=` pruning | none |
| `GET` | `/character/{slug}/historial` | Return append-only `historial[]` only | none |
| `POST` | `/character/{slug}/event` | Append milestone; mutates sheet; 409 on mocks | none |
| `POST` | `/canonize` | Persist ephemeral as canon; assign slug; freeze `historia` | none |
| `GET` | `/roster/mock` | List 22 mock fixtures (summary fields) | none |
| `GET` | `/meta/{categoria}` | Dynamic tag catalog by category (and nested `/meta/equipo/arma`, etc.) | none |
| `GET` | `/meta/factions` | Factions with lore descriptors | none |
| `GET` | `/meta/rangos` | Ranks with deterministic stat table | none |
| `GET` | `/meta/hito_types` | Suggested milestone type enum | none |
| `GET` | `/meta/encuentro/new` | Generate opaque 8-char encounter patent (no persistence) | none |
| `GET` | `/escuadras` | List squads; optional `faccion` filter | none |
| `GET` | `/escuadras/{slug}` | Squad detail with derived tactical fields | none |
| `POST` | `/escuadras` | Create squad | none |
| `POST` | `/escuadras/{slug}/miembro` | Add member; side effects on character tags and histories | none |
| `DELETE` | `/escuadras/{slug}/miembro/{char_slug}` | Remove member; transfer milestones | none |

User stories UC-01 through UC-28 map to these endpoints in `docs/user-stories.md`.

### 6.2 Other interfaces

- **CLI (reference scripts):**
  - `python3 scripts/sample_name.py [m|f] [N]` — sample identity from name pools.
  - `python3 scripts/validar_escuadras.py` — validate mock squads vs characters (exit non-zero on errors).
  - `python3 scripts/simular_iniciativa.py` — initiative simulation helper (per GDDR-02).
  - `python3 scripts/regenerar_slugs.py`, `migrate_slug_to_patente.py` — migration utilities for patent slug format.
- **Obsidian Bases:** open `bases/personajes.base`, `bases/escuadras.base`, `bases/tags.base`, or `backlogs/backlog.base` in Obsidian for filtered tables.
- **Agent skills:** invoke via `skills/kdx-backlog/SKILL.md`, `skills/kdx-obsidian-bases/SKILL.md`, `skills/manejo_tags_proyecto.md` when editing tags, bases, or backlog items.
- **No MCP tools, Telegram commands, or systemd units** defined in repo.

## 7. Data & persistence

**Specified but not hosted here.** `MODEL.md` defines four persisted entities plus embedded collections:

| Entity | Role | Seeded from |
|--------|------|-------------|
| `personaje` | Character sheet with tags, history, allies/nemesis | API create/canonize; mocks in `mock/personajes/` |
| `tag_catalogo` | Curated tag definitions with effects, triggers, requires | `tags/**/*.md` at implementer startup |
| `escuadra` | Squad with members, history, derived combat aggregates | `mock/escuadras/` fixtures; API CRUD |
| `faccion` | Closed-curated faction metadata | `tags/faccion/*.md` |

Important embedded types: `hito` (character milestones), `vinculo` (ally/nemesis refs), `miembro` (squad roster row), `hito_escuadra`. Derived fields (`fza_aportada`, `fatiga_max`, `moral_max`, `fza_total`, `cohesion_vigente`, etc.) are computed at read time, not stored.

**Topology:** Offline-first documentation repo; implementers choose edge/cloud/relational/document stores. Encounter patents from `GET /meta/encuentro/new` are intentionally not persisted as entities — only uniqueness against seen squad member `iniciativa.encuentro` values is guaranteed.

**Mock inventory (scan):** 24 character notes (22 core squad fighters + 2 NPC examples under `mock/personajes/npc/`), 2 squad notes, ~156 tag catalog notes across 17 category directories.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **Root contracts:** `PRD.md`, `API.md`, `MODEL.md`, `AGENTS.md`, `CHANGELOG.md` (header sample).
2. **`docs/**`:** `hoja-modelo.md`, `tag-modelo.md`, `escuadra-modelo.md`, `atributos-y-efectos.md`, `user-stories.md`, `tag-requeridos-por-categoria.md` — all schema and UC mapping.
3. **GDDR / PRD-adjacent:** `gddr/01-flujo-obligatorio-creacion.md`, `gddr/02-motor-batalla.md`.
4. **`.claude/`:** **Not present** in shallow clone. Listed in `.gitignore` (`.claude/`, `.agents/`, `.antigravitycli/`) — intended for local agent harness only; no tracked agent instruction tree to summarize.
5. **`.docs/`:** **Not present.** Hidden docs vault does not exist; public `docs/` serves this role.
6. **Agent skills (in repo):** `skills/manejo_tags_proyecto.md` (tag YAML vs Obsidian graph conventions), `skills/kdx-obsidian-bases/SKILL.md` (Bases views, `kit_tags` collision rule, frontmatter flattening), `skills/kdx-backlog/SKILL.md` (backlog issue workflow from `backlogs/.template.md`).
7. **Fixtures sampled:** `mock/personajes/confederacion/pelicanos/046VJ5BU.md`, `mock/escuadras/confederacion/cazadores_de_ricardo.md`, `tags/trait/cobarde.md`.
8. **Resources:** `resources/nombres/README.md`.

**AGENTS.md highlights for agents:** rolling-release PRD (no version stamps); strict API↔MODEL sync after schema edits; mock migration scripts required when schema changes; lore canon read-only from external SyV universe docs path; destructive mock edits need explicit user approval; randomness expressed as portable percentages/deltas only.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repo — summary describes structure without offering clone URLs as product links; `related: []` in frontmatter.
- **Auth model:** Contract explicitly places authentication, authorization, and rate limiting **out of scope** (`PRD.md` §8). Documented endpoints assume no auth layer.
- **Secrets:** No `.env`, PEM, tokens, or credentials observed in tracked tree. `.gitignore` excludes common secret and local-harness paths.
- **Editorial risk:** Mock `historia` and `historial[].descripcion` prose is treated as irreplacable editorial content — agents must not rewrite without authorization.
- **Lore boundary:** External universe docs are read-only reference; kit does not depend on them technically.

## 10. Operational picture

- **Local use:** Open as Obsidian vault or plain git checkout. Browse contracts in `PRD.md` / `API.md`. Run `python3 scripts/validar_escuadras.py` from repo root to validate mock consistency. Run `python3 scripts/sample_name.py f 5` to sample female identities.
- **Deployment:** None — documentation-only artifact. Downstream services implement `API.md` separately.
- **CI/CD:** No GitHub Actions workflows found in shallow clone.
- **Hardware constraints:** None. Paper-replicable battle rules are a design goal (`PRD.md` §7, `gddr/02-motor-batalla.md`).
- **Editorial workflow:** Issues intended as `backlogs/BL-NNN-*.md` per `backlogs/.template.md` and `skills/kdx-backlog/SKILL.md`; template present, no numbered issues in clone at scan time.

## 11. Open questions / unknowns

- **GDDR-02 completion:** Battle motor document exists and covers initiative in depth, but `PRD.md` §7 still lists motor as pending deliverable; full turn cycle, victory conditions, and tag effect application in combat may be incomplete.
- **GDDR-01 Phase 4:** Tags-after-attributes flow (additional tags, historia, historial, metadatos ordering) not finalized.
- **Tensions and OQs:** T-01..T-10 and OQ-01..OQ-14 referenced in `PRD.md` §9 as living on external Notion project page — not reproduced in repo.
- **`.claude/` / `.agents/` content:** Gitignored and absent from clone; local agent configs unknown.
- **Script `generar_grafo_obsidian.py`:** Referenced in `skills/manejo_tags_proyecto.md` and `CHANGELOG.md` but **not present** in current `scripts/` listing (five scripts only) — may have been removed or never pushed to `main`.
- **Implementing service:** Which downstream repo will host the actual API is unspecified here.
- **Auth for future API:** Deliberately undefined in v1 contract.
