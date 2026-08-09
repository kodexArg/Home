---
id: "engram"
title: "engram — persistent memory for AI coding agents"
visibility: public
importance: normal
source_repo: "engram"
org: "kodexArg"
default_branch: "main"
primary_language: "Go"
repo_kind: "application"
status: "active"
related: []
tags: ["go", "sqlite", "fts5", "mcp", "ai-agents", "persistent-memory", "bubbletea", "cli", "tui", "agent-agnostic", "coding-agents", "memory-protocol", "git-sync", "obsidian", "mit"]
problems_solved:
  - "AI coding agents lose all session context when a chat ends, compaction runs, or a new IDE session starts — forcing users to re-explain architecture, bugs, and decisions."
  - "Existing agent memory tools (e.g. claude-mem) lock to one agent runtime and require heavy multi-process infrastructure (Node, Python, vector DB workers) instead of a portable single binary."
  - "Raw tool-call firehoses pollute memory with noise; agents need curated, searchable structured observations with deduplication, topic upserts, and progressive disclosure to stay token-efficient."
technologies:
  - "Go 1.25"
  - "SQLite + FTS5 (modernc.org/sqlite, pure Go)"
  - "MCP stdio server (mark3labs/mcp-go)"
  - "Charmbracelet Bubbletea / Lipgloss / Bubbles TUI"
  - "HTTP JSON REST API (stdlib net/http)"
  - "templ (server-rendered UI fragments)"
  - "GitHub Actions CI + GoReleaser cross-platform builds"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# engram

> **Problem thesis (required):** kodexArg/engram gives AI coding agents a **persistent, local-first memory layer** that survives session boundaries, compaction, and machine changes. A single Go binary stores agent-curated observations (decisions, bugfixes, patterns) in SQLite with FTS5 full-text search, exposed through MCP stdio, a REST HTTP API, CLI, and Bubbletea TUI. The design is deliberately **agent-agnostic** — Claude Code, OpenCode, Gemini CLI, Codex, VS Code, Cursor, Windsurf, and any MCP-capable runtime can share the same `~/.engram/engram.db` without Node, Python, ChromaDB, or a dedicated worker fleet.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/engram` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Agent-agnostic persistent memory — one Go binary, SQLite + FTS5, MCP + HTTP + CLI + TUI. |
| Audience | Developers using AI coding agents; agent plugin authors; contributors maintaining Engram itself; operators who want local-first memory with optional git-based sync across machines. |

## 2. Problems it solves

### P1 — Session amnesia for coding agents

- **Who hurts:** Developers pair-programming with Claude Code, Cursor, OpenCode, Codex, Gemini CLI, and other agents; anyone whose agent forgets prior architecture decisions after compaction or a new chat.
- **Pain today:** Context windows reset. The agent re-discovers the same bugs, re-debates the same tradeoffs, and cannot recall what the user already decided last Tuesday. Manual `CLAUDE.md` notes are static and do not capture session-specific learnings.
- **How this repo answers:** Agents call MCP tools (`mem_save`, `mem_session_summary`, `mem_context`, `mem_search`) to persist structured observations and end-of-session summaries. On the next session, `mem_context` and progressive disclosure (`mem_search` → `mem_timeline` → `mem_get_observation`) inject relevant prior work. Plugins add compaction-recovery hooks so memory discipline survives context resets.
- **Out of scope:** Replacing the agent's live working context, real-time collaborative editing of memories by humans, or cloud-hosted team knowledge bases without local SQLite as source of truth.

### P2 — Agent lock-in and infrastructure bloat in memory tools

- **Who hurts:** Multi-agent users, contributors who want MIT licensing, and operators who refuse to run Node + Python + vector DB sidecars for memory.
- **Pain today:** Tools like claude-mem target Claude Code hooks, require multiple runtimes, run worker services and ChromaDB, and auto-capture raw tool calls that need a separate compression pipeline (extra API cost and latency).
- **How this repo answers:** Engram is a **single CGO-free Go binary** (`go install` or release tarball). Search uses built-in SQLite FTS5 — no vector database process. Memory is **agent-curated** at save time (the agent already has the LLM context). MCP stdio works with any compatible agent; thin adapter plugins exist for OpenCode and Claude Code only.
- **Out of scope:** Semantic embedding search, automatic capture of every tool invocation, or AGPL-licensed hosted memory SaaS.

### P3 — Memory hygiene, deduplication, and token-efficient recall

- **Who hurts:** Power users with hundreds of observations across projects; agents that would otherwise dump entire memory dumps into prompts.
- **Pain today:** Duplicate saves clutter the store; evolving topics (e.g. auth architecture) spawn many near-duplicate rows; naive recall blows the context budget.
- **How this repo answers:** `topic_key` upserts merge evolving topics (`revision_count` increments). Exact dedupe via normalized hash + project + scope + type + title within a rolling window. Soft-delete by default (`deleted_at`). Progressive disclosure: compact search hits (~100 tokens each), timeline drill-in, then full observation fetch. `scope` supports `project` vs `personal` partitioning.
- **Out of scope:** Automatic merging of semantically similar but differently keyed memories; human-facing wiki editing inside the TUI beyond browse/search.

## 3. Product / idea

Engram is the **memory engine**; agents and thin plugins are **clients**. The mental model:

```
Agent (any MCP runtime)
    ↓ MCP stdio  OR  HTTP REST  OR  CLI
