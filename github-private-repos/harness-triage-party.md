---
id: "harness-triage-party"
title: "harness-triage-party — Kimi-native triage-and-fix agent party"
visibility: private
importance: high
source_repo: "harness-triage-party"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "skill"
status: "active"
related: []
tags: ["kimi", "agents", "triage-and-fix", "github", "pr-requirements", "workflow", "python", "markdown", "kwf"]
problems_solved:
  - "Claude Code has a deterministic Workflow runtime for kdx-wf-triage-and-fix, but Kimi Code CLI has no equivalent — orchestration must be encoded as a skill playbook plus typed YAML contracts between subagents."
  - "GitHub offers no native 'do not merge before PR #N' dependency — stacked PR work silently strands when a prerequisite is deferred or closed unmerged."
  - "Parallel multi-slice builds need path-disjoint camp specialists (backend, frontend, devops, design) rather than a hardcoded two-way split, with doctrine gates before builders wake."
technologies:
  - "Kimi Code CLI (Agent tool, subagent dispatch, resume)"
  - "Markdown agent definitions (tools allowlists, YAML output contracts)"
  - "Python 3 stdlib (kwf-deps CLI)"
  - "GitHub CLI (gh)"
  - "Git worktrees"
  - "GitHub Actions (optional cascade workflow)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# harness-triage-party

> **Problem thesis (required):** This repository is the single source of truth for **kdx-kimi-triage-and-fix** — a Kimi-native port of the Claude Code triage-and-fix workflow. It solves three intertwined pains: (1) Kimi has no Workflow runtime, so reliability must come from a deterministic skill playbook, closed YAML contracts, and tool-grant enforcement in agent definitions; (2) GitHub cannot express PR merge ordering, so work that builds on unmerged PRs needs a labels-only REQUIREMENT system with transitive defer cascade; (3) real issues often span disjoint file sets that should be built in parallel by role-specialized agents (backend, frontend, devops, design) with doctrine review before any code is written.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/harness-triage-party` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | The Kimi-native triage-and-fix party: eighteen `kwf-*` agent cast definitions, one orchestration skill, and a Python CLI that manages PR requirement labels and defer cascades. |
| Audience | Operators running Kimi Code CLI against kodexArg repos; the main Kimi agent executing the skill; developers vendoring the optional GitHub Actions cascade workflow. |

## 2. Problems it solves

### P1 — No deterministic Workflow runtime on Kimi

- **Who hurts:** Teams that already run `kdx-wf-triage-and-fix` on Claude Code and want the same end-to-end issue-to-PR pipeline on Kimi Code CLI.
- **Pain today:** Claude's Workflow runtime enforces phase order, branching, and structured outputs. Kimi exposes `Agent` dispatch and resume but no schema-enforced subagent output — orchestration would otherwise drift into prose improvisation.
- **How this repo answers:** The skill `skills/kdx-kimi-triage-and-fix/SKILL.md` is the script: the main agent follows fixed phases (forest → tavern → camp → stalking → plaza) with explicit quick exits. Each `agents/kwf-*.md` node declares a closed YAML output contract as its final message; the main agent parses typed fields and branches. Tool grants in frontmatter (`tools: []` means zero tools) enforce what nodes can and cannot do — "a grant is a claim; a prompt is a wish." `references/cast.md` is the node spec SSOT.
- **Out of scope:** A hosted workflow engine, Kimi product changes, or automatic tier enforcement beyond dispatch-time `model` pins and optional `model_preference: secondary` in config.

### P2 — PR dependency and defer propagation on GitHub

- **Who hurts:** Anyone stacking PRs where later work assumes an unmerged prerequisite, or issues that declare `Requires PR: #N` in the body.
- **Pain today:** GitHub has no first-class merge ordering. When a prerequisite PR is labeled `deferred` or closed unmerged, dependent PRs can remain open and look mergeable while their ground is gone.
- **How this repo answers:** Labels-only contract: `requires:<N>` on a PR means "must not merge before PR #N"; `deferred` means the hunt is off. `bin/kwf-deps` implements `requires`, `check`, `cascade`, `lift`, and `status` using `gh` and Python stdlib. The hunter checks issue-side `Requires PR: #N` at intake; the mage sets `baseRef` and `prRequirements` in the plan; the bard declares labels at publish and runs cascade on deferral. `extras/gha-kwf-deps.yml` vendors an Actions trigger for human-side defers.
- **Out of scope:** Branch protection rules, merge queues, or parsing requirement declarations from PR comment text (the label is the machine contract).

### P3 — Parallel, role-aware builds with governance gates

