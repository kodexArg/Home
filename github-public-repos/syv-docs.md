---
id: "syv-docs"
title: "syv-docs — canonical Obsidian lore vault for Subordinación y Valor"
visibility: public
importance: high
source_repo: "syv-docs"
org: "kodexArg"
default_branch: "main"
primary_language: "Markdown"
repo_kind: "documentation"
status: "active"
related: []
tags: ["obsidian", "worldbuilding", "ttrpg", "spanish", "markdown-vault-mcp", "lore", "speculative-fiction", "python", "agent-harness", "wikilinks", "creative-commons"]
problems_solved:
  - "A sprawling post-apocalyptic fiction universe needs one versioned, interconnected canonical corpus — not scattered notes, conflicting timelines, or prose that contradicts established lore."
  - "Human collaborators and AI agents must share the same structured knowledge graph (wikilinks, frontmatter facets, spoiler gates) so retrieval, editing, and canon review stay coherent at scale."
  - "AI-assisted prose co-writing needs a feedback loop that learns house style from human edits without confusing machine-generated drafts with author revisions."
technologies:
  - "Obsidian (vault + community plugins)"
  - "Markdown with YAML frontmatter"
  - "markdown-vault-syv MCP (external SSOT server)"
  - "obsidian-syv MCP (secondary graph/UI surface)"
  - "Python 3 (ruamel.yaml tooling)"
  - "Highlightr plugin mark protocol"
  - "pytest (tooling tests)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# syv-docs

> **Problem thesis (required):** *Subordinación y Valor* (SyV) is a large speculative-fiction universe — a 22nd-century Argentina under Catholic military theocracy where digital technology is heresy and perpetual rain rots everything. That universe cannot live in one author's head or in disconnected drafts. This repository is the **canonical Obsidian markdown vault**: ~260 interconnected notes organized into numbered zones (background lore, atlas, characters, in-universe fiction, playable adventures, media), wired for hybrid human-and-agent collaboration through strict frontmatter contracts, wikilink graphs, an external corpus MCP, and Python tooling that migrates metadata and distills writing style from human red-pen edits.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-docs` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Version-controlled Obsidian lore bible for SyV — structured markdown corpus with agent harness, metadata migration tools, and a style-learning pipeline for AI co-authorship. |
| Audience | Worldbuilders and narrative contributors; TTRPG designers writing modules; AI agents (`syv-orquestador` team) maintaining canon; RAG systems indexing the corpus via `markdown-vault-syv`; readers exploring the setting in Spanish. |

## 2. Problems it solves

### P1 — Scattered lore breaks canon at scale

- **Who hurts:** Authors, collaborators, and agents extending a complex timeline (2020–2178) with factions, credos, cities, and dozens of characters.
- **Pain today:** Without a single graph-backed corpus, new prose introduces date contradictions, orphan notes, duplicate character basenames, and wikilinks that point nowhere — especially painful when multiple hands write in parallel.
- **How this repo answers:** The vault enforces a **seven-zone taxonomy** (`0_proyecto` through `6_media`) with mandatory frontmatter (`title`, `folder`, `description`, controlled `entidad`/`alcance`/`estado` facets) and **relations expressed only as wikilinks** — not tags pretending to be links. A living `deuda-tecnica/` board tracks open inconsistencies (dates, broken links, spoilers, duplicates) with tagged incident cards. `CHANGELOG.md` records canon migrations at commit granularity.
- **Out of scope:** Runtime game engine, character sheet app, or live multiplayer session tooling (sibling repos `syv-pj` and `kdx-pj-api` live outside this corpus).

### P2 — AI agents need the same SSOT as humans, not raw filesystem grep

- **Who hurts:** Agent sessions editing lore through Claude/Cursor harnesses; operators relying on semantic search across hundreds of notes.
- **Pain today:** Direct filesystem reads miss graph context (backlinks, orphan detection, broken links); blind writes desync search indexes from disk; concurrent Obsidian auto-commits cause etag races on MCP edits.
- **How this repo answers:** `AGENTS.md` / `CLAUDE.md` charter mandates **`markdown-vault-syv` MCP as primary SSOT** — hybrid keyword+vector search, optimistic-concurrency writes, backlink/orphan hygiene, and immediate index updates. A **blocking preflight gate** halts all corpus work if the MCP is down. Secondary `obsidian-syv` MCP covers live Obsidian UI/graph cascade across the wider `~/SyV/` vault horizon. Agent roles are **folder-scoped** (`syv-canon` owns `1_trasfondo`+`2_atlas`, `syv-personajes` owns `3_personajes`, etc.) with `syv-juez-de-codigo` as mandatory closing reviewer.
- **Out of scope:** The MCP server implementation itself (consumed externally; referenced throughout harness docs).