Engram Go binary (cmd/engram)
    ↓
SQLite + FTS5  (~/.engram/engram.db)
    ↓ optional
Git sync chunks (.engram/ in repo)  OR  Obsidian markdown export (beta)
```

After significant work, the **agent** (not a background compressor) calls `mem_save` with structured What/Why/Where/Learned content. Sessions are registered (`mem_session_start` / `mem_session_end`) and summarized at closure. Retrieval is search-first, then timeline, then full observation — never a full DB dump.

Six user-facing surfaces share one `internal/store` package:

1. **CLI** — `engram search`, `save`, `context`, `sync`, `projects`, etc.
2. **HTTP API** — JSON REST on loopback port 7437 for plugins (OpenCode session tracking).
3. **MCP server** — stdio transport; 15 tools for agent tool calls.
4. **TUI** — `engram tui` Bubbletea browser (Catppuccin Mocha, vim keys).
5. **Setup/installer** — `engram setup [agent]` embeds and patches plugin configs.
6. **Git sync** — exports gzipped JSONL chunks into `.engram/` for commit-based multi-machine sync without merge conflicts on one giant file.

Beta **Obsidian Brain** (`engram-beta` side-by-side binary) exports observations as linked Markdown notes for graph visualization in Obsidian — same DB, separate binary name so stable installs stay untouched.

### 3.1 North-star use cases

1. **Invisible background memory:** User installs via Homebrew or `engram setup`; agent saves bugfixes and decisions proactively; next session the agent searches memory before repeating mistakes (`docs/intended-usage.md` golden rule: infrastructure you forget exists).
2. **Compaction survival:** Claude Code / OpenCode plugins inject Memory Protocol skill and post-compaction hooks; agent re-saves session summary and recovers context after context window reset.
3. **Cross-machine continuity:** Developer runs `engram sync`, commits `.engram/` chunk, pulls on laptop, `engram sync --import` — memories follow the git repo.
4. **Operator browse:** Human runs `engram tui` or `engram search "auth middleware"` without an agent, inspecting what the agent remembered.
5. **Obsidian cognitive map (beta):** Export to vault; open Graph View to see session hubs and `topic_key` clusters as a navigable knowledge graph.

### 3.2 Non-goals

- Auto-capture every tool call and compress later with separate API calls (explicit philosophy vs claude-mem — `docs/COMPARISON.md`).
- Agent runtime lock-in — no requirement for Claude-only hooks for core memory (hooks are optional plugin enhancement).
- Heavy cloud dependency for core local usage — SQLite on disk is source of truth; git sync is file-based.
- Replacing project documentation (`README`, ADRs) — Engram stores *session-derived* learnings, not a full doc site.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Go 1.25, CGO_ENABLED=0 release builds | `go.mod`, `.goreleaser.yaml`, `.github/workflows/ci.yml` |
| Persistence | SQLite via modernc.org/sqlite (pure Go); WAL mode; FTS5 virtual tables | `internal/store/store.go`, `DOCS.md` |
| Search | FTS5 on observations and prompts; trigger-synced virtual tables | `DOCS.md` § Database Schema |
| Agent protocol | MCP stdio (mark3labs/mcp-go) | `internal/mcp/mcp.go`, `go.mod` |
| HTTP API | stdlib `net/http` ServeMux, JSON handlers | `internal/server/server.go` |
| TUI | Bubbletea v1.3, Lipgloss, Bubbles | `go.mod`, `internal/tui/` |
| UI templates | templ | `go.mod` (`github.com/a-h/templ`) |
| Plugins | TypeScript OpenCode plugin; Claude Code hooks + MCP JSON | `plugin/opencode/engram.ts`, `plugin/claude-code/` |
| Obsidian plugin | TypeScript + esbuild (separate from Go binary) | `plugin/obsidian/package.json` |
| Testing | `go test ./...`; E2E tag for server package; dockertest in deps | `.github/workflows/ci.yml`, `go.mod` |
| Release | GoReleaser — linux/darwin/windows amd64/arm64 archives | `.goreleaser.yaml`, `.github/workflows/release.yml` |
| CI | GitHub Actions — unit + e2e on Go 1.25 | `.github/workflows/ci.yml` |

### 4.1 Notable dependencies (curated)

- `modernc.org/sqlite` — embedded SQLite without CGO; enables single static binary cross-compilation.
- `github.com/mark3labs/mcp-go` — MCP server implementation for stdio tool registration.
- `github.com/charmbracelet/bubbletea` + `lipgloss` + `bubbles` — full-screen terminal UI with list/input components.
- `github.com/a-h/templ` — type-safe HTML generation (dashboard-related server UI).
- `github.com/golang-jwt/jwt/v5` — JWT handling (auth-related code paths).
- `github.com/lib/pq` — PostgreSQL driver (present in module; cloud/sync paths reference Postgres in contributor skills — `internal/cloud/` not present in current tree).
- `github.com/ory/dockertest/v3` — integration test harness for containerized dependencies.

## 5. Repository map (abstraction)

- **Entrypoints:** `cmd/engram/main.go` — all CLI subcommands (`serve`, `mcp`, `tui`, `setup`, `sync`, `projects`, etc.).
- **Domain / core:** `internal/store/store.go` — sessions, observations, prompts, FTS search, dedupe, topic upserts, export/import, schema migrations.
- **HTTP adapter:** `internal/server/server.go` — REST routes mirroring store operations; sync status endpoint for autosync consumers.
- **MCP adapter:** `internal/mcp/mcp.go` — 15 MCP tools mapping to store; tool filtering for agent vs admin surfaces.
- **Project intelligence:** `internal/project/` — git-based project name detection, Levenshtein similarity for `projects consolidate`.
- **Git sync:** `internal/sync/` — manifest + gzipped JSONL chunks, import dedupe via `sync_chunks` table.
- **Obsidian export (beta):** `internal/obsidian/` — markdown generation, graph metadata, watcher, hub/slug utilities.
- **Agent setup:** `internal/setup/` — `go:embed` plugin payloads, `engram setup` for opencode/claude-code/gemini-cli/codex; patches `ENGRAM_BIN` in installed plugins.
- **TUI:** `internal/tui/` — model/update/view split (Gentleman Bubbletea patterns); `styles.go` Catppuccin palette.
- **Version check:** `internal/version/` — optional GH_TOKEN/GITHUB_TOKEN for release awareness.
- **Thin plugins (adapters):** `plugin/opencode/engram.ts` (HTTP session tracking + MCP); `plugin/claude-code/` (hooks, MCP, memory skill); `plugin/obsidian/` (Obsidian community plugin).
- **Contributor agent skills:** `skills/` — 18+ `SKILL.md` files (architecture guardrails, memory protocol, server API, TUI quality, etc.); indexed in `AGENTS.md`; `setup.sh` symlinks into `.claude/.codex/.gemini` for local dev.
- **Claude marketplace metadata:** `.claude-plugin/marketplace.json` — publishes `plugin/claude-code` to Claude Code plugin marketplace.
- **Docs vaults:** `docs/` — INSTALLATION, AGENT-SETUP, ARCHITECTURE, PLUGINS, COMPARISON, intended-usage; `docs/beta/obsidian-brain.md`; root `DOCS.md` (full technical reference), `CONTRIBUTING.md`, `SECURITY.md`.
- **Agent scaffolding:** No `.claude/` or `.docs/` directories in tree (scanned — absent). Equivalent guidance lives in `AGENTS.md`, `skills/`, and `plugin/claude-code/skills/memory/SKILL.md`.
- **Assets / media:** `assets/` — TUI screenshots, agent-save diagram, Obsidian graph preview (referenced in docs).
- **Generated / vendor:** Release binaries and `*.db` files gitignored; `cmd/engram/main` binary may exist locally but root `/engram` binary pattern is gitignored.

## 6. Configuration & contracts (no secrets)

### Environment variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `ENGRAM_DATA_DIR` | SQLite DB and data directory (must be absolute when set) | `~/.engram` |
| `ENGRAM_PORT` | HTTP server listen port | `7437` |
| `ENGRAM_PROJECT` | Override project name for MCP server | auto-detected from git remote |
| `ENGRAM_BIN` | OpenCode plugin binary path override | `engram` on PATH |
| `GH_TOKEN` / `GITHUB_TOKEN` | Optional token for version check against releases | unset |
| `USER` / `USERNAME` | Sync chunk author metadata fallback | OS user |
| `XDG_CONFIG_HOME` | Linux config path resolution in setup | platform default |
| `APPDATA` | Windows config path resolution in setup | Windows env |

Server binds **loopback only** (`127.0.0.1`) — not exposed to LAN by default.

### 6.1 HTTP / API endpoints

Base: loopback port 7437. All JSON. No auth layer on local HTTP (trust boundary = local machine).

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/health` | Liveness + service version | none |
| `POST` | `/sessions` | Create session `{id, project, directory}` | none |
| `POST` | `/sessions/{id}/end` | End session with optional `{summary}` | none |
| `GET` | `/sessions/recent` | Recent sessions `?project=&limit=` | none |
| `POST` | `/observations` | Add observation (type, title, content, scope, topic_key, …) | none |
| `POST` | `/observations/passive` | Passive capture from text output | none |
| `GET` | `/observations/recent` | Recent observations `?project=&scope=&limit=` | none |
| `GET` | `/observations/{id}` | Single observation by ID | none |
| `PATCH` | `/observations/{id}` | Partial update | none |
| `DELETE` | `/observations/{id}` | Soft delete (default) or `?hard=true` | none |
| `GET` | `/search` | FTS5 search `?q=&type=&project=&scope=&limit=` | none |
| `GET` | `/timeline` | Chronological context `?observation_id=&before=&after=` | none |
| `POST` | `/prompts` | Save user prompt | none |
| `GET` | `/prompts/recent` | Recent prompts | none |
| `GET` | `/prompts/search` | Search prompts | none |
| `GET` | `/context` | Formatted cross-session context `?project=&scope=` | none |
| `GET` | `/export` | Export all data as JSON | none |
| `POST` | `/import` | Import from export JSON body | none |
| `GET` | `/stats` | Memory statistics | none |
| `POST` | `/projects/migrate` | Merge/migrate project name variants | none |
| `GET` | `/sync/status` | Autosync degraded-state visibility | none |

