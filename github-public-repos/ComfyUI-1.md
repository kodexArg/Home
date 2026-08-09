---
id: "comfyui-1"
title: "ComfyUI-1 — modular node-graph engine for diffusion and generative media"
visibility: public
importance: normal
source_repo: "ComfyUI-1"
org: "kodexArg"
default_branch: "master"
primary_language: "Python"
repo_kind: "mirror-fork"
status: "active"
related: []
tags: ["python", "pytorch", "comfyui", "diffusion", "node-graph", "aiohttp", "gpu", "image-generation", "video-generation", "audio-generation", "sqlite", "openapi", "generative-ai"]
problems_solved:
  - "Visual professionals and ML practitioners need fine-grained control over diffusion and generative pipelines without writing bespoke Python for every model, sampler, and conditioning trick."
  - "Running large generative models on consumer GPUs is constrained by VRAM, model count, and offload complexity — users need an engine that loads, unloads, and re-executes only what changed."
  - "Production and automation workflows need a stable programmatic surface (HTTP, WebSocket, job queue) on top of the same graph the GUI edits, not a separate inference stack."
technologies:
  - "Python 3.10+"
  - "PyTorch (torch, torchvision, torchaudio)"
  - "aiohttp (async HTTP server)"
  - "SQLAlchemy 2 + Alembic (SQLite)"
  - "Hugging Face transformers / tokenizers"
  - "safetensors"
  - "comfyui-frontend-package (pip-delivered SPA)"
  - "comfy-kitchen / comfy-aimdo (VRAM management)"
  - "Pydantic 2"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ComfyUI-1

