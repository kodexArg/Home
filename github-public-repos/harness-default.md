---
id: "harness-default"
title: "harness-default — Fullstack project template with constitution, ADRs, assertions, and agent delivery"
visibility: public
importance: high
source_repo: "harness-default"
org: "kodexArg"
default_branch: "main"
primary_language: "Markdown"
repo_kind: "template"
status: "template"
related: []
tags: ["harness", "template", "constitution", "adr", "assertions", "tdd", "agents", "skills", "hooks", "triage-and-fix", "astro", "django", "aws", "markdown-vault", "gherkin", "fullstack"]
problems_solved:
  - "New fullstack projects lack a shared authority model—PRD, constitution, ADRs, and living docs drift apart from code, and agents invent parallel law in prompts instead of obeying written decisions."
  - "Product promises (latency bounds, data consistency, UX constraints) live as wishes in backlogs with no proving path; teams ship code first and retroactively hope tests appear."
  - "GitHub issue-to-PR delivery with doctrine-first planning, guardian gates, and assertion-driven TDD has no in-tree playbook, cast, or safety-net hooks that survive cloning."
technologies:
  - "Markdown + YAML frontmatter (constitution, ADRs, assertions, skills)"
  - "Gherkin use cases collapsed into assertion laws"
  - "markdown-vault-mcp (wikilink-aware docs vault)"
  - "Claude Code hooks (.claude/settings.json lifecycle wiring)"
  - "Python 3 (khook-* lifecycle scripts)"
  - "Astro 7 + Svelte 5 (kskill-astro-7 stack skill)"
  - "Django 6 + DRF (kskill-django-6-drf stack skill)"
  - "AWS operational skills (S3, IAM, ECS, CloudWatch, Secrets Manager, cost)"
  - "GitHub CLI + git worktrees (issue delivery party)"
  - "uv (Python tool installer for vault MCP)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# harness-default

> **Problem thesis (required):** Starting a fullstack project from scratch forces every team to reinvent governance—where the PRD lives, how decisions bind code, how agents should behave, and how important features enter with proof. This repository is a cloneable harness template that separates what the project *knows* (everything under `docs/`) from what it *is* (code roots and `state/`), encodes decisions as ADRs with explicit authority order, introduces **assertions** as owner-reserved laws that enter solutions only through TDD-linked proving tests, and ships a complete issue-to-PR delivery cast (`kwf-*` agents + `kskill-triage-and-fix`) with guardian safety nets and lifecycle hooks so agent-assisted work obeys the written law instead of inventing it.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/harness-default` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Template harness for fullstack projects—constitution, docs, ADRs as binding rules, assertions as the TDD entry path for solutions, and in-tree triage-and-fix delivery with skills, hooks, and an 18-node agent cast. |
| Audience | Project owners cloning a new repo; operators wiring agent runtimes (Claude Code, Kimi, Cursor/Grok); developers who want ADR-governed architecture and assertion-driven feature delivery; LLM agents instructed to build a harness from this model. |

## 2. Problems it solves

### P1 — Scattered project knowledge and agent lawlessness

- **Who hurts:** Teams starting greenfield fullstack work; operators running LLM agents on a codebase without a single authority order; anyone whose PRD, requirements, and architecture docs diverge from what agents "remember" in session context.
- **Pain today:** Constitution and decisions live in wikis, Slack, or ad-hoc README sections. Agents improvise policy. Code and docs disagree with no binding arbiter. Every new repo reinvents folder layout, naming, and doc tiers.
- **How this repo answers:** Everything the project *knows* lives under `docs/` with a strict tier model (`docs/constitution/` for stable binding material, loose `docs/` files for iterating knowledge, `docs/adrs/` for numbered binding decisions, `docs/assertions/` for optional owner laws). ADR-01 defines authority order: PRD → constitution → ADRs → other docs; where ADR and code disagree, the ADR wins. Agent tooling (`kskill-*`, `khook-*`, `kbot-*`, `kwf-*`) lives beside the law under `docs/` and is wired into runtimes via symlinks (`.claude/agents`, `.claude/skills`, `.claude/hooks`). Hooks inject PRD and API at session start, enforce API-doc-before-route rules, and nudge guardian dispatch after edits.
- **Out of scope:** Running application code (code roots ship empty with `.gitkeep` only); choosing cloud provider or stack for the adoptee (INFRASTRUCTURE and stack skills are templates to remap); replacing a team's existing CI/CD (optional GHA workflow for `kwf-deps` is documented but not vendored by default).

### P2 — Product promises without a proving path

- **Who hurts:** Owners who need enforceable quality or behavior laws (latency ceilings, data-display consistency, navigation depth limits); teams that write Gherkin scenarios but never connect them to permanent tests; agents that ship features against silent wishes.
- **Pain today:** Requirements enumerate what should hold but lack a single law with a mandatory test link. Backlog items masquerade as guarantees. TDD is cultural, not structural. No skill demands failing tests before implementation when a promise matters.
- **How this repo answers:** **Assertions** are the novel mechanism: a Gherkin use case collapsed into one checkable paragraph under `docs/assertions/`, with a mandatory `## RELATED` section whose `### Tests` chapter must link runnable tests that *demonstrate* the law. The `kskill-assertion-review` skill interprets each law, resolves links, demands tests per `docs/TDD.md` (tests first, code second, tests remain forever), and stamps `verified` only when green. Zero assertions is healthy; presence binds. Assertion-00 discipline and ADR-01 rule 6 forbid inventing laws without the owner.
- **Out of scope:** CI enforcement of assertions (left to the adopting project); replacing unit/integration test frameworks; managing assertion count or compute budget for the owner.