- **Who hurts:** Issues that touch backend, frontend, infra, and cosmetic surfaces in one hunt — a single generic builder cannot split work cleanly or enforce path-disjoint parallel slices.
- **Pain today:** A two-way backend/frontend split is too coarse; unreviewed plans reach builders; secrets can slip into diffs; code review conflates intent with legibility.
- **How this repo answers:** The mage (or sorcerer for `difficulty: trivial`) emits `slices: [{name, builder, files}]` with path-disjoint file sets, each assigned to a camp specialist (`warrior`, `thief`, `dwarf`, `archer`, `elf-mage`, `paladin`). Builders create their own git worktrees and branches from `baseRef`. The inquisitor reviews the plan against PRD and ADRs before camp (up to two resume loops). The priest scans the combined diff for secrets with zero tools. The shadow performs a blind legibility review with zero tools. The bard merges slice branches into one PR.
- **Out of scope:** Post-bard hooks (guardian, verifier, smoke-test pause), shadow-to-builder retry loops, and priest appeal paths — noted as open in `references/cast.md`.

## 3. Product / idea

The repository is not an application server — it is an **agent harness**: markdown cast definitions plus one skill playbook plus a small GitHub automation CLI. After installation (cast paths registered in Kimi `extra_agent_dirs`, skill on the path the operator uses), a human or main agent can run **one GitHub issue end to end** through a fixed party:

```
forest     hunter + falcon + hound (parallel)
              ↓ quick exits (vampiro, duplicate, ground-unfit, requirement-unmet)
tavern     mage | sorcerer → inquisitor (doctrine loop, ≤2)
              ↓
camp       N specialists in parallel → priest (secret gate)
              ↓
stalking   shadow (blind review)
              ↓
plaza      bard → one PR or issue comment → kwf-deps cascade if deferred
```

The **main Kimi agent is the script** — there is no separate runtime process. Determinism lives in phase order, closed enums in YAML contracts, and tool allowlists. Fiction (Spanish flavor lines, prey names) is a closed render for humans; nodes never produce or consume it.

Model tiers are pinned at dispatch: mage and inquisitor on `kimi-code/k3-256k`; sorcerer on `kimi-code/kimi-for-coding-highspeed` for trivial hunts; familiars on cheapest `kimi-code/kimi-for-coding`; heavy camp pair (`elf-mage`, `paladin`) on k3-256k. Builders inherit the caller's model unless explicitly pinned.

### 3.1 North-star use cases

1. **Standard hunt:** Operator says "triage-and-fix issue #42" — forest triages, mage plans with doctrine read, three camp specialists build disjoint slices in worktrees, gates pass, bard opens one PR with honest test and deviation reporting.
2. **Stacked PR work:** Issue or plan requires unmerged PR #15 — mage sets `baseRef` to PR #15's head; bard opens new PR with `requires:15` labels via `kwf-deps requires`.
3. **Defer cascade:** Prerequisite PR #15 is closed unmerged — bard or Actions runs `kwf-deps cascade 15`; every open PR transitively requiring #15 gets `deferred` and an explanatory comment; `lift` clears dependents when requirements merge.

### 3.2 Non-goals

- Not a general-purpose agent framework — every `kwf-*` definition is scoped to `whenToUse: Only inside the kdx-kimi-triage-and-fix skill`.
- Not the Claude original (`kdx-wf-triage-and-fix`) — this is the Kimi port with generalized camp roster and PR REQUIREMENT system.
- No router agent — tavern routing is an `if` on `hunter.domain` and `hunter.difficulty` in the main agent.
- Post-publish verification hooks and shadow→builder retry remain explicitly unbuilt per `references/cast.md`.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (CLI), Markdown (agents + skill) | `skills/kdx-kimi-triage-and-fix/bin/kwf-deps`, `agents/kwf-*.md` |
| Agent platform | Kimi Code CLI — `Agent` tool, `subagent_type`, resume | `skills/kdx-kimi-triage-and-fix/SKILL.md`, `references/cast.md` |
| VCS integration | Git worktrees, branches; `gh` for issues/PRs/labels | agent builder contracts, `bin/kwf-deps` |
| CI / deploy | Optional GitHub Actions workflow (vendor copy) | `skills/kdx-kimi-triage-and-fix/extras/gha-kwf-deps.yml` |
| AI / agents | 18 custom subagents (`kwf-*`), 1 skill (`kdx-kimi-triage-and-fix`) | `agents/`, `skills/kdx-kimi-triage-and-fix/SKILL.md` |
| Tests | Python stdlib test harness with stubbed `gh` | `skills/kdx-kimi-triage-and-fix/tests/test-deps.py` |

### 4.1 Notable dependencies (curated)

