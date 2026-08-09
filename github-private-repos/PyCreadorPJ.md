---
id: "pycreadorpj"
title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor)"
visibility: private
importance: normal
source_repo: "PyCreadorPJ"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["python", "flask", "roleplaying", "tabletop-rpg", "rapido-y-facil", "subordinacion-y-valor", "character-generator", "jinja2", "bootstrap", "pandas", "numpy"]
problems_solved:
  - "Manual RyF character creation for the Subordinación y Valor module is slow and error-prone when a GM needs many NPCs with coherent stats, skills, gear, and Spanish-flavored names."
  - "RyF attribute and skill tables live in spreadsheets and JSON; this repo centralizes those rules into a web UI that rolls characters according to class weights, power level, and gendered trait grammar."
  - "Adventure reference material for the dystopian Argentina 2178 setting (locations, NPC hooks) is bundled alongside generation so a session can move from random PNJ to scenario context without switching tools."
technologies:
  - "Python 3"
  - "Flask 2.3"
  - "Jinja2 templates"
  - "Bootstrap 5 (CDN)"
  - "pandas 2.0"
  - "numpy 1.24"
  - "WTForms 3.0"
  - "Bootstrap-Flask 2.2"
  - "pickle file persistence"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# PyCreadorPJ

> **Problem thesis (required):** Tabletop GMs running the Spanish **Rápido y Fácil** system for the **Subordinación y Valor** post-apocalyptic module need fast, rule-faithful random characters (PNJs) with attributes, skills, inventory, initiative, defense, and culturally appropriate names. This private Flask web app automates that workflow from static JSON/CSV game data, renders printable character cards in the browser, and optionally surfaces bundled adventure lore from `historia.json`.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/PyCreadorPJ` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Web-based random PNJ generator for RyF's *Subordinación y Valor* dystopia, with save/load via pickle and a scenario lore browser. |
| Audience | Game masters and players of the RyF tabletop system; Spanish-speaking RPG groups; internal hobby tooling within the kodexArg org. |

## 2. Problems it solves

### P1 — Tedious NPC stat rolling at the table

- **Who hurts:** GMs preparing or running *Subordinación y Valor* sessions who need multiple NPCs with valid RyF stats, skills, and gear.
- **Pain today:** Rolling attributes per class weight tables, sampling skills from large nested JSON, matching inventory to skills, and computing initiative/defense by hand is repetitive and easy to get wrong mid-session.
- **How this repo answers:** `creador_personajes.py` implements the full randomization pipeline: class-weighted attributes scaled by a "poder" slider (1–10), skill sampling from `skills.json`, inventory keyed off possessed skills via `inventario.json`, Spanish name generation from INE-frequency CSVs, and dice formulas in `rolls.py` for initiative (1o3d10) and defense (Esquivar + 10). The `/generar` route runs the pipeline and auto-saves to `static/pjs/ultimo.pickle`.
- **Out of scope:** Player character sheet PDF export, campaign management, multiplayer sync, or rules validation for editions other than this module's data files.

### P2 — Setting-specific content mixed with mechanics

- **Who hurts:** GMs who want generated characters to fit the *Subordinación y Valor* tone (Argentina 2178 dystopia) and need quick access to location/NPC lore during prep.
- **Pain today:** Character tools and adventure text often live in separate notebooks, wikis, or spreadsheets.
- **How this repo answers:** README states the build is tailored for *Subordinación y Valor*. `static/historia.json` stores structured scenario entries (locations, NPC descriptions, plot hooks) browsable via `/historia`. Class portrait images under `static/img/` match RyF archetypes (Soldado, Médico, Cultista, etc.) for immediate visual identity.
- **Out of scope:** Full interactive map engine (the `/mapa` route only toggles a static map image include); VTT integration; live combat tracker.

### P3 — Spanish-first naming and trait grammar

- **Who hurts:** GMs who want procedurally generated Spanish names and gender-inflected trait text without hand-editing.
- **Pain today:** Generic name generators ignore Spanish frequency distributions and gendered adjective endings required by RyF trait lists.
- **How this repo answers:** `randomizar_nombre` filters INE-derived name CSVs by age/power, weighted by frequency. `randomizar_caracteristicas` reads `caracteristicas.list` and applies gender-specific suffix rules (Mujer/Hombre/Indeterminado placeholder patterns with `0`/`1` markers). Apellidos sampled from `static/spanish-names/apellidos.csv`.
- **Out of scope:** Localization to other languages; official INE API integration (static CSV snapshots only).

## 3. Product / idea

PyCreadorPJ is a **single-process Flask application** with server-rendered Jinja2 templates and Bootstrap 5 styling. The mental model:

1. User opens the home page and chooses **Generar**, **Cargar**, or **Guardar** from the navbar dropdown.
2. On generate, a GET form submits class, optional subclass ("Multiclase"), gender, optional fixed name/age/bio, and a power slider.
3. The server builds a character dict (attributes, skills, inventory, money, traits stub, initiative, defense) and pickles it under `static/pjs/`.
4. `personaje.html` renders card columns: portrait, attribute table, skill list (top skills emphasized), inventory, money.
5. Separate routes expose a static city map image and a lore browser fed by `historia.json`.

Code identifiers, comments, and UI copy are predominantly **Spanish**, matching the source RPG system ("Rápido y Fácil"). The dependency manifest is named `requeriments.txt` (typo for "requirements").

### 3.1 North-star use cases

1. **Quick NPC at the table** — GM sets class + poder, hits Generar, reads stats from the browser card.
2. **Named recurring NPC** — GM fills optional nombre/apellido/edad/bio fields, saves under a custom pickle filename via `/guardado`.
3. **Session prep with lore** — GM opens `/historia?historia=<key>` to read location and NPC paragraphs for a chosen scenario entry (e.g. "Ocaso Naranja").

### 3.2 Non-goals

- No authentication, multi-tenancy, or cloud deployment manifests in-tree (README comment references PythonAnywhere as a past hosting hint only).
- No automated test suite or CI pipeline.
- `randomizar_rasgos` in `creador_personajes.py` currently returns an empty string; `worksheets/papel.txt` holds a draft implementation not wired into production code.
- No `.claude/`, `.docs/`, or `docs/` vault — agent and hidden-doc scans found none (see §8).

## 4. Technology stack

Derived from `requeriments.txt`, `flask_app.py`, templates, and static data layout.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (shebang `#!/bin/python3`) | `flask_app.py`, `creador_personajes.py` |
| Web framework | Flask 2.3.2 | `requeriments.txt`, `flask_app.py` |
| Templates / UI | Jinja2, Bootstrap 5 + jQuery (CDN), custom CSS | `templates/base.html`, `static/base_ryf.css` |
| Forms | WTForms 3.0.1, Bootstrap-Flask 2.2.0 | `requeriments.txt`, `templates/form_*.html` |
| Data crunching | pandas 2.0.1, numpy 1.24.3 | `requeriments.txt`, `creador_personajes.py` |
| Data | JSON + CSV game tables; pickle character saves | `static/*.json`, `static/spanish-names/*.csv`, `static/pjs/*.pickle` |
| Infra / deploy | None in-repo; dev server `app.run(debug=True, host="0.0.0.0")` | `flask_app.py` |
| AI / agents | None | — |
| Tests | Ad-hoc worksheet script only | `worksheets/test.py` |