### P3 — AI prose must learn the author's voice, not overwrite it

- **Who hurts:** The primary author (kodex) co-writing narrative in `1_trasfondo/`, `4_diegesis/`, `5_aventuras/` with Claude; future agents imitating approved house prose.
- **Pain today:** Obsidian Git auto-commits attribute both human and MCP writes to the same author identity, making it impossible to distinguish "model draft" from "author revision" by git metadata alone.
- **How this repo answers:** Two complementary pipelines: **`syv-kodex-style`** (`_tools/syv-kodex-style/`) pairs ledger-recorded Claude generations with subsequent human edits via git diff after push, distilling ✅/✍️/✂️ style lessons into `0_proyecto/kodex-style-canon.md`; **`syv-highlight-marks`** (`_tools/syv-highlight-marks/`) scans Highlightr `<mark>` spans in live prose, classifies intent by color (approve, negate, paraphrase, lyric-more, etc.), and applies literal span replacements on disk before MCP reindex. Together they form a **human-in-the-loop style canon** grounded in real edit history.
- **Out of scope:** Fully automated prose generation without human review; the `syv-media` agent role is marked TBD/not implemented.

## 3. Product / idea

The central idea is an **Obsidian-native world bible** for *Subordinación y Valor*: a post-diluvian Argentina where the **Anatema Mecánico** (2061) banned digital AI after the rise of quantum intelligences (QIA), meteor impacts, and civilizational collapse. Present-day narrative anchors in **Ciudad Dársena** (2178) — a fog-choked port theocracy of twelve million souls walled against the Páramo, governed by Church and sword, where humidity is the permanent incense.

The vault is not a novel manuscript; it is a **layered knowledge product**:

1. **Trasfondo** — timeline, factions, credos, codex rules (what technology is forbidden, how justice works, taboo names).
2. **Atlas** — cities (Dársena centerpiece), climate, dress, science/tech under the Anatema.
3. **Personajes** — ~60 character sheets (principales + secundarios) linked to factions and locations.
4. **Diegesis** — in-universe fiction: relatos (e.g. *El Caso del Archivista* hub with PRD/prose chapter split), crónicas, cartas, draft notebooks.
5. **Aventuras** — playable TTRPG modules (e.g. *Poseídos* exorcism/possession scenarios).
6. **Media** — visual/audio assets (section stub, under construction).
7. **Proyecto** — contributor manuals, metadata authority, reading order, technical-debt registry, style canon.

Mental model: **markdown notes + wikilink graph + facet frontmatter + external MCP index**, edited by humans in Obsidian and tended by a multi-agent harness. Narrative work follows a **PRD-then-prose** pattern for long-form relatos (planning docs separate from published chapters). Reading order for newcomers is documented in `0_proyecto/orden-de-lectura.md` — hitos chronology first, atlas/factions/relatos later.

Creative work is **CC BY-SA 4.0** (see `LICENSE`): the universe lore is shareable and adaptable with attribution.

### 3.1 North-star use cases

1. Contributor opens `inicio.md`, follows wikilinks into `1_trasfondo/sinopsis.md` and the hitos chain to understand why machines are heresy in 2178.
2. Agent session receives a lore edit request → preflight MCP → `syv-canon` checks timeline/faction consistency → writes via MCP with wikilink cascade verification → `syv-juez-de-codigo` closes.
3. Author highlights draft prose in Obsidian → `/syv-highlight-marks` resolves marks → style lessons accumulate in `kodex-style-canon.md` for future chapters.
4. Maintainer runs `_tools/migrate_metadata.py --apply` after taxonomy changes to deterministically rewrite frontmatter across the vault without touching note bodies.
5. TTRPG facilitator runs *Poseídos* module pulling linked faction/location/character notes as player handouts.

### 3.2 Non-goals

