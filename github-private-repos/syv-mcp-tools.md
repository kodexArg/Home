---
id: "syv-mcp-tools"
title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor"
visibility: private
importance: normal
source_repo: "syv-mcp-tools"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "library"
status: "active"
related: []
tags: ["syv", "subordinacion-y-valor", "mcp", "markdown", "yaml-frontmatter", "metadata-validation", "python", "fastmcp", "sse", "agents", "documentation"]
problems_solved:
  - "Collaborators and AI agents editing SyV Markdown vault files need automated enforcement of the project's Spanish YAML frontmatter schema — manual review does not scale across thousands of lore documents."
  - "Cursor and other MCP-capable agents lack a machine-readable contract to validate and extract SyV metadata fields (titulo, carpeta, descripcion, tags, personaje fields) without re-implementing parsing rules in every session."
  - "One-off maintenance tasks on the SyV corpus (index regeneration, deprecated tag removal) require small, focused scripts that live alongside the MCP server rather than polluting the main lore repository."
technologies:
  - "Python 3.12+"
  - "MCP (Model Context Protocol) via FastMCP"
  - "Pydantic 2"
  - "uv (package manager)"
  - "SSE transport (Server-Sent Events)"
  - "FastAPI / Uvicorn (transitive MCP stack deps)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# SyV MCP Tools

> **Problem thesis (required):** The Subordinación y Valor (SyV) project maintains a large Markdown documentation vault with strict Spanish YAML frontmatter conventions. Human editors and AI agents routinely introduce metadata drift — wrong field order, English keys, missing required fields, malformed list blocks. This repository provides an MCP server that exposes **validate** and **extract** tools so agents can check files against the SyV metadata guide before committing changes, plus auxiliary maintenance scripts for index generation and tag cleanup.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-mcp-tools` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | MCP server with tools for validating and extracting YAML frontmatter metadata from SyV Markdown files. |
| Audience | SyV project collaborators, AI coding agents (Cursor, Claude Desktop, Grok) connected via MCP, and maintainers of the parent SyV lore repository. |

## 2. Problems it solves

### P1 — Enforcing SyV Markdown metadata schema at edit time

- **Who hurts:** SyV writers, lore editors, and AI agents generating or refactoring Markdown files across the six top-level content zones (`0_proyecto` through `5_aventuras`).
- **Pain today:** The SyV metadata guide (`0_proyecto/guias-para-colaboradores/guia-de-metadatos.md` in the parent repo) defines precise rules — Spanish field names, strict field ordering, vertical list syntax for `tags`/`facciones`/`spoilers`, conditional personaje fields — but nothing prevents non-compliant frontmatter from landing in the vault. Manual review is slow and inconsistent.
- **How this repo answers:** The `validar_metadatos_markdown` MCP tool runs a deterministic validator (`tools.py`) that checks file existence, YAML frontmatter presence, key casing, field order, required fields (`titulo`, `carpeta`, `descripcion`), list formatting, and personaje-specific conditional rules. Returns structured JSON with `status` (bool) and `message` (error detail on failure).
- **Out of scope:** Does not validate Markdown body content, internal links, spoiler policy in prose, or render/publish pipelines. Does not modify files — read-only validation.

### P2 — Machine-readable metadata extraction for agents

- **Who hurts:** AI agents that need to read SyV document metadata (title, folder, tags, region, character factions) to make routing or summarization decisions without parsing YAML themselves.
- **Pain today:** Each agent session would need to re-implement frontmatter parsing, list handling, and validation logic — error-prone and wasteful of context tokens.
- **How this repo answers:** The `obtener_metadatos_markdown` MCP tool validates first, then parses frontmatter into a JSON dictionary with properly typed list fields. Agents call one tool and receive structured metadata or a clear error.
- **Out of scope:** Does not query a database or search index; operates on a single file path at a time. No batch operations via MCP (though CLI supports single-file mode).

### P3 — Corpus maintenance utilities alongside the MCP server

- **Who hurts:** SyV maintainers performing structural housekeeping — rebuilding the vault index, removing deprecated frontmatter keys.
- **Pain today:** These one-shot tasks don't belong in the main lore repo but need to live somewhere versioned and discoverable.
- **How this repo answers:** Ships `regenerar_indice.py` (walks SyV zone directories and writes `indice.yaml`), `one-shot-remove-tag.py` (strips deprecated `tag:` lines from all Markdown files), and `reverse_logger.py` (prepends timestamped lines to `mcp_server.log` for debugging MCP traffic).
- **Out of scope:** Not integrated into MCP tool surface; run manually from CLI. `regenerar_indice.py` expects to run from within the parent SyV repo tree (uses `BASE_DIR` two levels up from script location).

## 3. Product / idea

The central idea is a **thin MCP adapter** over a pure-Python metadata validation library:

```
Agent (Cursor / Claude / Grok)
        │
        ▼  MCP over SSE (localhost:8000/sse)
   mcp_server.py  ──►  FastMCP("SyV Project Tools")
        │
        ├── validar_metadatos_markdown(path) ──► tools.validar_metadatos()
        └── obtener_metadatos_markdown(path) ──► tools.obtener_metadatos()
                              │
                              ▼
                    YAML frontmatter parser + rule engine
                              │
                              ▼
                    SyV *.md files on local filesystem
