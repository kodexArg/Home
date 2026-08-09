---
id: "odysseus"
title: "Odysseus — self-hosted AI workspace for chat, agents, and local model workflows"
visibility: public
importance: high
source_repo: "odysseus"
org: "kodexArg"
default_branch: "dev"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags:
  - "self-hosted"
  - "ai-workspace"
  - "fastapi"
  - "agents"
  - "mcp"
  - "rag"
  - "chromadb"
  - "searxng"
  - "cookbook"
  - "local-llm"
  - "email"
  - "calendar"
  - "documents"
  - "docker"
  - "sqlite"
  - "agpl"
problems_solved:
  - "Operators who want a private, all-in-one AI workspace — chat, agents, research, documents, email, notes, calendar, and local model serving — without sending personal data to a SaaS console or stitching together a dozen separate tools."
  - "Self-hosters who need hardware-aware guidance for downloading, serving, and probing local/API LLMs (Ollama, vLLM, llama.cpp, remote SSH servers) from a single UI instead of juggling terminal sessions and ad-hoc scripts."
  - "Power users and external coding agents (Claude Code, Codex, MCP clients) who need scoped, token-gated HTTP APIs to read/write Odysseus data (todos, email, memory, calendar, Cookbook tasks) without direct database or shell access."
technologies:
  - "Python 3.11+ (native) / Python 3.14-slim (Docker image)"
  - "FastAPI + Uvicorn + Starlette"
  - "SQLAlchemy + SQLite (default)"
  - "ChromaDB (vector store) + fastembed (local ONNX embeddings)"
  - "SearXNG (self-hosted web search)"
  - "ntfy (push notifications)"
  - "MCP (Model Context Protocol) client + built-in MCP servers"
  - "CalDAV + icalendar (calendar sync)"
  - "Vanilla HTML/CSS/JS frontend (no SPA framework)"
  - "Docker Compose (multi-service stack)"
  - "pytest + pytest-asyncio (large test suite)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Odysseus