- Shipping a compiled website or game binary from this repo alone (content-first; Obsidian is the authoring surface).
- English-language primary prose (canon is Spanish rioplatense; agent prompts are English by charter).
- Storing secrets, credentials, or live environment values (no `.env` pattern in tree).
- Exhaustive media gallery yet (`6_media` explicitly "en construcción").
- Replacing human canon judgment with autonomous lore invention (detectors flag; Opus-tier `syv-canon` decides).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Content format | Markdown + YAML frontmatter, Obsidian wikilinks | All `*.md` corpus files, `0_proyecto/guias-para-colaboradores/guia-de-metadatos.md` |
| Authoring surface | Obsidian vault | `.obsidian/`, `inicio.md`, harness docs |
| Corpus SSOT (external) | `markdown-vault-syv` MCP — SQLite + fastembed vectors, read-write | `AGENTS.md`, `CLAUDE.md` |
| Secondary MCP | `obsidian-syv` — live graph/UI, whole `~/SyV/` horizon | `AGENTS.md` |
| Tooling language | Python 3 (stdlib + ruamel.yaml) | `_tools/migrate_metadata.py`, `_tools/strip_framework.py` |
| Tooling runner | `uv run` / `python3` invocations documented in tool READMEs | `_tools/migrate_metadata.py` header, `_tools/syv-kodex-style/README.md` |
| Obsidian plugins | Highlightr, Excalidraw, 3D Graph | `.obsidian/community-plugins.json` |
| Editor config | VS Code preview CSS | `.vscode/settings.json`, `.vscode/preview.css` |
| Tests | pytest on migration fixtures | `_tools/tests/test_migrate.py`, `_tools/tests/fixtures/` |
| Version control | Git + GitHub PR workflow for contributors | `0_proyecto/guias-para-colaboradores/manual-del-colaborador.md` |
| License | CC BY-SA 4.0 (creative universe) | `LICENSE` |

### 4.1 Notable dependencies (curated)

- `ruamel.yaml` — round-trip YAML frontmatter migration preserving quotes/indent while leaving note bodies byte-identical (`migrate_metadata.py`, `strip_framework.py`).
- Highlightr plugin — color-coded `<mark>` spans feeding the highlight-marks review protocol (`_tools/syv-highlight-marks/highlight.py`).
- `markdown-vault-syv` (external MCP) — hybrid search, etag-based edits, graph hygiene tools; declared SSOT in agent charter.
- `obsidian-markdown` skill (agent-side) — required before any `.md` write per harness law.
- No `package.json`, `Cargo.toml`, or `wrangler.jsonc` — this is not an application deployable; it is a documentation corpus with Python maintenance scripts.

## 5. Repository map (abstraction)

- **Entrypoints:** `inicio.md` (root index to all zones); `0_proyecto/orden-de-lectura.md` (guided hitos path); `1_trasfondo/sinopsis.md` (setting thesis).
- **Domain / core — lore zones:**
  - `1_trasfondo/` (~82 notes): `sinopsis.md`, `cronologia.md`, `hitos/` (dated milestones 2029–2178), `facciones/` (Confederación, Iglesia, Ejército Rojo, minor factions), `credos/` (Peronismo, Umbanda, Iglesia Maradoniana, etc.), `codex/` (Anatema Mecánico, QIA, constitution, taboos).
  - `2_atlas/` (~62 notes): `ciudades/` (Dársena deep tree — barrios, tuberías, institutions), `tecnologia-y-ciencia/`, `climas/`, cultural notes.
  - `3_personajes/` (~60 notes): `principales/` (Damian Diconte, Francisco de la Cruz, Videla IV, etc.), `secundarios/` (40+ linked NPCs).
  - `4_diegesis/` (~24 notes): `relatos/` (including `el_caso_del_archivista/` hub with PRD/prose split), `cronicas/`, `cartas/`, `block_de_notas/` drafts.
  - `5_aventuras/`: `poseidos/` playable module stubs.
  - `6_media/`: placeholder for visual/audio assets.
- **Project / governance:** `0_proyecto/` — contributor manuals, `kodex-style-canon.md`, `deuda-tecnica/` incident board, metadata templates (`PLANTILLA_FACCION.md`).
- **Adapters / tooling:** `_tools/` — metadata migration, framework stripping, tag audit, kodex-style pairing, highlight-marks engine; `_tools/tests/` with fixture markdown files.
- **Agent scaffolding:** `AGENTS.md`, `CLAUDE.md` (identical harness charter), `.claude/settings.json` (agent teams experimental flag). `.claude/agents/` and `.claude/rules/` are gitignored except whitelisted paths — not present in the shallow clone snapshot.
- **Obsidian config:** `.obsidian/` (appearance, core/community plugins, CSS snippets for soft highlights and presentation-orange styling).
- **Docs vaults:** No `.docs/` directory in tree. Project docs live in `0_proyecto/guias-para-colaboradores/` and zone index notes. `CHANGELOG.md` acts as operational history.
- **Generated / vendor:** `.obsidian/plugins/` contains bundled plugin JS (vendor); `__pycache__/` gitignored; volatile MCP state `.markdown_vault_mcp/` gitignored.