### 4.1 Notable dependencies (curated)

- `Flask` — HTTP routing and template rendering for the entire app surface.
- `pandas` / `numpy` — vectorized class weight multiplication, skill sampling, inventory probability rolls, and name frequency weighting.
- `Bootstrap-Flask` — Bootstrap integration (forms styled with Bootstrap 5 classes in templates).
- `WTForms` — listed in requirements; forms are primarily raw HTML GET forms rather than WTForms classes in the reviewed routes.

## 5. Repository map (abstraction)

- **Entrypoints:** `flask_app.py` (Flask app, routes, pickle I/O); `if __name__ == "__main__"` runs debug server on all interfaces.
- **Domain / core:** `creador_personajes.py` — randomization functions (`randomizar_caracteristicas`, `randomizar_atributos`, `randomizar_habilidades`, `randomizar_inventario`, `randomizar_dinero`, `randomizar_nombre`, stub `randomizar_rasgos`); `rolls.py` — initiative and defense dice helpers; `constantes.py` — paths, class DataFrame, tuning constants (`POSIBILIDAD_TRAIT`, `POSIBILIDAD_INVENTARIO`, `INTENTOS`).
- **Adapters:** Flask routes map HTTP to generation and template context; filesystem reads for JSON/CSV/list files under `static/`.
- **Presentation:** `templates/` — `home.html` shell, `personaje.html` character card, `form_generar.html` / `form_guardar.html` / `form_seleccionar.html`, `historia.html`, `mapa.html`, `barra-nav.html`, `base.html`.
- **Static game data:** `static/clases.json` (17 classes with attribute weight fractions), `static/skills.json` (nested class → attribute → skill levels), `static/inventario.json` (skill → items with probability tuples), `static/caracteristicas.list` + `static/caracteristicas.json`, `static/rasgos.json`, `static/historia.json` (scenario lore), `static/img/` (class/gender PNG portraits), `static/images/` (map and character sheet SVG/PDF assets).
- **Persistence:** `static/pjs/` — pickle files (`ultimo.pickle` default); listed saved characters exclude `ultimo.pickle` in the load dropdown.
- **Worksheets / scratch:** `worksheets/` — `clases.csv`, `clases.json`, `test.py` (CSV→JSON conversion experiment), `papel.txt` (draft rasgos algorithm).
- **Editor config:** `.vscode/settings.json` — Black formatter for Python.
- **Docs vaults:** none (no `docs/`, `.docs/`, or ADR trees).
- **Agent scaffolding:** none (no `.claude/`, `.agents/`, or `SKILL.md`).
- **Generated / vendor:** `static/pjs/ultimo.pickle` is runtime output; `__pycache__` and virtualenv paths are gitignored.

