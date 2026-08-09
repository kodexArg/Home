---
id: "syv-image-generation"
title: "SyV Image Generation — ComfyUI portrait factory for Subordinación y Valor"
visibility: public
importance: high
source_repo: "syv-image-generation"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: ["syv-pj", "syv-docs", "syv-pj-api", "syv-pj-flutter"]
tags: ["syv", "comfyui", "z-image-turbo", "image-generation", "portraits", "prompt-engineering", "python", "lora", "playground", "rag-calibration"]
problems_solved:
  - "Turning structured SyV character sheets into reproducible ComfyUI portrait prompts and curated preview images without inventing canon."
  - "Closing the loop between human ranking of generated portraits and future prompt calibration via inbox entries and whitelist memory."
  - "Versioning ComfyUI workflows, export pipelines, and generation metadata so every image has a literal prompt + seed audit trail."
  - "Operating Z-Image Turbo (S3-DiT + Qwen3) on constrained local GPU VRAM with documented recipes, style experiments, and LoRA constraints."
technologies:
  - "Python 3 (uv-run scripts, no pyproject in repo)"
  - "ComfyUI (external runtime, HTTP API on port 8188)"
  - "Z Image Turbo (S3-DiT, Qwen3-4B lumina2 CLIP, GGUF Q8)"
  - "ComfyUI-GGUF (city96), Nunchaku quantized loaders"
  - "Z-Image native LoRAs (age/fat/muscle sliders, cinematic lighting)"
  - "Legacy Pony/SDXL workflows (zavyfantasiaxl, deprecated)"
  - "Markdown prompt vault (inbox, whitelist, character compilations)"
  - "Static HTML gallery builders (build/)"
  - "syv-harness comfyui skill + comfyctl lifecycle"
  - "Sibling syv-pj character SSOT (read-only input)"
  - "markdown-vault-syv MCP for syv-docs canon"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# syv-image-generation