> **Problem thesis (required):** ComfyUI exists because script-based or monolithic UIs for diffusion models hide the composable structure of modern generative pipelines — checkpoints, CLIP encoders, ControlNets, LoRAs, samplers, latent ops, and post-processing each deserve first-class, reusable blocks. ComfyUI exposes that structure as a **node graph**: users wire typed inputs and outputs, queue runs, and iterate without re-running unchanged subgraphs. The kodexArg `ComfyUI-1` repository is a **public mirror-fork** of the upstream Comfy-Org ComfyUI core (version **0.26.0** at scan time), tracking `master` with `upstream` pointing at Comfy-Org/ComfyUI and `origin` at kodexArg/ComfyUI-1. It ships the full Python backend, execution engine, built-in nodes, optional cloud API nodes, asset database layer, OpenAPI contract, and workflow blueprint library — while the browser UI is delivered as a separate pip package.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/ComfyUI-1` |
| Visibility | `public` |
| Default branch | `master` |
| One-line pitch | The most powerful and modular diffusion-model GUI, API, and backend — a node-graph engine for images, video, audio, and 3D with smart GPU memory management and production-grade HTTP/WebSocket automation. |
| Audience | Visual artists and designers, ML researchers, custom-node authors, operators running local or headless GPU servers, integrators embedding ComfyUI into pipelines, and kodexArg maintainers who mirror upstream Comfy core. |

## 2. Problems it solves

### P1 — Generative pipelines are opaque without a composable graph

- **Who hurts:** Creatives who need control over every model, parameter, and conditioning path; researchers swapping samplers, schedulers, or ControlNets; teams reproducing complex multi-pass workflows (hires fix, inpainting, area composition).
- **Pain today:** Single-page UIs hide internal wiring; notebook scripts become unmaintainable as model families multiply (SDXL, Flux, Wan video, Hunyuan3D, etc.); sharing a workflow means sharing screenshots or fragile prose instructions.
- **How this repo answers:** ComfyUI models pipelines as a **directed acyclic graph of typed nodes** (`nodes.py`, `comfy_extras/`, `comfy_api_nodes/`). Each node declares `INPUT_TYPES`, `RETURN_TYPES`, and a handler function. The frontend (pip package `comfyui-frontend-package`) renders the canvas; `execution.py` topologically sorts and runs only nodes whose inputs changed since the last run. Workflows serialize to JSON; PNG/WebP/FLAC outputs embed workflow metadata for drag-and-drop reload. `blueprints/` ships dozens of ready-made template graphs (text-to-image, video, inpainting, depth, audio, 3D).
- **Out of scope:** Training new base models from scratch; managed cloud hosting (that is a separate Comfy Cloud product); guaranteed stability of third-party custom nodes across bleeding-edge commits.

### P2 — GPU VRAM and model lifecycle are the bottleneck on real hardware

- **Who hurts:** Users on 8–12 GB consumer GPUs, multi-model workflows, and anyone running several large checkpoints in one session.
- **Pain today:** Naive loaders keep every model resident; switching checkpoints OOMs; low-VRAM hacks are manual and error-prone.
- **How this repo answers:** `comfy/model_management.py` and `comfy-aimdo` implement **dynamic VRAM**, async weight offload, and aggressive unload policies controlled by CLI flags (`--lowvram`, `--novram`, `--highvram`, `--gpu-only`, `--reserve-vram`, `--disable-dynamic-vram`, etc. in `comfy/cli_args.py`). Execution caching (`comfy_execution/caching.py`) defaults to RAM-pressure mode so unchanged node outputs are reused. Quantization support (`QUANTIZATION.md`, `comfy/quant_ops.py`) enables FP8 and mixed-precision paths. CPU fallback (`--cpu`) exists for environments without accelerators.
- **Out of scope:** Guaranteeing performance on every exotic accelerator without platform-specific PyTorch builds (ROCm, XPU, Ascend, Cambricon, Iluvatar each have README install notes but remain operator responsibility).

### P3 — Automation and production need the same graph the GUI edits

- **Who hurts:** Pipeline engineers, batch operators, desktop/cloud integrators, and headless server admins.
- **Pain today:** GUI-only tools cannot be queued, monitored, or embedded; separate inference servers duplicate model loading and diverge from artist workflows.
- **How this repo answers:** `server.py` exposes a long-lived **aiohttp** server (default `127.0.0.1:8188`) with REST endpoints for prompt queueing, history, object metadata, uploads, jobs, assets, workflows, and settings. **WebSocket** at `/ws` streams execution progress and binary preview events (`protocol.py` defines `BinaryEventTypes`). `openapi.yaml` (~5k lines) is the machine-readable contract; `script_examples/basic_api_example.py` and `websockets_api_example.py` show minimal clients. Job APIs (`/api/jobs`, cancel endpoints) support multi-client orchestration. Optional **API nodes** (`comfy_api_nodes/`, 36 provider modules) call external closed-source models through Comfy's API-node layer, disable-able via `--disable-api-nodes`.
- **Out of scope:** Built-in multi-tenant auth for internet-facing deployments — default bind is localhost; exposing `--listen 0.0.0.0` is an operator choice requiring external access control.

## 3. Product / idea

ComfyUI is three surfaces on one engine:

1. **Interactive graph editor** — browser UI loaded by `app/frontend_management.py` from the pip frontend package; users place nodes, connect wires, queue prompts, inspect history.
2. **Inference runtime** — `main.py` bootstraps paths, optional ComfyUI-Manager, database, custom nodes, then starts `PromptServer` in `server.py`. `execution.py` receives a prompt JSON, validates inputs (`comfy_execution/validation.py`), walks the graph with caching, dispatches each node class from `nodes.NODE_CLASS_MAPPINGS`, and streams progress.
3. **Extensibility plane** — `custom_nodes/` (gitignored except example) loads community extensions; `comfy_api/` versions the node authoring API (`v0_0_1`, `v0_0_2`, `latest`); `comfy_extras/` ships first-party extra nodes (video, audio, ControlNet helpers, merging, etc.).

The mental model: **models live on disk** under `models/` (checkpoints, VAE, LoRA, ControlNet, etc. — directory scaffold is committed, weights are not), **graphs are JSON**, **execution is incremental**, and **state** (settings, userdata, assets) increasingly lives in a local **SQLite** database migrated by Alembic.

The kodexArg fork adds no visible product divergence in-tree: it mirrors upstream `master` (latest commit at scan: advanced Krea 2 model-merging node). Operators treating this as kodexArg infrastructure get upstream Comfy core with an extra remote for pulling Comfy-Org changes.

### 3.1 North-star use cases

1. **Artist iteration** — build a text-to-image graph with checkpoint loader, CLIP encode, KSampler, VAE decode; tweak seed and prompt; only affected nodes re-run.
2. **Template workflow** — open a blueprint from `blueprints/` (e.g. Flux dev, Wan 2.2 video, Hunyuan3D) and adapt parameters without reconstructing the graph.
3. **Headless batch** — POST workflow JSON to `/prompt` or `/api/prompt`; poll `/queue` and `/history`; retrieve images via `/view`.
4. **Low-VRAM machine** — launch with dynamic VRAM defaults; run models that would not fit if all weights stayed on GPU.
5. **Asset library** (opt-in) — start with `--enable-assets`; ingest outputs into SQLite-backed asset catalog with Blake3 hashing, tags, and content API.

### 3.2 Non-goals

- Replacing model training frameworks (PyTorch training loops are out of scope; inference and graph composition are in scope).
- Bundling model weights in git (the `models/` tree is placeholders; checkpoints are operator-supplied and gitignored).
- Shipping the frontend source in this repo (UI is the separate `comfyui-frontend-package` wheel).
- Stable ABI for every custom node on `master` between weekly releases (README release process warns that commits off stable tags may break extensions).
- Offline-incompatible API nodes when enabled (those nodes call external providers; `--disable-api-nodes` restores fully offline core behavior).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python ≥3.10 (3.13 well supported per README) | `pyproject.toml`, `README.md` |
| ML framework | PyTorch ecosystem (torch, torchvision, torchaudio, einops, kornia) | `requirements.txt` |
| Diffusion / transformers | Hugging Face transformers, tokenizers, sentencepiece, safetensors | `requirements.txt`, `comfy/` |
| HTTP server | aiohttp + yarl | `requirements.txt`, `server.py` |
| Frontend delivery | `comfyui-frontend-package`, `comfyui-workflow-templates`, `comfyui-embedded-docs` (pip) | `requirements.txt` |
| Database | SQLite via SQLAlchemy 2.0, Alembic migrations | `app/database/db.py`, `alembic.ini`, `alembic_db/versions/` |
| Schema validation | Pydantic ~2.0, pydantic-settings | `requirements.txt`, `app/assets/api/` |
| VRAM / kitchen | comfy-kitchen, comfy-aimdo | `requirements.txt`, `main.py` |
| Media I/O | Pillow, av (PyAV), scipy | `requirements.txt` |
| API contract | OpenAPI 3 spec, Spectral lint | `openapi.yaml`, `.spectral.yaml`, `.github/workflows/openapi-lint.yml` |
| Lint / CI | Ruff, Pylint config, pytest | `pyproject.toml`, `pytest.ini`, `.github/workflows/` |
| Tests | pytest unit (`tests-unit/`) and GPU integration (`tests/`) | `tests-unit/`, `tests/`, `.github/workflows/test-ci.yml` |

### 4.1 Notable dependencies (curated)

- `torch` / `torchvision` / `torchaudio` — core tensor runtime; platform-specific wheels chosen at install time per README (CUDA, ROCm, XPU, DirectML).
- `transformers` — text encoders and auxiliary HF model loaders used across `comfy/` and nodes.
- `safetensors` — preferred checkpoint format; safe loading paths in `nodes.py` and model management.
- `aiohttp` — async HTTP/WebSocket server for all client interaction.
- `SQLAlchemy` + `alembic` — asset and app persistence; file-backed SQLite default with process-level file lock.
- `comfyui-frontend-package` — prebuilt SPA served by backend; version pinned in `requirements.txt`.
- `comfy-kitchen` / `comfy-aimdo` — performance and dynamic VRAM control hooks initialized in `main.py`.
- `blake3` — content hashing for the assets subsystem.
- `simpleeval` — safe expression evaluation in select nodes.
- `spandrel` — architecture-agnostic super-resolution / restoration model loader in extras.

## 5. Repository map (abstraction)

- **Entrypoints:** `main.py` (CLI launcher), `server.py` (`PromptServer` class), `execution.py` (graph executor), `cuda_malloc.py` (CUDA allocator tuning).
- **Domain / core (`comfy/`):** diffusion sampling (`k_diffusion/`, `samplers.py`), model loading (`sd.py`, `diffusers_load.py`), CLIP/VAE/ControlNet implementations, memory management, quantization (`quant_ops.py`), latent formats, hooks, audio/video encoder paths.
- **Node registry:** `nodes.py` (large built-in node catalog), `comfy_extras/nodes_*.py` (extended nodes loaded as extensions), `comfy_api_nodes/nodes_*.py` (external API provider nodes).
- **Execution infrastructure (`comfy_execution/`):** graph representation, caching strategies, progress handlers, validation, asset enrichment on outputs.
- **Public node API (`comfy_api/`):** versioned IO types, feature flags, stub generation; `comfy_api/latest/` is the current authoring surface.
- **Application services (`app/`):** `frontend_management.py`, `user_manager.py`, `app_settings.py`, `custom_node_manager.py`, `model_manager.py`, `subgraph_manager.py`, `node_replace_manager.py`, `assets/` (full asset CRUD stack), `database/`.
- **HTTP adapters:** `server.py` (primary routes), `app/assets/api/routes.py` (asset routes, gated by `--enable-assets`), `api_server/routes/internal/` (internal-only diagnostics), `middleware/cache_middleware.py`.
- **Configuration & paths:** `folder_paths.py` (model/input/output/temp resolution), `comfy/cli_args.py` (extensive CLI), `extra_model_paths.yaml.example` (shared model dirs with other UIs).
- **Workflow templates:** `blueprints/*.json` plus `.glsl/` shader assets for image-processing blueprint nodes.
- **Database migrations:** `alembic_db/versions/` (assets schema evolution: `0001_assets.py` through `0004_drop_tag_type.py`).
- **Model directory scaffold:** `models/` (checkpoints, loras, vae, controlnet, etc. — weights gitignored).
- **Custom extension slot:** `custom_nodes/` (gitignored except `example_node.py.example`).
- **I/O directories:** `input/`, `output/` (gitignored contents), `temp/` (gitignored).
- **Examples & protocol:** `script_examples/`, `protocol.py` (WebSocket binary event types).
- **Docs vaults:** no `docs/`, `.docs/`, or `.claude/` present in this tree (see §8).
- **CI / release:** `.github/workflows/` (GPU CI, unit tests, OpenAPI lint, Windows portable builds, stable release automation).
- **Generated / vendor:** frontend wheel contents not in repo; `models/` weights operator-supplied; lockfile `uv.lock` gitignored.

## 6. Configuration & contracts (no secrets)

### CLI and environment (shapes only)

`comfy/cli_args.py` defines the launch contract. High-signal groups:

| Flag group | Purpose |
|------------|---------|
| `--listen`, `--port`, `--tls-keyfile`, `--tls-certfile` | Bind address (default localhost), port (default 8188), optional TLS |
| `--base-directory`, `--output-directory`, `--input-directory`, `--temp-directory`, `--extra-model-paths-config` | Filesystem layout overrides |
| `--cuda-device`, `--default-device`, `--cpu`, VRAM modes | Device selection and memory policy |
| FP8/FP16/BF16 unet/vae/text-enc flags | Precision overrides per subsystem |
| `--cache-ram`, `--cache-classic`, `--cache-lru`, `--cache-none` | Node output caching strategy |
| `--preview-method`, `--preview-size` | Latent preview behavior |
| `--enable-manager`, `--disable-manager-ui` | Optional ComfyUI-Manager integration |
| `--disable-api-nodes` | Strip external API nodes and block frontend internet calls |
| `--database-url` | SQLAlchemy URL (default file SQLite under user data path) |
| `--enable-assets` | Turn on asset API, DB sync, and background scanning |
| `--max-upload-size` | Upload cap in MB |
| `--enable-cors-header` | CORS for browser clients |

`main.py` sets `HF_HUB_DISABLE_TELEMETRY` and `DO_NOT_TRACK` at startup. GPU vendor env vars (`CUDA_VISIBLE_DEVICES`, `HIP_VISIBLE_DEVICES`, etc.) are set from CLI when specified.

`extra_model_paths.yaml` (from example file) maps external checkpoint roots — operator-authored, gitignored when live.

### 6.1 HTTP / API endpoints (when applicable)

ComfyUI exposes a large HTTP surface documented in `openapi.yaml`. Legacy routes (no `/api` prefix) remain alongside newer `/api/*` paths. WebSocket: `GET /ws` for real-time execution events.

**Core workflow execution**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `POST` | `/prompt`, `/api/prompt` | Queue a workflow graph for execution | none (default local) |
| `GET` | `/queue`, `/api/queue` | Inspect running and pending prompts | none |
| `POST` | `/queue`, `/api/queue` | Manage queue (clear, etc.) | none |
| `POST` | `/interrupt`, `/api/interrupt` | Cancel current run | none |
| `POST` | `/free`, `/api/free` | Release loaded models / memory | none |
| `GET` | `/history`, `/api/history`, `/api/history_v2` | Past execution records | none |
| `GET` | `/history/{prompt_id}`, `/api/history_v2/{prompt_id}` | Single history entry | none |
| `POST` | `/history`, `/api/history` | History mutations (e.g. clear) | none |

**Discovery & metadata**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/`, `/api/` | SPA shell / root | none |
| `GET` | `/object_info`, `/api/object_info` | All node class schemas | none |
| `GET` | `/object_info/{node_class}`, `/api/object_info/{node_class}` | Single node schema | none |
| `GET` | `/models`, `/models/{folder}` | List model files per category | none |
| `GET` | `/embeddings`, `/api/embeddings` | List embedding files | none |
| `GET` | `/extensions`, `/api/extensions` | Loaded extension manifest | none |
| `GET` | `/features`, `/api/features` | Server capability flags | none |
| `GET` | `/system_stats`, `/api/system_stats` | CPU/GPU/RAM/device stats | none |
| `GET` | `/workflow_templates`, `/api/workflow_templates` | Template index | none |
| `GET` | `/global_subgraphs`, `/api/global_subgraphs` | Reusable subgraph definitions | none |
| `GET` | `/node_replacements`, `/api/node_replacements` | Node migration mappings | none |
| `GET` | `/i18n`, `/api/i18n` | Localization bundles | none |

**Files & previews**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `POST` | `/upload/image`, `/api/upload/image` | Upload input image | none |
| `POST` | `/upload/mask`, `/api/upload/mask` | Upload mask image | none |
| `GET` | `/view`, `/api/view` | Serve output/input image by filename params | none |
| `GET` | `/view_metadata/{folder_name}` | File metadata sidecar | none |

**Jobs (orchestration)**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/jobs` | List jobs | none |
| `GET` | `/api/jobs/{job_id}` | Job detail | none |
| `POST` | `/api/jobs/{job_id}/cancel` | Cancel one job | none |
| `POST` | `/api/jobs/cancel` | Bulk cancel | none |
| `GET` | `/api/job/{job_id}/status` | Job status snapshot | none |

**Users & settings**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET`/`POST` | `/users`, `/api/users` | Multi-user roster (when enabled) | unknown |
| `GET`/`POST`/`DELETE` | `/userdata`, `/userdata/{file}`, `/api/userdata` variants | Per-user workflow/settings files | unknown |
| `GET`/`POST` | `/settings`, `/settings/{id}`, `/api/settings` variants | Server-side settings records | none |

**Assets (requires `--enable-assets`)**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET`/`POST` | `/api/assets` | List / create assets | user-scoped when auth present |
| `GET`/`PATCH`/`DELETE` | `/api/assets/{id}` | Asset CRUD | user-scoped |
| `GET` | `/api/assets/{id}/content` | Download asset bytes | user-scoped |
| `POST` | `/api/assets/from-hash`, `/api/assets/hash/{hash}` | Deduped ingest by hash | user-scoped |
| `POST` | `/api/assets/seed`, `/api/assets/seed/cancel`, `/api/assets/seed/status` | Background filesystem scan | user-scoped |
| `GET`/`POST` | `/api/tags`, `/api/assets/{id}/tags` | Tag histogram and mutation | user-scoped |

**Workflows (persisted graphs)**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET`/`POST` | `/api/workflows` | List / create workflows | unknown |
| `GET`/`PATCH`/`DELETE` | `/api/workflows/{workflow_id}` | Workflow CRUD | unknown |
| `GET` | `/api/workflows/{workflow_id}/content` | Workflow JSON body | unknown |
| `POST` | `/api/workflows/{workflow_id}/fork` | Fork workflow | unknown |
| `GET` | `/api/workflows/published/{share_id}` | Published share lookup | unknown |

**Health & internal**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/health` | Liveness | none |
| `GET` | `/internal/folder_paths`, `/internal/logs`, `/internal/logs/raw`, `/internal/logs/subscribe` | Operator diagnostics — **not for external apps** per `api_server/routes/internal/README.md` | internal only |

**WebSocket**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/ws` | Execution progress, previews (`BinaryEventTypes` in `protocol.py`) | none |

### 6.2 Other interfaces

- **CLI:** `python main.py` plus flags from `comfy/cli_args.py`; `comfy-cli` external installer referenced in README.
- **WebSocket binary protocol:** preview images and text events via typed integers in `protocol.py`.
- **Custom nodes:** Python modules in `custom_nodes/` registering classes into `NODE_CLASS_MAPPINGS` at import time.
- **ComfyUI-Manager:** optional pip package (`manager_requirements.txt`) enabled with `--enable-manager` for extension lifecycle.
- **API provider nodes:** `comfy_api_nodes/` modules wrap third-party generative APIs as graph nodes (disable with `--disable-api-nodes`).
- **Feature flags:** `comfy_api/feature_flags.py` and `GET /features` expose runtime toggles to the frontend.

## 7. Data & persistence

- **SQLite database** (default path derived in `comfy/cli_args.py`, overridable via `--database-url`): Alembic-managed schema for assets and related tables (`app/assets/database/models.py` defines `Asset`, `AssetReference`, tag and metadata tables). Process-level file lock prevents concurrent writers (`app/database/db.py`). In-memory SQLite supported for tests via `sqlite:///:memory:`.
- **Filesystem stores:** model weights under `models/` subtrees; user uploads in `input/`; renders in `output/`; ephemeral files in `temp/` — all governed by `folder_paths.py` and largely gitignored.
- **Workflow/state files:** JSON graphs on disk via userdata endpoints; blueprint templates committed under `blueprints/`.
- **Hashes:** Blake3 content IDs for asset deduplication (`app/assets/helpers.py`, OpenAPI `Asset.hash` pattern).
- **Topology:** single-process local server by default; database and files co-located on the host. No built-in distributed inference — horizontal scale is external (multiple instances, external queue). Cloud-specific fields in OpenAPI (e.g. `short_url` with `x-runtime: cloud`) describe Comfy Cloud behavior not active in vanilla local installs.

## 8. Docs & agent memory (required scan)

| Source | Finding |
|--------|---------|
| `README.md` | Primary product documentation: features, model support list, install matrix (NVIDIA/AMD/Intel/Apple/Ascend/etc.), shortcuts, ComfyUI-Manager setup, running notes, TLS, release process across Core/Desktop/Frontend repos. |
| `CONTRIBUTING.md` | Contribution norms; questions on Discord/Matrix; PR guidance. |
| `QUANTIZATION.md` | QuantizedTensor architecture, layout handlers, mixed precision in Comfy. |
| `SECURITY.md` | Security reporting expectations. |
| `openapi.yaml` | Authoritative HTTP contract for routes, schemas, asset model. |
| `api_server/routes/internal/README.md` | Internal routes are unstable and Comfy-private. |
| `tests/README.md`, `tests-unit/README.md` | Test layout guidance. |
| `blueprints/.glsl/README.md` | Shader blueprint maintenance. |
| `.github/PULL_REQUEST_TEMPLATE/api-node.md` | Template for API-node contributions. |
| `script_examples/*.py` | API usage patterns. |
| **`.claude/`** | **Not present** — no agent instruction tree in this repo. |
| **`.docs/`** | **Not present** — no hidden docs vault. |
| **`docs/`** | **Not present** at repository root. |

## 9. Security & privacy notes (summary-time)

- **Visibility:** public mirror-fork; contains no kodexArg-private secrets in tracked files. Model weights and operator `.env` files are gitignored and must not be ingested into summaries.
- **Auth model:** default install binds to loopback (`127.0.0.1`) with **no authentication** on workflow or file endpoints — intended for trusted local use. Multi-user/file ACL features exist in `app/user_manager.py` for deployments that enable them; exposing the server publicly requires reverse-proxy auth or network isolation.
- **External calls:** API nodes and optional manager features may reach the internet unless `--disable-api-nodes` is set.
- **Upload surface:** image/mask upload endpoints and asset ingest accept user files — `--max-upload-size` caps size; operators should harden when exposed.
- **Telemetry:** HF hub telemetry disabled via env in `main.py`.
- **This summary:** contains no secrets, PEM material, database passwords, or live credential values.

## 10. Operational picture

- **Local dev / run:** install deps via `pip install -r requirements.txt` (or `uv` per project norms); place checkpoints under `models/checkpoints`; launch `python main.py`. Common flags: `--listen` for LAN access, `--enable-preview-method auto`, `--enable-assets` for asset DB, `--enable-manager` for extension manager.
- **Port:** default **8188** (`--port`).
- **Hardware:** NVIDIA CUDA primary; AMD ROCm, Intel XPU, Apple Metal, Ascend, Cambricon, Iluvatar paths documented in README. GPU strongly recommended; CPU mode available but slow. VRAM as low as ~1 GB claimed for some workflows with offloading.
- **CI:** `.github/workflows/test-ci.yml` runs full GPU integration on self-hosted Linux runners across Python 3.10–3.12; `test-unit.yml`, `test-execution.yml`, `ruff.yml`, `openapi-lint.yml` provide additional signal. Windows portable builds via dedicated workflows.
- **Release cadence:** README describes weekly-ish releases; stable tags on upstream Core; this fork tracks `master` and tags through v0.31.0 visible on upstream remote at clone time.
- **Frontend updates:** delivered by bumping `comfyui-frontend-package` pin in `requirements.txt`, not by editing web assets in-repo.

## 11. Open questions / unknowns

- **kodexArg fork policy:** no in-repo README or config states why kodexArg mirrors ComfyUI-1 versus tracking upstream directly — appears to be an org namespace mirror with `upstream` remote only.
- **Auth in production:** exact deployment pattern kodexArg uses (if any) for exposing ComfyUI — not defined in this tree.
- **Pinned vs rolling:** fork is on bleeding `master` (0.26.0 in `pyproject.toml`); whether kodexArg intends to follow stable tags only is undocumented here.
- **Custom nodes in kodexArg deployments:** `custom_nodes/` is empty in clone; operator-specific extensions unknown.
- **Cloud-only OpenAPI fields:** several asset/workflow schema fields reference cloud runtime behaviors that may not activate in local-only mode.