## 6. Configuration & contracts (no secrets)

- **Frontmatter contract:** Universal fields `title`, `folder`, `description`; entity facets `entidad` (personaje·faccion·ubicacion·concepto·credo·hito·relato·guia·objeto·vehiculo), `alcance` (secreto·publico), `estado` (canon·borrador·propuesta); relations via quoted wikilinks in `facciones`, `related`, `ubicaciones`, `apariciones`; `tags` as open vivero (not graph edges); `spoilers` list for sensitive content. Authority: `0_proyecto/guias-para-colaboradores/guia-de-metadatos.md`, `glosario-de-tags.md`.
- **Agent charter env:** `.claude/settings.json` sets `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` only — no API keys in repo.
- **MCP env (external, not in repo):** `MARKDOWN_VAULT_MCP_READ_ONLY=false` referenced in harness for write-capable corpus server.
- **Git hook contract:** `syv-kodex-style` installs `pre-push` hook via `install_hook.py`; volatile state in gitignored `state.json`, `pushes.jsonl`, `generations.jsonl`.
- **Highlight mark protocol:** Color→action mapping in `_tools/syv-highlight-marks/highlight.py` palette; `{brace notes}` override color semantics.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP server, REST API, or Workers routes**. It is a static markdown corpus consumed locally (Obsidian), via git clone, through GitHub's file UI for PR contributions, and through external MCP tools (`markdown-vault-syv`, `obsidian-syv`).

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | — | **N/A — no in-repo HTTP surface** | — |

### 6.2 Other interfaces

- **MCP — `markdown-vault-syv` (primary):** `search`, `read`, `write`, `edit`, `rename`, `delete`, `get_backlinks`, `get_broken_links`, `get_orphan_notes`, `reindex`, `build_embeddings`, etc. (full surface documented in `AGENTS.md`).
- **MCP — `obsidian-syv` (secondary):** `vault_read`, `vault_list`, `search_query`, `command_execute`, vault mutate fallbacks.
- **CLI — metadata migration:** `uv run python _tools/migrate_metadata.py [--dry-run|--apply]`.
- **CLI — framework strip:** `uv run --with ruamel.yaml python _tools/strip_framework.py [--apply]`.
- **CLI — highlight marks:** `python3 _tools/syv-highlight-marks/highlight.py scan|apply`.
- **CLI — style ledger:** `python3 _tools/syv-kodex-style/record_generation.py`, `pair.py`, `install_hook.py`.
- **Slash commands (agent harness):** `/syv-kodex-style`, `/syv-highlight-marks` referenced in tool READMEs.
- **GitHub PR workflow:** Web-based edit → propose changes → pull request (documented for non-technical contributors).

## 7. Data & persistence

- **Primary store:** Git-tracked markdown files on disk (~262 `.md` notes in shallow clone count).
- **Search index (external):** `markdown-vault-syv` maintains SQLite + embedding vectors mirroring corpus mutations; must be reindexed after filesystem-only highlight edits.
- **Volatile local state (gitignored):** `state.json`, `pushes.jsonl`, `generations.jsonl` (style pipeline); `.markdown_vault_mcp/` (MCP runtime); Obsidian `workspace.json` / `graph.json`.
- **Important entities (by folder, not row data):** Timeline hitos (`1_trasfondo/hitos/`), faction trees under `1_trasfondo/facciones/`, city graphs under `2_atlas/ciudades/darsena/`, character basenames under `3_personajes/`.
- **Topology:** Offline-first authoring in Obsidian; corpus MCP adds local hybrid search; no cloud database binding inside this repo. Sibling game/API repos (`syv-pj`, `kdx-pj-api`) referenced as vault siblings but not vendored here.

## 8. Docs & agent memory (required scan)

