---
id: "syv-pj"
title: "syv-pj — character contract module for Subordinación y Valor"
visibility: public
importance: normal
source_repo: "syv-pj"
org: "kodexArg"
default_branch: "main"
primary_language: "Markdown"
repo_kind: "documentation"
status: "active"
related: []
tags: ["markdown", "obsidian", "yaml", "character-sheet", "tabletop-rpg", "procedural-generation", "tags", "api-contract", "syv", "argentinian-spanish", "lore", "catalog"]
problems_solved:
  - "Multiple SyV consumers (narrative vault, battle engine, RPG table, visual portrait generator) need one canonical character schema instead of incompatible parallel formats."
  - "Character classification, procedural generation, and post-creation mutation require an extensible tag model that grows without schema migrations or breaking stored data."
  - "Universe lore and mechanical character data must stay separated so lore lives in one vault while the character module stays autonomous, testable, and implementation-agnostic."
technologies:
  - "Obsidian Flavored Markdown (OFM)"
  - "YAML frontmatter"
  - "Python 3 maintenance scripts (PyYAML)"
  - "HTTP API contract (documented, not implemented here)"
  - "ComfyUI workflow contract (portrait generation)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# syv-pj

> **Problem thesis (required):** `syv-pj` is the **minimum-entity module** for *Subordinación y Valor* (SyV): the **character** (`personaje`). It is **not an application** — it is a self-contained set of **contracts, catalogs, and rules in Markdown** that define what a character is in this universe, how it is classified, how it mutates over time, and how external systems operate on it through a documented HTTP API. The module is **autonomous** (no dependency on other repos), **faithful to the SyV universe** (2178, Anatema Mecánico, Confederación vs. Ejército Rojo), and **usage-agnostic** (same homogenized sheet serves narrative diégesis, strategy combat, tabletop play, and visual sheet generation). Consumers choose the use; `syv-pj` classifies, stores, and delivers.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-pj` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Documentation-as-contract for the SyV character: schema, tag ontology, procedural generation rules, universe catalogs, and HTTP/MODEL contracts — with no runtime implementation in-repo. |
| Audience | SyV authors and curators, implementers of `syv-pj-api` (or any HTTP consumer), battle/strategy engines, RPG facilitators, diégesis vault editors, AI agents maintaining character data, and procedural character generators. |

## 2. Problems it solves

### P1 — One character, many consumers

- **Who hurts:** Teams building narrative tools, battle simulators, RPG facilitators, and portrait pipelines in parallel over the same fictional universe.
- **Pain today:** Each consumer invents its own character JSON/YAML shape. Faction membership in the vault does not match combat stats in the engine; visual generators read ad-hoc fields; canon mutations in one system do not propagate semantics to others.
- **How this repo answers:** A single **hoja de personaje** (character sheet) contract in `docs/hoja-personaje.md` with six structural blocks (`identidad`, `atributos`, `tags`, `historia`, `historial`, `metadatos`, plus `apariencia` and `extras`). `MODEL.md` types every field; `API.md` defines how to read, generate, canonize, and mutate characters. `docs/casos-de-uso.md` maps consumers (generator, diégesis, battle engine, game engine, visual projection) to operations. Field pruning via `?campos=` lets each consumer request only what it needs.
- **Out of scope:** Squad/group simulation, tactical encounter resolution, UI dashboards, and concrete persistence engines — those belong to sibling tools in the SyV ecosystem.

### P2 — Extensible classification without migrations

- **Who hurts:** Designers adding new factions, equipment, traits, loyalty edges, or milestone types mid-campaign.
- **Pain today:** Relational schemas require ALTER TABLE and versioned migrations; ad-hoc enums break when lore expands; duplicate fields (`ventaja` vs `aspecto`, legacy `rol` vs `especialidad`) diverge silently.
- **How this repo answers:** **Tags as first-class model** (`docs/sistema-tags.md`): slash notation `<categoria>/<slug>` (and optional nested segments) in a flat `tags[]` list that is **not a multiset** (last value wins). Open/closed principle: new tag categories, hito types, and catalog entries extend vertically without breaking stored characters. Tags outside the curated catalog are **legal** — curation is process, not a hard DB constraint. Relational bonds (`lealtad/*`, `aliado/*`, `nemesis/*`) are tags, not separate tables. Contracts (`docs/contratos.md`) attach mechanical packages behind `aspecto/*`, `habilidad/*`, and `efecto/*` tags.
- **Out of scope:** Automatic validation that every tag resolves to a catalog entry; referential integrity for `actores[]` or bond slugs — dangling references are accepted by design.

### P3 — Deterministic mechanics, seeded identity, living canon

- **Who hurts:** Procedural generators, QA testers, and canon curators who need reproducible drafts but irreversible narrative history once published.
- **Pain today:** Random stat rolls make regression testing impossible; biography re-generation overwrites canon; there is no clear ephemeral-vs-canon lifecycle.
- **How this repo answers:** **Eight-phase procedural flow** (`docs/generacion-procedural.md`): affiliation and identity are seeded; **attributes are deterministic** from rank tables in `resources/rangos/` (zero randomness in `cuerpo`/`mente`/`alma`); tags are weighted draws from `resources/catalogos/` and rules in `resources/reglas/`; `historia` prose is LLM-generated **once** and frozen at canonization. Ephemeral characters (`identidad.slug: null`) are reproducible via `(semilla, faccion, rango)`; canonized characters gain an opaque 8-char patent slug and an append-only `historial[]` of milestones (`combate`, `ascenso`, `agregar_tag`, `formacion_lealtad`, etc.). `POST /canonizar` is idempotent on the seed tuple.
- **Out of scope:** Milestone reversal, arbitrary editing of canonized sheets outside hitos, and versioning of frozen prose.

### P4 — Lore vs. mechanics separation

- **Who hurts:** Lore writers and mechanics authors who would otherwise duplicate faction articles or invent terminology in the character module.
- **Pain today:** Character repos become second lore wikis; faction names drift from the universe bible; geography and chronology get re-invented per tool.
- **How this repo answers:** `docs/diegesis.md` explicitly redirects universe context to the external **`syv-docs`** Obsidian vault (trasfondo, atlas, personajes notables, diégesis narratives). `syv-pj` holds **operational stereotypes** in `resources/personajes/` (shallow molds for generators) while deep biography stays in `syv-docs`. `AGENTS.md` mandates universe fidelity — verify terminology against lore SSOT, do not invent geography or factions here. `resources/facciones/*.md` entries link to lore paths via `doc:` frontmatter fields without duplicating articles.
- **Out of scope:** Owning the SyV universe bible, secondary lore factions (Pueblos del Pantano, Salvajes, Poseídos), or civilian characters without military specialty.

## 3. Product / idea

The central idea is **documentation as the product**: implementers read `PRD.md`, `MODEL.md`, and `API.md` as binding contracts; curators maintain **machine-readable catalogs** under `resources/` as the data SSOT adopted from the former `syv-pj-api` monolith (per `CHANGELOG.md`). The mental model:

```
[resources/ catalogs + rules] ──seed──▶ [Procedural generator (external)]
                                              │
                                              ▼
                                    Ephemeral personaje (GET /personaje)
                                              │
                              POST /canonizar ▼
                                    Canon personaje + historial[]
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              ▼                               ▼                               ▼
        Diégesis (wikilinks)           Battle engine (stats)          Visual (ComfyUI workflow)
```

A character sheet has **three data classes** (`docs/hoja-personaje.md`): **persisted** fields (identity, attributes, tags, historia, historial, metadatos, extras), **derived-at-serve** fields (`es_canon`, `fatiga_max`, `moral_max`, `fza_aportada`, `filiacion`), and **volatile combat state** (explicitly out of scope — lives in the battle motor).

The universe anchor: **year 2178**, eighteen years of war along the **Zanja de Alsina** in Patagonia; **Confederación Argentina** (regular squads, formal chain of command, clerical attachments) vs. **Ejército Rojo** (worker militias from Bahía Blanca, heterogeneous cells); **Anatema Mecánico** forbids field drones, computing, and smart weapons — coordination is voice, gesture, and pennant.

### 3.1 North-star use cases

1. **Procedural cast generation (UC-G01–G05):** A generator requests `GET /personaje?faccion=…&rango=…&semilla=…`, previews ephemerals, then `POST /canonizar` to persist with a patent slug and open `historial[]`.
2. **Narrative diégesis (UC-D01–D06):** An author reads a canonized sheet, writes scenes consistent with tags and `historia`, registers narrative milestones via `POST /personaje/{slug}/evento`, and navigates faction/roster graphs via Obsidian wikilinks in example fichas.
3. **Battle/strategy consumption (UC-B*):** A combat motor pulls pruned fields (`atributos`, equipment tags, derived `fza_aportada`) without needing prose blocks.
4. **Visual portrait pipeline:** `GET /personaje/{slug}/workflow` returns a deterministic ComfyUI API-JSON graph (seed from character, LoRA stack from tags) per `API.md` and `docs/prompt-imagen.md` (referenced, not fully duplicated here).
5. **Catalog curation:** Editors add a new `habilidad` or `equipo` entry as a markdown file under `resources/catalogos/`; the `/meta/{categoria}` contract exposes it without code changes.

### 3.2 Non-goals

- HTTP server, database, auth, rate limiting, or deployment — explicitly out of scope per `PRD.md` §4.
- Group/squad entities and tactical simulation (single character only; optional membership tags at most).
- Implementing dice mechanics — probabilities are expressed as portable percentages and integer deltas (`AGENTS.md`), not system-specific notation.
- Backward-compatibility documentation inside docs — single current-version docs; history lives in `git log` and `CHANGELOG.md`.
- Publishing internal design spine files (`SPINE.md`, `ORCHESTRATOR.md` are gitignored and not part of the public contract surface).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | No application runtime; authoring in Markdown/YAML; Python 3 for maintenance scripts | `_tools/*.py`, YAML frontmatter throughout |
| Frontend | None (Obsidian vault authoring) | `docs/obsidian.md`, `.vscode/settings.json` |
| Backend / API | **Contract only** — REST shapes documented, implementation external (`syv-pj-api` per changelog) | `API.md`, `MODEL.md` |
| Data | Markdown entity files + YAML fragments; tag catalogs as per-entity `.md` with frontmatter | `resources/**` |
| Infra / deploy | Public GitHub repo; consumed as docs/submodule | `CHANGELOG.md`, `README.md` |
| AI / agents | Editorial policy for agents; LLM for `historia` generation in procedural flow; ComfyUI for portraits | `AGENTS.md`, `docs/generacion-procedural.md`, `API.md` §1 workflow route |
| Tests | Python `unittest` for roster schema migration | `_tools/test_roster_schema.py` |

### 4.1 Notable dependencies (curated)

- **PyYAML** — used by `_tools/migrate_roster_hoja_v2.py` and related maintenance scripts for frontmatter parsing (not declared in a root manifest; scripts import `yaml` directly).
- **Obsidian Flavored Markdown** — wikilinks, callouts, `==highlight==`, frontmatter contracts; skills `/obsidian-markdown` and `/obsidian-bases` referenced in `docs/obsidian.md`.
- **ComfyUI workflow JSON** — portrait endpoint returns raw node graphs, not wrapped in the `personaje` envelope (`API.md`).

## 5. Repository map (abstraction)

- **Entrypoints / contracts (root):** `README.md` (navigation hub), `PRD.md` (vision and scope), `MODEL.md` (persistence types and invariants), `API.md` (HTTP contract), `AGENTS.md` (editorial policy for humans and agents), `CHANGELOG.md` (release notes).
- **Domain / core docs:** `docs/hoja-personaje.md` (sheet anatomy — nucleus), `docs/sistema-tags.md` (tag ontology), `docs/atributos.md` (cuerpo/mente/alma and derived stats), `docs/contratos.md` (aspecto/habilidad/efecto packages), `docs/generacion-procedural.md` (8-phase creation flow), `docs/historial.md`, `docs/lealtad.md`, `docs/nemesis-y-aliados.md`, `docs/apariencia.md`, `docs/casos-de-uso.md`.
- **Data catalogs (`resources/`):** universe SSOT for generation and `/meta/*` seeding — ~408 markdown/YAML files total.
  - `resources/catalogos/` — `aspecto`, `entrenamiento`, `equipo`, `habilidad`, `rasgo` (~111 entity files).
  - `resources/facciones/` — 20 playable factions + `independiente` mechanical entry (`_moc-facciones.md` index).
  - `resources/subfacciones/` — 12 subfaction definitions.
  - `resources/rangos/` — per-faction rank tables with deterministic base attributes.
  - `resources/especialidades/` — per-faction tactical specialty catalogs.
  - `resources/personajes/` — ~40 example character sheets (stereotypes for generators/LLM style guides).
  - `resources/reglas/` — per-key generation parameters (e.g. `edad_default`, `rasgo_prob`, `equipo_cuota`) migrated from monolithic YAML.
  - `resources/nombres/` — name pools (`nombres_mujeres.yaml`, `nombres_varones.yaml`, text lists).
  - MOC index files (`_moc-*.md`) for Obsidian discoverability across categories.
- **Adapters / maintenance:** `_tools/` — deterministic migration (`migrate_roster_hoja_v2.py`), tag normalization (`normalize_tags.py`), slug verification (`verificar_slugs_doc.py`), schema tests (`test_roster_schema.py`).
- **Docs vaults:** `docs/` (public contract docs); **no `.docs/` hidden vault present in tree**.
- **Agent scaffolding:** **No `.claude/` directory present** in the cloned tree (though `resources/personajes/_moc-personajes.md` references `.claude/rules/tags-taxonomy.md` and `wikilinks-relations.md` as conventions — those files are not shipped in this repo snapshot). Agent rules live primarily in `AGENTS.md`.
- **Generated / gitignored (existence only, not ingested):** `SPINE.md`, `ORCHESTRATOR.md`, `.obsidian/workspace*`, `__pycache__/` per `.gitignore`.

## 6. Configuration & contracts (no secrets)

- **No `.env` or credential files** in the tracked tree; this is a documentation repository.
- **Frontmatter field names** (`title`, `tags`, `aliases`, `slug`, `description`, etc.) are a programmatic contract — keys stay English lowercase per `AGENTS.md`; values may be Spanish prose.
- **Identifier conventions:** character patent `^[A-Z0-9]{8}$`; catalog slugs `lowercase_with_underscores`; tags use slash notation aligned with Obsidian folder paths.
- **Procedural rules** live as keyed markdown in `resources/reglas/*.md` with `clave` and `valor` in frontmatter (e.g. `edad_default` → min/max/median/deviation).
- **Faction entries** expose `probabilidad` weights for affiliation draws and `doc:` pointers to lore SSOT paths.
- **Bindings:** N/A (no Cloudflare/worker config in-repo).

### 6.1 HTTP / API endpoints (contract — implementation external)

Documented in `API.md`; any route not listed there is not part of the contract.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/personaje` | Generate ephemeral character; query `faccion`, `rango`, `semilla`, `campos`, repeatable `tag` | unknown — not specified in contract |
| `GET` | `/personaje/{slug}` | Fetch canonized sheet with derived fields | unknown |
| `GET` | `/personaje/{slug}/historial` | Return `historial[]` only (no pagination v1) | unknown |
| `GET` | `/personaje/{slug}/workflow` | Deterministic ComfyUI API-JSON portrait workflow for canonized character | unknown |
| `POST` | `/personaje/{slug}/evento` | Append milestone hito; apply tag/attribute effects per type table | unknown |
| `POST` | `/canonizar` | Persist ephemeral → canon; assign patent slug; freeze `historia` | unknown |
| `GET` | `/generar` | Full procedural pipeline (semantically equivalent to `GET /personaje`) | unknown |
| `GET` | `/meta/{categoria}` | Tag catalog for category (supports nested e.g. `/meta/equipo/arma`) | unknown |
| `GET` | `/meta/facciones` | Faction list with short lore descriptors | unknown |
| `GET` | `/meta/rangos` | Ranks with per-faction deterministic base attributes | unknown |
| `GET` | `/meta/tipos_hito` | Suggested milestone type enumeration (open catalog) | unknown |
| `GET` | `/meta/encuentro/nuevo` | Generate opaque 8-char encounter patent for `historial[].encuentro` | unknown |

### 6.2 Other interfaces

- **Obsidian vault:** Human authoring interface — wikilinks, MOC navigation, Bases views (future `.base` files).
- **CLI maintenance:** `uv run python _tools/migrate_roster_hoja_v2.py [--apply]`, `normalize_tags.py`, `verificar_slugs_doc.py`, `test_roster_schema.py` — roster migration and validation, not end-user character creation.
- **Submodule consumption:** `CHANGELOG.md` notes `resources/` exposed for submodule pull from implementing services (e.g. former `syv-pj-api` integration).

## 7. Data & persistence

- **Logical stores (contract-level):** `personaje` (main resource), `tag_catalogo` (curated tag definitions), `faccion` (first-class faction entity); embedded `hito` collection inside `personaje.historial[]`.
- **Physical representation in this repo:** Markdown files with YAML frontmatter under `resources/`; example characters in `resources/personajes/` mirror the sheet shape (some still migrating to hoja v2 per `_tools/migrate_roster_hoja_v2.py`).
- **Important entities:** `identidad` block (slug patent, nombre, rol, especialidad, genero, edad), `atributos` (cuerpo, mente, alma on 2..7 scale), flat `tags[]`, frozen `historia`, append-only `historial[]`, three-paragraph `apariencia` object (`rostro`, `figura`, `presencia`).
- **Topology:** This repo is the **documentation and catalog SSOT** at rest in git; a separate service would hold runtime persistence (SQL/document/KV — unspecified). Ephemeral characters are never persisted until canonization. Encounter patents from `/meta/encuentro/nuevo` are not stored by `syv-pj` itself — only referenced from hitos.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. `README.md` — module purpose, navigation table, artifact index.
2. `PRD.md` — vision, universe context (2178, Zanja de Alsina, Anatema Mecánico), design principles, scope boundaries.
3. `MODEL.md` — entity schemas, mutability rules, derived fields, invariants.
4. `API.md` — full HTTP contract including ComfyUI workflow route.
5. `AGENTS.md` — editorial policy, SPINE precedence rule (internal), identifier conventions, portable randomness, open/closed schema, agent collaboration rules.
6. `docs/hoja-personaje.md` — sheet structure and identity patent model.
7. `docs/sistema-tags.md` — tag mechanics, categories, non-multiset rule, Obsidian path alignment.
8. `docs/generacion-procedural.md` — eight-phase creation pipeline and combatant example path.
9. `docs/casos-de-uso.md` — consumer matrix and UC catalog.
10. `docs/diegesis.md` — redirect to `syv-docs` lore vault.
11. `docs/obsidian.md` — OFM authoring conventions and skills.
12. `docs/contratos.md`, `docs/atributos.md` — mechanical vocabulary (partial read for stack grounding).
13. `resources/facciones/_moc-facciones.md`, `resources/personajes/_moc-personajes.md` — catalog indices and authoring conventions.
14. `resources/personajes/ovidio-gauna-sargento.md`, `resources/facciones/fuerzas_armadas.md`, `resources/reglas/edad_default.md` — representative data shapes.
15. `CHANGELOG.md` — resources adoption, attribute refactor (cuerpo/mente/alma), MOC discoverability work.
16. `_tools/migrate_roster_hoja_v2.py` — migration contract for hoja v2.
17. **`.claude/` — not present; scan attempted, directory absent.**
18. **`.docs/` — not present; scan attempted, directory absent.**
19. **`SPINE.md`, `ORCHESTRATOR.md` — gitignored; not read per swarm rules.**

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; catalogs and example characters are world-readable. No private keys, tokens, or `.env` content in tracked files.
- **Auth model:** Not defined in this module — authentication, authorization, and rate limiting are explicitly out of scope (`PRD.md`).
- **Data sensitivity:** Example characters are fictional stereotypes; no real PII. This summary contains no secrets, connection strings, or scraped ignored paths.
- **Integrity model:** Canonized example characters may be marked immutable (409 on event POST per `API.md`); general canon mutates only via append-only hitos.

## 10. Operational picture

- **Local authoring:** Open as Obsidian vault; follow `docs/obsidian.md` and `AGENTS.md`. Preview styling via `.vscode/settings.json` and `.vscode/preview.css`.
- **Maintenance scripts:** Run from repo root with `uv run python _tools/<script>.py` (migration dry-run by default; `--apply` to write).
- **Deployment:** Documentation repo published on GitHub (made public per `CHANGELOG.md`); implementing services consume via submodule or copy of `resources/`. No CI/CD manifests observed in the shallow clone root.
- **Hardware constraints:** None — pure markdown/YAML documentation and light Python tooling.

## 11. Open questions / unknowns

- **HTTP implementation location and stack** — contract references `syv-pj-api` historically but this summary did not inspect that repo; runtime language/framework unknown from `syv-pj` alone.
- **`.claude/rules/*` referenced in `_moc-personajes.md`** — not present in the cloned tree; may live elsewhere or be planned.
- **`docs/prompt-imagen.md`** — referenced by `API.md` for ComfyUI prompt template detail; file not verified in shallow inventory (may exist under `docs/` — not read in this pass).
- **`apariencia` API exposure** — `MODEL.md` notes pending sync to `API.md` + Pydantic downstream for the list→object migration.
- **Exact ephemeral character count in `resources/personajes/`** — MOC cites ~34–40 examples; roster may still be mid-migration to hoja v2 (`PENDIENTE` placeholders visible in sample fichas).
- **CI/test automation** — `test_roster_schema.py` exists locally; no GitHub Actions workflow observed at repo root in shallow clone.