Evidence: `internal/server/server.go` routes(); `DOCS.md` § HTTP API Endpoints.

### 6.2 Other interfaces

**MCP tools (stdio, 15 tools):**

| Tool | Purpose |
|------|---------|
| `mem_save` | Save structured observation (What/Why/Where/Learned) |
| `mem_update` | Update observation by ID |
| `mem_delete` | Soft or hard delete |
| `mem_suggest_topic_key` | Stable key for evolving topics |
| `mem_search` | FTS5 full-text search |
| `mem_session_summary` | End-of-session summary save |
| `mem_context` | Recent session context injection |
| `mem_timeline` | Chronological drill-in around observation |
| `mem_get_observation` | Full content by ID |
| `mem_save_prompt` | Persist user prompt text |
| `mem_stats` | Memory statistics |
| `mem_session_start` | Register session start |
| `mem_session_end` | Mark session complete |
| `mem_capture_passive` | Extract learnings from text output |
| `mem_merge_projects` | Admin: merge project name variants |

Claude Code MCP config uses `engram mcp --tools=agent` to filter tool surface (`plugin/claude-code/.mcp.json`).

**CLI commands (high level):** `setup`, `serve`, `mcp`, `tui`, `search`, `save`, `timeline`, `context`, `stats`, `export`, `import`, `sync`, `projects list|consolidate|prune`, `version`.