- **`gh` (GitHub CLI)** — sole GitHub API surface for `kwf-deps` and for bard/hunter mutations; auth via user's `gh` session.
- **Python 3 stdlib** — `kwf-deps` uses `argparse`, `json`, `subprocess` only; no pip packages.
- **Git with worktree support** — each camp specialist creates `git worktree add` on first act per builder contract.
- **Kimi Code CLI** — requires `extra_agent_dirs` pointing at `agents/` so `kwf-*` subagent types resolve; skill compatibility notes in `SKILL.md` frontmatter.

## 5. Repository map (abstraction)

- **Entrypoints:** No long-running service. Operational entry is the skill `skills/kdx-kimi-triage-and-fix/SKILL.md` (invoked by name/description) and CLI `skills/kdx-kimi-triage-and-fix/bin/kwf-deps`.
- **Agent cast (`agents/`):** Eighteen markdown agent definitions — forest (`hunter`, `falcon`, `hound`), tavern planners and familiars (`mage`, `sorcerer`, `owl`, `cat`, `mouse`, `inquisitor`; `hound` reused as familiar), camp builders (`warrior`, `thief`, `dwarf`, `archer`, `elf-mage`, `paladin`), gates and terminal (`priest`, `shadow`, `bard`). Each file: frontmatter (`name`, `description`, `tools`, optional `subagents`, `model_preference`), role prose, YAML output contract.
- **Skill bundle (`skills/kdx-kimi-triage-and-fix/`):** Orchestration playbook (`SKILL.md`), reference specs (`references/cast.md`, `references/deps.md`), CLI (`bin/kwf-deps`), optional GHA template (`extras/gha-kwf-deps.yml`), local tests (`tests/test-deps.py`).
- **Domain / core:** Phase logic and contracts live in `SKILL.md` + `references/cast.md`; PR requirement semantics in `references/deps.md`.
- **Adapters:** `gh` subprocess wrapper inside `kwf-deps`; bash/git commands in bard and builder prompts.
- **Docs vaults:** No root `README`, no `docs/`, no `.docs/`, no `.claude/` in tree — documentation is embedded in skill and reference markdown.
- **Generated / vendor:** None in-repo; GHA workflow fetches `kwf-deps` at runtime when vendored (pin `KWF_DEPS_REF` in workflow).

## 6. Configuration & contracts (no secrets)

- **Kimi install paths (operator machine):** Cast expected at `~/Dev/harness-triage-party/agents/kwf-*.md` per skill docs; discovered via `extra_agent_dirs` in `~/.kimi-code/config.toml`. Sessions started before install will not resolve `kwf-*` types.
- **Secondary model experiment:** Mage and k3 camp pair may use `model_preference: secondary` bound to `[secondary_model] model = "kimi-code/k3-256k"` when `KIMI_CODE_EXPERIMENTAL_SECONDARY_MODEL=1` in shell env.
- **GitHub labels (created on demand by `kwf-deps`):** `requires:<N>` (gray), `deferred` (red) — no repo bootstrap required.
- **Issue intake convention:** `Requires PR: #N` or `Requires: #N, #M` in issue body — checked by hunter via `kwf-deps status`.
- **Plan fields:** `baseRef` (branch for worktrees), `prRequirements` (PR numbers for bard to label), `slices` (path-disjoint builder assignments).

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP server**. All external integration is via GitHub's API through the `gh` CLI (issues, PRs, labels, comments). There is no OpenAPI surface, Workers routes, or web handlers in-tree.

### 6.2 Other interfaces

**CLI — `kwf-deps`**

| Subcommand | Purpose |
|------------|---------|
| `requires <pr> <N...>` | Declare PR merge requirements (`requires:N` labels + comment) |
| `check <pr>` | Exit 0 iff all requirements merged; exit 2 if unmet |
| `cascade <pr>` | Transitively label `deferred` on dependents of a deferred/closed-unmerged PR |
| `lift <pr>` | Remove `deferred` from PRs whose requirements are all merged |
| `status <pr>` | Print requirement chain and states |

Global flags: `--repo OWNER/REPO`, `--dry-run`.

**Kimi subagent types:** `kwf-hunter`, `kwf-falcon`, `kwf-hound`, `kwf-mage`, `kwf-sorcerer`, `kwf-owl`, `kwf-cat`, `kwf-mouse`, `kwf-inquisitor`, `kwf-warrior`, `kwf-thief`, `kwf-dwarf`, `kwf-archer`, `kwf-elf-mage`, `kwf-paladin`, `kwf-priest`, `kwf-shadow`, `kwf-bard` — dispatched via Kimi `Agent` tool with `subagent_type`.

**Skill invocation:** Trigger phrases include "triage-and-fix", "kimi triage", naming a `kwf-*` node, or running an issue through the party / defer-require PR flows per `SKILL.md` description.

## 7. Data & persistence

No databases, KV, or vector stores. State is entirely **GitHub-native**:

