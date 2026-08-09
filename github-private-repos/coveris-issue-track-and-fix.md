---
id: "coveris-issue-track-and-fix"
title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents"
visibility: private
importance: high
source_repo: "coveris-issue-track-and-fix"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["python", "google-antigravity", "gemini", "mcp", "github-api", "issue-triage", "autonomous-agents", "angular", "django", "coveris", "obsidian"]
problems_solved:
  - "Manual triage and routing of Coveris GitHub issues across severity and effort dimensions, which does not scale and is inconsistent across engineers."
  - "Slow turnaround from issue report to pull request for low-risk bugs in the cotton-coveris-mvp codebase (Angular frontend + Django backend)."
  - "Lack of a governed, extensible agent harness with skills, MCP integrations, and safety policies for autonomous code-change workflows."
technologies:
  - "Python 3 (asyncio)"
  - "Google Antigravity SDK (google-antigravity)"
  - "Gemini 3.5 Flash"
  - "Pydantic"
  - "GitHub REST API"
  - "Obsidian MCP (Streamable HTTP)"
  - "Loguru"
  - "python-dotenv"
  - "PyYAML"
  - "pytest / unittest"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Coveris Issue Track and Fix

> **Problem thesis (required):** This private repository hosts a two-stage autonomous agent pipeline for the Coveris product line. A **Tracker** agent investigates live GitHub issues against the cotton-coveris-mvp application workspace, produces structured triage intelligence (difficulty, severity, root-cause addendum), and a deterministic **Router** decides whether to defer, skip, or invoke a **Fixer** agent. The Fixer reads code (read-only locally), applies changes exclusively via GitHub API tools (branch, commit, pull request), and escalates unresolvable issues by commenting and labeling them `complex`. The repo also ships an Obsidian documentation vault, Antigravity SDK reference docs, and a library of `agy-*` agent skills for Angular and Django work.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/coveris-issue-track-and-fix` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Autonomous Antigravity agents that triage Coveris GitHub issues and open fix pull requests with governed tool access. |
| Audience | Internal operators and agent maintainers on Linux; Antigravity SDK agents consuming MCP and filesystem skills; human engineers reviewing deferred or `complex` issues. |

## 2. Problems it solves

### P1 — Inconsistent, slow GitHub issue triage for Coveris

- **Who hurts:** Coveris maintainers and on-call engineers managing issues in the target application repository (`kodexArg/cotton-coveris-mvp` by default).
- **Pain today:** Each issue requires manual reading of descriptions, cross-referencing product docs in Obsidian, grepping the Angular/Django codebase, and subjective judgment about severity and fix effort before anyone starts coding.
- **How this repo answers:** The Tracker agent (`agy_coveris_issue_tracker/agent.py`) fetches the live issue via `fetch_github_issue_tool`, injects an Obsidian vault index from the target repo's `docs/` tree, connects to Obsidian MCP for contextual knowledge graph navigation, inspects code read-only in the configured workspace, and returns a structured `TrackerPayload` (original issue text, tracker addendum with root cause, `dificultad`, `severidad`). The Router (`router.py`) normalizes those fields into a binary effort/severity matrix and either defers high/high combinations or routes to the Fixer.
- **Out of scope:** Fully automated merge or CI gating; issues requiring architectural redesign are deferred or marked `complex` for humans.

### P2 — High friction from bug report to pull request

- **Who hurts:** Developers fixing routine frontend/backend bugs in the Coveris MVP stack.
- **Pain today:** Even after triage, engineers must branch, patch, commit, and open PRs manually; agent tooling without GitHub write adapters cannot close the loop.
- **How this repo answers:** The Fixer agent (`agy_coveris_issue_fixer/agent.py`) operates read-only on disk (filesystem write tools disabled) but registers four GitHub REST tools from `agy_coveris_issue_tracker/github_api.py`: `create_github_branch`, `commit_file_to_github`, `create_github_pull_request`, and `comment_and_mark_issue_complex`. It follows an SOP embedded in its prompt: create `fix/issue-{id}` branch, commit via API, open PR, or escalate on failure/timeout (300s cap with automatic `complex` labeling).
- **Out of scope:** Local file mutation; direct shell execution (`RUN_COMMAND` disabled on Fixer); multi-repo orchestration beyond the configured target.

### P3 — Missing agent harness, skills, and safety documentation for Coveris workflows

- **Who hurts:** Teams building and operating Antigravity-based agents that must interact with MCP, skills, and policy-gated tools.
- **Pain today:** SDK knowledge, Coveris-specific Angular/Django conventions, and checkpoint discipline are tribal; agents lack a curated skill library and Obsidian-backed operational docs.
- **How this repo answers:** Ships `.agents/skills/` with `agy-*` skills (Angular signals/forms/routing/http/component, `agy-implement-waypoint` milestone gates, `django-expert`, `docker-compose`, `google-antigravity-sdk`) plus `docs/` Obsidian vault covering architecture, MCP, tools, safety policies, configuration, and data contracts. `skills-lock.json` pins the upstream `google-antigravity-sdk` skill hash. `AGENTS.md` documents skill registration via `LocalAgentConfig.skills_paths`.
- **Out of scope:** General-purpose skill marketplace; skills are Coveris- and AGY-oriented, not product end-user documentation.

## 3. Product / idea

The repository implements a **sequential multi-agent pipeline** orchestrated by `router.py`, not a long-running HTTP service. Execution is CLI-driven: `python router.py [issue_number]` (default issue `94`) or via `run_mock_pipeline.py` wrapper.

**Mental model:**

1. **Tracker phase** — Gemini-powered agent with YAML prompts (`agy_coveris_issue_tracker/prompts.yml`), Obsidian MCP (mandatory health-check; aborts if unreachable), one custom tool for GitHub issue fetch, structured JSON output schema (`TrackerPayload`), and read-only workspace over the Coveris MVP checkout.
2. **Router phase** — Pure Python decision matrix: `HIGH` effort + `HIGH` severity → defer (no Fixer); all other combinations route to Fixer with `effort_level` `HIGH` or `LOW` (model stays `gemini-3.5-flash`).
3. **Fixer phase** — Second agent with augmented prompt identity per effort level, GitHub write tools, disabled local write/run tools, skills loaded from `.agents/skills/`, same Obsidian MCP requirement, 300-second timeout with graceful escalation.

Parallel to the live pipeline, `coveris_core/` defines **strategy-pattern contracts** (`TriageStrategy`, `FixStrategy`) and Pydantic DTOs (`Issue`, `TriageResult`, `PullRequest`, enums `IssueStatus`, `TriageDecision`) intended for OCP-extensible rule engines. README and `docs/AGY.md` describe registering new strategies in workflow modules; those workflow/mock_db files are **referenced in docs but absent from the current tree** — the running system has evolved toward full LLM agents rather than deterministic strategy classes.

A secondary **local issue queue** (`issues.md` markdown table + `scripts/get_random_issue.py`) supports human/agent task assignment independent of GitHub issue numbers.

### 3.1 North-star use cases

1. Operator runs `router.py 101` → Tracker analyzes GitHub issue #101 in cotton-coveris-mvp → Router assigns Fixer → Fixer opens a PR with the patch.
2. Tracker classifies a stale/duplicate-style issue → Router defers or Fixer calls `comment_and_mark_issue_complex` when confidence is low.
3. Maintainer invokes `agy-implement-waypoint` skill at a milestone (new triage/fix strategy or core Python change) → commit, pytest, gate before continuing.

### 3.2 Non-goals

- No public HTTP API surface; not a web application.
- No direct repository filesystem writes by agents (Fixer uses GitHub Contents API only).
- No guaranteed autonomous resolution for `HIGH`/`HIGH` effort-severity pairs (explicit defer).
- README's mock issue database (`mock_db.py`) and workflow modules (`triage_rules.py`, `fix_strategies.py`) are documented but not present in the current `main` snapshot — treat as aspirational or removed legacy unless restored.

## 4. Technology stack

Derived from imports, README, and `docs/` (no `pyproject.toml` or `requirements.txt` in tree).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3, asyncio | `router.py`, `agy_coveris_issue_tracker/agent.py` |
| AI / agents | Google Antigravity SDK, Gemini 3.5 Flash | `docs/installation.md`, agent configs |
| Data contracts | Pydantic v2 models | `coveris_core/models.py` |
| HTTP client | `requests` | `agy_coveris_issue_tracker/github_api.py` |
| Logging | Loguru + stdlib bridge | `router.py`, agent modules |
| Config / prompts | YAML + dotenv | `prompts.yml`, `config_loader.py`, `router.py` |
| External APIs | GitHub REST v3 | `github_api.py` |
| MCP | Obsidian Streamable HTTP server | agent `get_*_config()` functions |
| Docs UX | Obsidian vault (`.obsidian/`) | `docs/index.md`, `.obsidian/` |
| Tests | unittest + pytest invocation | `tests/test_flow.py`, README |
| Infra / deploy | None in-repo (no CI workflows) | tree scan — no `.github/` |

### 4.1 Notable dependencies (curated)

- `google-antigravity` — Agent runtime, `LocalAgentConfig`, hooks, MCP server types, builtin tool enums.
- `pydantic` — DTOs for issues, triage results, pull requests, and Tracker structured output.
- `requests` — GitHub REST and Obsidian MCP health checks.
- `loguru` — Structured console logging for Router and agents.
- `python-dotenv` — Loads `.env` from agent workspace path (gitignored; not read).
- `PyYAML` — Prompt and agent identity loading.
- `pytest` — Test runner referenced in README and `agy-implement-waypoint` skill.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `router.py` — Main async orchestrator (Tracker → matrix → Fixer).
  - `run_mock_pipeline.py` — Thin wrapper defaulting issue `94`.
  - `scripts/get_random_issue.py` — CLI for `issues.md` queue management.
  - `test_flash.py`, `test_pro.py`, `test_raw.py` — Ad-hoc agent/model experiments (root level).

- **Domain / core:**
  - `coveris_core/models.py` — Shared enums and Pydantic DTOs.
  - `coveris_core/interfaces.py` — `TriageStrategy` and `FixStrategy` ABCs for OCP extension.

- **Agents:**
  - `agy_coveris_issue_tracker/` — Tracker agent, GitHub fetch tool, prompt loader with vault index injection, `prompts.yml`.
  - `agy_coveris_issue_fixer/` — Fixer agent, effort-augmented prompts, tool registration, timeout handling.

- **Adapters:**
  - `agy_coveris_issue_tracker/github_api.py` — GitHub issues, git refs, contents API, PR creation, comment/label escalation.

- **Docs vaults:**
  - `docs/` — Obsidian MOC: installation, configuration, architecture, safety, tools, MCP, inputs/outputs, AGY guidelines.
  - `AGENTS.md` — Spanish-language operator guide for skills and workspace paths.
  - `README.md` — English architecture overview (partially stale vs current agent-first implementation).

- **Agent scaffolding:**
  - `.agents/skills/` — Bundled skills (`agy-implement-waypoint`, `agy-angular-*`, `django-expert`, `docker-compose`, `google-antigravity-sdk`, `find-skills`, `skill-creator`).
  - `skills-lock.json` — Locked upstream skill provenance for `google-antigravity-sdk`.
  - **`.claude/`** — Not present in repository (scanned).
  - **`.docs/`** — Not present; project uses visible `docs/` instead.

- **Local data / queue:**
  - `issues.md` — Markdown table of synthetic/local issues with status workflow.

- **Generated / vendor / IDE:**
  - `.obsidian/` — Vault config and community plugins (mermaid-tools, mermaid-icons); `workspace.json` gitignored.
  - `.brain/`, `venv/`, `__pycache__/` — gitignored; not ingested.

## 6. Configuration & contracts (no secrets)

### Environment variables (names + purpose only)

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Authenticates Antigravity agents to Gemini (per `docs/installation.md`). |
| `GITHUB_TOKEN` | Bearer token for GitHub REST API (`github_api.py`). |
| `GITHUB_TARGET_REPO` | `owner/repo` slug for issue/PR operations (default `kodexArg/cotton-coveris-mvp`). |
| `OBSIDIAN_MCP_URL` | Streamable HTTP endpoint for Obsidian MCP (default localhost port 27125 path `/mcp`). |
| `OBSIDIAN_MCP_TOKEN` | Optional bearer token for Obsidian MCP authorization header. |

Agents load dotenv from a fixed absolute `.env` path under the operator's Agents directory (see `router.py`); that file is gitignored and was not read.

### Agent configuration shapes

- **Tracker** (`get_tracker_config`): YAML system instructions + vault index, `fetch_github_issue_tool`, Obsidian MCP server (fail-fast), hooks for logging, `response_schema=TrackerPayload`, `vertex=False`, workspaces over agent repo and Coveris MVP checkout.
- **Fixer** (`get_fixer_config`): YAML instructions with effort suffix, four GitHub tools, Obsidian MCP, `model="gemini-3.5-flash"`, `skills_paths` to `.agents/skills`, disabled `CREATE_FILE`/`EDIT_FILE`/`RUN_COMMAND`, same workspace pair.

### Structured contracts

- **Tracker output** (`TrackerPayload`): `issue_original`, `adenda_del_issue_tracker`, `dificultad`, `severidad`.
- **Core DTOs** (`coveris_core/models.py`): `Issue`, `TriageResult`, `PullRequest` with status/decision enums.
- Documented JSON examples in `docs/inputs_outputs.md` for legacy strategy workflow outputs (`DISCARD`, `DELEGATE_TO_FIXER`, PR diff).

### 6.1 HTTP / API endpoints (when applicable)

This repository does **not** expose its own HTTP server. It is a CLI/async Python application.

**Outbound HTTP integrations:**

| Method | Path pattern | Purpose | Auth |
|--------|--------------|---------|------|
| `GET` | GitHub REST `/repos/{owner}/{repo}/issues/{number}` | Fetch issue payload | `GITHUB_TOKEN` bearer |
| `GET` | GitHub REST `/repos/{owner}/{repo}/git/ref/heads/{branch}` | Resolve branch SHA | `GITHUB_TOKEN` |
| `POST` | GitHub REST `/repos/{owner}/{repo}/git/refs` | Create fix branch | `GITHUB_TOKEN` |
| `GET`/`PUT` | GitHub REST `/repos/{owner}/{repo}/contents/{path}` | Read/update file on branch | `GITHUB_TOKEN` |
| `POST` | GitHub REST `/repos/{owner}/{repo}/pulls` | Open pull request | `GITHUB_TOKEN` |
| `POST` | GitHub REST `/repos/{owner}/{repo}/issues/{n}/comments` | Escalation comment | `GITHUB_TOKEN` |
| `POST` | GitHub REST `/repos/{owner}/{repo}/issues/{n}/labels` | Apply `complex` label | `GITHUB_TOKEN` |
| `GET` | Obsidian MCP health probe | Fail-fast before agent start | optional `OBSIDIAN_MCP_TOKEN` |

### 6.2 Other interfaces

- **CLI — Router:** `python router.py [issue_number]` runs full pipeline.
- **CLI — Pipeline wrapper:** `python run_mock_pipeline.py [issue_number]`.
- **CLI — Issue queue:** `python scripts/get_random_issue.py [ISSUE-NNN] [action_code]` mutates `issues.md` (actions: work, done, defer, pending, discard).
- **MCP — Obsidian:** Streamable HTTP server `obsidian_coveris_kodex` for vault search/read during Tracker and Fixer turns.
- **Antigravity tools — Tracker custom:** `fetch_github_issue_tool(issue_number: int) -> str` (JSON).
- **Antigravity tools — Fixer GitHub:** branch create, file commit, PR create, comment+label escalation.
- **Filesystem skills:** Loaded from `.agents/skills/` per `LocalAgentConfig.skills_paths`.

## 7. Data & persistence

- **No application database** in this repo. Issue state for the live pipeline comes from GitHub Issues API on the target repository.
- **Local queue file** `issues.md` stores synthetic task rows (`Status`, `Issue ID`, `Difficulty`, `Priority`, `Description`) for operator-driven assignment; mutated by `get_random_issue.py`.
- **Pydantic models** represent in-memory/issue-tracker contracts; enums `IssueStatus` and `TriageDecision` model lifecycle states (`OPEN`, `CLOSED`, `DISCARDED`, `FIXED`; `DISCARD`, `CLOSE`, `DELEGATE_TO_FIXER`).
- **Agent conversation persistence** optional via Antigravity `save_dir` / `conversation_id` (documented in `docs/configuration.md`; not wired in current router).
- **Obsidian vault** in target Coveris MVP `docs/` is indexed at prompt-build time (`config_loader.get_vault_index`) for Tracker context injection.
- Topology: agents run on operator Linux host; Gemini backend remote; GitHub API remote; Obsidian MCP expected local; target application code read from filesystem workspace paths.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

- `README.md` — Modular package layout, OCP strategy extension instructions, mock issue scenarios (#101–#103), pytest invocation. **Note:** references `mock_db.py` and `workflow` modules not found in current tree.
- `AGENTS.md` — Coveris workspace layout, `agy-*` skill catalog, `LocalAgentConfig.skills_paths` registration, `get_random_issue.py` workflow.
- `docs/index.md` — Obsidian MOC linking setup, architecture, security, tools, MCP, data-flow docs.
- `docs/architecture.md` — Antigravity SDK pillars: Agent, Conversation, Connection; execution flow diagrams.
- `docs/AGY.md` — Repo package graph, OCP extension diagram, core DTO table.
- `docs/inputs_outputs.md` — Tracker/Fixer data contracts, mermaid pipeline, JSON output examples.
- `docs/configuration.md` — `LocalAgentConfig` options: model, system instructions, structured output, persistence, `app_data_dir`.
- `docs/installation.md` — `uv` install paths for `google-antigravity`, `GEMINI_API_KEY` setup patterns.
- `docs/tools.md` — Builtin tools enum, custom tools, skills loading.
- `docs/mcp.md` — Stdio vs SSE MCP, policy interaction with MCP tool names.
- `docs/safety_policies.md` — Policy precedence, deny/ask/allow, fail-closed predicates.
- `.agents/skills/agy-implement-waypoint/SKILL.md` — Milestone gate: stop, commit, pytest, PASS/RED before continuing.
- `.agents/skills/google-antigravity-sdk/SKILL.md` — SDK routing table to reference docs and examples.

### Scans with no content

- **`.claude/`** — Directory does not exist in repository.
- **`.docs/`** — Directory does not exist; documentation lives under `docs/`.

## 9. Security & privacy notes (summary-time)

- **Private repository** — Summary describes mechanisms without clone URLs; `related: []` per private-repo policy.
- **Secrets handling** — `GITHUB_TOKEN`, `GEMINI_API_KEY`, and optional `OBSIDIAN_MCP_TOKEN` required at runtime; `.env` gitignored. This summary contains no credential values.
- **Agent safety model** — Antigravity policy system documented in `docs/safety_policies.md`; Fixer explicitly disables filesystem write and shell tools, forcing GitHub API as the only mutation path. Tracker is read-only by prompt contract and workspace scoping.
- **Fail-fast dependencies** — Both agents abort if Obsidian MCP health check fails (no degraded mode).
- **Timeout guard** — Fixer cancels after 300s and marks issue `complex` via GitHub API.
- **Auth model** — Bearer tokens for GitHub and optional Obsidian MCP; Gemini via API key; no end-user session/OIDC in this repo.

## 10. Operational picture

### Local development

- Install: `google-antigravity`, `pydantic`, `requests`, `loguru`, `python-dotenv`, `pyyaml` (per README and imports; `uv pip install` patterns in `docs/installation.md`).
- Configure gitignored `.env` with `GEMINI_API_KEY`, `GITHUB_TOKEN`, optional `GITHUB_TARGET_REPO`, Obsidian MCP vars.
- Ensure Obsidian MCP server is running before Tracker/Fixer (mandatory).
- Ensure Coveris MVP checkout exists at configured workspace path for code inspection.
- Run pipeline: `python router.py <issue_number>` or `pytest tests/`.
- Issue queue ops: `python scripts/get_random_issue.py`.

### Deployment

- No GitHub Actions, Dockerfile, or wrangler config in tree.
- Intended as a long-running or cron-invoked agent service on operator Linux (`AGENTS.md` references Agents directory deployment).
- `skills-lock.json` suggests skills may be synced from upstream `google-antigravity/antigravity-sdk-python`.

### Hardware constraints

- None documented; standard Linux workstation. No GPU requirements stated (cloud Gemini inference).

## 11. Open questions / unknowns

- **Missing workflow modules** — `mock_db.py`, `triage_rules.py`, `fix_strategies.py`, and `workflow.py` files referenced in README and `docs/inputs_outputs.md` are absent from `main`; unclear if removed in favor of LLM agents or live on another branch.
- **Test drift** — `tests/test_flow.py` asserts `config.vertex` is `True` for Tracker, but `get_tracker_config()` sets `vertex=False`; test may be stale.
- **Dependency manifest** — No `pyproject.toml`, `requirements.txt`, or `uv.lock` in repo; exact version pins unknown.
- **CI/CD** — No `.github/workflows`; deployment automation not defined in tree.
- **Default issue `94`** — Hardcoded in `router.py` and `run_mock_pipeline.py`; significance unknown without target repo context.
- **`.claude/` and `.docs/`** — Confirmed absent; all agent instructions are under `.agents/skills/` and `docs/`.