**Git sync contract:** `engram sync` writes gzipped JSONL chunks + manifest under `.engram/` in project tree; `sync --import` merges remote chunks; `sync --status` reports state. Chunk IDs tracked in `sync_chunks` table to prevent re-import.

**Obsidian beta contract:** `engram-beta` commands export Markdown notes with wikilinks; Obsidian plugin watches vault changes; shares `~/.engram/engram.db` with stable binary.

## 7. Data & persistence

**Primary store:** Single SQLite file at `{ENGRAM_DATA_DIR}/engram.db` (default `~/.engram/engram.db`). WAL mode, 5s busy timeout, foreign keys ON.

**Core entities (tables):**

- `sessions` — id, project, directory, started_at, ended_at, summary, status
- `observations` — session_id FK, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, deleted_at, sync_id
- `observations_fts` — FTS5 virtual (title, content, tool_name, type, project) via triggers
- `user_prompts` — session_id FK, content, project
- `prompts_fts` — FTS5 virtual on prompt content
- `sync_chunks` — chunk_id PK, imported_at (git sync dedupe)

**Topology:** Strictly **local-first**. The binary and DB live on the developer machine. Optional **git-adjacent sync** replicates chunk files through the project's git history — not a live cloud replica in the open-source tree. Contributor skills reference `internal/cloud/` packages (cloudstore, cloudserver, dashboard, autosync) for a planned or private cloud tier; those directories are **not present** in the shallow `main` clone examined.

