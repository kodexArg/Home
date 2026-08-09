---
# REQUIRED — every agent must fill these keys. Do not invent URLs or paste secrets.
id: "repo-example-name"
title: "Example Name — one-line human title"
visibility: public
# visibility MUST be exactly: public | private
importance: normal
# importance: high | normal | low
source_repo: "ExampleName"
# GitHub repo name only (no owner, no URL)
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
# Best-guess primary language from package manifests / tree (not a URL)
repo_kind: "application"
# repo_kind examples: application | library | template | documentation | infrastructure | game | skill | mirror-fork | archive-adjacent | other
status: "active"
# status: active | experimental | template | legacy | unknown
related: []
# public repos MAY list destination ids later; private MUST leave []
tags: ["example", "typescript", "cloudflare", "rag"]
# lowercase, no URLs; include stack + domain nouns
problems_solved:
  - "Lorem ipsum dolor sit amet — names the user pain this repo attacks."
  - "Consectetur adipiscing elit — second problem if real; else omit."
technologies:
  - "Astro 7"
  - "Svelte 5"
  - "Cloudflare Workers"
  - "Django 6 / DRF"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Example Name

> **Problem thesis (required):** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore — state clearly **what pain / workflow / constraint this repository exists to solve**. If multiple problems, list them; do not invent.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/ExampleName` |
| Visibility | `public` \| `private` (must match frontmatter) |
| Default branch | `main` |
| One-line pitch | Lorem ipsum dolor sit amet — product sentence, not marketing fluff. |
| Audience | Who uses it (operators, end users, agents, internal ALVS, …). |

## 2. Problems it solves

For each problem, use this block. Prefer 1–3 real problems. Verbose is better than vague.

### P1 — Short problem name

- **Who hurts:** Lorem ipsum (role / team / system).
- **Pain today:** Ut enim ad minim veniam, quis nostrud exercitation.
- **How this repo answers:** Duis aute irure dolor in reprehenderit — concrete mechanism, not slogans.
- **Out of scope:** What it deliberately does *not* solve.

### P2 — Optional second problem

- **Who hurts:** …
- **Pain today:** …
- **How this repo answers:** …
- **Out of scope:** …

## 3. Product / idea

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Explain the **central idea** of the repository: what the user can do after cloning/deploying, the mental model (e.g. “SSR site + DRF API on two Fargate services”), and how pieces relate. Prefer architecture narrative over file laundry lists.

### 3.1 North-star use cases

1. Lorem — primary happy path.
2. Ipsum — secondary path.
3. Dolor — operator / agent path if relevant.

### 3.2 Non-goals

- Lorem ipsum — explicit non-goals from README / ADRs / constitution if present.

## 4. Technology stack

Derive from **high-level manifests only** where possible (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pubspec.yaml`, `composer.json`, `Gemfile`, `settings.py`, `wrangler.jsonc`, `docker-compose*.yml`, `Dockerfile*`, workspace `README`, ADRs). Do **not** paste lockfile blobs.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | e.g. Node 22, Python 3.12, Bun | `package.json` engines / `.python-version` |
| Frontend | e.g. Astro 7, Svelte 5, Angular 21 | `package.json` deps |
| Backend / API | e.g. Django 6 + DRF, FastAPI, Workers | `pyproject.toml` / `src/` |
| Data | e.g. Postgres, D1, Vectorize, Redis | compose / settings / wrangler |
| Infra / deploy | e.g. AWS Fargate, Cloudflare, Docker | IaC / CI / README |
| AI / agents | e.g. Workers AI, skills, MCP | `.claude/`, `.agents/`, docs |
| Tests | e.g. Vitest, pytest | configs |

### 4.1 Notable dependencies (curated)

- `example-lib` — why it matters here (one line).
- Avoid exhaustive dependency dumps; pick signal deps only.

## 5. Repository map (abstraction)

Describe **zones**, not every file:

- **Entrypoints:** apps, workers, CLIs (paths).
- **Domain / core:** where business rules live.
- **Adapters:** HTTP, DB, queues, hardware.
- **Docs vaults:** `docs/`, `.docs/`, ADRs, PRDs.
- **Agent scaffolding:** `.claude/`, `.agents/`, `SKILL.md`, harness notes — **read and summarize** when present (even if unusual or sometimes gitignored elsewhere; these dirs are **in scope** for this summary).
- **Generated / vendor:** note existence only; do not ingest contents.

## 6. Configuration & contracts (no secrets)

Summarize **shapes**, never values that look like credentials.

- Env vars: names + purpose only (`DATABASE_URL` = Postgres DSN) — **never** paste real secrets, tokens, `.env` contents, PEM/keys, or `credentials*.json`.
- Feature flags / settings modules: e.g. `settings.py` sections at abstraction level.
- Bindings (Cloudflare): binding names from `wrangler.jsonc`, not account ids.

### 6.1 HTTP / API endpoints (when applicable)

If the repo exposes HTTP, document **clearly**. Prefer OpenAPI/routes modules/README over guessing.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/health` | Liveness | none |
| `POST` | `/api/ask` | Lorem — example row | session / token |
| `…` | `…` | Prefer real routes; if unknown write `unknown — not found in manifests` | |

If there is **no** HTTP surface, say so explicitly and describe CLI / library / game / skill surface instead.

### 6.2 Other interfaces

- CLI commands, MCP tools, Telegram commands, systemd units, Godot scenes — name the interface contract at high level.

## 7. Data & persistence

- Stores used (SQL, KV, object storage, vector index).
- Important entities / tables **by name** if obvious from migrations/models — no row data.
- Offline vs edge vs cloud topology in one short paragraph.

## 8. Docs & agent memory (required scan)

Agents **must** attempt to read and fold in:

1. Root `README*` (and localized README if present).
2. `docs/**` and **`.docs/**`** when present.
3. ADR / PRD / constitution / harness docs when present.
4. **`.claude/**`** and agent skill trees when present — summarize missions, conventions, and project rules; do not copy huge prompts verbatim if redundant.

For each source used, add a short “evidence” bullet with **path only**.

## 9. Security & privacy notes (summary-time)

- Visibility implications (`private` ⇒ describe without offering clone URLs as product links in related).
- Auth model at high level (OIDC, session cookie, none).
- Explicit: this summary must contain **no** secrets, private keys, connection strings with passwords, or scraped `.env`.

## 10. Operational picture

- How it is run locally (dev command names only).
- How it is deployed (CI name / platform) if evident.
- Hardware constraints if relevant (RPi, GPU VRAM, …).

## 11. Open questions / unknowns

List honestly what the tree did not reveal. Prefer “unknown” over fabrication.

---

## Agent fidelity checklist (delete this section in the real output)

- [ ] Frontmatter `visibility` matches actual GitHub private/public flag.
- [ ] `problems_solved` and §2 are non-empty and concrete.
- [ ] Technologies grounded in manifests / docs.
- [ ] Endpoints table filled or explicitly N/A.
- [ ] `.claude/` and `.docs/` scanned when they exist.
- [ ] Gitignored / secret paths not quoted as content.
- [ ] Single file only; verbose structured prose; no URL / email literals in the body if the consuming RAG forbids them (use path references and destination ids instead).