```

The validator encodes the SyV metadata contract as code: ten ordered fields (`titulo` → `spoilers`), three list-type fields requiring vertical `- item` syntax, prohibition of English keys (`layout`, `title`, `date`), and personaje detection logic (presence of `nombre` or `facciones` triggers both being required). This is the same ruleset documented in the parent project's metadata guide, but executable.

### 3.1 North-star use cases

1. **Agent pre-commit check:** Before saving a SyV Markdown file, an MCP-connected agent calls `validar_metadatos_markdown` with the file path; on `status: false`, reads `message` and fixes the specific line/format error.
2. **Metadata-aware navigation:** An agent calls `obtener_metadatos_markdown` to learn a document's `carpeta`, `tags`, and `region` before deciding how to cross-link or summarize it.
3. **Operator debugging:** Maintainer runs `mcp_server.bat` (Windows) or `uv run mcp_server.py`, pipes stderr through `reverse_logger.py` to capture reverse-chronological MCP traffic in `mcp_server.log`.

### 3.2 Non-goals

- Not a web CMS, static site generator, or publishing pipeline for SyV content.
- Not a search engine or vector index over the vault.
- Not a general-purpose Markdown linter (no heading hierarchy, link checking, or spell check).
- Does not use the Anthropic API at runtime despite listing `anthropic` and `pydantic-ai` as dependencies — those packages are declared in `pyproject.toml` but not imported in current source (possible future AI-assisted validation or leftover planning).
- No `.claude/`, `.docs/`, or `docs/` vault in this repo — agent instructions live in the parent SyV project.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python ≥3.12 | `pyproject.toml` `requires-python` |
| Package manager | uv | `pyproject.toml` `[tool.uv]`, `uv.lock`, `mcp_server.bat` uses `uv run` |
| MCP framework | FastMCP (`mcp` ≥1.22) | `mcp_server.py` imports `mcp.server.fastmcp` |
| Validation models | Pydantic 2 (`BaseModel`) | `tools.py` `ModeloSalida` |
| Transport | SSE (Server-Sent Events) on port 8000 | `mcp_server.py` `mcp.run(transport="sse")`, `mcp_server.bat` |
| HTTP stack (transitive) | FastAPI ≥0.110, Uvicorn | `pyproject.toml` deps (pulled by MCP SSE stack) |
| AI SDK (declared, unused) | anthropic ≥0.75, pydantic-ai ≥1.26 | `pyproject.toml` only — no imports in `*.py` |
| Config | python-dotenv (declared) | `pyproject.toml`; README mentions `.env` with `ANTHROPIC_API_KEY` but no dotenv usage in source |
| Tests | None evident | No `tests/` directory or test configs in tree |
| CI / deploy | None evident | No `.github/workflows/`, Dockerfile, or IaC |

### 4.1 Notable dependencies (curated)

- `mcp` — Official Model Context Protocol Python SDK; provides `FastMCP` decorator-based tool registration and SSE transport.
- `pydantic` — Structured output model for validation results (`status` + `message` JSON schema).
- `fastapi` / `uvicorn` — HTTP layer underlying MCP SSE transport (not directly authored in this repo).
- `anthropic` / `pydantic-ai` — Declared but not used in current codebase; README references Anthropic API key in `.env` suggesting planned or removed AI integration.

## 5. Repository map (abstraction)

Small, flat Python repo with no package subdirectories:

- **Entrypoints:**
  - `mcp_server.py` — MCP server main; registers two tools, runs SSE on `__main__`.
  - `mcp_server.bat` — Windows launcher: clears `__pycache__` and log, runs `uv run mcp_server.py`, redirects output to `mcp_server.log`.
  - `tools.py` — CLI mode (`python tools.py <path>`) for local validate+extract without MCP.

- **Domain / core:**
  - `tools.py` — All metadata validation and parsing logic (~270 lines). Functions: `validar_metadatos`, `obtener_metadatos`, `validar_contenido_metadatos`, helpers for list/key/order checks.

- **Maintenance scripts (not MCP-exposed):**
  - `regenerar_indice.py` — Recursively walks SyV zone dirs, emits `indice.yaml` at parent repo root.
  - `one-shot-remove-tag.py` — Walks CWD tree, strips lines starting with `tag:` from all `.md` files.
  - `reverse_logger.py` — Stdin-to-log utility; prepends timestamped entries to `mcp_server.log`.

- **Docs vaults:** None present. No `docs/`, `.docs/`, or ADR directories.

- **Agent scaffolding:** None present. No `.claude/`, `.agents/`, `SKILL.md`, or `AGENTS.md` in this repo. Agent integration is via MCP protocol only.

- **Generated / vendor:** `uv.lock` (lockfile — not ingested). `__pycache__/` gitignored. `mcp_server.log` gitignored at runtime.

## 6. Configuration & contracts (no secrets)

### Environment variables

| Variable | Purpose | Used in code? |
|----------|---------|---------------|
| `ANTHROPIC_API_KEY` | Anthropic API authentication | Declared in README `.env` example only — **not referenced in source** |

No other env vars documented or used. `.env` is gitignored.

### MCP tool contracts

#### `validar_metadatos_markdown`

- **Input:** `ruta_archivo` (str) — absolute or relative path to a `.md` file.
- **Output:** JSON string with `{ "status": bool, "message": str }`.
- **Behavior:** Returns `status: false` with specific Spanish error message on any validation failure; `status: true` with `message: "metadatos correctos"` on pass.

#### `obtener_metadatos_markdown`

- **Input:** `ruta_archivo` (str).
- **Output:** JSON string — on success, dict with parsed fields (`titulo`, `slug`, `carpeta`, `descripcion`, `tags`[], `region`, `fecha`, `nombre`, `facciones`[], `spoilers`[] as applicable). On failure, `{ "error": "<message>" }`.

### Metadata schema (encoded in `tools.py`)

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `titulo` | yes | string | Must be first field |
| `slug` | no | string | After titulo |
| `carpeta` | yes | string | |
| `descripcion` | yes | string | |
| `tags` | no | vertical list | Empty value after `:`, items as `  - item` |
| `region` | no | string | |
| `fecha` | no | string | |
| `nombre` | conditional | string | Required if personaje (with `facciones`) |
| `facciones` | conditional | vertical list | Required if personaje (with `nombre`) |
| `spoilers` | no | vertical list | |

**Prohibited keys:** `layout`, `title`, `date` (English equivalents).
**Key format:** lowercase only; space required after colon.

### 6.1 HTTP / API endpoints (when applicable)

The MCP server exposes an **SSE transport endpoint**, not a REST API:

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/sse` | MCP Server-Sent Events transport (FastMCP default) | none (localhost only) |