**Privacy tags:** Documentation references stripping `<private>` content at capture layers (comparison with claude-mem); agents should not persist sensitive tags.

## 8. Docs & agent memory (required scan)

### Scanned locations

| Location | Status | Summary |
|----------|--------|---------|
| `.claude/` | **Absent** | Not in tree; `setup.sh` generates symlinks to `skills/` for local dev |
| `.docs/` | **Absent** | Not in tree |
| `docs/` | Present | User-facing install, agent setup, architecture, plugins, comparison, beta Obsidian |
| `AGENTS.md` | Present | Contributor skill index — 18 skills with triggers |
| `skills/` | Present | Repo-wide contributor standards + memory protocol |
| `.claude-plugin/` | Present | Claude Code marketplace manifest |

### Evidence bullets (paths only)

- `README.md` — product pitch, quick start, MCP tool table, CLI reference, git sync overview.
- `DOCS.md` — full technical reference: schema, env vars, HTTP API, MCP tools, TUI screens, systemd service example.
- `docs/ARCHITECTURE.md` — session lifecycle, progressive disclosure, memory hygiene, topic_key workflow, project structure map.
- `docs/AGENT-SETUP.md` — per-agent one-liners (Claude Code, OpenCode, Gemini CLI, Codex, VS Code, Cursor, Windsurf); compaction survival guidance.
- `docs/INSTALLATION.md` — Homebrew tap, binary downloads, source install (referenced from README).
- `docs/PLUGINS.md` — OpenCode and Claude Code plugin capabilities beyond bare MCP.
- `docs/COMPARISON.md` — design philosophy vs claude-mem (agent-agnostic, FTS5 vs ChromaDB, curated vs auto-capture).
- `docs/intended-usage.md` — mental model: invisible infrastructure; golden rule — if you think about engram while coding, something went wrong.
- `docs/beta/obsidian-brain.md` — Obsidian Brain beta: side-by-side `engram-beta` binary, graph visualization, install per platform.
- `CONTRIBUTING.md` — contribution workflow and standards.
- `SECURITY.md` — security reporting expectations.
- `CHANGELOG.md` — release history.
- `AGENTS.md` — maps tasks to `skills/*/SKILL.md` files.
- `skills/memory-protocol/SKILL.md` — when to mem_save, search rules, session close, post-compaction recovery.
- `skills/architecture-guardrails/SKILL.md` — local SQLite as source of truth; thin plugins; boundary rules (references cloud packages not in current tree).
- `skills/catalog.md` — skill catalog for contributors.
- `plugin/claude-code/skills/memory/SKILL.md` — end-user Memory Protocol for Claude plugin installs.
- `.claude-plugin/marketplace.json` — Claude Code marketplace entry for engram plugin.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repo; memory data itself is **local private** — lives only on the user's machine in `~/.engram/` unless explicitly synced via git chunks or export JSON.
- **Auth model:** Local HTTP API has **no authentication** — designed for loopback plugin communication. JWT and Postgres dependencies suggest optional cloud/auth paths in extended builds; not active in the examined open-source `main` tree without `internal/cloud/`.
- **Secrets:** This summary contains no credentials, tokens, `.env` values, or database passwords. Optional `GH_TOKEN`/`GITHUB_TOKEN` are user-supplied for version checks only.
- **Data sensitivity:** Users choose what agents save; `<private>` tag stripping documented in comparison doc. Soft-delete prevents accidental permanent loss; hard-delete available for admin operations.
- **Supply chain:** GoReleaser builds with `-s -w` stripped binaries; checksums published per release workflow.