> **Problem thesis (required):** This repository is the **visual portrait factory** for the *Subordinación y Valor* (SyV) universe. It exists because lore-rich character data lives in sibling repos (`syv-pj` sheets, `syv-docs` canon) but **images must be produced locally on a GPU via ComfyUI**, with every generation documented, ranked, and fed back into prompt calibration. Without this repo, portrait work would be ad-hoc: prompts would not be reproducible, good/bad combos would not accumulate, workflows would not be versioned, and agents would invent palette or faction details outside the SSOT. The central pain is **bridging structured narrative character data → deterministic natural-language prompts → ComfyUI jobs → human-curated visual memory** on a machine with tight VRAM (8 GB class GPU).

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-image-generation` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Playground and SSOT for SyV character portrait generation: ComfyUI workflows, prompt compilation, inbox delivery, and whitelist-driven calibration loop. |
| Audience | SyV creators, ComfyUI operators on the local SyV harness machine, coding agents (`AGENTS.md` / `CLAUDE.md` symlink), and downstream consumers of portrait assets (`syv-pj`, `syv-pj-api`, `syv-pj-flutter`). |

## 2. Problems it solves

### P1 — Lore sheets do not become images by themselves

- **Who hurts:** Anyone building SyV characters who needs a **visual identity** matching faction, rank, attributes, and palette — creators, narrative designers, and agents tasked with portrait work.
- **Pain today:** Character truth lives in markdown fichas (`../syv-pj/resources/personajes/*.md` — 34 mock characters indexed in `_moc-personajes.md`). ComfyUI expects natural-language photographic prompts (especially under Z-Image Turbo), not YAML frontmatter. Manual translation is slow, inconsistent across styles (propaganda screenprint vs cinematic vs pixel-art vs watercolor), and loses the cuerpo/mente/alma stat semantics.
- **How this repo answers:** `AGENTS.md` defines the **six-step portrait brain** (read ficha → read whitelist → build positive/negative or natural-language prompt → generate → deliver to `prompts/inbox/` → promote to `prompts/whitelist.md`). Python compilers (`scripts/prompt_compiler.py`, `scripts/portrait_prompt.py`, `scripts/realistic_portrait_prompt.py`, `scripts/sheet_to_comfy.py`) deterministically map stats, faction, rank, equipment, and atmosphere clauses into prompt text. `prompts/atmosphere.md` supplies a token-efficient SyV world clause. `prompts/characters/` holds per-character ComfyUI compilations (39 fichas present in tree).
- **Out of scope:** Does not author or mutate character canon in `syv-pj` or `syv-docs`. Does not host ComfyUI itself (external install detected via `syv-harness` skill / `scripts/_comfy_root.py`).

### P2 — Generated images without metadata are useless for iteration

- **Who hurts:** Operators rerunning batches, agents comparing styles, and future LoRA trainers who need paired image+caption datasets.
- **Pain today:** ComfyUI dumps PNGs into its output directory with filename prefixes only. Without seed, workflow, checkpoint, sampler, CFG, and literal prompt text, results cannot be reproduced or explained. Bulk raw exports bloat git if committed blindly.
- **How this repo answers:** Each curated delivery is a folder `prompts/inbox/<AAAAMMDD>-<personaje>-<estilo>/` with **`preview.png` + `entry.md`** (prompt literals, generation metadata, empty `rating` block for the user). `scripts/export.py` imports recent PNGs from ComfyUI output into **`images/raw/`** (gitignored bulk scratch). `docs/workflow.md` documents end-to-end conventions: slug format, seed mandatory, full literal prompts. Batch scripts write structured JSON to `build/` for dry-runs (`generate_portraits.py`, comparison pages, galerías).
- **Out of scope:** Not a general DAM or cloud image CDN. Selected previews in inbox are intentionally small and curated, not every raw frame.

### P3 — Prompt quality must improve over time, not reset every session

- **Who hurts:** Repeat portrait operators and agents who would otherwise re-discover the same failures (photo drift under watercolor CFG, incompatible SDXL LoRAs on Z-Image, sub-optimal 704×960 softness).
- **Pain today:** Human taste is implicit; failed prompt combos are forgotten; good combos are not systematically reused. Model paradigm shifted (Pony booru tags → Z-Image natural language + ConditioningZeroOut) making old habits harmful.
- **How this repo answers:** `prompts/whitelist.md` is **calibration memory**: JSON combo entries in `## Buenos` (rating ≥ 4) and `## Malos` (rating ≤ 2), idempotent promotion from ranked inbox entries. `docs/findings-acuarela-calibracion.md` captures empirical style findings (CFG 2 for watercolor vs CFG 1 for photo, latent background rules, transparency/rembg notes). `docs/z-image-turbo.md` is the canonical model reference (resolution buckets, prompting law, LoRA compatibility). `workflows/backup/` preserves historical experiment graphs without polluting active set.
- **Out of scope:** Not automated ML feedback or RLHF — human rating in `entry.md` drives whitelist updates.

## 3. Product / idea

The mental model is a **closed calibration loop factory**:

```
syv-pj fichas (read-only) ──► prompt compilers / AGENTS rules ──► ComfyUI workflow JSON
        ▲                                                              │
        │                                                              ▼
syv-docs canon (MCP) ──► palette + atmosphere clause          ComfyUI GPU render
        │                                                              │
        │                                                              ▼
prompts/whitelist.md ◄── promote ranked combos ◄── prompts/inbox/ (preview + entry.md)
```

After cloning, an operator or agent:

1. Starts ComfyUI via the external `comfyui` skill (`comfyctl start`, port 8188).
2. Reads a character from sibling `syv-pj` and current `prompts/whitelist.md`.
3. Loads a versioned workflow from `workflows/` (UI `.json` or API `_api.json` twin).
4. Generates with Z-Image Turbo recipe (8 steps, CFG 1, no negative, `res_multistep`/`simple`, AuraFlow shift 3).
5. Exports bulk to `images/raw/` via `scripts/export.py`, then packages a curated folder in `prompts/inbox/`.
6. User ranks; agent promotes combos to whitelist for the next run.

The repo is explicitly a **playground** inside the broader SyV ecosystem — inspiration (places, factions, palette) flows from `syv-docs`; subjects flow from `syv-pj`; delivery flows to character tooling and Flutter visualizer downstream.

### 3.1 North-star use cases

1. **Single portrait delivery:** Agent reads `../syv-pj/resources/personajes/<slug>.md`, compiles prompt via `prompt_compiler.py` or `sheet_to_comfy.py`, runs v7 slider workflow, delivers `prompts/inbox/<date>-<slug>-<estilo>/` with full metadata.
2. **Batch propaganda poster sweep:** `scripts/generate_portraits.py --run` posts all soldier records to ComfyUI sequentially; dry-run default writes `build/portrait_prompts.json`.
3. **Style matrix / comparison:** `generate_squad_test.py`, `generate_3x5_hyper.py`, `generate_zimage_panorama.py`, `build_zimage_matrix.py`, `generate_comparison_page.py`, `build_galeria_html.py` for multi-style shoots and static HTML review pages in `build/`.
4. **LoRA dataset prep:** Curate 80–150 image+caption pairs from mock characters for Z-Image Omni-Base training (Ostris AI Toolkit) or legacy Pony path — documented in `AGENTS.md` training section.

### 3.2 Non-goals

- **Not a canon writer:** Places, factions, characters, and mandatory palette (`olive drab`, `celeste`, `cream`, `warm black`) must be confirmed against `syv-docs` / design system — never invented here.
- **Not ComfyUI packaging:** Root install, venv, models, and MCP registration live in `syv-harness/skills/comfyui` and local machine paths documented in `docs/comfyui-setup.md`.
- **Not SDXL LoRA portability:** Pony/SDXL LoRAs are legacy and **incompatible** with Z-Image Turbo UNet shapes; docs state this explicitly.
- **Not silent agent work:** `AGENTS.md` mandates visible operation — browser snapshots, screenshots, immediate inbox delivery ("work public" rule).

## 4. Technology stack

Derived from manifests, docs, and script headers. No `pyproject.toml` or `requirements.txt` in repo — scripts assume `uv run` with stdlib + occasional packages noted in docs (`rembg`, `onnxruntime` pending for transparency pipeline).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3, shebang scripts, `uv run` invocation | `scripts/*.py`, `docs/workflow.md` |
| Image engine | ComfyUI (external), HTTP API port 8188 | `docs/comfyui-setup.md`, `scripts/sheet_to_comfy.py` |
| Active model | Z Image Turbo — S3-DiT GGUF Q8, Qwen3-4B CLIP lumina2, ae VAE | `AGENTS.md`, `docs/z-image-turbo.md` |
| Quantized variants | Nunchaku SVDQ-INT4 workflows, GGUF loaders | `workflows/svdq-int4-zit.json` |
| Legacy model | zavyfantasiaxlPDXL Pony/SDXL (deprecated Jun 2026) | `docs/comfyui-setup.md` |
| Prompt surface | Markdown fichas, YAML frontmatter in inbox entries | `prompts/`, `AGENTS.md` |
| LoRA stack | ZIT age/fat/muscle sliders, cinematic portrait lighting, Civitai Z-Image natives | `workflows/workflow-syv-portrait-sliders.json`, `docs/z-image-turbo.md` |
| Gallery output | Static HTML + PNG in `build/` | `build/style_example/index.html`, `scripts/build_galeria_html.py` |
| Agent harness | `AGENTS.md` (= `CLAUDE.md` symlink), comfyui skill | `AGENTS.md`, `CLAUDE.md` |
| Upstream data | syv-pj personajes markdown (read-only) | `AGENTS.md`, `scripts/generate_portraits.py` |
| Canon lookup | markdown-vault-syv MCP → syv-docs | `AGENTS.md`, `README.md` |
| Infra / deploy | Local GPU workstation; no CI workflows in tree | `.github/` absent |
| Tests | No automated test suite observed | tree scan |

### 4.1 Notable dependencies (curated)

- **ComfyUI** — sole image generation runtime; all batch scripts POST workflow graphs to its HTTP API.
- **Z Image Turbo stack** (`zimageTurboByStable_2602Q8.gguf`, `qwen_3_4b.safetensors`, `ae.safetensors`) — canonical portrait backbone since Jun 2026; natural-language prompting, no booru quality tags.
- **city96 ComfyUI-GGUF + gguf lib** — loads GGUF UNet on 8 GB VRAM class GPUs.
- **Nunchaku nodes** — quantized SVDQ-INT4 Z-Image loader path in `svdq-int4-zit.json`.
- **ZIT slider LoRAs** (`ZIT-age-slider`, fat, muscle) — chained in v7 portrait slider workflows.
- **syv-harness comfyui skill** — `comfyctl`, `find_comfy.py`, `last_root` config; `scripts/_comfy_root.py` delegates here.
- **rembg / u2net** (planned) — subject segmentation for watercolor transparency exports per `docs/findings-acuarela-calibracion.md`.

## 5. Repository map (abstraction)

| Zone | Role | Paths |
|------|------|-------|
| **Brain / agent rules** | Portrait flow, model recipes, visibility rules, LoRA training notes | `AGENTS.md`, `CLAUDE.md` (symlink) |
| **Entry docs** | Quick orientation | `README.md` |
| **Reference guides** | Setup, workflow, model canon, empirical findings | `docs/comfyui-setup.md`, `docs/workflow.md`, `docs/z-image-turbo.md`, `docs/findings-acuarela-calibracion.md` |
| **Workflows** | Versioned ComfyUI graphs (UI + API twins in backup/history) | `workflows/*.json`, `workflows/backup/` (40+ historical graphs) |
| **Prompt vault** | Atmosphere clause, per-character compilations, inbox deliveries, whitelist memory | `prompts/atmosphere.md`, `prompts/characters/` (39 fichas), `prompts/inbox/`, `prompts/whitelist.md` |
| **Automation** | Export, compile, batch generate, HTML galleries | `scripts/` (14 Python modules) |
| **Build artifacts** | Dry-run JSON, style galleries, comparison pages | `build/` (`style_example/` with sample HTML+PNG) |
| **Raw image scratch** | ComfyUI bulk import, gitignored | `images/raw/` |
| **Agent scaffolding** | No `.claude/` or `.docs/` trees; agent rules consolidated in `AGENTS.md` | — |

**Active workflow highlights (15 top-level JSON files):** `workflow-syv-portrait-sliders.json`, `workflow-syv-pj-portrait-01.json`, `svdq-int4-zit.json`, `svdq-portrait-v2.json`, `cyberrealistic-zit.json`, `damian-zit-workflow.json`, `ZIT.json`, `anima-base-version.json`, `3-2-3-safetensor-ver.json`, comic-factory Civitai imports, Bradhamel art style, guff-base LoRA version, tree-girl variants.

**Scripts inventory:**

| Script | Purpose |
|--------|---------|
| `export.py` | Copy recent ComfyUI output PNGs → `images/raw/` |
| `_comfy_root.py` | Dynamic ComfyUI root detection |
| `prompt_compiler.py` | Deterministic cuerpo/mente/alma → English descriptors |
| `portrait_prompt.py` | Propaganda-poster prompt builder from syv-pj record |
| `realistic_portrait_prompt.py` | Cinematic realistic portrait variant |
| `sheet_to_comfy.py` | v7 slider workflow submitter (scene + character slots) |
| `generate_portraits.py` | Batch all soldier records (dry-run or live POST) |
| `generate_squad_test.py` | Squad-style multi-job test shoot |
| `generate_3x5_hyper.py` | Hypergrid batch generation |
| `generate_zimage_panorama.py` | Panorama/batch via API |
| `generate_galeria_estilos.py` | Multi-style gallery generation |
| `generate_comparison_page.py` | Comparison HTML builder |
| `build_galeria_html.py` | Static gallery HTML from outputs |
| `build_zimage_matrix.py` | Z-Image style matrix builder |

## 6. Configuration & contracts (no secrets)

### Environment variables (names + purpose)

| Variable | Purpose |
|----------|---------|
| `SYV_PJ_PATH` | Override path to syv-pj root for personajes resolution |
| `COMFYUI_PATH` / `COMFYUI_ROOT` / `COMFYUI_DIR` | ComfyUI installation root |
| `COMFYUI_OUTPUT` | Direct path to ComfyUI output directory |
| `~/.config/comfyui/last_root` | Written by comfyui skill; fallback root discovery |

No `.env` files in repo. Civitai download token may exist on operator machine at `~/.config/civitai/token` (documented in findings doc) — **never commit or quote token values**.

### ComfyUI model files (expected on local install, not in git)

| Component | Filename | Loader node |
|-----------|----------|-------------|
| UNet GGUF | `zimageTurboByStable_2602Q8.gguf` | `UnetLoaderGGUF` |
| Text encoder | `qwen_3_4b.safetensors` | `CLIPLoader` (type lumina2) |
| VAE | `ae.safetensors` | `VAELoader` |
| Slider LoRAs | `ZIT-age-slider.safetensors`, etc. | `LoraLoader` / `LoraLoaderModelOnly` |

### Z-Image Turbo canonical recipe

- Scheduler: `res_multistep` / `simple` + `ModelSamplingAuraFlow` shift 3
- Steps: 8 · CFG: 1 · Negative: `ConditioningZeroOut` (no negative prompt text)
- Resolution: 704×960 working size documented; docs recommend 864×1152 or 832×1248 portrait buckets for ≥1 MP quality
- Pre-gen: stop `local-llm` service to free ~1.9 GB VRAM on 8 GB GPU

### Inbox entry contract (`entry.md`)

- Full positive and negative prompt literals (negative empty/omitted for Z-Image)
- Metadata: personaje, facción, estilo, checkpoint, sampler, scheduler, steps, cfg, seed, resolution, workflow name
- Evaluation block: `rating: null`, `liked`, `disliked` (user-filled)

### Whitelist JSON combo contract

```json
{
  "personaje": "<slug>",
  "estilo": "<style-slug>",
  "rating": 5,
  "fuente": "[[inbox/<delivery-slug>/entry]]",
  "Positivo": "...",
  "Negativo": "..."
}
```

### 6.1 HTTP / API endpoints (when applicable)

This repo does not expose its own HTTP server. It **consumes ComfyUI's HTTP API** on local port 8188. Documented in scripts and `docs/workflow.md`:

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `POST` | `/prompt` | Submit workflow graph (API JSON format) for queue execution | none (local) |
| `GET` | `/history` | Poll completed jobs and output filenames | none |
| `GET` | `/queue` | Inspect pending/running queue state | none |
| `GET` | `/system_stats` | Health / resource probe (via comfyctl) | none |

ComfyUI also serves its web UI on the same port for manual workflow load from `workflows/*.json`. Optional **comfyui-mcp** tools (`generate-image`, `health-check`, `queue`, `workflow-*`) are checked by the external skill before use; HTTP + `comfyctl` is the functional fallback.

### 6.2 Other interfaces

- **CLI:** `uv run scripts/<script>.py` with per-script flags (`--run`, `--dry-run`, `--prefix`, `--since`, `--seed`, `--lora NAME:WEIGHT`).
- **comfyctl CLI** (external skill): `status`, `start`, `stop`, `url`, `find` — lifecycle for ComfyUI process.
- **MCP:** `markdown-vault-syv` for syv-docs canon lookup; comfyui-mcp for generation when registered.
- **Obsidian wikilinks:** `fuente` fields and character cross-refs use `[[path]]` syntax for inbox and syv-pj sources.

## 7. Data & persistence

| Store | Role | Versioned? |
|-------|------|------------|
| `prompts/inbox/` | Curated delivery folders (preview PNG + entry.md) | yes (committed previews) |
| `prompts/whitelist.md` | Human-ranked prompt combo memory | yes |
| `prompts/characters/` | Compiled per-character ComfyUI fichas | yes |
| `workflows/` | ComfyUI graph SSOT for this ecosystem | yes |
| `images/raw/` | Bulk ComfyUI exports | **no** (gitignored) |
| `build/` | Generated HTML/JSON matrices, sample galleries | partial (`style_example/` present) |
| ComfyUI `output/` | Live render destination on local install | external, ephemeral |
| ComfyUI `models/` | Checkpoints, LoRAs, GGUF weights | external, large binaries |

**Important entities (by name, not row data):** 34 syv-pj mock characters (FA/Confederación, Resistencia/Ejército Rojo, Iglesia/Inquisición, minor factions); 39 local compiled fichas in `prompts/characters/`; inbox deliveries keyed by `AAAAMMDD-personaje-estilo` slug.

Topology: **fully local/offline GPU workstation** — no cloud vector DB, no edge Workers, no central image server in this repo. Canon text may be fetched via MCP from local vault paths. Images flow outward to sibling apps after curation.

## 8. Docs & agent memory (required scan)

| Source | Summary | Evidence path |
|--------|---------|---------------|
| Root README | Orientation, structure diagram, quick 5-step flow | `README.md` |
| AGENTS.md / CLAUDE.md | **Primary brain:** 6-step portrait loop, Z-Image recipes, palette law, inbox/whitelist contracts, LoRA training input spec, work-public rule | `AGENTS.md`, `CLAUDE.md` |
| workflow.md | End-to-end test procedure, export, inbox conventions, ranking → whitelist | `docs/workflow.md` |
| comfyui-setup.md | Local ComfyUI paths, comfyctl commands, model table, workflow dual-format note | `docs/comfyui-setup.md` |
| z-image-turbo.md | Canonical model reference: resolution buckets, prompting anti-patterns, LoRA list, VRAM variants, training base | `docs/z-image-turbo.md` |
| findings-acuarela-calibracion.md | Empirical watercolor CFG findings, black background limits, transparency/rembg plan, compiler laws recap | `docs/findings-acuarela-calibracion.md` |
| atmosphere.md | Token-efficient SyV world clause for all prompts | `prompts/atmosphere.md` |
| whitelist.md | Calibration memory structure (currently empty buckets, reset Jul 2026 for Z-Image) | `prompts/whitelist.md` |
| Character fichas | Per-slug compiled prompts, slider values, source syv-pj link | `prompts/characters/*.md` |
| `.claude/` | **Not present** — rules live in `AGENTS.md` | — |
| `.docs/` | **Not present** — reference docs in `docs/` | — |

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repo — workflows, prompts, and curated previews are shareable; no private clone URLs needed in related metadata.
- **Auth model:** None for repo contents. ComfyUI local API is unauthenticated on loopback (operator machine). Civitai downloads may use a local token file — never embed in repo.
- **Secrets hygiene:** `.gitignore` excludes `images/raw/`, editor dirs, Python caches, venvs. This summary contains no tokens, PEM keys, connection strings, or `.env` contents.
- **Canon integrity:** Repo is read-only toward `syv-pj` and `syv-docs` — reduces risk of accidental lore mutation by generation agents.
- **Content sensitivity:** Character fichas depict fictional militarized/theocratic dystopia characters; images are creative assets for internal SyV development.

## 10. Operational picture

### Local development

```bash
# Start ComfyUI (external skill)
~/SyV/syv-harness/skills/comfyui/scripts/comfyctl start --port 8188 --enable-manager

# Export recent renders
uv run scripts/export.py
uv run scripts/export.py --prefix syv_pixel_art_portrait --since 30

# Compile prompt for one character
uv run scripts/prompt_compiler.py luisa-pescadora

# Batch portraits (dry-run first)
uv run scripts/generate_portraits.py --dry-run
uv run scripts/generate_portraits.py --run

# v7 slider submit
uv run scripts/sheet_to_comfy.py sor-sofia-guardaespaldas "a woman in a dark habit"
```

### Hardware constraints

- Target GPU: **NVIDIA RTX 2060 Super 8 GB VRAM** documented throughout docs.
- Kill `local-llm` before heavy runs to reclaim ~1.9 GB VRAM.
- Z-Image GGUF Q8 is the VRAM-balanced choice; FP8 and Q4 variants documented for smaller GPUs.
- Render time ~40–65s per image noted after model reload between jobs.

### Deployment / CI

- No GitHub Actions or `.github/workflows` in tree.
- Not deployed to Cloudflare or cloud — local workstation playground.
- Part of broader SyV monorepo layout under `~/SyV` with sibling repos.

### Agent operation rules (from AGENTS.md)

- Use comfyui skill exclusively for ComfyUI tasks — never hardcode install paths.
- Always read whitelist before generating.
- Deliver to inbox immediately after each generation with full metadata.
- Operate visibly: browser snapshot + screenshot + read output image; no silent API-only runs when user expects visibility.

## 11. Open questions / unknowns

- **Whitelist state:** `prompts/whitelist.md` buckets are empty after Jul 2026 Z-Image reset — calibration memory must be rebuilt from new inbox rankings.
- **Inbox population:** `prompts/inbox/` contains only `.gitkeep` in current tree — no committed delivery folders at snapshot time (may exist only on operator machine).
- **Python packaging:** No `pyproject.toml` / lockfile — exact third-party deps per script are implicit (`uv` environment on operator machine).
- **rembg pipeline:** Documented as pending install for watercolor alpha exports — not yet wired in scripts.
- **Active workflow SSOT:** Multiple parallel workflow files (svdq, sliders, cyberrealistic, damian-zit) — which is default for new agents depends on context not encoded in a single manifest flag.
- **syv_zimage_turbo.json:** Referenced heavily in docs/AGENTS.md but may live in `workflows/backup/` rather than top-level `workflows/` in current branch — operators should verify before load.
- **CI / release process:** Unknown — no automation observed for publishing galleries or syncing previews to downstream apps.
