---
id: "syv-game-system"
title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor"
visibility: private
importance: normal
source_repo: "syv-game-system"
org: "kodexArg"
default_branch: "main"
primary_language: "Markdown"
repo_kind: "documentation"
status: "experimental"
related: []
tags: ["wargame", "wego", "obsidian", "json-schema", "hex-grid", "tactical", "board-game", "game-design", "lore", "gemini", "markdown", "mermaid"]
problems_solved:
  - "A simultaneous-turn (WEGO) tactical wargame needs a single source of truth for rules, data models, and lore that can drive physical tabletop play, PC clients, and mobile apps without locking to any engine or stack."
  - "Combat resolution and narrative reporting must stay deterministic and auditable while still delivering immersive player-facing chronicles — mechanics and story generation must not be entangled in one opaque blob."
  - "Squad-level tactics with individual soldiers, tags, orders, and hex movement produce combinatorial rule interactions that are hard to keep consistent across documents unless structured as an Obsidian vault with JSON schemas and agent governance."
technologies:
  - "Obsidian vault (Markdown knowledge base)"
  - "JSON Schema Draft-07 (abstract data contracts)"
  - "Mermaid.js (flow diagrams in reglamento)"
  - "SVG (embedded default map in lore)"
  - "Python 3 (scratch ASCII hex grid utility only)"
  - "Gemini API (planned narrative layer — documented, not implemented here)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# syv-game-system