## 6. Configuration & contracts (no secrets)

No `.env` files or credential modules are present in the tracked tree. Configuration is code constants and static data paths:

| Symbol / setting | Purpose |
|------------------|---------|
| `STATIC_ROOT` | Absolute path to `static/` beside `constantes.py` |
| `PJS` | Directory for pickle saves (`static/pjs/`) |
| `CLASES` / `ATRIBUTOS` | Derived from `clases.json` columns and index |
| `INTENTOS` (500) | Max retries when sampling weighted names/surnames |
| `POSIBILIDAD_TRAIT` (3) | d10 threshold for adding random characteristics |
| `POSIBILIDAD_INVENTARIO` (1.5) | Multiplier on inventory drop probabilities |
| Flask `debug=True` | Enabled when running `flask_app.py` directly |

No Cloudflare bindings, database URLs, or API keys appear in manifests.

### 6.1 HTTP / API endpoints (when applicable)

All routes are GET-driven HTML (no JSON API, no auth).

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home: optional `?sel=Generar\|Cargar\|Guardar`; loads last character | none |
| `GET` | `/generar` | Build character from query params (`clase`, `clase2`, `genero`, `poder`, optional name fields); saves `ultimo.pickle` | none |
| `GET` | `/cargado` | Load pickle by `?nombre_archivo=` | none |
| `GET` | `/guardado` | Save current character as `?nombre=` pickle | none |
| `GET` | `/mapa` | Show static map view (`mapa=True` in template) | none |
| `GET` | `/historia` | Browse `historia.json`; `?historia=<key>` selects entry | none |

Static files served from `/static/` (CSS, images, JSON not directly exposed as download routes beyond Flask default static).

### 6.2 Other interfaces

- **CLI:** Run `python flask_app.py` (or `python3 flask_app.py`) to start the dev server on `0.0.0.0` with debug reload.
- **Library surface:** `creador_personajes` and `rolls` modules are importable but designed for in-app use, not published as a package (`requeriments.txt` only, no `pyproject.toml`).
- **Worksheet utility:** `worksheets/test.py` converts `clases.csv` to JSON locally (developer maintenance, not part of runtime app).