### P3 — Issue delivery without doctrine, guardians, or assertion gates

- **Who hurts:** Operators running GitHub issues through multi-agent PR workflows; maintainers who need PRD/ADR review before merge; teams where important features should enter as assertion laws, not silent code.
- **Pain today:** Ad-hoc agent loops skip planning against written law. Guardian review is manual or absent. Post-PR batches close without ADR/PRD checks. No standard cast for scout → plan → parallel implement → review → publish.
- **How this repo answers:** ADR-04 binds in-tree issue delivery: skill `docs/skills/kskill-triage-and-fix/`, 18 `kwf-*` cast agents under `docs/agents/`, and `bin/kwf-deps` for PR requirement/defer cascades. Phases: forest (hunter, falcon, hound) → tavern (routing) → camp (parallel specialists in git worktrees) → stalking → plaza (bard publishes) → post-bard guardian dispatch with `--bundle` payload and `kskill-assertion-review` when assertions were touched. ADR-03 defines `kbot-prd` and `kbot-adr` guardians with watchlist globs and verdict contracts. `khook-guardian-dispatch` and `khook-pre-commit` form the safety net. Runtime spawn maps live in `docs/skills/kskill-triage-and-fix/references/runtimes.md`.
- **Out of scope:** Hosting the delivery party outside this tree (explicitly rejected by ADR-04); guaranteeing any specific LLM runtime has native `kwf-*` registry support (Cursor/Grok injects agent files as prompts instead).

## 3. Product / idea

The harness is **scaffolding with opinion**, not a runnable app. Clone it, pick one code-root pair, fill constitution brackets, grow docs with code, and optionally wire issue delivery. The mental model splits knowledge from implementation:

```
docs/          → everything the project KNOWS (vault-indexed markdown)
frontend|backend OR interfaces|services → what the project IS (code)
state/         → database artifacts (gitignored contents)
```

Two layers of familiar governance sit on the scaffold: **PRD** at the top of authority, **ADRs** as binding rules (presence in `docs/adrs/` makes a rule in force). The **novel layer** is assertions—owner-reserved laws that are the only sanctioned entry path for important solutions, always arriving as proving tests then code.

Agent artifacts are prefixed by kind (`kskill-*` skills, `khook-*` hooks, `kbot-*` agents, `kwf-*` delivery cast) per ADR-02 rule 8. Ported stack skills wear a banner warning that origin ADR citations and cloud/path specifics are not in force until remapped.

The `docs/` tree is served as an Obsidian-style wikilink vault via `markdown-vault-mcp` (config in `.mcp.json` and `.cursor/mcp.json`), excluding `skills/`, `hooks/`, and `agents/` from the index to avoid `SKILL.md` basename collisions.