> **Problem thesis (required):** Odysseus exists to give individuals and small teams a **self-hosted AI workspace** that replaces the patchwork of cloud chat UIs, separate note apps, email clients, calendar tools, and local-model terminal workflows. It centralizes conversational AI with tools (shell, files, web, MCP), durable memory and RAG, deep multi-step research, document editing, IMAP/SMTP email, notes/tasks/calendar with CalDAV sync, and a **Cookbook** subsystem that discovers hardware, downloads models, and serves them locally or on remote SSH hosts — all behind authentication on infrastructure the operator controls. External agents integrate through scoped API tokens rather than privileged shell access.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/odysseus` |
| Visibility | `public` |
| Default branch | `dev` (active development; `main` is the more curated release branch) |
| One-line pitch | A self-hosted AI workspace for chat, agents, research, documents, email, notes, calendar, and local model workflows — Docker-first, AGPL-licensed, designed as a private admin console rather than a public SaaS. |
| Audience | Self-hosting operators on Linux/macOS (Docker or native Python); power users who want local/API LLM flexibility; admins who enable shell, email, and MCP for trusted users; external coding agents (Claude Code, Codex) connecting via scoped integration tokens; contributors improving Cookbook reliability, security, and mobile polish. |

## 2. Problems it solves

### P1 — Fragmented personal AI and productivity stack

- **Who hurts:** Individuals and small teams who use separate products for chat, notes, email triage, calendar, document editing, and local model experimentation — and who cannot or will not route all of that through a cloud provider.
- **Pain today:** Context does not travel between tools; research outputs land in chat logs instead of documents; email and calendar live outside the agent's reach; switching between Ollama terminals, web UIs, and file editors breaks flow; cloud AI consoles retain conversation and attachment data on vendor infrastructure.
- **How this repo answers:** Ships a single FastAPI application with a unified browser UI (`static/`) covering chat/agent sessions, deep research, document editor, email inbox, notes/todos, calendar (with CalDAV), gallery/image tools, memory/skills management, and settings — all persisting under a configurable `data/` tree. The agent loop (`src/agent_loop.py`, `src/tool_implementations.py`) connects LLM providers to tools (filesystem, shell, web fetch/search, MCP, notes, email, calendar) with owner-scoped authorization and prompt-injection hardening (`src/prompt_security.py`).
- **Out of scope:** Multi-tenant SaaS hosting for unrelated customers; fully sandboxed agent execution (shell/filesystem confinement is an acknowledged gap per `THREAT_MODEL.md`); replacing dedicated enterprise mail or calendaring suites at scale.

### P2 — Local model serving without terminal expertise

- **Who hurts:** Self-hosters with GPUs or modest CPUs who want to run open-weight models locally but struggle with download paths, quant selection, serve backends (Ollama, vLLM, llama.cpp, SGLang), Docker GPU passthrough, and remote SSH model hosts.
- **Pain today:** Model discovery is manual; VRAM/RAM fit is guesswork; serve jobs fail opaquely; Docker on macOS cannot use Metal GPU; container recreates wipe installed engines unless caches are persisted correctly.
- **How this repo answers:** The **Cookbook** subsystem (`routes/cookbook_routes.py`, `services/hwfit/`, `src/cookbook_serve_lifecycle.py`) scans hardware (`hwfit`), ranks models (`services/hwfit/data/hf_models.json`), downloads via HuggingFace, installs serve dependencies into persisted `data/local` and `data/huggingface` volumes, manages tmux-backed serve sessions, and probes endpoints. Docker Compose documents GPU overlay files (`docker-compose.gpu-nvidia.yml`, `docker-compose.gpu-amd.yml`) and helper scripts (`scripts/check-docker-gpu.sh`, `scripts/check-docker-amd-gpu.sh`). Settings UI exposes remote SSH server configuration with generated keys under `data/ssh/`.
- **Out of scope:** Training or fine-tuning models; guaranteed SGLang reliability across all platforms (called out as roadmap work in `ROADMAP.md`); managed cloud GPU provisioning.

### P3 — Safe external agent access to workspace data

- **Who hurts:** Users of Claude Code, Codex, or other agentic IDEs who want their coding agent to manage Odysseus todos, read email, update memory, or launch Cookbook serves — without handing over admin cookies, SQLite paths, or unrestricted shell.
- **Pain today:** Ad-hoc automation via raw database access or browser session hijacking breaks owner scoping and bypasses audit trails; agents confuse reminders (todos with due dates) with calendar events; integration docs are scattered.
- **How this repo answers:** Scoped **Codex/Claude Agent API** under `/api/codex/*` (`routes/codex_routes.py`) enforces per-token scopes (todos, email, memory, calendar, documents, cookbook). Integration skill packs ship in `integrations/claude/skills/odysseus/` and `integrations/codex/skills/odysseus/` with helper scripts and explicit safety rules (no SSH/SQLite bypass). API tokens are created in Settings → Integrations; capabilities are discoverable via `GET /api/codex/capabilities`. Agent migration from other systems uses a normalized `agent-migration.v1` manifest (`docs/agent-migration.md`, `scripts/agent_migration_manifest.py`).
- **Out of scope:** Replacing Odysseus's internal agent loop with an external agent runtime; unscoped public API access (auth is mandatory by default).

## 3. Product / idea

Odysseus is architected as a **single-process FastAPI server** (`app.py`) that orchestrates dozens of route modules, a large `src/` domain layer, and a vanilla JS frontend served from `static/`. The mental model is an **admin console for a private AI lab**: authenticated users chat with models (local or API), optionally enable agent mode with tools, and use adjacent productivity surfaces (email, calendar, documents) that the same agent can act on when privileges allow.

At startup, `app.py` wires middleware (CORS, gzip, security headers, request timeouts), initializes `AuthManager`, mounts ~40 routers, starts background schedulers (email pollers, scheduled tasks, cleanup), and serves HTML shell routes (`/`, `/notes`, `/calendar`, `/cookbook`, `/email`, etc.) that load feature-specific JS bundles.

**Bundled infrastructure (Docker Compose):** the default stack runs four services — the Odysseus app, ChromaDB (vectors), SearXNG (web search), and ntfy (notifications). Loopback-only port binds are the safe default; operators opt into LAN/Tailscale exposure via `APP_BIND` and related env vars.

**Agent execution path:** user message → `routes/chat_routes.py` → `src/chat_processor.py` / `src/agent_loop.py` → LLM via `src/llm_core.py` → tool dispatch via `src/tool_execution.py` and `src/tool_implementations.py` → admin-gated HTTP loopback for privileged tools (`core/middleware.py` internal token). Non-admin users are blocked from shell, MCP, email send, vault, and model serving per `core/auth.py` and `src/tool_security.py`.

**Research path:** `routes/research_routes.py` and `services/research/` run multi-step web research using SearXNG and optional provider APIs, producing sanitized HTML/Markdown reports (`src/visual_report.py`).

**Compare path:** blind side-by-side model evaluation with synthesis (`routes/compare_routes.py`).

### 3.1 North-star use cases

1. **Daily AI workspace:** Operator runs `docker compose up`, logs in, connects Ollama or an API key in Settings, chats with RAG over personal documents, and saves outputs to the built-in editor.
2. **Local model lab:** Operator uses Cookbook to scan GPU/RAM, download a recommended quant, serve via llama.cpp or vLLM in tmux, and point chat sessions at the new endpoint — persisting caches across container restarts.
3. **Agentic productivity:** Admin enables agent mode; the agent triages email, creates todos with due-date reminders (ntfy/browser), drafts calendar events, and updates memory — while external Claude Code uses a scoped token for the same data via `/api/codex/*`.
4. **Deep research:** User kicks off a research job that searches the web (SearXNG), reads sources, and generates a cited report without leaving the workspace.
5. **Migration:** User imports memories, skills, and archive documents from another agent via the `agent-migration.v1` manifest workflow.

### 3.2 Non-goals

- Public internet exposure without authentication (README and `THREAT_MODEL.md` frame Odysseus as a trusted-network admin console).
- Adding more UI themes (explicitly deprioritized in `ROADMAP.md`).
- Windows-native parity (CONTRIBUTING notes Windows is not actively tested; Docker on Linux or macOS manual install is preferred).
- Fully offline CDN-free frontend (roadmap mentions eventual vendor CDN asset bundling).
- Preventing admins from executing shell commands (by design for trusted admins; non-admins are restricted).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.11+ native; Python 3.14-slim in Docker | `docs/setup.md`, `Dockerfile`, `requirements.txt` |
| Web framework | FastAPI, Uvicorn, Starlette, Pydantic v2 | `app.py`, `requirements.txt` |
| Frontend | Vanilla HTML/CSS/JS (large monolithic `static/style.css`, feature modules under `static/js/`) | `static/`, `specs/architecture-runtime-inventory.md` |
| ORM / DB | SQLAlchemy; SQLite default (`sqlite:///./data/app.db`) | `core/database.py`, `.env.example`, `docker-compose.yml` |
| Vector / RAG | ChromaDB HTTP client, fastembed ONNX embeddings, keyword fallback | `requirements.txt`, `src/chroma_client.py`, `src/rag_manager.py` |
| Web search | SearXNG (bundled service) + optional Brave/Google/Tavily/Serper API keys | `docker-compose.yml`, `.env.example`, `services/search/` |
| Email | IMAP/SMTP (stdlib + custom handlers) | `routes/email_routes.py`, `routes/email_pollers.py` |
| Calendar | CalDAV sync, icalendar, python-dateutil recurrence | `src/caldav_sync.py`, `routes/calendar_routes.py` |
| Speech | TTS and STT services | `services/tts/`, `services/stt/`, `routes/tts_routes.py`, `routes/stt_routes.py` |
| Agents / tools | Custom agent loop, MCP client (`mcp` package), built-in MCP servers | `src/agent_loop.py`, `src/mcp_manager.py`, `mcp_servers/` |
| Auth | bcrypt sessions, TOTP 2FA, API tokens, scoped integration tokens | `core/auth.py`, `routes/auth_routes.py`, `THREAT_MODEL.md` |
| Notifications | ntfy (bundled), browser, email channels | `docker-compose.yml`, task/notes reminder flows |
| Containerization | Docker Compose multi-service; optional NVIDIA/AMD GPU overlays | `docker-compose.yml`, `docker-compose.gpu-*.yml`, `Dockerfile` |
| CI | GitHub Actions: compileall, node --check, pytest (informational), container scans | `.github/workflows/ci.yml`, `.github/workflows/docker-publish.yml` |
| Tests | pytest with area taxonomy markers | `pyproject.toml`, `tests/`, `tests/README.md` (referenced in pyproject) |
| License | AGPL-3.0-or-later | `LICENSE`, `README.md` |

### 4.1 Notable dependencies (curated)

- `fastapi` / `uvicorn` — HTTP server and ASGI runtime for the entire workspace.
- `SQLAlchemy` — persistence for sessions, documents, email accounts, calendar, tasks, memory, API tokens, webhooks, and more (`core/database.py`).
- `chromadb-client` + `fastembed` — vector memory/RAG with local embedding fallback when no HTTP embedding API is configured.
- `caldav` + `icalendar` — CalDAV discovery, sync, and ICS import/export.
- `mcp` — Model Context Protocol integration for extensible agent tools.
- `httpx` — outbound HTTP for LLM providers, web fetch, and provider probes.
- `nh3` — HTML sanitization for untrusted research report rendering.
- `pyotp` + `qrcode` — TOTP two-factor authentication setup.
- `youtube-transcript-api` — YouTube transcript ingestion for agent tools.
- `@anthropic-ai/sdk` (dev dep in `package.json`) — used in JS/tooling contexts; Python Anthropic usage is via HTTP in `src/llm_core.py`.
- `pypdf` — PDF text extraction for document/RAG pipelines.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `app.py` — FastAPI application orchestrator (~1,185 lines).
  - `launcher.py`, `start-macos.sh`, `launch-windows.ps1` — platform launch helpers.
  - `setup.py` — first-run directory and database initialization, admin user creation.
  - `docker/entrypoint.sh` — container privilege drop (PUID/PGID) and volume ownership repair.

- **HTTP adapters (`routes/`, 53 modules):** flat directory of route setup functions included from `app.py`. Major domains: `chat_routes`, `research_routes`, `email_routes`, `calendar_routes`, `cookbook_routes`, `model_routes`, `document_routes`, `memory_routes`, `skills_routes`, `task_routes`, `note_routes`, `gallery_routes`, `mcp_routes`, `webhook_routes`, `codex_routes` (scoped agent API), `auth_routes`, `vault_routes`, `compare_routes`, `backup_routes`, `diagnostics_routes`.

- **Domain / core (`src/`, ~109 files):** agent loop, tool implementations, LLM core, RAG, embeddings, memory vectors, chat processing, task scheduler, webhook manager, prompt security, cookbook lifecycle, CalDAV sync, document processing, research handlers. Subpackages: `src/agent_tools/` (document, filesystem, subprocess, web), `src/search/` (partial alias to `services/search/`).

- **Core infrastructure (`core/`, 10 files):** `database.py` (large SQLAlchemy models), `auth.py`, `middleware.py`, `session_manager.py`, `constants.py`, `atomic_io.py`.

- **Service modules (`services/`):** packaged subsystems — `search/`, `research/`, `memory/`, `tts/`, `stt/`, `shell/`, `youtube/`, `hwfit/`, `docs/`, `faces/`.

- **MCP servers (`mcp_servers/`):** standalone MCP processes for email, image generation, RAG, and memory (`email_server.py`, `image_gen_server.py`, `rag_server.py`, `memory_server.py`).

- **Companion bridge (`companion/`):** LAN client discovery and admin-gated pairing tokens for mobile/companion clients (`companion/README.md`).

- **Integrations (`integrations/`):** Claude and Codex skill packs with `SKILL.md` and `odysseus_api.py` helper scripts.

- **CLI scripts (`scripts/`):** `odysseus-*` family for mail, memory, cookbook, tasks, backup, calendar, etc.; GPU check scripts; `agent_migration_manifest.py`.

- **Frontend (`static/`):** `index.html`, monolithic `style.css` (~36k lines per architecture inventory), feature JS under `static/js/` (chat, email, notes, settings, document editor, etc.).

- **Configuration (`config/`):** SearXNG settings template (`config/searxng/settings.yml`).

- **Docs vaults:**
  - `docs/` — setup guide, security CI notes, backup/restore, email Outlook guide, agent migration spec, landing `index.html`.
  - `specs/` — architecture runtime inventory (planning baseline).
  - `THREAT_MODEL.md`, `SECURITY.md`, `ROADMAP.md`, `CONTRIBUTING.md` at repo root.
  - **`.docs/`** — not present in tree.
  - **`dev-docs/`**, **`docs/windows-port/`** — gitignored internal notes (not ingested).

- **Agent scaffolding:**
  - **`.claude/`** — listed in `.gitignore` (line 44); not present in clone; operators may maintain local agent instructions outside version control.
  - `integrations/claude/skills/odysseus/SKILL.md` — shipped Claude Code skill with scoped API rules.
  - `integrations/codex/skills/odysseus/SKILL.md` — Codex plugin skill counterpart.

- **Generated / vendor / ignored:** `data/`, `logs/`, `node_modules/`, `venv/`, `*.db`, media uploads, `reports/`, `tasks/`, `.playwright-mcp/` — existence noted; contents not ingested per `.gitignore`.

## 6. Configuration & contracts (no secrets)

Environment variables are documented in `.env.example` (names and purpose only). Key groups:

| Group | Representative vars | Purpose |
|-------|---------------------|---------|
| LLM | `LLM_HOST`, `LLM_HOSTS`, `OLLAMA_BASE_URL`, `OPENAI_API_KEY`, `RESEARCH_LLM_ENDPOINT`, `LLM_CA_BUNDLE` | Model discovery, API keys, custom TLS roots |
| Search | `SEARXNG_INSTANCE`, `SEARXNG_SECRET`, `DATA_BRAVE_API_KEY`, `GOOGLE_API_KEY`, `TAVILY_API_KEY`, `SERPER_API_KEY` | Self-hosted and optional external search providers |
| Database | `DATABASE_URL` | SQLite path (default `sqlite:///./data/app.db`) |
| Auth | `AUTH_ENABLED`, `LOCALHOST_BYPASS`, `SECURE_COOKIES`, `ODYSSEUS_ADMIN_USER`, `ODYSSEUS_ADMIN_PASSWORD`, `ALLOWED_ORIGINS` | Session security and first-boot admin |
| Bind / ports | `APP_BIND`, `APP_PORT` | Docker host binding (loopback default) |
| Vectors | `CHROMADB_HOST`, `CHROMADB_PORT`, `CHROMADB_BIND`, `EMBEDDING_URL`, `EMBEDDING_MODEL`, `FASTEMBED_MODEL`, `FASTEMBED_CACHE_PATH` | ChromaDB and embedding lanes |
| Data paths | `APP_DATA_DIR`, `APP_LOGS_DIR`, `ODYSSEUS_DATA_DIR` | Persist settings, DB, uploads, caches |
| Upload caps | `ODYSSEUS_CHAT_UPLOAD_MAX_BYTES`, `ODYSSEUS_GALLERY_UPLOAD_MAX_BYTES`, etc. | Per-feature size limits validated at startup |
| Schedulers | `ODYSSEUS_INPROCESS_POLLERS`, `ODYSSEUS_INPROCESS_TASKS`, `ODYSSEUS_SCRIPT_HOST` | Email polling and scheduled task execution |
| GPU Compose | `COMPOSE_FILE`, `RENDER_GID` | Optional NVIDIA/AMD GPU overlay selection |
| Notifications | `NTFY_BIND`, `NTFY_BASE_URL` | ntfy service exposure |
| Timeouts | `REQUEST_HARD_TIMEOUT` | Default 45s handler timeout (streaming routes exempt) |

SOPS workflow: encrypted `secrets.env` may be committable per `.gitignore` comments; plaintext `secrets.env.*` variants are ignored.

Docker Compose wires internal service hostnames (`chromadb`, `searxng`, `ntfy`) and maps host ports on loopback by default.

### 6.1 HTTP / API endpoints (when applicable)

Odysseus exposes a large REST + SSE surface. Below is a curated map of major route prefixes; individual routers define dozens of sub-routes.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/health` | Liveness probe | none |
| `GET` | `/api/ready` | Readiness (dependencies) | none |
| `GET` | `/api/version` | App version metadata | none |
| `GET` | `/api/runtime` | Runtime diagnostics | session |
| `POST` | `/api/auth/login` | Password login (+ 2FA flow) | none |
| `POST` | `/api/auth/logout` | End session | session cookie |
| `GET` | `/api/auth/status` | Current auth state | session |
| `POST` | `/api/auth/setup` | First-run admin setup | setup gate |
| `POST` | `/api/chat` | Non-streaming chat | session |
| `POST` | `/api/chat_stream` | Streaming chat (SSE) | session |
| `GET` | `/api/chat/resume/{session_id}` | Resume interrupted stream | session |
| `POST` | `/api/chat/stop/{session_id}` | Stop active generation | session |
| `GET` | `/api/sessions` | List chat sessions | session (owner-scoped) |
| `POST` | `/api/research` | Deep research jobs | session |
| `GET` | `/api/models` | List discovered models | session |
| `GET` | `/api/model-endpoints` | Configured LLM endpoints | session |
| `POST` | `/api/model-endpoints` | Add/update endpoint | admin |
| `GET` | `/api/cookbook/*` | Hardware scan, download, serve, presets | admin for serve/setup |
| `GET` | `/api/memory` | List memories | session (owner) |
| `POST` | `/api/skills/*` | Skill CRUD, invoke, audit | session |
| `GET` | `/api/notes` | Notes and todos | session |
| `GET` | `/api/email/*` | IMAP inbox, send, triage | admin |
| `GET` | `/api/calendar/*` | Events, CalDAV sync | admin for write |
| `POST` | `/api/upload` | File uploads (chat, gallery, etc.) | session |
| `GET` | `/api/tasks` | Scheduled agent tasks | session |
| `POST` | `/api/shell/stream` | Shell command SSE (admin) | admin |
| `GET` | `/api/mcp/*` | MCP server registry and OAuth | admin |
| `GET` | `/api/webhooks` | Outbound webhook config | admin |
| `POST` | `/api/v1/chat` | OpenAI-compatible webhook chat | API token |
| `GET` | `/api/codex/capabilities` | Scoped agent capability flags | integration token |
| `GET` | `/api/codex/todos` | Agent todo read | token scope `todos:read` |
| `POST` | `/api/codex/todos` | Agent todo write | token scope `todos:write` |
| `GET` | `/api/codex/emails` | Agent email read | token scope `email:read` |
| `GET` | `/api/codex/memory` | Agent memory read | token scope `memory:read` |
| `POST` | `/api/codex/cookbook/serve` | Agent launch model serve | token scope `cookbook:launch` |
| `GET` | `/api/companion/ping` | Companion health | session or token |
| `POST` | `/api/companion/pair` | Mint pairing token | admin cookie |
| `GET` | `/` | Main chat UI shell | session (or login redirect) |

HTML shell routes (`/notes`, `/calendar`, `/cookbook`, `/email`, `/memory`, `/gallery`, `/tasks`, `/library`, `/login`) serve SPA-like pages backed by static JS.

Auth routes are mounted under `/api/auth/*` via `routes/auth_routes.py` (login, signup, 2FA, user management, settings, integrations).

### 6.2 Other interfaces

- **CLI (`scripts/odysseus*`)**: mail polling, memory import, cookbook control, backup/restore, task management, session export — intended for cron/systemd alongside or instead of in-process pollers.
- **MCP servers (`mcp_servers/`)**: email, RAG, memory, image generation — launched as separate processes and registered in Settings.
- **Integration helper scripts**: `integrations/claude/skills/odysseus/scripts/odysseus_api.py` and Codex counterpart — thin HTTP clients for scoped `/api/codex/*` calls.
- **systemd unit**: `odysseus-ui.service` example unit file for native Linux installs.
- **macOS app**: `build-macos-app.sh` / `Odysseus.spec` for clickable wrapper.
- **Webhooks**: `POST /api/v1/chat` OpenAI-compatible ingress for external automations (token-scoped; SSRF on `base_url` is a known gap per `THREAT_MODEL.md`).
- **Device flow**: `routes/device_flow.py` for OAuth-style device authorization where applicable.

## 7. Data & persistence

**Primary store:** SQLite database at `data/app.db` (configurable via `DATABASE_URL`). SQLAlchemy models in `core/database.py` include, among others: `Session`, `ChatMessage`, `Document`, `DocumentVersion`, `GalleryAlbum`, `GalleryImage`, `EmailAccount`, `ModelEndpoint`, `McpServer`, `ApiToken`, `Webhook`, `ScheduledTask`, `TaskRun`, `Memory`, `Note`, `CalendarCal`, `CalendarEvent`, `EditorDraft`, `Integration`, `Comparison`, `Signature`, `UserTool`.

**File-based state:** `data/sessions.json` (auth sessions, atomic writes via `core/atomic_io.py`), `data/auth.json` (user records), cookbook state files, upload directories, TTS cache, generated images, deep research output folders — paths centralized in `src/constants.py` and created by `setup.py`.

**Vector store:** ChromaDB service (Docker) with client in `src/chroma_client.py`; memory vectors and RAG collections under `data/` subtrees (`CHROMA_DIR`, `RAG_DIR`, `MEMORY_VECTORS_DIR`).

**Search cache:** `services/search/cache.py` with on-disk cache under `services/cache/search` (gitignored runtime data).

**Topology:** Default deployment is **single-host**: app + SQLite + ChromaDB + SearXNG + ntfy on one machine (Docker Compose or native). Cookbook can target **remote SSH hosts** for model download/serve while the UI stays on the operator's machine. No built-in multi-node HA; backup/restore is operator-driven (`docs/backup-restore.md`, `routes/backup_routes.py`).

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **Root README** (`README.md`) — product pitch, quick start, feature list, security framing, AGPL license.
2. **Setup guide** (`docs/setup.md`) — Docker/native/macOS install paths, GPU overlays, Cookbook storage, security bind notes.
3. **Roadmap** (`ROADMAP.md`) — high-priority bugs, Cookbook reliability, agent prompt bloat, email performance, provider audits, refactor targets.
4. **Threat model** (`THREAT_MODEL.md`) — trust boundary, role capabilities, internal tool loopback, prompt-injection policy, known security gaps.
5. **Contributing** (`CONTRIBUTING.md`) — branch model (`dev` vs `main`), PR expectations, test commands.
6. **Agent migration** (`docs/agent-migration.md`) — `agent-migration.v1` manifest schema and safe import philosophy.
7. **Architecture inventory** (`specs/architecture-runtime-inventory.md`) — module sizes, import graph risks, refactor guidance.
8. **Companion bridge** (`companion/README.md`) — LAN pairing API and CSRF posture.
9. **Claude integration skill** (`integrations/claude/skills/odysseus/SKILL.md`) — scoped API rules, reminder vs calendar guidance, helper script usage.
10. **Security** (`SECURITY.md`) — vulnerability reporting (referenced; high-level posture aligned with threat model).
11. **Backup/restore** (`docs/backup-restore.md`) — data directory backup semantics (listed in docs tree).
12. **Environment template** (`.env.example`) — configuration contract names only.

**`.claude/` scan:** Present in `.gitignore` as an ignored path; **not present in the cloned tree**. Per gitignore rules, local agent instruction trees are out of repo scope; shipped agent guidance lives under `integrations/*/skills/`.

**`.docs/` scan:** **Not found** in repository tree.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public AGPL project; all user data stays on the operator's machine under `data/` (explicitly gitignored). This summary contains no secrets, tokens, or `.env` values.
- **Auth model:** Session cookies (bcrypt passwords, 7-day tokens), optional TOTP 2FA with backup codes, API tokens for webhooks and integrations, admin vs non-admin privilege separation. `AUTH_ENABLED=true` by default; `LOCALHOST_BYPASS` is dev-only.
- **Trust boundary:** Designed for trusted users on a private network — admins can run shell, read/write files, send email, and control model serving. Non-admins are restricted via `DEFAULT_PRIVILEGES` and `NON_ADMIN_BLOCKED_TOOLS`.
- **Prompt injection:** Untrusted content (web results, email, memories, skills) must pass through `src/prompt_security.py` wrappers; direct system-role injection is treated as a security bug.
- **Network exposure:** Default Docker binds services to loopback; exposing to LAN or Tailscale requires explicit `APP_BIND` / `NTFY_BIND` changes with auth enforced.
- **Known gaps (from threat model):** No shell/filesystem sandbox; SSRF risk on webhook `base_url` parameter; partial search module consolidation. Container scanning and secret scanning run in CI (`.github/workflows/`).

## 10. Operational picture

**Local development (Docker — recommended):**
```bash
cp .env.example .env
docker compose up -d --build
```
Default UI port 7000 on loopback; first admin password printed in container logs.

**Local development (native):**
```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python setup.py
python -m uvicorn app:app --host 127.0.0.1 --port 7000
```

**macOS GPU path:** `./start-macos.sh` (native, port 7860 default) — Docker cannot use Metal GPU.

**Tests:** `python -m pytest` (large suite; CI runs with `continue-on-error: true` pending flake stabilization). JS syntax: `node --check static/js/<file>.js`.

**Deploy:** Primary distribution is self-hosted Docker Compose or native install; GitHub Actions publishes container images (`.github/workflows/docker-publish.yml`). Repology tracks packaging as `odysseus-ai`. kodexArg fork tracks `dev` branch with upstream to `arcahyadi/odysseus`.

**Hardware:** Cookbook benefits from NVIDIA/AMD GPU with Docker passthrough or native macOS/Linux serve; CPU-only operation supported via API providers or small local models. tmux required for background Cookbook jobs.

**Maintenance scripts:** `scripts/odysseus-backup`, `scripts/update_database.py`, `scripts/odysseus-mail poll-scheduled` for operational tasks.

## 11. Open questions / unknowns

- Exact divergence between `kodexArg/odysseus` and upstream `arcahyadi/odysseus` / `pewdiepie-archdaemon/odysseus` — clone shows both remotes; README links still reference upstream maintainer repos.
- Contents of operator-local `.claude/` trees — gitignored; any conventions there are not versioned.
- Whether `.docs/` hidden vault is planned or used only in private forks — absent from this tree.
- Full OpenAPI spec — not found as a single artifact; endpoint inventory derived from route modules.
- Production hardening checklist for internet-facing reverse-proxy deployments beyond README security notes — partially documented in `docs/setup.md` security section; operator-specific TLS termination patterns unknown.
- CI pytest suite stability — marked informational in workflow; full green status unknown without running the entire suite in this environment.
- Windows portable build maturity — `build-windows-portable.ps1` and `update_windows.bat` exist; CONTRIBUTING states Windows is not actively tested.
