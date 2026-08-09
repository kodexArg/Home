---
id: "dollar-today-km1151"
title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay)"
visibility: private
importance: low
source_repo: "dollar-today-km1151"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags:
  - "python"
  - "pillow"
  - "opencv"
  - "marquee"
  - "currency"
  - "exchange-rates"
  - "argentina"
  - "image-generation"
  - "display"
  - "onwork"
problems_solved:
  - "Retail or office marquees need a quick way to show today's dollar and related currency prices on a branded background — manual Photoshop or slide decks are slow and error-prone for daily updates."
  - "Operators need a local, scriptable path to overlay numeric exchange values onto a fixed background asset and optionally preview fullscreen on a display without a full web stack."
technologies:
  - "Python 3"
  - "Pillow 9.5"
  - "OpenCV (opencv-python 4.7)"
  - "NumPy 1.24"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# dollar-today-km1151

> **Problem thesis (required):** dollar-today-km1151 is an **on-work Python prototype** for a **marquesina** (marquee / signboard) that shows current currency exchange rates — especially Argentine peso–dollar variants and related pairs. The repo attacks the pain of manually updating a visual price board: it provides scripts to composite large numeric prices onto a shared background image and a stub toward fullscreen display, driven by a small JSON pricing file rather than a CMS or spreadsheet workflow.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/dollar-today-km1151` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Small Python toolkit to overlay daily currency prices on a marquee background and preview fullscreen — marquesina on-work project. |
| Audience | Internal operators updating a physical or digital marquee (KM1151 context); developers extending the overlay/display pipeline. |

## 2. Problems it solves

### P1 — Manual marquee price updates

- **Who hurts:** Staff responsible for a currency-exchange or retail marquee that must show "dollar today" and related rates (official dollar, blue dollar, euros, etc.).
- **Pain today:** Updating a signboard image often means opening a design tool, typing numbers, aligning text, and exporting — repetitive work every trading day, easy to misalign or use stale dates.
- **How this repo answers:** `app.py` loads a fixed `background/background.jpg`, prompts for a numeric value, draws it centered in large white Arial text (512 pt via `arial.ttf`), and saves `output.png`. `files/pricing.json` holds structured rate entries (name, date, price) that `bg.py` is intended to consume after JSON normalization (date formatting, float prices).
- **Out of scope:** Live API feeds from central banks or brokers; multi-currency layout on one canvas; scheduling or cron; web UI; authentication; production deployment manifests.

### P2 — Fullscreen preview on a display PC

- **Who hurts:** Whoever mounts a monitor or TV as the marquee and needs to verify background scaling before going live.
- **Pain today:** Without a dedicated player, operators resize windows manually or rely on slideshow software unrelated to the price data.
- **How this repo answers:** `bg.py` sketches an OpenCV fullscreen window (`1280×720`, `WND_PROP_FULLSCREEN`) that loads and displays `background/background.jpg`. The `read_json_file` helper prepares pricing records for future overlay logic.
- **Out of scope:** Completed integration between JSON prices and on-screen text (current `create_background` body does not draw prices yet; the function definition appears incomplete in the tree).

## 3. Product / idea

The central idea is **image-first marquee publishing**: one canonical background artwork, daily numbers injected programmatically, output as PNG for downstream use (digital signage, print, or a simple local fullscreen preview). The mental model is not a web app or API service but a **two-script workstation**:

1. **Compositor (`app.py`)** — interactive CLI: enter today's number, get a centered overlay on the background, save static asset.
2. **Display prototype (`bg.py`)** — OpenCV window for fullscreen background preview; JSON reader for structured multi-rate data (official dollar, blue dollar, Chilean peso, euro in the sample file).

Pieces relate as: `files/pricing.json` → (planned) `bg.py` display pipeline; `background/*.jpg` → shared visual template; `app.py` → ad-hoc single-value export path. A committed `output.png` in the repo illustrates a generated result. The GitHub description labels the effort **"Marquesina - onwork project"**, consistent with an early prototype rather than a finished product.

### 3.1 North-star use cases

1. Operator runs `app.py`, enters the day's dollar price, obtains `output.png` for the marquee feed.
2. Operator edits `files/pricing.json` with dated rates for several labels, runs display script (when complete) for fullscreen TV preview.
3. Developer swaps `background/background.jpg` or adds alternate backgrounds (`background2.jpg`, `background3.jpg` present) for seasonal branding.

### 3.2 Non-goals

- No README, ADR, or constitution documents define explicit non-goals; inferred from tree: no network layer, no database, no user accounts, no automated rate fetching, no CI/CD, no packaging (`setup.py` / `pyproject.toml` absent).

## 4. Technology stack

Derived from `requirements.txt` and source imports only.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (version not pinned) | `requirements.txt`, `*.py` |
| Image compositing | Pillow 9.5 (`PIL.Image`, `ImageDraw`, `ImageFont`) | `app.py`, `requirements.txt` |
| Display / video | OpenCV 4.7 (`cv2`) | `bg.py`, `requirements.txt` |
| Numerics | NumPy 1.24 | `requirements.txt` |
| Frontend | N/A | — |
| Backend / API | N/A | — |
| Data | Static JSON file | `files/pricing.json` |
| Infra / deploy | None evident | no CI, Docker, or IaC |
| AI / agents | None | no `.claude/`, `.docs/`, or skill trees |
| Tests | None | no test configs or `tests/` |

### 4.1 Notable dependencies (curated)

- `Pillow` — raster compositing: paste background, draw centered price text, export PNG.
- `opencv-python` — fullscreen window management and background resize for display preview.
- `numpy` — declared dependency (likely transitive or for future array ops with OpenCV); not directly imported in the scanned sources.

## 5. Repository map (abstraction)

- **Entrypoints:** `app.py` (interactive image generator), `bg.py` (display / JSON helper prototype).
- **Domain / core:** Price overlay logic in `app.py`; JSON normalization in `bg.py` `read_json_file`.
- **Adapters:** Local filesystem only (`background/`, `files/pricing.json`, `output.png`, `arial.ttf` expected at repo root for font — font file not present in shallow tree listing).
- **Docs vaults:** None — no `README`, `docs/`, `.docs/`, or ADRs.
- **Agent scaffolding:** None — `.claude/` and `.docs/` directories do not exist in the clone.
- **Assets:** `background/background.jpg` (primary), `background/background2.jpg`, `background/background3.jpg`; sample output `output.png`.
- **Generated / vendor:** `venv/` gitignored; `output.png` is a committed artifact.

## 6. Configuration & contracts (no secrets)

- **Env vars:** None defined; scripts use hardcoded relative paths (`background/background.jpg`, `files/pricing.json`, `output.png`, `arial.ttf`).
- **JSON pricing schema** (`files/pricing.json`): top-level keys are human-readable currency labels (e.g. `Dólar Oficial`, `Dólar Blue`); each value is an object with `date` (ISO `YYYY-MM-DD` in source) and `price` (numeric). `read_json_file` converts `price` to `float` and `date` to `DD/MM/YYYY` strings.
- **Gitignore:** `venv/` only — no `.env` patterns; no secret files observed in tree.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP or API surface**. There is no web server, Workers route list, OpenAPI spec, or `urls.py`. All interaction is via **CLI stdin** (`app.py` `input()`) or **local GUI window** (OpenCV in `bg.py`).

### 6.2 Other interfaces

| Interface | Contract | Notes |
|-----------|----------|-------|
| CLI — `app.py` | Prompt: `Enter a numeric value:` → writes `output.png` | Requires `background/background.jpg` and `arial.ttf` at runtime |
| CLI — `bg.py` | `read_json_file(path)` returns list of dicts with formatted dates | `create_background()` intended for fullscreen preview; implementation incomplete |
| File — `files/pricing.json` | Static rate table | Sample data dated 2023-05-08 |

## 7. Data & persistence

- **Stores:** Single JSON file `files/pricing.json`; no database, KV, or object storage bindings.
- **Entities (by JSON keys):** `Dólar Oficial`, `Dólar Blue`, `Pesos Chilenos`, `Euros` — each with `date` and `price` fields in the sample.
- **Topology:** Fully local/offline workstation scripts; no edge or cloud persistence layer. Output is a flat PNG on disk.

## 8. Docs & agent memory (required scan)

Scanned paths and outcomes:

1. **Root `README*`** — not present.
2. **`docs/**` and `.docs/**`** — not present.
3. **ADR / PRD / constitution** — not present.
4. **`.claude/**`** — not present (confirmed via directory listing).
5. **Evidence from code:**
   - `app.py` — PIL overlay workflow and font/size choices.
   - `bg.py` — JSON read helper and OpenCV fullscreen stub.
   - `files/pricing.json` — sample multi-currency rate structure.
   - GitHub repo description hint (dispatcher): "Marquesina - onwork project".

No agent instruction trees or hidden doc vaults to fold in.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` — internal prototype; summary describes mechanics without clone URLs as product links.
- **Auth model:** None — local scripts with no network exposure.
- **Secrets:** This summary contains **no** secrets, keys, tokens, or `.env` contents. The pricing JSON holds only public-style sample numbers and dates.
- **Dependencies:** Standard PyPI packages; no cloud credential files in tree.

## 10. Operational picture

- **Local dev (inferred):**
  - Create `venv`, `pip install -r requirements.txt` (per `.gitignore` convention).
  - Place `arial.ttf` at repo root for `app.py` font loading.
  - Run `python app.py` for interactive PNG generation.
  - Run `python bg.py` for display prototype (may require display environment and fixes to incomplete function).
- **Deploy:** No CI workflows, Docker, or platform configs in the shallow clone.
- **Hardware:** Targets a display PC or signage monitor (fullscreen 1280×720 in `bg.py`); no RPi or GPU-specific constraints documented.

## 11. Open questions / unknowns

- **KM1151 meaning:** Repo name suffix suggests a site, client, or ticket id — not explained in-repo.
- **`bg.py` completeness:** `def create_background()` line lacks a colon in the cloned source; function does not call `read_json_file` or draw prices — likely WIP.
- **`arial.ttf`:** Referenced by `app.py` but not listed in the shallow file tree; may be omitted from git or machine-local.
- **Rate sourcing:** No scraper, API client, or manual update workflow documented — operators must edit JSON or type values by hand.
- **Which background variant** (`background2.jpg`, `background3.jpg`) is intended for production — unknown.
- **Python version pin:** Not specified in `requirements.txt` or `.python-version`.
- **Relationship to other kodexArg currency/marquee projects:** Not referenced in tree.