### 3.1 North-star use cases

1. **Clone and bootstrap:** Operator clones the template, deletes one code-root pair (`frontend`+`backend` *or* `interfaces`+`services`), links `khook-pre-commit`, installs `markdown-vault-mcp`, fills PRD brackets, and writes the first product ADR when a decision lands.
2. **Elevate a feature to law:** Owner writes `docs/assertions/assertion-NN-slug.md`, runs `kskill-assertion-review`, which demands failing tests under `### Tests`, then implementation until green; `verified` date stamps success.
3. **Deliver a GitHub issue to PR:** Operator invokes `kskill-triage-and-fix` with the `kwf-*` cast; forest scouts, inquisitor gates doctrine-first planning, camp specialists work in parallel worktrees, bard publishes; owner runs `khook-guardian-dispatch --bundle`, dispatches `kbot-prd`/`kbot-adr` on cheap tier, and runs assertion review if laws were touched.
4. **Reference without cloning:** Point an LLM at `kodexArg/harness-default` and instruct it to reproduce the harness structure (constitution tiers, ADR families, assertion discipline, agent naming) in a new project.

### 3.2 Non-goals

- Not a deployed application or library—code roots are empty placeholders.
- Not a second SSOT for agents outside `docs/agents/` (ADR-02 rule 4).
- Not a place for skills to invent product law without owner and proving path (ADR-02 rule 2).
- Not a generic skill pack without remapping—ported skills explicitly disclaim origin bindings (ADR-02 rule 5).
- Not mandatory assertions—a project with none is explicitly healthy (assertion-00).
- Not a committed CI pipeline (no `.github/workflows/` in tree; optional `gha-kwf-deps.yml` mentioned in CLONE for human-side defer cascades).

## 4. Technology stack

This template is **documentation-first**; runtime stack signals come from opinionated skills and conventions, not from application manifests in empty code roots.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Markdown + YAML frontmatter; Python 3 for hooks; optional Astro 7 / Django 6 stacks when adopted | `docs/constitution/CONVENTION.md`, `docs/hooks/*.py`, `docs/skills/kskill-astro-7/SKILL.md`, `docs/skills/kskill-django-6-drf/SKILL.md` |
| Frontend (adoption skill) | Astro 7.0.7, Svelte 5.56, HTMX 2.0, Melt UI, shadcn-svelte | `docs/skills/kskill-astro-7/SKILL.md` metadata |
| Backend (adoption skill) | Django 6.1b1 / 6.0.7 fallback, DRF 3.17, Python 3.14, psycopg 3, PostgreSQL 17 | `docs/skills/kskill-django-6-drf/SKILL.md` metadata |
| Data | PostgreSQL or SQLite in `state/` (gitignored); docker volumes expected on adoption | `docs/constitution/HARNESS.md` (`state/` section), `.gitignore` |
| Infra / deploy | AWS skills (S3, IAM, ECS/containers, CloudWatch, Secrets Manager, cost, observability, troubleshoot); no IaC committed | `docs/skills/kskill-aws-*`, `docs/constitution/INFRASTRUCTURE.md` (empty template) |
| AI / agents | 22 `kskill-*` skills, 13 `kbot-*` workers, 18 `kwf-*` delivery cast, 7 `khook-*` scripts, markdown-vault-mcp with fastembed embeddings | `docs/skills/`, `docs/agents/`, `docs/hooks/`, `.mcp.json` |
| Tests | TDD discipline for assertions; pytest referenced in Django skill; no test runner configured in empty code roots | `docs/TDD.md`, `docs/skills/kskill-django-6-drf/SKILL.md` |
| Docs vault | markdown-vault-mcp, BAAI/bge-small-en-v1.5 embeddings, index under `.mvmcp/` (gitignored) | `.mcp.json`, `.cursor/mcp.json` |

### 4.1 Notable dependencies (curated)

