---
id: "mini-character-sheet"
title: "mini-character-sheet — Warhammer stat overlay on miniature photos"
visibility: private
importance: low
source_repo: "mini-character-sheet"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags: ["python", "pillow", "warhammer", "wargame", "image-compositing", "miniatures", "character-stats", "tabletop"]
problems_solved:
  - "Tabletop wargame players who photograph painted miniatures need a quick way to show classic Warhammer Fantasy character statistics on the image without manual Photoshop or GIMP work for every model."
  - "Stat blocks for individual miniatures are often tracked on paper or separate sheets; compositing a readable stat row directly onto the portrait makes sharing builds and army lists in chat or forums faster and more legible."
technologies:
  - "Python 3"
  - "Pillow (PIL) 9.4"
  - "numpy 1.24 (declared, unused in current script)"
  - "opencv-python 4.7 (declared, unused in current script)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# mini-character-sheet

> **Problem thesis (required):** This repository is a **minimal Python image-compositing utility** that overlays a semi-transparent Warhammer Fantasy–style character stat table onto a miniature photograph. It exists so a player can resize a source portrait, draw a labeled grid of core stats (WS, BS, S, T, Ini, A, D, I, WP, Fel), center that overlay on the image, and export a single shareable PNG — without opening a full graphics editor. The scope is deliberately tiny: one script, hard-coded sample stats, and committed before/after images as proof of concept.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/mini-character-sheet` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Python + Pillow script that pastes a Warhammer stat row onto a resized miniature photo and saves the composite. |
| Audience | Internal hobby use — tabletop wargame players who want quick stat-on-picture exports; not a packaged library or public service. |

## 2. Problems it solves

### P1 — Manual stat overlay on miniature photos is slow

- **Who hurts:** Wargame players who photograph painted models and want the character's numeric profile visible in the same image when posting to groups, campaign logs, or personal archives.
- **Pain today:** Adding a stat block in GIMP, Photoshop, or Canva for every miniature is repetitive: resize canvas, type headers, align cells, export. Spreadsheets and paper rosters are separate from the visual.
- **How this repo answers:** `testing.py` loads `input.jpg`, resizes it to 360×760 pixels, programmatically draws a two-row table (header row + values) on a semi-transparent white RGBA layer (340×50, 50% opacity), centers that layer on the portrait, and writes `output.png`. Stat abbreviations match classic Warhammer Fantasy profile lines: WS (Weapon Skill), BS (Ballistic Skill), S (Strength), T (Toughness), Ini (Initiative), A (Attacks), D (Damage — here labeled as a single column), I (Intelligence), WP (Wounds Profile or similar house usage), Fel (Fellowship).
- **Out of scope:** Interactive UI, CLI arguments, batch processing multiple minis, reading stats from JSON/CSV, game-system validation, or integration with army-builder tools.

### P2 — Reproducible before/after artifact for a fixed layout

- **Who hurts:** Anyone iterating on overlay size, font, or placement who needs a committed reference image pair.
- **Pain today:** Ad-hoc scripts without sample inputs/outputs make it hard to see what changed between runs.
- **How this repo answers:** The tree includes `input.jpg` (source portrait, 640×1280 JPEG), `output.png` (360×760 composite result), and `table.png` (220×30 RGBA PNG — likely an earlier or alternate table render reference). Running the script reproduces the compositing pipeline deterministically for the hard-coded stat array.
- **Out of scope:** Automated visual regression tests, CI, or versioned layout presets.

## 3. Product / idea

The central idea is **"stats on picture"** (per GitHub repo description): treat a miniature photo as a canvas, generate a small tabular stat strip in code, and alpha-composite it centered on the image. The mental model is a one-shot batch script, not a framework.

Pipeline in `testing.py`:

1. **Load and normalize input** — open `input.jpg` with Pillow; resize to 360×760 (portrait aspect suited to phone-style mini photos).
2. **Build overlay** — create RGBA image 340×50 with white at 128 alpha; use `ImageDraw` to grid cells and center text per cell.
3. **Font** — `ImageFont.truetype('times.ttf', 20)`; expects Times New Roman (or equivalent) installed on the host OS, not vendored in the repo.
4. **Composite** — compute centered `(table_x, table_y)` on the resized base image; `paste` with the overlay as mask.
5. **Export** — save `output.png`.

Hard-coded `table_data`:

| WS | BS | S | T | Ini | A | D | I | WP | Fel |
|----|----|---|----|-----|---|---|---|----|-----|
| 51 | 42 | 32 | 41 | 24 | 23 | 45 | 24 | 15 | 24 |

These are sample values for demonstration; there is no external data source.

### 3.1 North-star use cases

1. **Single-mini export** — place `input.jpg` beside the script, run `python testing.py`, obtain `output.png` with centered stat strip for sharing.
2. **Layout tweak** — edit cell dimensions (`table_width`, `table_height`), font size, or `table_data` in `testing.py` and re-run to iterate on readability over a specific base image size.
3. **Reference check** — compare new `output.png` against the committed artifact to validate Pillow/font behavior on a new machine.

### 3.2 Non-goals

- No README, ADR, or configuration file — behavior is entirely defined in `testing.py`.
- No web app, API, or mobile client.
- No support for Warhammer 40k, Age of Sigmar, or other stat schemas without manual code edits.
- Declared dependencies `numpy` and `opencv-python` are not imported; likely placeholders for future CV work (e.g. auto-detecting mini bounding box) that was never implemented.

## 4. Technology stack

Derived from `requirements.txt` and `testing.py` only. No `pyproject.toml`, Dockerfile, or CI manifests present.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (version not pinned) | `testing.py`, GitHub `primaryLanguage` |
| Image I/O & drawing | Pillow 9.4.0 | `requirements.txt`, `from PIL import Image, ImageDraw, ImageFont` |
| Numerics / CV (unused) | numpy 1.24.2, opencv-python 4.7.0.72 | `requirements.txt` only — no imports in `testing.py` |
| Frontend / API / data | none | — |
| Infra / deploy | none — local script execution | — |
| AI / agents | none | `.claude/` absent |
| Tests | none formal; `testing.py` name suggests manual trial | filename only |

### 4.1 Notable dependencies (curated)

- **Pillow** — sole active dependency; handles JPEG load, RGBA overlay creation, rectangle/text drawing, alpha paste, PNG save.
- **numpy** — listed in `requirements.txt` but unused; safe to omit for current script unless extended.
- **opencv-python** — listed but unused; no contour detection or perspective warp in current tree.

## 5. Repository map (abstraction)

Very flat layout — six tracked files at repo root plus `.gitignore`.

- **Entrypoint:** `testing.py` — entire compositing pipeline (misnamed; functions as the main application script).
- **Domain / core:** inline in `testing.py` — `table_data` array, dimension constants, draw loop; no package structure or modules.
- **Adapters:** filesystem only (`input.jpg` in, `output.png` out); OS font path for `times.ttf`.
- **Sample assets:** `input.jpg`, `output.png`, `table.png` — binary images committed for demonstration; not generated at clone time except by running the script.
- **Docs vaults:** none — no `README`, `docs/`, `.docs/`, ADRs, or PRDs.
- **Agent scaffolding:** none — `.claude/` not present; no `AGENTS.md`, skills, or harness files.
- **Generated / vendor:** `venv/` gitignored per `.gitignore`; not present in clone.

## 6. Configuration & contracts (no secrets)

No environment variables, feature flags, or secret files. Configuration is **hard-coded constants** in `testing.py`:

| Symbol | Role |
|--------|------|
| `input.jpg` | Source image filename (fixed string) |
| `output.png` | Output filename (fixed string) |
| Resize target | 360 × 760 pixels |
| `table_width` / `table_height` | 340 × 50 overlay dimensions |
| `times.ttf`, size 20 | Font family and point size (host dependency) |
| `table_data` | 2×10 string grid of headers and stat values |
| Overlay background | RGBA white `(255, 255, 255, 128)` — half opacity |
| Cell outline | `(1, 1, 1)` rectangle stroke |

No `.env`, credentials, API keys, or cloud bindings.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP surface**. There is no web server, Workers route, FastAPI app, or OpenAPI spec. Operation is **local file I/O only**: read JPEG, write PNG.

### 6.2 Other interfaces

- **CLI:** implicit — run `python testing.py` from repo root (requires `input.jpg` and system `times.ttf`). No `argparse`, no subcommands, no stdin protocol.
- **Library API:** none — not structured as an importable package.
- **MCP / Telegram / systemd:** none.

## 7. Data & persistence

- **Persistence:** ephemeral — output is a single PNG on disk; no database, KV, or object store.
- **Entities:** none beyond the in-memory `table_data` 2D list; no models or migrations.
- **Topology:** fully offline, single-machine. No edge or cloud deployment path documented.

## 8. Docs & agent memory (required scan)

Scans performed per swarm rules:

1. **Root `README*`** — **not present**. No project description beyond GitHub metadata (`warhammer stats on picture`).
2. **`docs/**` and `.docs/**`** — **not present**.
3. **ADR / PRD / constitution** — **not present**.
4. **`.claude/**`** — **not present**; no agent instruction trees to summarize.

Evidence sources used for this summary:

- `testing.py` — full compositing logic and hard-coded stats.
- `requirements.txt` — declared Python dependencies and versions.
- `.gitignore` — ignores `venv/` only.
- Committed images `input.jpg`, `output.png`, `table.png` — existence and dimensions via file metadata (not pixel content quoted).
- GitHub API metadata — visibility `PRIVATE`, description, primary language Python, default branch `main`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` — internal hobby/experiment repo; summary contains no clone URLs or credentials.
- **Auth model:** none — local script with no network calls.
- **Secrets:** this summary contains no API keys, `.env` values, PEM files, or connection strings. The repo tree contained no secret-shaped files at scan time.
- **Binary assets:** `input.jpg` may depict a real miniature photo; treat as user-generated content if republished — not analyzed for PII in this summary.

## 10. Operational picture

**Local run (inferred):**

1. Create Python virtualenv (optional; `venv/` is gitignored).
2. `pip install -r requirements.txt` (Pillow required; numpy/opencv optional for current script).
3. Ensure `times.ttf` is available to Pillow on the system font path (script uses bare filename `times.ttf`).
4. Place or keep `input.jpg` in repo root.
5. `python testing.py` → produces `output.png`.

**Deploy / CI:** no GitHub Actions, Dockerfile, or deployment manifests in the shallow clone. No hardware constraints beyond a machine with Python and a TrueType font.

**Known runtime caveats:**

- `font.getsize()` is used for text centering — deprecated in Pillow ≥ 10 in favor of `textbbox`; may warn or break on newer Pillow without code change.
- Script name `testing.py` suggests prototype status rather than production entrypoint naming.

## 11. Open questions / unknowns

- **Why numpy and opencv are listed** — no usage in `testing.py`; intent (planned auto-crop, background removal?) unknown without author context.
- **Role of `table.png`** — smaller (220×30) than the programmatic overlay (340×50); possibly an earlier manual asset or alternate design; not referenced in code.
- **Stat column semantics** — "D" and "WP" abbreviations may be house rules; not documented in-repo.
- **Target Warhammer edition** — stat line matches classic Warhammer Fantasy Battle profile shape; edition (6th/7th/8th or fan remake) not stated.
- **Font portability** — reliance on `times.ttf` by filename may fail on Linux without Microsoft core fonts or path adjustment.
- **No README** — intended audience, license, and run instructions exist only implicitly from code and GitHub description.