- Issues and PRs hold human-readable bodies; machine contracts are **labels** (`requires:N`, `deferred`).
- Git branches and worktrees hold in-flight code per builder slice until bard merges and pushes.
- `kwf-deps` reads live PR state via `gh pr view` / `gh pr list`; mutations are label add/remove and comments.
- Local test fixture in `tests/test-deps.py` simulates PR graphs in JSON — not shipped runtime state.

Topology: operator machine runs Kimi + git + `gh`; target repo may vendor GHA workflow for cascade on web UI events; no edge or offline persistence layer.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **`skills/kdx-kimi-triage-and-fix/SKILL.md`** — full orchestration playbook, phase diagram, REQUIREMENT system summary, editing rules, file map.
2. **`skills/kdx-kimi-triage-and-fix/references/cast.md`** — runtime contract, cast table with tools and tiers, per-node ownership, open items.
3. **`skills/kdx-kimi-triage-and-fix/references/deps.md`** — label semantics, intake/planning/deferral moments, CLI reference, invariants.
4. **`agents/kwf-hunter.md`** — forest triage, four ground checks, YAML contract fields.
5. **`agents/kwf-mage.md`** — planner doctrine-first read, familiars, slice plan contract.
6. **`agents/kwf-sorcerer.md`** — trivial-tier planner sibling to mage.
7. **`agents/kwf-inquisitor.md`** — pre-camp doctrine gate.
8. **`agents/kwf-warrior.md`** — representative camp builder (worktree, slice-only edits).
9. **`agents/kwf-priest.md`** — secret-scan gate, zero tools.
10. **`agents/kwf-shadow.md`** — blind diff review, zero tools.
11. **`agents/kwf-bard.md`** — terminal publish, PR merge, cascade duty.
12. **`skills/kdx-kimi-triage-and-fix/bin/kwf-deps`** — implementation of cascade/lift/requires.
13. **`skills/kdx-kimi-triage-and-fix/extras/gha-kwf-deps.yml`** — Actions trigger contract.
14. **`skills/kdx-kimi-triage-and-fix/tests/test-deps.py`** — behavioral spec for CLI.

**Not present (scanned):** root `README*`, `docs/**`, `.docs/**`, `.claude/**`, ADRs, PRDs, `package.json`, `pyproject.toml`, `.gitignore`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private kodexArg repo — cast and skill describe internal agent orchestration; summary contains no clone URLs or tokens.
- **Auth model:** `gh` uses the operator's authenticated GitHub session; GHA workflow uses `GITHUB_TOKEN` with `pull-requests: write` and `issues: write` when vendored.
- **Secret handling in workflow:** Priest gate explicitly forbids shipping secrets; findings cite location and kind only, never values. This summary contains no credentials, `.env` contents, or key material.
- **GHA fetch:** Vendored workflow downloads `kwf-deps` from a pinned ref — operators should pin `KWF_DEPS_REF` to a trusted tag/SHA.

## 10. Operational picture

**Local setup (operator):**

1. Clone or sync `harness-triage-party` to the path Kimi expects (skill references `~/Dev/harness-triage-party`).
2. Register `agents/` in `~/.kimi-code/config.toml` `extra_agent_dirs`.
3. Ensure `gh auth login`, `git` worktrees, `python3` on PATH.
4. Install skill per Kimi skill discovery (path depends on operator layout).

**Running a hunt:** Main Kimi agent loads `kdx-kimi-triage-and-fix` skill and follows `SKILL.md` step by step — parallel `Agent` calls per phase, resume for doctrine loop.

**Testing `kwf-deps`:** `python3 skills/kdx-kimi-triage-and-fix/tests/test-deps.py` from skill directory — stubbed `gh`, no network.

**Deploy:** No hosted deploy. Optional: copy `extras/gha-kwf-deps.yml` to target repo `.github/workflows/kwf-deps.yml` for cascade automation on PR close/label events.

**Hardware constraints:** None — CLI and markdown only; model quota/tier costs are the main operational constraint (k3 vs K2.7 highspeed vs standard).

## 11. Open questions / unknowns

- Exact consumer repo layout for skill install (skill frontmatter references `~/Dev/harness-triage-party` — may differ per machine).
- Whether `gha-kwf-deps.yml` fetch URL still points at `kdx-kimi-triage-and-fix` repo vs this `harness-triage-party` repo after rename/split — workflow comment says adjust `KWF_DEPS_REF` and source path.
- Shadow `needs-work` → builder retry loop remains unbuilt.
- Tier enforcement beyond dispatch pins relies on operator discipline and optional `model_preference` config.
- No root README — onboarding is entirely via skill + references.
- License field null on GitHub metadata; skill frontmatter declares MIT compatibility — repo-level license file not present in shallow clone.
