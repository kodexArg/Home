---
id: "cowsay"
title: "cowsay — deterministic ASCII cow renderer for AI agents"
visibility: public
importance: normal
source_repo: "cowsay"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "skill"
status: "active"
related: []
tags: ["python", "stdlib", "agent-skill", "cowsay", "ascii-art", "cli", "deterministic", "terminal", "skills-sh", "mit"]
problems_solved:
  - "AI agents freehand ASCII cowsay art, producing crooked, inconsistent dialog boxes and cow silhouettes that vary between replies."
  - "System cowsay or pip-installed dependencies are unavailable, undesirable, or non-deterministic in agent sandboxes and skills ecosystems."
  - "Agent skills lack a bundled, testable, stdlib-only renderer with explicit contracts for width, cow switching, and persistent art preferences."
technologies:
  - "Python 3 (stdlib only)"
  - "Agent Skills format (SKILL.md)"
  - "skills.sh distribution (npx skills add)"
  - "unittest golden tests"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# cowsay

> **Problem thesis (required):** kodexArg/cowsay exists because AI coding agents routinely improvise cowsay-style ASCII art by hand, and the results are visually inconsistent, misaligned, and non-reproducible. The repository ships a **deterministic, stdlib-only Python renderer** plus an **Agent Skills** instruction pack so agents pipe every cowsay-mode reply through `bin/cowsay` and display only its stdout. The renderer is law: same text, same flags, same width environment → same bytes every time.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/cowsay` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Deterministic cowsay agent skill — Python 3 stdlib renderer + SKILL.md for chat and CLI use. |
| Audience | AI agent runtimes (Claude Code, Cursor, skills.sh consumers), developers who want a portable cowsay without system packages, and operators packaging kodexArg skills. |

## 2. Problems it solves

### P1 — Inconsistent agent-generated ASCII art

- **Who hurts:** Users in cowsay mode, agent harness authors, and anyone expecting classic terminal cowsay aesthetics from an LLM.
- **Pain today:** Models draw speech balloons and cows from memory. Box borders drift, alignment breaks with wide Unicode, cow faces change between turns, and thought-bubble stems do not match classic cowsay conventions.
- **How this repo answers:** A bundled `bin/cowsay` composes `lib/dialog.py` (Unicode balloon, terminal-aware wrap) and `lib/art.py` (cowfile load, faces, active-cow persistence). `SKILL.md` and `AGENTS.md` mandate: never freehand art; always run the binary and show only stdout inside one fenced block.
- **Out of scope:** General-purpose rich terminal UI, image generation, or replacing the agent's natural-language reasoning — only the final rendered artifact is standardized.

### P2 — Dependency and sandbox friction

- **Who hurts:** Agent sandboxes without `apt`, air-gapped environments, and skills installers that forbid pip/network during skill activation.
- **Pain today:** System `cowsay` may be missing; Python ports often pull dependencies; ad-hoc scripts duplicate wrap logic poorly and fail on East Asian width or combining marks.
- **How this repo answers:** Zero third-party packages — only Python 3 standard library (`argparse`, `pathlib`, `unicodedata`, `subprocess` in tests). Install via skills ecosystem (`npx skills add kodexArg/cowsay`). No network at runtime.
- **Out of scope:** Packaging as a PyPI wheel, Docker images, or cross-language bindings — the deliverable is a skill tree with an executable script.

### P3 — Cow switching and persistent preferences without coupling layers

- **Who hurts:** Users who want `/cowsay tux`, moose art, or custom `.cow` files; maintainers adding new animals.
- **Pain today:** Monolithic cowsay clones mix balloon geometry with cow ASCII; changing art risks breaking wrap or box width calculations.
- **How this repo answers:** Strict layer separation: `dialog.py` knows nothing about `.cow` paths; `art.py` knows nothing about balloon glyphs. Cowfiles use `$thoughts`, `$eyes`, `$tongue` placeholders. Active cow resolves via `-f` → `COWSAY_COW` → `.active-cow` → `default`. `--set-cow` persists choice; `COWPATH` adds external directories with symlink-escape guards.
- **Out of scope:** A GUI cow picker, cloud-synced preferences, or a cowfile editor — stems come from `cowsay -l` only.

## 3. Product / idea

The repository is a **skills.sh-style agent skill package** wrapped in a minimal GitHub repo. The repo root holds marketing (`README.md`), license, demo image, and a `skills/cowsay/` subtree that is the actual skill root after install. The mental model is a **pure function pipeline**:

1. **Input:** UTF-8 text (stdin, argv message, or heredoc) plus CLI flags.
2. **Dialog layer:** Normalize text, soft-wrap to display columns (not naive codepoint counts), build rounded Unicode box (`╭─╮│╰╯`) with minimum three text rows and width floored by cow silhouette.
3. **Art layer:** Load `.cow` resource, substitute face variables, append below the balloon.
4. **Output:** Single deterministic string to stdout.

Agents enter **cowsay mode** when the user invokes `/cowsay` or equivalent; every subsequent reply is piped through the binary at terminal-aware width. Users can switch art (`/cowsay tux`), request thought bubbles (`cowthink` / `--think`), or exit back to normal chat.

### 3.1 North-star use cases

1. **Chat cowsay mode:** User says `/cowsay`; agent resolves `SKILL_ROOT`, computes wrap width from `COLUMNS` / `stty`, pipes full answer through `bin/cowsay`, displays stdout only.
2. **One-shot render:** User says `/cowsay hello world` or pipes CLI text; binary renders once without entering persistent mode.
3. **Art swap:** User names a stem from `-l` (`default`, `moose`, `tux` bundled); agent runs `--set-cow <stem>` and confirms with a rendered message showing the new animal.
4. **Local CLI / scripting:** Developer runs `printf 'moo' | bin/cowsay` or `bin/cowsay -l` without any agent involved.
5. **Custom cows:** Operator drops `*.cow` into `cows/` or sets `COWPATH`; dialog logic unchanged.

### 3.2 Non-goals

- No system package installation (`apt install cowsay` is explicitly forbidden in agent rules).
- No freehand ASCII by the agent when the skill is active.
- No balloon logic inside `.cow` files or cow geometry inside `dialog.py`.
- No `SKILL.md` at repo root — skill lives under `skills/cowsay/` per package convention.
- No HTTP server, database, or cloud deployment surface.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.x, stdlib only | `skills/cowsay/bin/cowsay` shebang; `SKILL.md` prerequisites |
| Frontend | N/A | — |
| Backend / API | N/A (CLI + skill contract) | `bin/cowsay` argparse interface |
| Data | Local `.cow` files; `.active-cow` persistence (gitignored) | `skills/cowsay/cows/*.cow`, `lib/art.py` |
| Infra / deploy | skills.sh / `npx skills add` distribution | `README.md`, `SKILL.md` metadata |
| AI / agents | Agent Skills (`SKILL.md`), `AGENTS.md` harness rules | `skills/cowsay/SKILL.md`, `skills/cowsay/AGENTS.md` |
| Tests | `unittest` subprocess goldens | `skills/cowsay/tests/test_cowsay.py` |

### 4.1 Notable dependencies (curated)

- **Python 3 standard library only** — `argparse`, `pathlib`, `os`, `sys`, `shutil`, `unicodedata`, `subprocess`, `tempfile`, `unittest`; no `requirements.txt` or `pyproject.toml`.
- **Bundled cowfiles** — `default.cow`, `moose.cow`, `tux.cow` under `skills/cowsay/cows/`.
- **Original cowsay lineage** — design homage to Tony Monroe's classic cowsay; this implementation is independent MIT code by kodexArg.

## 5. Repository map (abstraction)

- **Repo root:** `README.md` (user-facing pitch, install hint, CLI quick start), `LICENSE` (MIT), `assets/cowsay-demo.png` (screenshot), `.gitignore` (Python caches, `.active-cow`, `.grok/`).
- **Skill root (`skills/cowsay/`):** Canonical install target after skills add.
- **Entrypoints:** `skills/cowsay/bin/cowsay` — CLI compose (`VERSION` 1.0.5); also responds to `cowthink` basename for thought mode.
- **Domain / core:** `skills/cowsay/lib/dialog.py` (wrap, display width, balloon); `skills/cowsay/lib/art.py` (COWPATH, load cow, faces, active cow); `skills/cowsay/lib/__init__.py` re-exports public API.
- **Resources:** `skills/cowsay/cows/*.cow` — ASCII templates with `$thoughts`, `$eyes`, `$tongue`.
- **Agent scaffolding:** `skills/cowsay/SKILL.md` (full agent instructions, flags, env table, width recipe); `skills/cowsay/AGENTS.md` (layer contract, verification commands).
- **Tests:** `skills/cowsay/tests/test_cowsay.py` — golden outputs, security tests (symlink escape, non-`.cow` refusal), width/Unicode edge cases, active-cow persistence.
- **Generated / vendor:** `__pycache__/`, `.pytest_cache/`, `.active-cow` — gitignored; not ingested.
- **Absent in tree:** `.claude/`, `.docs/`, `docs/`, CI workflows, `pyproject.toml`, Docker — not present in shallow clone.

## 6. Configuration & contracts (no secrets)

### Environment variables

| Name | Purpose |
|------|---------|
| `COLUMNS` | Terminal width hint when `-W` omitted; drives `default_wrap_cols()` |
| `COWSAY_WIDTH` | Pin wrap width (tests/CI); overrides terminal detection |
| `COWSAY_COW` | Force active cow stem; beats `.active-cow` file |
| `COWPATH` | OS path-separated list of directories searched for `.cow` files before bundled `cows/` |

### Persistent state

| Path | Purpose |
|------|---------|
| `skills/cowsay/.active-cow` | Single-line stem written by `--set-cow`; gitignored |

### Active cow resolution order

`-f` flag → `COWSAY_COW` env → `.active-cow` file → `default` stem.

### CLI flags (high signal)

| Flag | Effect |
|------|--------|
| `-W N` | Wrap width in terminal display columns |
| `-f <stem>` | One-shot cow (does not write `.active-cow`) |
| `--set-cow <stem>` | Persist active cow and exit |
| `--show-cow` | Print active stem |
| `-l` | List loaded cow stems |
| `--think` | Thought bubbles (`o` stems) instead of speech (`\`) |
| `-n` | Hard wrap (no soft word break) |
| `-e`, `-T` | Eyes and tongue strings (2 chars) |
| `-bdgpstwy` | Classic face presets (borg, dead, greedy, etc.) |
| `-V` | Version string |
| `-h` | Usage help |

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP surface**. There is no web server, REST API, OpenAPI spec, or Workers route. All interaction is via:

- **CLI:** `skills/cowsay/bin/cowsay` with stdin/stdout/stderr.
- **Agent chat commands:** `/cowsay`, `/cowsay <stem>`, `/cowsay <text>`, natural-language triggers documented in `SKILL.md`.

### 6.2 Other interfaces

- **Agent Skills install:** `npx skills add kodexArg/cowsay` places skill per installer layout (typically under user agent skills directory).
- **Python library import:** `from lib.dialog import balloon, wrap_lines` and `from lib.art import load_cow` when `skills/cowsay` is on `PYTHONPATH` — secondary to CLI.
- **Test runner:** `python3 skills/cowsay/tests/test_cowsay.py` (stdlib `unittest`, verbosity 2).

## 7. Data & persistence

- **No database, KV, or object storage.** All state is filesystem-local.
- **Cow resources:** Static `.cow` text files; loaded at render time with placeholder substitution.
- **Persistence:** Optional `.active-cow` file (one stem name per line); gitignored so developer preference does not commit.
- **Topology:** Fully offline, edge-local, single-process. No sync, no cloud, no network calls in renderer or tests (except skills install which is external to the repo runtime).

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`README.md`** — install command, chat triggers table, CLI examples, layer diagram, test invocation, rationale ("renderer is law").
2. **`skills/cowsay/SKILL.md`** — Agent Skills frontmatter (name, description, compatibility, version 1.0.5), chat command matrix, width resolution bash recipe, failure handling, confinement rules, flag/env tables.
3. **`skills/cowsay/AGENTS.md`** — Layer table, determinism contract, five agent rules, layout note (skill not at repo root), verify commands.
4. **`skills/cowsay/bin/cowsay`** — CLI argument surface, `render()` composition, version constant.
5. **`skills/cowsay/lib/dialog.py`** — Unicode display width, soft wrap, balloon geometry, terminal column detection.
6. **`skills/cowsay/lib/art.py`** — COWPATH search, symlink escape prevention, active cow get/set, face flag mapping.
7. **`skills/cowsay/tests/test_cowsay.py`** — Golden `moo` output, security cases, layer separation assertions.
8. **`LICENSE`** — MIT, Copyright 2026 kodexArg.

**Scanned, not present:** `.claude/`, `.docs/`, `docs/`, ADRs, PRDs, constitution files, CI workflow manifests.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repo; safe to reference by org/repo name in RAG corpora. No private endpoints or credentials in tree.
- **Auth model:** None — local CLI with no authentication.
- **Input handling:** Stdin must be valid UTF-8 or exit code 1. Cowfile paths restricted to `COWPATH` directories and bundled `cows/`; refuses `/etc/passwd` and symlink escapes outside allowed roots; non-`.cow` paths rejected.
- **Secrets:** This summary contains no secrets, tokens, `.env` values, or private keys. `.active-cow` and `.grok/` are gitignored and were not read.

## 10. Operational picture

### Local development

```bash
cd skills/cowsay
python3 tests/test_cowsay.py
printf 'moo' | ./bin/cowsay -W 40
./bin/cowsay -l
./bin/cowsay --set-cow tux
```

### Agent operation

1. Resolve `$SKILL_ROOT` to installed `skills/cowsay` path.
2. Compute `W` from `COWSAY_WIDTH`, `COLUMNS`, or `stty` (minimum 8).
3. Pipe user-visible answer through `"$SKILL_ROOT/bin/cowsay" -W "$W"` (add `--think` when requested).
4. On non-zero exit, report stderr and exit code in plain text — do not invent art.

### Distribution

- Published as kodexArg public skill; install via skills ecosystem CLI.
- No GitHub Actions, wrangler, or container build files observed in shallow clone.

### Hardware constraints

- None beyond a Python 3 interpreter and a terminal capable of Unicode box-drawing characters.

## 11. Open questions / unknowns

- **CI/CD:** No workflow files in shallow `main` clone — release/testing may be manual or hosted outside this tree.
- **Version bump process:** `VERSION` in `bin/cowsay` and `SKILL.md` metadata both show 1.0.5; sync mechanism unknown.
- **skills.sh listing details:** Homepage metadata in `SKILL.md` frontmatter exists; full marketplace pipeline not documented in-repo.
- **`.grok/` directory:** Mentioned in `.gitignore` purpose unknown (likely local tooling artifact).
- **Internationalization:** `SKILL.md` documents Spanish trigger phrases (`basta vaca`, `modo vaca`); renderer itself is locale-agnostic UTF-8.