- **markdown-vault-mcp** — indexes `docs/` as a wikilink graph for agent queries; excludes tooling folders from index.
- **fastembed / BAAI/bge-small-en-v1.5** — local embedding provider configured for vault semantic search.
- **gh + git worktrees** — required by `kskill-triage-and-fix` for issue delivery and parallel camp specialists.
- **uv** — recommended installer for `markdown-vault-mcp` per `docs/CLONE.md`.
- **kskill-assertion-review** — standing law skill; laws → tests → code.
- **kskill-triage-and-fix** — standing delivery skill; issue → PR party with guardian close-out.
- **kskill-orchestrator** — main chat as team lead over `kbot-*` workers (planner, builder, auditor, critic, janitor, etc.).
- **kskill-markdown-vault / kskill-obsidian-markdown** — vault query and Obsidian-flavored markdown conventions.
- **kskill-report / kskill-reporte** — self-contained dark HTML report generators (English/Spanish twins).

## 5. Repository map (abstraction)

| Zone | Purpose |
|------|---------|
| `docs/constitution/` | Stable binding tier: PRD, REQUIREMENTS, HARNESS, CONVENTION, LOCALISATION, INFRASTRUCTURE (mostly bracket templates awaiting fill) |
| `docs/` (loose) | Iterating knowledge: GLOSSARY, USE-CASES, USER-STORIES, TDD, CLONE, ARCHITECTURE, API, FRONTEND, BACKEND, INTERFACES, SERVICES |
| `docs/adrs/` | Five harness ADRs: adr-00 discipline, adr-01 constitution, adr-02 harness tooling, adr-03 guardians, adr-04 issue delivery |
| `docs/assertions/` | Assertion family; ships assertion-00 discipline only (no product laws yet) |
| `docs/skills/` | 22 skill packages (`kskill-*`), each with `SKILL.md` and optional `references/`, `bin/` |
| `docs/hooks/` | Seven hook scripts: guardian dispatch, pre-commit, SSOT load, API/ADR checks, PR-flow reminder |
| `docs/agents/` | 13 `kbot-*` orchestration/guardian agents, 18 `kwf-*` delivery cast, optional `souls/` personality sidecars |
| `docs/obsolete/` | Retired ADR slot (empty theme retirement path) |
| `frontend/` + `backend/` | Specific fullstack pair (classic webapp); empty except `.gitkeep` |
| `interfaces/` + `services/` | Generalistic pair (constellation of UIs and services); empty except `.gitkeep` |
| `state/` | Database state directory; contents gitignored |
| `.claude/` | Symlinks to `docs/agents`, `docs/skills`, `docs/hooks`; `settings.json` hook wiring; `workflows/kwf-triage-and-fix.js` |
| `.cursor/` | `mcp.json` vault server config for Cursor |
| `.mcp.json` | Root MCP config for markdown-vault-harness |
| Root `README.md` | Only README (outside vault; basename uniqueness rule) |

**Entrypoints:** No application entrypoints. Operator entry is `docs/CLONE.md` checklist. Agent entry is skill discovery paths and `.claude/settings.json` lifecycle hooks.

**Generated / vendor:** `.mvmcp/` local vault index (gitignored); `.claude` session scratch patterns gitignored.

## 6. Configuration & contracts (no secrets)

### Environment and MCP bindings

| Name | Purpose |
|------|---------|
| `MARKDOWN_VAULT_MCP_SOURCE_DIR` | Vault root (`docs`) |
| `MARKDOWN_VAULT_MCP_READ_ONLY` | Write access flag for vault MCP |
| `MARKDOWN_VAULT_MCP_INDEX_PATH` | SQLite index path under `.mvmcp/data/` |
| `MARKDOWN_VAULT_MCP_EMBEDDINGS_PATH` | Embedding storage path |
| `MARKDOWN_VAULT_MCP_STATE_PATH` | MCP state JSON path |
| `MARKDOWN_VAULT_MCP_EMBEDDING_PROVIDER` | `fastembed` |
| `MARKDOWN_VAULT_MCP_FASTEMBED_MODEL` | `BAAI/bge-small-en-v1.5` |
| `MARKDOWN_VAULT_MCP_EXCLUDE` | `skills/**,hooks/**,agents/**` |

### Gitignore contract

Secrets (`.env`, `.env.*`), `state/*` contents, `node_modules/`, `__pycache__/`, `.venv/`, `dist/`, `.mvmcp/`, and Claude session scratch under `.claude/`.