No REST routes, OpenAPI spec, or Django/FastAPI routers authored in this repo. The FastAPI/Uvicorn stack serves MCP protocol over SSE only. Default port: 8000 (per `mcp_server.bat` echo message).

### 6.2 Other interfaces

- **MCP tools:** `validar_metadatos_markdown`, `obtener_metadatos_markdown` (primary interface).
- **CLI:** `python tools.py <ruta_archivo>` — validates then prints metadata JSON to stdout; exits 1 on failure.
- **CLI (maintenance):** `python regenerar_indice.py`, `python one-shot-remove-tag.py` — run from appropriate working directory.
- **Stdin pipe:** `reverse_logger.py` — accepts stdin lines, writes reverse-chronological log.

## 7. Data & persistence

- **No database.** All operations are filesystem reads against Markdown files passed by path.
- **No vector store, KV, or object storage.**
- **Ephemeral log:** `mcp_server.log` written at runtime by `mcp_server.bat` redirect or `reverse_logger.py`; gitignored.
- **Index output:** `regenerar_indice.py` writes `indice.yaml` to the parent SyV repo root (two directories above the script) — a YAML tree mapping zone directories to slug lists. This script is designed to run from within the SyV monorepo layout, not standalone.
- **Topology:** Purely local — agent → localhost MCP SSE → local filesystem paths. No edge or cloud deployment evident.