1. **Root index** — `inicio.md`: defines SyV pitch (post-diluvian theocratic Argentina, 22nd century) and links all seven zones.
2. **Harness charter** — `AGENTS.md` / `CLAUDE.md`: full agent team table, MCP preflight gate, language law (English prompts, Spanish user output), folder ownership, frontmatter rules, MCP tool inventories.
3. **Setting thesis** — `1_trasfondo/sinopsis.md`: present-day Dársena, Anatema Mecánico, faction landscape, narrative hooks.
4. **Contributor manuals** — `0_proyecto/guias-para-colaboradores/manual-del-colaborador.md`, `guia-de-metadatos.md`, `guia-de-personajes.md`, `guia-de-facciones.md`, `glosario-de-tags.md`, `estandar-frontmatter-ecosistema.md`.
5. **Reading order** — `0_proyecto/orden-de-lectura.md`: ordered hitos spine from 2029 market prophecies through 2178 present.
6. **Style canon** — `0_proyecto/kodex-style-canon.md`: living ✂️/✅ rules distilled from highlight approvals (e.g. cap-01-cursiva voice traits).
7. **Technical debt registry** — `0_proyecto/deuda-tecnica/deuda-tecnica.md`: tag taxonomy (`#deuda/fechas`, `#deuda/incongruencia`, etc.) and incident card index.
8. **Tooling READMEs** — `_tools/syv-kodex-style/README.md`, `_tools/syv-highlight-marks/README.md`.
9. **Operational history** — `CHANGELOG.md`: detailed canon migrations (metadata rewrite, El Caso del Archivista restructure, meteorito 2039 date fix, Caridad Divina purge, etc.).
10. **`.claude/`** — only `settings.json` present (agent teams flag); agents/commands/rules trees gitignored and absent from clone.
11. **`.docs/`** — **not present** in repository tree.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public GitHub repo; creative universe licensed CC BY-SA 4.0 — lore is intended for sharing/adaptation with attribution, not for hiding setting spoilers from the public (in-universe secrets are marked via `alcance: secreto` and `spoilers` fields, not repo privacy).
- **Auth model:** None in-repo. External MCP servers and Obsidian local app handle access control on the operator's machine.
- **Secrets posture:** No `.env`, credentials, or API keys found in tracked tree; `.gitignore` excludes volatile MCP state and Python caches. Harness explicitly forbids pasting connection strings or tokens into corpus notes.
- **This summary:** Contains no secrets, private keys, or environment values.

## 10. Operational picture

- **Local authoring:** Open folder as Obsidian vault; edit markdown with wikilinks; optional VS Code for preview (`/.vscode/preview.css`).
- **Contributor flow:** Fork/branch or GitHub web edit → PR per `manual-del-colaborador.md`; metadata must follow `guia-de-metadatos.md`.
- **Agent sessions:** Ensure `markdown-vault-syv` MCP alive → preflight `stats` → dispatch folder-scoped agents → close with `syv-juez-de-codigo` → Spanish synthesis to user.
- **Metadata maintenance:** `uv run python _tools/migrate_metadata.py` (dry-run default); `strip_framework.py` for legacy sidebar/order field removal.
- **Style pipeline:** After prose push, run `/syv-kodex-style` (triggered by pre-push hook reminder) to process generation/edit pairs.
- **Highlight review:** Paint marks in Obsidian → `/syv-highlight-marks` scan/apply → optional `record_generation.py` for in-scope files.
- **Tests:** `pytest` on `_tools/tests/test_migrate.py` (20 tests per changelog note on idempotency and body preservation).
- **Deploy:** None — content repo; distribution is git clone + Obsidian + MCP indexing. No CI workflow files observed in shallow clone root.
- **Hardware constraints:** None declared; standard markdown editing.

## 11. Open questions / unknowns

- **`markdown-vault-syv` server source/repo:** Referenced extensively as this repo's MCP but not vendored here — deployment and embedding model version live outside this tree.
- **`.claude/agents/` and `.claude/rules/`:** Gitignored except whitelisted subpaths; agent definition files not visible in shallow clone — full agent prompt bodies unknown from this snapshot.
- **`6_media` completion:** Section explicitly under construction; asset pipeline undefined in-repo.
- **`syv-media` agent:** Marked TBD / not implemented in harness table.
- **Sibling repos `syv-pj`, `kdx-pj-api`:** Referenced as vault siblings for character sheets and API — relationship contracts not documented inside `syv-docs` beyond harness mentions.
- **CI/CD:** No `.github/workflows/` found in shallow clone — release/deploy automation unknown (may simply be absent).
- **Exact MCP embedding model and index size:** Capabilities mentioned (`fastembed`, hybrid search) but not pinned in this repo's manifests.