> **Problem thesis (required):** This repository is the **platform-agnostic design vault** for *Subordinación y Valor* (SyV), a simultaneous-turn (WEGO) tactical wargame set in a militarized alternate Patagonia. It exists so that rules, mechanics, lore, and abstract data models live in one Obsidian-structured knowledge base that any future implementation — physical tabletop, PC, or mobile — can consume without rewriting design from scratch. The vault deliberately separates human-readable reglamento from machine-oriented JSON schemas, documents a deterministic combat resolver ("Fricción") distinct from a planned Gemini-powered narrative layer, and enforces agent editing conventions so AI-assisted design work stays consistent and non-contradictory.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-game-system` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Platform-agnostic Obsidian vault of WEGO wargame rules, JSON schemas, mathematical foundations, and Patagonian lore for *Subordinación y Valor*. |
| Audience | Game designers and rule authors; AI agents acting as "Diseñador de Sistemas de Juego y Arquitecto Conceptual" per `AGENTS.md`; future engine implementers who need schemas and reglamento as SSOT. |

## 2. Problems it solves

### P1 — Platform lock-in before any implementation exists

- **Who hurts:** Anyone who wants to prototype SyV on tabletop, then port to digital, without maintaining parallel rule documents or reverse-engineering informal notes.
- **Pain today:** Game design notes often live in ad-hoc docs, wikis, or engine-specific prototypes. Rules drift; data shapes are implied rather than specified; physical and digital versions diverge.
- **How this repo answers:** The README and `AGENTS.md` state explicit **platform agnosticism**: logic is expressed only in Markdown, JSON Schema, Mermaid, and diagrams — never production code in Python, Rust, C#, etc. The `arquitectura/esquemas/` directory defines abstract contracts for `personaje`, `escuadra`, `ordenes_turno`, `fase_combate`, and `registro_combate` that any runtime can validate against. The reglamento tree is the human SSOT; schemas are the machine SSOT.
- **Out of scope:** Any runnable game client, server, database, or CI pipeline. The single Python script in `scratch/` is a throwaway ASCII hex visualizer, not part of the design deliverable.

### P2 — Deterministic combat vs. immersive narrative

- **Who hurts:** Players and designers who want tactically fair, replayable combat logs but also rich "Cronista del Frente" battle reports instead of raw dice tables.
- **Pain today:** Mixing narrative generation into combat math makes outcomes hard to audit, balance, or replay; pure numbers bore players.
- **How this repo answers:** The **Motor de Resolución «Fricción»** is specified as a deterministic/entropic resolver that simulates up to six one-hour combat rounds per six-hour turn, producing a structured log conforming to `registro_combate.schema.json`. A separate documented pipeline (`reglamento/14_historias_de_combate_ia.md`) sends that JSON to the **Gemini API** with system instructions for trench-realism tone, faction jargon, and activation of per-soldier H.I.T.O.S. aspects (Concepto, Perk, Complicación). Math lives in `arquitectura/pildoras/01_fundamentos_matematicos.md`; story lives in the IA chapter — never merged in this repo's source tree.
- **Out of scope:** Actual Gemini API integration code, API keys, or a deployed narrative service. Only the contract and prompt shape are documented.

### P3 — Rule consistency under combinatorial complexity

- **Who hurts:** Designers and AI agents extending a system with WEGO orders, tag pipelines, squad aggregation, hex movement, initiative tracks, and five lore factions.
- **Pain today:** WEGO games with individual soldiers inside squad tokens, tag-based modifiers, and simultaneous secret orders produce edge cases (collisions, desorganizado states, FAP crew requirements) that contradict across documents without a governed vault structure.
- **How this repo answers:** `reglamento/00_indice.md` is the Map of Content with integrated glossary and faction synonym table. `reglamento/02_sistema_tags.md` defines tags as a **non-transactional document database** with a deterministic pre-roll pipeline (flat modifiers → multipliers → health effects → context). `AGENTS.md` imposes red lines: no implementation code, mechanical symmetry for Blue/Red in MVP, YAML frontmatter on every reglamento/lore note, and mandatory index updates for new notes. Mathematical probability tables in the architecture pill ground dice design (`3d10` median, favorable min, unfavorable max).
- **Out of scope:** Automated rule validation, linter, or playtest harness. Status across files is predominantly `borrador` (draft).

## 3. Product / idea

SyV is a **hex-grid WEGO wargame** where two players (MVP: symmetric Confederación Azul vs. Ejército Rojo) command **escuadras** (squad tokens) on a map where **1 hex = 1 km**. A full in-fiction day spans four six-hour strategic turns (Mañana, Tarde, Noche, Madrugada). Each turn has three phases:

1. **Fase I · Mando** — simultaneous secret order assignment from a limited pool tied to leadership stats.
2. **Fase II · Combate** — orders revealed; movement by initiative; collisions trigger individual combat resolved hour-by-hour (up to 6 hours) by «Fricción».
3. **Fase III · Reabastecimiento** — logistics, recovery (e.g. 1d4 restoration), supply checks.

Individual **unidades** (soldiers) have FIS/TAC/MEN attributes, H.I.T.O.S. aspect phrases, tags, weapons, and health — but only **escuadras** occupy hexes. Combat uses **3d10 roll-under** with median (standard), min (favorable), or max (desfavorable) selection; triple-zero is heroic crit with automatic in-match XP; triple-nine is catastrophic fumble.

The repository is structured as an **Obsidian vault** (`.obsidian/` config present) with three top-level zones:

- **`reglamento/`** — numbered rule chapters from introduction through initiative, dice, combat, and future plans.
- **`arquitectura/`** — JSON schemas plus mathematical "píldoras" for designers and implementers.
- **`lore/`** — factions, default map, and named characters (narrative only; must not override MVP mechanical symmetry).

### 3.1 North-star use cases

1. **Author opens vault in Obsidian** — navigates `reglamento/00_indice.md`, edits a rule chapter, updates frontmatter `ultimo_cambio`, and cross-links related mechanics.
2. **Engine developer clones schemas** — implements «Fricción» against `registro_combate.schema.json`, validates squad payloads with `escuadra.schema.json` and `personaje.schema.json`, and maps `tipo_orden` values from `ordenes_turno.json`.
3. **AI agent refines design** — follows `AGENTS.md` to propose rule changes, preserve Blue/Red symmetry in MVP, and extend schemas when new order types or combat events appear.

### 3.2 Non-goals

- No production application code, game engine project, or deployment manifests.
- MVP explicitly excludes: PvAI, asymmetric factions in play, persistent cross-campaign veteranía, full logistics/supply lines, and radio-officer order emission mechanics (only receiving orders on squads for now).
- Lore factions beyond Blue/Red are documented for future asymmetry but **mechanically identical** in MVP per `reglamento/99_planes_futuro.md` and the glossary symmetry note.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | None (design vault); Markdown + JSON | tree has no `package.json`, `pyproject.toml`, or app entrypoints |
| Knowledge base | Obsidian vault | `README.md`, `.obsidian/`, wikilink-style structure |
| Data contracts | JSON Schema Draft-07 | `arquitectura/esquemas/*.json` |
| Diagrams | Mermaid.js | `reglamento/02_sistema_tags.md` pipeline graph |
| Map visualization | Inline SVG in lore note | `lore/03_escenario/mapa-modelo-por-defecto.md` |
| Scratch utilities | Python 3 (non-production) | `scratch/gen_ascii_grid.py` |
| Planned AI narrative | Gemini API (external) | `reglamento/14_historias_de_combate_ia.md`, `reglamento/01_introduccion.md` |
| License | MIT | `LICENSE` (Copyright 2026 Gabriel Cavedal) |

### 4.1 Notable dependencies (curated)

- **JSON Schema Draft-07** — strict typing for characters, squads, turn orders, combat phases, and combat logs intended as API/persistence contracts.
- **Obsidian** — recommended viewer for linked reglamento; README documents Linux AppImage setup (external download referenced in README; not vendored in repo).
- **Mermaid** — tag evaluation pipeline visualization in rules docs.
- **Gemini API** — documented consumer of `registro_combate` JSON for "Cronista de Trinchera" prose; no SDK or worker code in this repository.

## 5. Repository map (abstraction)

- **Entrypoints:** `README.md` (project overview, vault tree, Obsidian install notes); `reglamento/00_indice.md` (MOC + glossary); `AGENTS.md` (AI agent operating manual).
- **Domain / core — rules:** `reglamento/` — 16 numbered chapters covering WEGO sequence, tags, orders, hex grid, units/squads, roles, weapons, defense, character sheets, squads, encounters, dice, AI chronicles, initiative, and MVP/future scope (`99_planes_futuro.md`).
- **Domain / core — architecture:** `arquitectura/esquemas/` — five JSON schemas; `arquitectura/pildoras/01_fundamentos_matematicos.md` — probability analysis and pseudocode for dice resolution.
- **Lore (non-mechanical overlay):** `lore/02_facciones/` — five factions (Confederados, Ejército Rojo, Pantano, Salvajes, Poseídos) each with `faccion_*.md` and `hoja_escuadra_*.md` templates; `lore/03_escenario/` — scenario rules and default Patagonia valley map (radius 6, 127 hexes); `lore/04_personajes/` — six named soldier profiles for narrative examples.
- **Agent scaffolding:** `AGENTS.md` only — defines role, red lines, Obsidian conventions, and workflow for rule changes. **No `.claude/` directory present.** **No `.docs/` hidden docs vault present.**
- **Tooling / scratch:** `scratch/gen_ascii_grid.py` — generates small-radius ASCII hex grid with chess-style labels; experimental, not wired to reglamento.
- **Editor config:** `.obsidian/` — workspace and plugin settings for local Obsidian use.
- **Generated / vendor:** none beyond Obsidian local config.

## 6. Configuration & contracts (no secrets)

This repository contains **no environment files, API keys, or deployment bindings**. All contracts are declarative:

- **Character contract** (`personaje.schema.json`): `rol`, `faccion` enum, `atributos` (fisico/tactico/mental ranges), H.I.T.O.S. `aspectos`, `tags[]`, `equipo.armor`, `armas[]` (max 2), `estado_salud` enum.
- **Squad contract** (`escuadra.schema.json`): aggregates up to 14 `personaje` refs; enforces functional tags (`líder`, FAP crew `artillero`/`apuntador`/`recargador`); exposes collective `valores_colectivos` (fuerza, poder_fuego, defensa, movilidad táctico/ejecutivo, cohesión, iniciativa, harass flag).
- **Turn orders** (`ordenes_turno.json`): Fase I structure with `calculo_ordenes` (official result + fixed +3 modifier) and `asignacion_ordenes[]` pairing `escuadra_id` with `tipo_orden`.
- **Combat phase** (`fase_combate.json`): Fase II with global initiative per faction, maneuver sequence, and up to six hourly rounds with fixed -1 fatiga/-1 moral desgaste.
- **Combat log** (`registro_combate.schema.json`): full deterministic record for narrative AI — metadata, both squads with member aspects, `secuencia_horas[]` with dice details and impact, `resolucion_encuentro`.
- **Valid order types** (from reglamento, aligned to schema): `Marcha`, `Despliegue`, `Ataque`, `Defensa`.

### 6.1 HTTP / API endpoints (when applicable)

**N/A — this repository does not expose HTTP services.** It documents a **future external integration**: post-combat, a not-yet-implemented client would POST structured JSON matching `registro_combate.schema.json` to the **Gemini API** with system instructions defined in `reglamento/14_historias_de_combate_ia.md`. No OpenAPI spec, Workers routes, or server code exists in the tree.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | — | No in-repo HTTP surface | — |

### 6.2 Other interfaces

- **Obsidian vault interface** — open repo root as vault; navigate via `reglamento/00_indice.md` MOC and relative Markdown links.
- **JSON Schema validation** — implementers validate squad/combat payloads against `arquitectura/esquemas/` (intended for game engines, save files, or API bodies).
- **Tabletop interface** — rules support physical hex boards, dice (3d10 per soldier check), and paper character sheets per `reglamento/10_hoja_personaje.md`.
- **Gemini narrative contract** — documented input/output shape in `reglamento/14_historias_de_combate_ia.md` (JSON in, Markdown chronicle out); not callable from this repo alone.

## 7. Data & persistence

- **In-repo persistence:** Git-tracked Markdown and JSON only; no database, KV, or object storage.
- **Conceptual game entities** (from schemas and glossary): `escuadra`, `personaje`/`unidad`, `tags`, `ordenes`, combat `registro` with hourly `eventos`, terrain types (`pampa`, `bosque`, `ruinas`, `colinas`, `pantano`, `trincheras`), faction enums, weapon categories (Corta/Media/Larga).
- **Scale model:** Hex axial coordinates `(q, r)`; strategic map discourse uses radius ~20 (~40 km) in introduction/MVP docs; default playtest map uses **radius 6** (127 cells) per `lore/03_escenario/mapa-modelo-por-defecto.md`.
- **Topology:** Design is offline-first (Obsidian + tabletop). Future digital implementations would persist squad state and combat logs locally or via a not-specified-here backend; schemas are the portable contract layer.

## 8. Docs & agent memory (required scan)

| Source | Summary |
|--------|---------|
| `README.md` | Declares platform agnosticism, vault tree, Obsidian install on Linux, early-design status. |
| `AGENTS.md` | AI agent role, no-code red line, MVP faction symmetry, YAML frontmatter rules, JSON Schema conventions, impact-analysis workflow. |
| `reglamento/00_indice.md` | MOC, glossary, WEGO phase table, faction synonym matrix, links to all rule chapters and lore. |
| `reglamento/01_introduccion.md` | WEGO philosophy, «Fricción» overview, Gemini chronicle example, MVP symmetric scope. |
| `reglamento/02_sistema_tags.md` | Tag catalog and pre-roll pipeline (Mermaid). |
| `reglamento/03_secuencia_de_juego.md` | Three-phase turn structure, order pool mechanics. |
| `reglamento/04_sistema_de_ordenes.md` | Marcha/Despliegue/Defensa/Ataque catalog with movement and initiative modifiers. |
| `reglamento/99_planes_futuro.md` | MVP bounds and post-MVP roadmap (IA chronicles, asymmetric factions, PvIA, logistics, campaign veteranía). |
| `reglamento/14_historias_de_combate_ia.md` | Gemini narrative architecture, tone guide, system prompt template, JSON examples. |
| `arquitectura/pildoras/01_fundamentos_matematicos.md` | 3d10-Med probability tables, combat impact formulas, fatigue/moral deterministic tax, resolver pseudocode. |
| `arquitectura/esquemas/*.json` | Five machine-readable contracts (see §6). |
| `lore/02_facciones/02_facciones.md` | Five-faction setting overview and Zanja de Alsina backdrop. |
| `lore/03_escenario/mapa-modelo-por-defecto.md` | Default symmetric test map with SVG diagram. |
| `lore/04_personajes/` | Six example soldiers (Ricardo KIA, Rodríguez, Walter, Videla, Pérez, Morales). |

**`.claude/` — not present** (scanned; directory does not exist).

**`.docs/` — not present** (scanned; directory does not exist).

**`docs/` — not present** (no conventional docs folder; `reglamento/` and `arquitectura/` serve that role).

## 9. Security & privacy notes (summary-time)

- Repository visibility is **private**; this summary describes content by path and repo name only, without clone or product links.
- No secrets, credentials, `.env` files, or API keys appear in the tracked tree.
- Future Gemini integration will require API credentials in an implementing application, not in this design vault.
- `AGENTS.md` explicitly forbids agents from introducing production code or stack-specific assumptions that could leak implementation details into the SSOT.

## 10. Operational picture

- **Local use:** Clone repo; open root as Obsidian vault (README documents AppImage download and `--no-sandbox` on Linux). Read/edit Markdown; view Mermaid in Obsidian or compatible renderers; validate JSON against schemas externally.
- **Scratch utility:** `python3 scratch/gen_ascii_grid.py` prints a small ASCII hex grid to stdout — optional visual aid, not part of official rules delivery.
- **Deployment:** None. No GitHub Actions, Wrangler, Docker, or package manifests detected. Distribution is via private Git only.
- **Hardware constraints:** None specified; design targets tabletop and general-purpose computers. No GPU/edge requirements.

## 11. Open questions / unknowns

- **Implementation status:** All examined reglamento notes use `status: borrador`; no "approved" baseline is marked in frontmatter.
- **Map scale inconsistency:** Introduction and MVP text reference a radius-20 (~40 km) strategic grid, while the default playtest map uses radius 6 (127 hexes). Relationship between strategic and tactical map sizes is not fully reconciled in one canonical spec.
- **Broken absolute links:** Some reglamento cross-links use `file:///home/kodex/Documents/...` paths (e.g. in `reglamento/00_indice.md` and `04_sistema_de_ordenes.md`) that will not resolve on other machines; relative links are preferred elsewhere.
- **Order pool formula drift:** `ordenes_turno.json` describes `resultado_oficial + 3` fixed modifier, while `reglamento/03_secuencia_de_juego.md` describes turn orders refreshed from min(MEN, TAC) of highest-ranking leader — potential schema/reglamento alignment gap.
- **`.claude/` and `.docs/`:** Confirmed absent; agent guidance is solely in `AGENTS.md`.
- **CI / validation:** No automated schema validation, link checker, or playtest simulation in repo.
- **English localization:** Primary content is Spanish; no separate English README.