## 8. Docs & agent memory (required scan)

Sources scanned and evidence:

1. **`README.md`** — Primary documentation. Describes two MCP tools, installation via `uv sync`, `.env` setup (ANTHROPIC_API_KEY), usage commands, dependency list, and link to parent SyV project. Written in Spanish.
2. **`pyproject.toml`** — Project metadata (name: `scripts`, version 0.1.0), Python version constraint, full dependency list.
3. **`tools.py` module docstring** — Documents function signatures and the metadata validation contract inline.
4. **`mcp_server.py` tool docstrings** — MCP tool descriptions exposed to connected agents.

**Not found (scanned, absent):**

- `.claude/` — does not exist in repo.
- `.docs/` — does not exist in repo.
- `docs/` — does not exist in repo.
- ADR / PRD / constitution files — none.
- `AGENTS.md` / `SKILL.md` — none.

Agent integration relies entirely on MCP tool docstrings and the README. Parent project metadata rules are referenced by path (`0_proyecto/guias-para-colaboradores/guia-de-metadatos.md`) but that file lives in the separate SyV repository, not cloned here.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg` org. Summary contains no clone URLs or credentials.
- **Auth model:** MCP SSE server binds to localhost with no authentication layer — intended for local dev/agent use only. Not suitable for internet exposure without additional auth.
- **Secrets:** README documents `ANTHROPIC_API_KEY` in `.env` but current code does not load or use it. `.env` is gitignored. This summary contains no secrets, tokens, or connection strings.
- **Filesystem access:** MCP tools accept arbitrary file paths — an agent with MCP access can validate/read any `.md` file the OS user can read. No sandboxing.
- **Maintenance scripts:** `one-shot-remove-tag.py` modifies files in place (destructive write). Should be run with care and version control.

## 10. Operational picture

### Local development

```bash
uv sync                    # install dependencies
uv run mcp_server.py       # start MCP SSE server
python tools.py <path.md>  # CLI validate + extract
```

Windows: `mcp_server.bat` handles cleanup and launches via `uv run`.

### Deployment

No CI/CD, Docker, or cloud deployment configuration found. This is a local MCP server meant to be configured in an agent's MCP settings (e.g., Cursor `mcp.json`) pointing to the SSE endpoint.

### Parent repo relationship

Designed as a satellite tool for the SyV project (`kodexArg/syv`). `regenerar_indice.py` hardcodes SyV zone directory names and expects the parent repo layout. The MCP validator references the parent project's metadata guide path as documentation context but does not fetch or embed that guide — rules are hardcoded in `tools.py`.

### Hardware constraints

None. Lightweight Python process; no GPU or special hardware requirements.

## 11. Open questions / unknowns

- **Why are `anthropic`, `pydantic-ai`, `fastapi`, and `python-dotenv` declared but unused?** Possible planned AI-assisted metadata suggestions or removed feature. README still mentions `ANTHROPIC_API_KEY`.
- **Is the metadata rule set in `tools.py` kept in sync with `guia-de-metadatos.md`?** No automated sync mechanism; drift risk if the parent guide evolves independently.
- **`regenerar_indice.py` BASE_DIR logic** assumes the script lives two levels below the SyV repo root — unclear if this repo is always checked out as a subdirectory of `syv` or standalone.
- **No tests** — validation logic has no pytest/unittest coverage in tree.
- **No CI** — no automated lint, type check, or MCP protocol compliance tests.
- **Transport hardening** — SSE on localhost:8000 with no TLS or auth; production deployment pattern unknown.
- **`.claude/` / `.docs/`** — confirmed absent; agent conventions for this repo itself are undocumented beyond MCP tool docstrings.
