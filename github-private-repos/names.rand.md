---
id: "names-rand"
title: "Names.rand — fantasy and real-name desktop generator"
visibility: private
importance: normal
source_repo: "names.rand"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["python", "flet", "desktop", "name-generator", "fantasy", "rpg", "pyinstaller", "cross-platform", "gpl"]
problems_solved:
  - "Tabletop GMs, writers, and game designers need culturally flavored fantasy names (drow, elf, dwarf, demon, dragon, orc, gnome, halfling) without hand-crafting or copying from wikis."
  - "Creators need batch generation of plausible real-language personal names across multiple locales and sexes for NPCs, characters, and test data — with export to text or CSV."
  - "Users want a single offline, cross-platform desktop app instead of ad-hoc web generators that vary in quality and cannot be saved locally in bulk."
technologies:
  - "Python 3.x (3.8+ recommended, CI uses 3.10)"
  - "Flet (cross-platform UI framework)"
  - "PyInstaller via flet pack (desktop packaging)"
  - "AppVeyor CI (Windows, macOS, Linux matrix builds)"
  - "JSON and plain-text name corpora"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Names.rand

> **Problem thesis (required):** Creative work — tabletop RPGs, fiction, game prototyping — constantly needs believable character names, both fantasy-race flavored and real-world locale flavored. Manual naming is slow, repetitive, and inconsistent; web generators are fragmented and often lack batch export. Names.rand is a **desktop GUI application** that procedurally composes names from curated syllable pools and word lists, supports eight fantasy races plus nine real-language name sets, generates up to 100 names per run, and exports results to plain text or CSV — packaged for Windows, Linux, and macOS.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/names.rand` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Cross-platform desktop app that generates fantasy-race and real-language personal names in bulk, with save-to-file export. |
| Audience | Game masters, fiction writers, indie game developers, and kodexArg maintainers who need quick offline name lists; end users who download pre-built executables. |

## 2. Problems it solves

### P1 — Fantasy-race name generation with lore-appropriate structure

- **Who hurts:** Dungeon masters, fantasy authors, and game designers populating worlds with drow, elves, dwarves, demons, dragons, orcs, gnomes, and halflings.
- **Pain today:** Inventing names that *feel* right for each race is tedious. Copy-pasting from fan wikis is inconsistent and copyright-adjacent. Generic random-string generators produce nonsense.
- **How this repo answers:** `generator.py` implements race-specific composition algorithms. Drow and elf names combine syllable pools with dice-roll-driven patterns (apostrophe inserts, doubled syllables, last-name assembly). Dwarven names stitch prefix, sex-specific suffix, and suffix pools. Demons concatenate two syllable lists. Dragons, gnomes, and halflings use multi-segment name assembly with optional "earned" epithets from a shared `gnome_hafling_earned` corpus. Orc names draw from a flat word list. Each race's data lives under `names/fantasy/` as JSON or TXT.
- **Out of scope:** Does not generate place names, ship names, or full character backstories. Does not validate names against official D&D trademark lists. Sex selection is disabled for races that do not use it (demons, dragons, orcs).

### P2 — Real-language personal names for characters and fixtures

- **Who hurts:** Writers and developers who need plausible first+last names in Spanish, English, Portuguese, German, French, Italian, Russian, Muslim, or Chinese contexts.
- **Pain today:** Picking names from baby-name sites is one-at-a-time. Test data generators often use Anglo-only defaults. Russian feminine surname inflection is easy to get wrong.
- **How this repo answers:** `real_names()` in `generator.py` pairs random entries from `names/real/{sex}_{lang}.txt` first-name lists with `names/real/lastnames/{lang}.txt` surname lists. A special case adjusts Russian female surnames ending in `ov`, `ev`, or `in` by appending `a`. The UI exposes male/female selection for all real-language generators.
- **Out of scope:** Does not generate addresses, phone numbers, or full identities. Name lists are static files, not live census data. README mentions future expansion but Android and PWA targets are not implemented in the current tree.

### P3 — Offline, cross-platform desktop delivery

- **Who hurts:** Users who want a double-clickable tool without installing Python, and maintainers who need reproducible builds for three OS targets.
- **Pain today:** Python GUI apps are hard to distribute to non-technical users. Platform-specific packaging is boilerplate-heavy.
- **How this repo answers:** Flet provides a Flutter-backed UI from pure Python (`main.py`). AppVeyor CI (`appveyor.yml`) runs `flet pack` on Visual Studio 2019, macOS, and Ubuntu images, producing zip/tar.gz artifacts versioned at 0.2.0. `update-ci.sh` manages a `ci` git tag for triggering builds. README documents Linux `libmpv` dependency for Flet 0.20+.
- **Out of scope:** No auto-update mechanism, no installer/signing pipeline beyond AppVeyor artifacts, no mobile builds yet.

## 3. Product / idea

The central idea is a **two-layer desktop app**: a Flet GUI shell (`main.py`) and a procedural name engine (`generator.py`) backed by static corpora on disk.

```
User selects race/lang + sex + count (1–100)
        │
        ▼
   main.py (Flet UI)
        │
        ├── fantasy path → Fantasy.{race}(…) per-race method
        │                      └── reads names/fantasy/*.json or orcs.txt
        │
        └── real path    → real_names(lang, sex, total)
                               └── reads names/real/{sex}_{lang}.txt
                                   + names/real/lastnames/{lang}.txt
        │
        ▼
   ListView display + optional Save (txt or csv via FilePicker)
```

After launching (from source via `python3 main.py` or from a packaged executable), the user picks a category from a dropdown (fantasy races grouped separately from real languages), optionally selects sex, adjusts a slider for batch size, clicks Generate, and optionally saves the list. CSV export splits each full name into first and last columns.

### 3.1 North-star use cases

1. **GM session prep** — Generate 50 drow NPC names before a session and save to a text file for reference at the table.
2. **Writer character roster** — Batch-create German or Russian male/female names for a cast list.
3. **Quick one-off** — Pick demon or dragon (no sex needed), generate a single evocative name.

### 3.2 Non-goals

- No network API, no cloud sync, no user accounts.
- No name meaning lookup or etymology.
- No Android or PWA builds in the current codebase (README lists them as future goals).
- No localization of the UI itself — labels are English only.

## 4. Technology stack

Derived from manifests and source structure only.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.x (CI: 3.10; README recommends 3.8+) | `appveyor.yml`, `README.md` |
| UI framework | Flet | `requirements.txt`, `main.py` |
| Packaging | PyInstaller via `flet pack` | `appveyor.yml` build_script |
| Data format | JSON syllable pools, plain-text name lists | `names/fantasy/`, `names/real/` |
| CI / release | AppVeyor matrix (VS2019, macOS, Ubuntu) | `appveyor.yml` |
| License | GNU GPL v3+ | `COPYING`, `README.md` |

### 4.1 Notable dependencies (curated)

- `flet` — sole runtime dependency; provides cross-platform Flutter-based UI, file picker, responsive layout, and `flet pack` for desktop bundling.
- `pyinstaller` — listed in `requirements.txt`; used indirectly through `flet pack` during CI builds.
- Standard library only in application code: `json`, `random`, `csv`, `os.path`.

## 5. Repository map (abstraction)

- **Entrypoints:** `main.py` — Flet app bootstrap (`ft.app(target=main)`). `generator.py` — importable name engine (`Fantasy` class, `real_names()` function).
- **Domain / core:** `generator.py` — all procedural logic (dice rolls, syllable concatenation, sex-aware transformations). Race dispatch in `main.py` uses `getattr(fng, self.race)` for fantasy and `real_names()` for real languages.
- **Data corpora:**
  - `names/fantasy/` — JSON files per race (`drow.json`, `elf.json`, `dwarven.json`, `demons.json`, `dragons.json`, `gnome.json`, `hafling.json`, `gnome_hafling_earned.json`) plus `orcs.txt` flat list.
  - `names/real/` — `{male,female}_{lang}.txt` first-name files for nine languages (`en`, `es`, `pt`, `ge`, `fr`, `it`, `ru`, `mu`, `ch`).
  - `names/real/lastnames/` — `{lang}.txt` surname files matching the language codes.
- **UI assets:** `icon.svg`, `assets/icon_windows.png`, `assets/icon_macos.png`, `screenshot.png`.
- **CI / ops:** `appveyor.yml` (build matrix and GitHub release deploy on tags), `update-ci.sh` (tag-push helper for CI triggers).
- **Docs vaults:** No `docs/`, `.docs/`, `.claude/`, or `.agents/` directories present in the tree (scanned; not found).
- **Generated / vendor:** `build/`, `dist/`, `__pycache__/` are gitignored — not ingested.

## 6. Configuration & contracts (no secrets)

This application has **no environment variables, no `.env` files, and no external service bindings**. All configuration is implicit:

- Data directory resolved at runtime via `LOCAL_DIR = path.dirname(path.realpath(__file__))` in `generator.py`.
- Fantasy race sex-gating is hardcoded in `main.py` via the `self.races` dict (boolean per race indicating whether sex selector is enabled).
- AppVeyor uses an encrypted `GITHUB_TOKEN` for release deployment — value not reproduced here.

### 6.1 HTTP / API endpoints (when applicable)

**No HTTP surface.** This is a local desktop GUI application with no server component, no REST routes, and no WebSocket listeners. All interaction is through the Flet window and native file-save dialog.

### 6.2 Other interfaces

| Interface | Contract | Notes |
|-----------|----------|-------|
| CLI (dev) | `python3 main.py` | Launches Flet desktop window |
| GUI dropdown | `fantasy,{race}` or `real,{lang}` keys | Drives generator dispatch |
| GUI slider | Integer 1–100 | Batch size for generation |
| File export | `.txt` (one name per line) or `.csv` (first,last columns) | Via Flet `FilePicker.save_file` |
| Packaged binary | `Names.rand` executable / `.app` | Built per OS by AppVeyor |

## 7. Data & persistence

- **Stores:** None. The app is fully stateless between sessions — no database, no KV, no cloud storage.
- **Static corpora:** All name data ships as files in `names/`. Fantasy JSON files use keyed arrays (`male_1`, `male_2`, `female_1`, `female_2`, `lastname_1`, `lastname_2` for drow; `names`, `prefix`, `male_suffix`, `female_suffix`, `suffixes` for dwarven; `names_1`/`names_2` for demons; etc.).
- **User output:** Ephemeral in-memory list (`self.names_generated`) until explicitly saved to a user-chosen path via the file picker.
- **Topology:** Single-machine, offline-first. No edge or cloud components.

## 8. Docs & agent memory (required scan)

Sources scanned and folded in:

1. **`README.md`** — Project description, available generators (8 fantasy races, 9 languages), usage instructions (executable download, from-source `python3 main.py`), Linux `libmpv` dependency note, GPL license, author credit (Alfonso Saavedra "Son Link"), future Android/PWA mention.
2. **`COPYING`** — Full GNU GPL v3 license text.
3. **`appveyor.yml`** — CI matrix, build command (`flet pack main.py --name Names.rand … --add-data names:names`), artifact names per platform, GitHub release deploy on tag builds.
4. **`.claude/`** — Not present in repository (scanned; directory does not exist).
5. **`.docs/`** — Not present in repository (scanned; directory does not exist).
6. **`docs/`** — Not present in repository (scanned; directory does not exist).
7. **No ADRs, PRDs, constitutions, AGENTS.md, or SKILL.md** files found.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg`. Summary describes mechanics without offering clone URLs as product links.
- **Auth model:** None — standalone desktop app with no authentication, no network calls in application code.
- **Secrets:** AppVeyor config contains an encrypted `GITHUB_TOKEN` for release publishing; this summary contains no token values, no `.env` contents, and no credential files.
- **Data privacy:** Name generation is entirely local. Saved files go only to user-selected paths. No telemetry evident in source.
- **License:** GPL v3+ — derivative works must remain open source if distributed.

## 10. Operational picture

### Local development

```sh
pip install -r requirements.txt   # installs flet, pyinstaller
python3 main.py                   # launches Flet GUI
```

On Linux with Flet 0.20+, `libmpv` must be installed (README documents distro-specific steps).

### CI / release

- **Platform:** AppVeyor with Python 3.10 stack.
- **Build:** `flet pack main.py --name Names.rand --product-name Names.rand --product-version "0.2.0" --add-data names:names`
- **Artifacts:** `Names.rand-windows.zip`, `Names.rand-macos.tar.gz`, `Names.rand-linux.tar.gz`
- **Release trigger:** Git tag builds deploy to GitHub Releases via encrypted token.
- **CI tag helper:** `update-ci.sh` deletes and re-pushes a `ci` tag to trigger builds.

### Hardware constraints

- Standard desktop/laptop; no GPU or special hardware requirements.
- Packaged binaries bundle Python runtime via PyInstaller.

## 11. Open questions / unknowns

- **Fork lineage:** README badges and author credit reference `son-link/names.rand` as the upstream origin; relationship to `kodexArg/names.rand` (mirror, fork, or transfer) is not documented in-tree.
- **Version drift:** AppVeyor hardcodes product version `0.2.0`; no `pyproject.toml` or `setup.py` for programmatic version tracking.
- **Flet version pin:** `requirements.txt` lists `flet` without a version constraint — reproducibility across dev and CI is unknown.
- **Russian surname logic:** The feminine inflection check in `real_names()` uses `sex == 'f'` but the UI passes `'female'` — this branch may never execute; possible latent bug.
- **Android / PWA:** README lists as future targets; no code or configs present.
- **Test coverage:** `appveyor.yml` sets `test: off`; no test files in tree.
- **Agent scaffolding:** No `.claude/`, `.docs/`, or agent instruction trees to summarize.