### Hook lifecycle contract (Claude Code)

| Hook | Event | Duty |
|------|-------|------|
| `khook-load-ssot.py` | SessionStart | Inject PRD and API |
| `khook-require-api-read.py` | UserPromptSubmit | Force API re-read when routes touched |
| `khook-require-pr-flow.py` | PreToolUse (Bash) | Issue→PR reminder on commit/push to main |
| `khook-check-adr.py` | PostToolUse (Write\|Edit) | ADR shape validation |
| `khook-check-api.py` | PostToolUse (Write\|Edit) | Block `urls.py` routes without API.md row |
| `khook-dispatch-guardians.py` | PostToolUse (Write\|Edit) | Guardian dispatch safety net |

### Agent naming contract

- `kskill-*` — instruction packages
- `khook-*` — lifecycle/git automation
- `kbot-*` — agent roles (guardians, orchestration workers)
- `kwf-*` — delivery party members with phase assignments

### 6.1 HTTP / API endpoints (when applicable)

This template ships **no HTTP surface**. `docs/API.md` is the SSOT for future endpoints and explicitly states that a route in `urls.py` without a row in the API table does not exist; `khook-check-api.py` enforces that contract on adoption.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | — | No endpoints declared yet (placeholder row in API.md) | — |

When a project adopts `frontend`+`backend` or `interfaces`+`services`, operators must add rows to `docs/API.md` before implementing routes.

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| **Skills** | `docs/skills/<name>/SKILL.md` loaded on demand by agent runtimes |
| **Guardian dispatch CLI** | `docs/hooks/khook-guardian-dispatch` with optional `--bundle` for hit files, diff, ADR use_case index |
| **Issue delivery deps** | `docs/skills/kskill-triage-and-fix/bin/kwf-deps` for `requires:N` label cascades |
| **Pre-commit safety net** | `docs/hooks/khook-pre-commit` symlinked to `.git/hooks/pre-commit` (warn-only) |
| **Vault MCP** | `markdown-vault-mcp serve` with env from `.mcp.json` |
| **Workflow JS** | `.claude/workflows/kwf-triage-and-fix.js` — large workflow definition for triage party |
| **Markdown wikilinks** | `[[note-basename]]` resolution across `docs/` vault |

## 7. Data & persistence

- **Template state:** `state/` exists for database artifacts (PostgreSQL docker volumes, SQLite files, dumps). Contents are gitignored; only the folder and `.gitkeep` are tracked.
- **Vault index:** `.mvmcp/data/index.db`, embeddings, and state JSON are local per clone (gitignored).
- **No application entities:** No migrations, models, or ORM schemas in tree—adopting projects populate `state/` and document stores in `docs/BACKEND.md` or `docs/SERVICES.md`.
- **Topology:** Knowledge is edge-local in markdown files; optional vault MCP adds semantic index. Code and DB state live outside the vault in code roots.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **Root README** — harness overview, assertion thesis, structure table, agent tooling inventory, license (MIT).
2. **`docs/constitution/HARNESS.md`** — tiers vs families, code-root duality, vault rules, issue delivery model, hook table.
3. **`docs/constitution/PRD.md`** — authority pointer to assertions, use cases, user stories, requirements (bracket template).
4. **`docs/CLONE.md`** — first-run checklist: code-root pick, pre-commit, vault, skills remap, delivery wiring.
5. **`docs/TDD.md`** — tests-first rule for assertion-driven work.
6. **`docs/API.md`** — endpoint SSOT contract (empty table).
7. **`docs/assertions/assertion-00-discipline.md`** — assertion format, naming, review procedure.
8. **`docs/adrs/adr-01-constitution.md`** — authority order, tier rules, assertion laws.
9. **`docs/adrs/adr-02-harness.md`** — skills/hooks/agents home, naming prefixes, ported-skill banner policy.
10. **`docs/adrs/adr-03-guardians.md`** — `kbot-prd`/`kbot-adr`, dispatch `--bundle`, cheap-tier default.
11. **`docs/adrs/adr-04-issue-delivery.md`** — triage-and-fix SSOT, phases, assertion TDD gate, forbidden shortcuts.
12. **`docs/skills/kskill-assertion-review/SKILL.md`** — law enforcement procedure.
13. **`docs/skills/kskill-triage-and-fix/SKILL.md`** — delivery party playbook overview.
14. **`docs/skills/kskill-astro-7/SKILL.md`** and **`docs/skills/kskill-django-6-drf/SKILL.md`** — stack opinion metadata (ported banners).
15. **`.claude/settings.json`** — Claude Code hook wiring (symlinks to `docs/hooks`).
16. **`.mcp.json`** and **`.cursor/mcp.json`** — vault MCP server configuration.