## 7. Data & persistence

- **Stores:** Filesystem only — JSON/CSV/list files for rules data; pickle for character snapshots. No SQL, KV, or vector index.
- **Important entities (by name):**
  - Classes: Soldado, Policía, Médico, Cultista, Técnico, Detective, Bribón, Charlatán, Sicario, and others defined in `clases.json`.
  - Attributes: FÍSICO, ASTUCIA, DESTREZA, MAGIA, PERCEPCIÓN, VOLUNTAD, CARISMA, EDUCACIÓN.
  - Skills: nested under class → attribute in `skills.json` (e.g. Esquivar, Reflejos, Armas Pequeñas).
  - Inventory items keyed by skill (e.g. Pistola 9mm, Mapa de la ciudad) with probability and damage metadata tuples.
  - Scenario keys in `historia.json` (e.g. "Ocaso Naranja") with Localización, Personajes sections.
- **Topology:** Single-machine offline web app; all state is local files next to the codebase. Pickle protocol uses highest available (`pickle.HIGHEST_PROTOCOL`).

## 8. Docs & agent memory (required scan)

Scanned locations per swarm rules:

| Source | Result |
|--------|--------|
| `README.md` | Present — describes RyF character randomization, Spanish naming, *Subordinación y Valor* module focus, share/modify freely ethos |
| `docs/**` | **Absent** — not in repository |
| `.docs/**` | **Absent** — directory does not exist |
| `.claude/**` | **Absent** — directory does not exist |
| ADR / PRD / constitution | **None found** |
| `static/spanish-names/README.md` | Documents INE-derived Spanish name/apellido CSV provenance |
| `worksheets/papel.txt` | Informal design notes for unfinished `randomizar_rasgos` logic |

**Evidence bullets (paths only):**

- `README.md` — product intent and module targeting
- `static/spanish-names/README.md` — name data lineage
- `worksheets/papel.txt` — WIP trait randomization sketch

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private org repo; summary contains no clone URLs or credentials.
- **Auth model:** None — all routes are open; suitable only for trusted local/LAN use. Debug mode and `0.0.0.0` bind are unsafe for public internet without a reverse proxy and hardening.
- **Secrets:** No tracked `.env`, keys, or tokens observed. Pickle files can execute arbitrary code on load — treat `static/pjs/*.pickle` as trusted-local data only.
- **This summary:** Contains no secrets, connection strings, or scraped environment files.

## 10. Operational picture

- **Local dev:** Install deps from `requeriments.txt` (consider a virtualenv per `.gitignore`), then run `python flask_app.py`. Access the UI on the configured host/port (Flask default 5000).
- **Deploy:** No GitHub Actions, Dockerfile, or IaC in tree. `constantes.py` comment suggests past PythonAnywhere deployment via `STATIC_ROOT` resolution — current ops path unknown.
- **Hardware:** Lightweight CPU workload (pandas/numpy on small tables); no GPU or embedded constraints.

## 11. Open questions / unknowns

- **Production hosting:** No CI/CD or hosting manifest; whether the app still runs on PythonAnywhere or elsewhere is unknown.
- **Template data key mismatch:** `personaje.html` references `pj['data']['clase']` and `pj['data']['sexo']`, but `generar_personaje` returns `caracter` (with `clase`, `genero`) in its `locals()` dict — display may be broken unless an undocumented transform occurs before render.
- **Gender form values vs code:** `form_generar.html` offers `Femenino`/`Masculino`/`Indeterminado`, while `creador_personajes.py` branches on `Mujer`/`Hombre` — name/trait gender rules may not apply as intended without mapping.
- **`randomizar_rasgos`:** Returns empty string; full logic exists only in `worksheets/papel.txt`.
- **WTForms usage:** Declared in requirements but not evident in route handlers reviewed — may be unused legacy dependency.
- **Test coverage:** Only `worksheets/test.py` (CSV conversion); no pytest suite.