## 10. Operational picture

**Local development:**

```bash
go test ./...
go run ./cmd/engram mcp          # MCP stdio server
go run ./cmd/engram serve        # HTTP on 7437
go run ./cmd/engram tui          # Terminal UI
```

Contributor skill `setup.sh` links `skills/` into agent config dirs for local standards.

**Typical user runtime:**

1. Install binary (Homebrew `gentleman-programming/tap/engram`, release tarball, or `go install`).
2. `engram setup <agent>` or install Claude Code plugin from marketplace.
3. For OpenCode: also `engram serve` in background for session HTTP tracking.
4. Agent uses MCP tools automatically per Memory Protocol.

**Deployment / CI:**

- `.github/workflows/ci.yml` — `go test ./...` and `go test -tags e2e ./internal/server/...` on PR and main push.
- `.github/workflows/release.yml` + `.goreleaser.yaml` — multi-platform release artifacts.
- `.github/workflows/pr-check.yml` — additional PR gates (present in tree).
- User-level **systemd** unit documented in `DOCS.md` for persistent `engram serve`.

**Hardware constraints:** None significant — single SQLite file, no GPU. Runs on macOS, Linux, Windows (amd64/arm64). Raspberry Pi tags exist in clone metadata (`pi-v0.1.x` release tags observed during shallow clone).

## 11. Open questions / unknowns

- **kodexArg vs upstream lineage:** Shallow clone resolved to `Gentleman-Programming/engram` remote; `go.mod` module path is `github.com/Gentleman-Programming/engram` while `DOCS.md` also references `github.com/alanbuscaglia/engram`. Relationship between `kodexArg/engram` assignment and upstream forks is unclear from tree alone.
- **Cloud tier:** Contributor skills (`skills/architecture-guardrails/SKILL.md`) describe `internal/cloud/cloudstore`, `cloudserver`, `dashboard`, `autosync` — **not present** in examined `main` tree. May be private, unreleased, or removed; cloud HTTP/JWT/Postgres deps remain in `go.mod`.
- **MCP tool count drift:** README lists 13 tools in some tables; architecture docs say 15; both align with `mem_merge_projects` and passive capture additions — exact agent-filtered subset per platform may differ (`--tools=agent` flag).
- **Dashboard HTMX UI:** Skills reference `dashboard-htmx` and `internal/cloud/dashboard` — no dashboard package found in current clone; may ship separately or be upcoming.
- **Version string:** `/health` returns hardcoded `0.1.0` in server handler while release tags show `v1.20.0` — runtime version reporting may lag release tagging.