### `.claude/` scan

- Symlinks: `agents → ../docs/agents`, `skills → ../docs/skills`, `hooks → ../docs/hooks` (single SSOT, no duplicate agent definitions).
- `settings.json` wires SessionStart, UserPromptSubmit, PreToolUse, and PostToolUse hooks to `docs/hooks/khook-*.py`.
- `workflows/kwf-triage-and-fix.js` — workflow asset for delivery party (38KB).
- Session scratch patterns (`.nudge-seen-*`, `*.lock`, `.graph-index-marker`) are gitignored.

### `.docs/` scan

- **Not present** in this repository. No hidden docs vault at `.docs/`.

### Agent cast inventory (evidence paths)

- **Delivery cast (`kwf-*`, 18):** `docs/agents/kwf-archer.md` through `kwf-warrior.md` (forest, camp, stalking, plaza roles).
- **Guardians (`kbot-*`):** `docs/agents/kbot-prd.md`, `docs/agents/kbot-adr.md`.
- **Orchestration workers (`kbot-*`):** planner, builder, auditor, critic, low/medium/high, janitor, changelog, document-this, evaluate.
- **Souls:** `docs/agents/souls/` — optional personality sidecars referenced by `soul:` frontmatter.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public template; no private credentials or deployment targets committed.
- **Secrets handling:** `.env` and `.env.*` are gitignored; this summary contains no tokens, keys, or connection strings.
- **Auth model:** None in template. `docs/API.md` Auth section awaits project-specific ADR.
- **Guardian gate:** `kbot-prd` and `kbot-adr` block `violation`/`danger` verdicts until resolved; `needs-new-adr` routes through ADR lifecycle.
- **Ported skill risk:** Stack skills may cite origin cloud accounts and paths in banners—explicitly not in force until remapped (ADR-02 rule 5).
- **Pre-commit:** Warns on owed guardians; does not block commits (owner process must still dispatch).

## 10. Operational picture

### Local development (adopting project)

1. Pick code-root pair per `docs/CLONE.md`.
2. `ln -s ../../docs/hooks/khook-pre-commit .git/hooks/pre-commit`
3. `uv tool install markdown-vault-mcp` (recommended).
4. Fill `docs/constitution/PRD.md` brackets; write first product ADR.
5. Remap or delete ported `kskill-aws-*` / stack skills as needed.
6. Verify runtime sees `docs/agents/kwf-*.md` and `kskill-triage-and-fix` for issue delivery.

### This template as-is

- No `package.json` at root; no `bun install` or build step for the harness itself.
- No `.github/workflows/` committed; optional `docs/skills/kskill-triage-and-fix/extras/gha-kwf-deps.yml` for adopters.
- MIT license (`LICENSE`).

### Deployment

Not applicable to the template. `docs/constitution/INFRASTRUCTURE.md` is an empty bracket template for the adopting project to fill.

## 11. Open questions / unknowns

- **Adopter stack choice:** Empty code roots—actual frontend/backend or interfaces/services implementation is unknown until clone customization.
- **CI/CD:** No in-tree GitHub Actions; whether adopters enable `gha-kwf-deps.yml` is operator choice.
- **Product assertions:** Only assertion-00 discipline ships; no product-specific laws yet.
- **PRD / REQUIREMENTS / INFRASTRUCTURE content:** Bracket templates not filled in template (intentional).
- **ARCHITECTURE.md:** Header only—no system diagram in template.
- **Default runtime:** Delivery playbook supports Kimi, Claude Code, and Cursor/Grok via `runtimes.md`; native `kwf-*` registry availability varies by host.
- **`.docs/` vault:** Absent; not all harness clones use a hidden docs directory.
