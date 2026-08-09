---
id: "creadorpj"
title: "CreadorPJ — random character sheet generator for Subordinación y Valor"
visibility: private
importance: normal
source_repo: "CreadorPJ"
org: "kodexArg"
default_branch: "master"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags: ["flask", "python", "tabletop-rpg", "subordinacion-y-valor", "character-generator", "npc", "pandas", "numpy", "bootstrap", "pickle", "game-master"]
problems_solved:
  - "Game masters running Subordinación y Valor sessions need playable NPCs and pre-generated PCs quickly — manual character creation against eight attributes, class-weighted skills, traits, inventory, and derived combat stats is slow at the table."
  - "SyV character math (class attribute weights, skill sampling, trait gender inflection, inventory probability tied to skills) is easy to get wrong by hand; a single generator enforces the same data-driven rules every roll."
  - "GMs need in-session reference for scripted scenarios (locations, NPC cast lists, dialogue hooks) without digging through separate lore documents during play."
technologies:
  - "Python 3.7"
  - "Flask 1.1"
  - "Flask-Bootstrap / Bootstrap-Flask 1.2"
  - "pandas 0.25"
  - "numpy 1.18"
  - "Jinja2 templates"
  - "pickle (character persistence)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# CreadorPJ

> **Problem thesis (required):** CreadorPJ is a **Flask web application** that randomly generates complete *Subordinación y Valor* (SyV) character sheets — name, age, class, eight core attributes, sampled skills, physical traits, occupational traits (rasgos), inventory with weapon stats, cash, initiative, and defense — and renders them as Bootstrap card layouts with class/sex portrait art. It also hosts a scenario browser fed from `historia.json` and a static campaign map image. The repo exists so GMs and players can produce rule-consistent PNJs (NPCs) in seconds, persist favorites as pickle files, and consult scripted adventure locations during sessions without manual spreadsheet work.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/CreadorPJ` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Browser-based random character creator and scenario reference for the SyV tabletop RPG, with save/load via pickle files. |
| Audience | Game masters and players of *Subordinación y Valor* who need NPCs, quick PCs, or on-screen scenario notes during play. |

## 2. Problems it solves

### P1 — Slow, error-prone manual character creation at the table

- **Who hurts:** GMs improvising NPCs mid-session and players who want a pre-rolled character without studying the full rule corpus.
- **Pain today:** SyV characters require class-specific attribute distributions (eight stats scaled by a "poder" slider), a subset of skills drawn from class tables with attribute bonuses, gender-inflected physical traits, trait (rasgo) eligibility gated on skill and attribute thresholds, and inventory items probabilistically tied to possessed skills. Doing this with pen and paper or ad-hoc dice takes minutes and invites arithmetic mistakes.
- **How this repo answers:** `randomizadores.py` implements the full pipeline: `randomizar_atributos` applies class weight columns from `clases.json` with Gaussian noise and clamps 4–10; `randomizar_habilidades` samples from `skills.json` per class; `randomizar_caracteristicas` and `randomizar_rasgos` apply gender suffix rules (`0`/`1` placeholders → `o`/`a`); `randomizar_inventario` rolls items keyed to skill names in `inventario.json`; `rolls.py` derives initiative (Percepción or Reflejos + 1o3d10 display) and defense (Destreza or Esquivar + 10). One GET to `/generar` produces a full sheet and auto-saves as `ultimo.pickle`.
- **Out of scope:** Player character advancement, campaign tracking, networked multiplayer, or integration with the separate `syv-game-system` rules vault. No authentication or multi-user isolation.

### P2 — Inconsistent application of Spanish name and demographic flavor

- **Who hurts:** GMs who want culturally grounded Argentine/Spanish names and ages that correlate with the "poder" stat without inventing demographics from scratch.
- **Pain today:** Random name generators ignore census frequency and age curves; SyV's tone benefits from plausible local naming.
- **How this repo answers:** `randomizar_nombre` reads `static/spanish-names/mujeres.csv`, `hombres.csv`, and `apellidos.csv`, filters names by median age vs. poder, and accepts frequency-weighted sampling (up to `INTENTOS` = 500 retries). Optional overrides (`opt_nombre`, `opt_apellido`, `opt_edad`) allow partial manual control from the "+opciones" form panel.
- **Out of scope:** Full character biography, H.I.T.O.S. narrative aspects, or faction assignment — only mechanical sheet fields and cosmetic traits.

### P3 — Scenario reference scattered outside the play session

- **Who hurts:** GMs running published or draft SyV scenarios who need location prose, NPC roster blurbs, and sample dialogue at hand.
- **Pain today:** Lore and scenario text may live in separate design repos or notebooks; switching context mid-session breaks pacing.
- **How this repo answers:** `static/historia.json` embeds multiple named scenarios (e.g. asylum, hotel, embassy, police/intelligence sites, sewer basements) with structured fields: `Localización` (paragraph array), `Personajes` (name → description lines), and `Diálogos` (name → quote lines). The `/historia` route and `historia.html` template provide a dropdown browser. `static/images/mapa.png` is shown via `/mapa` for geographic orientation.
- **Out of scope:** Dynamic state tracking for scenario progression, combat resolution, or the WEGO turn engine documented in `syv-game-system`.

## 3. Product / idea

The mental model is **"single Flask app + JSON/CSV data lake + Jinja UI"**. There is no separate API service or database server — persistence is flat pickle files under `static/pjs/`. The navbar brands the app as *Subordinación y Valor* and exposes three PNJ workflows (Generar, Cargar, Guardar) plus Mapa.

### Generation flow

1. User selects class, sex, poder (default 40), optionally expands "+opciones" for name/age/trait overrides.
2. Form submits GET `/generar` with query params captured as `caracter` dict.
3. `generar_personaje` runs randomizers sequentially, then `rolls` for derived stats.
4. Result rendered in `personaje.html` as Bootstrap cards: portrait (`static/img/{Clase}_{Sexo}_01.png`), attribute table, traits + rasgos tables (top rows emphasized via CSS gray scale), skills table, inventory with estorbo/daño/rango columns, cash in pesos.
5. Auto-save to `static/pjs/ultimo.pickle`; explicit save writes `{nombre}.pickle` via `/guardado`.

### 3.1 North-star use cases

1. **GM rolls a street NPC** — pick Milicia, Hombre, poder 35, click Generar; use sheet at table or screenshot.
2. **Reuse a favorite NPC** — Cargar dropdown lists all `.pickle` files except `ultimo.pickle`; reload recalculates initiative/defense from stored attributes/skills.
3. **Consult scenario during mystery arc** — open Historia, select "Ocaso Naranja" or "Sótano del Asilo", read location and NPC notes alongside generated characters.

### 3.2 Non-goals

- No README, ADR, or constitution in repo — conventions are implicit in code comments only.
- No production hardening: `app.run(debug=True, host='0.0.0.0')` in `flask_app.py`.
- No separation of player vs. GM roles, no audit log, no export to PDF (though `static/images/` contains SVG/PDF character sheet assets that appear to be print templates, not wired into the live generator UI).
- Not a platform-agnostic rules SSOT — that role belongs to the related `syv-game-system` documentation vault.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.7 | `venv/` tree, `requeriments.txt` era |
| Web framework | Flask 1.1 + Werkzeug 0.16 | `requeriments.txt`, `flask_app.py` |
| UI | Bootstrap via Flask-Bootstrap, Jinja2 templates | `templates/`, `requeriments.txt` |
| Data crunching | pandas 0.25, numpy 1.18 | `randomizadores.py`, `constantes.py` |
| Persistence | pickle binary files | `flask_app.py` `guardar_personaje` / `cargar_personaje` |
| Static assets | JSON scenario/skill data, CSV names, PNG/SVG art | `static/` |
| Infra / deploy | Comment reference to PythonAnywhere; committed `venv` | `constantes.py` comment, repo tree |
| AI / agents | None | no `.claude/`, `.agents/`, or skills |
| Tests | None evident | no test directory or pytest config |

### 4.1 Notable dependencies (curated)

- `Flask` + `Bootstrap-Flask` — server-rendered UI with responsive navbar and card layout.
- `pandas` — reads `clases.json` as DataFrame for attribute matrix; skill and inventory sampling via DataFrame operations.
- `numpy` — Gaussian noise on attributes, random thresholds for traits and inventory acceptance.
- `pickle` (stdlib) — highest-protocol serialization of entire character dict including nested `data` request snapshot.

## 5. Repository map (abstraction)

- **Entrypoints:** `flask_app.py` — all routes and orchestration; run via `python flask_app.py` or VS Code Python launcher.
- **Domain / core:** `randomizadores.py` (generation algorithms), `rolls.py` (initiative/defense/3d10 median roll), `constantes.py` (paths, class list, tuning constants).
- **Adapters:** Flask request/query parsing in routes; filesystem I/O for JSON/CSV/pickle under `static/`.
- **Presentation:** `templates/` — `home.html` shell, `personaje.html` sheet, `form_regenerar.html` / `form_guardar.html` / `form_seleccionar.html`, `barra-nav.html`, `mapa.html`, `historia.html`.
- **Data vaults:** `static/clases.json`, `skills.json`, `inventario.json`, `rasgos.json`, `caracteristicas.list`, `historia.json`, `spanish-names/*.csv` — authoritative game data for generation and scenarios.
- **Character store:** `static/pjs/*.pickle` — saved characters (sample names present in clone; treat as playtest data, not secrets).
- **Art / print assets:** `static/img/` class portraits, `static/images/` map and character sheet SVG/PDF templates, `static/base_ryf.css`.
- **Docs vaults:** **none** — no `docs/`, `.docs/`, README, or ADRs.
- **Agent scaffolding:** **none** — `.claude/` and `.docs/` directories do not exist in the repository.
- **Generated / vendor:** `venv/` committed (full Python 3.7 virtualenv — should be ignored in normal workflows; not ingested for this summary), `__pycache__/`.
- **Editor config:** `.vscode/launch.json`, `settings.json` — local dev only.

## 6. Configuration & contracts (no secrets)

No environment variables or Cloudflare bindings. Configuration is module-level constants in `constantes.py`:

| Symbol | Purpose |
|--------|---------|
| `STATIC_ROOT` | Absolute path to `static/` beside `constantes.py` |
| `PJS` | `static/pjs` directory for pickle files |
| `CLASES` | Column names from `clases.json` (seven classes) |
| `ATRIBUTOS` | Row index names from `clases.json` (eight attributes) |
| `INTENTOS` | Max retries for name sampling (500) |
| `POSIBILIDAD_TRAIT` | Base probability for physical trait lines (3, decays ×0.8 per accepted trait) |
| `POSIBILIDAD_INVENTARIO` | Inventory acceptance multiplier (1.5) |

Character dict shape (from `generar_personaje` return via `locals()`):

- `caracter` — original form/query dict (`clase`, `sexo`, `poder`, optional overrides).
- `caracteristicas` — indexed physical trait strings.
- `atributos` — map of eight uppercase Spanish stat names → int 4–10.
- `habilidades` — map skill name → final value (top ~12×(poder/40) skills).
- `inventario` — map item name → list `[prob, estorbo, daño?, rango?]`.
- `dinero` — `{'dinero': int}` pesos.
- `nombre` — `nombre`, `apellido`, `edad` strings.
- `rasgos` — OrderedDict occupational trait → value.
- `iniciativa`, `defensa` — display strings computed at render/load time.

### 6.1 HTTP / API endpoints

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home; optional `sel` query shows Generar/Cargar/Guardar forms; loads `ultimo.pickle` or empty flow | none |
| `GET` | `/generar` | Generate character from query params (`clase`, `sexo`, `poder`, optional `opt_*`); saves `ultimo.pickle` | none |
| `GET` | `/cargado` | Load pickle by `nombre_archivo` query param | none |
| `GET` | `/guardado` | Save current character to `{nombre}.pickle` | none |
| `GET` | `/mapa` | Display campaign map image | none |
| `GET` | `/historia` | Scenario browser; `historia` query selects entry from `historia.json` | none |

No REST JSON API, no POST body routes (forms use GET). No OpenAPI spec.

### 6.2 Other interfaces

- **CLI:** implicit via `python flask_app.py` — starts dev server on all interfaces.
- **VS Code:** "Python: Current File" launch configuration in `.vscode/launch.json`.
- No MCP, Telegram, systemd, or game-engine plugins.

## 7. Data & persistence

- **Stores:** Local filesystem only — pickle binaries for characters; JSON/CSV/list files for rules data. No SQL, KV, or vector index.
- **Important entities (data files, not DB tables):**
  - Classes: Cultista, Milicia, Bribón, Técnico, Charlatán, Sicario, Médico.
  - Attributes: FÍSICO, ASTUCIA, DESTREZA, MAGIA, PERCEPCIÓN, VOLUNTAD, CARISMA, EDUCACIÓN.
  - Scenarios in `historia.json`: Ocaso Naranja, Hotel Plaza, Hogar de Francisco Miranda, Cubíl de Francisco Miranda, Sótano del Asilo, Sótano hacia las alcantarillas, Hogar del Asesinato en Barrio Norte, Hogar del Asesinato en los Barios del Muro, Embajada, S.I.A., P.F.A., Sótano Oculto, Folios.
  - Skills and inventory keyed by Spanish skill names (e.g. Supervivencia, Lucha, Armas Pesadas).
- **Topology:** Single-process Flask app; all state on disk beside the app. Suitable for local GM laptop or a simple PaaS (PythonAnywhere comment). No edge deployment.

## 8. Docs & agent memory (required scan)

| Source | Result |
|--------|--------|
| Root `README*` | **Not present** |
| `docs/**` | **Not present** |
| `.docs/**` | **Not present** |
| ADR / PRD / constitution | **Not present** |
| `.claude/**` | **Not present** — scanned; directory does not exist |
| Agent skill trees | **Not present** |
| `static/historia.json` | Primary narrative/scenario reference embedded as game data |
| Code comments | `flask_app.py` header "creador aleatorio de pjs"; `constantes.py` PythonAnywhere note; `randomizadores.py` self-deprecating comment on trait algorithm readability |

Evidence paths: `flask_app.py`, `constantes.py`, `static/historia.json`, `templates/barra-nav.html` (product title *Subordinación y Valor*).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — summary describes mechanics without clone URLs as product links; `related` frontmatter empty per policy.
- **Auth model:** None — all routes public; dev server binds `0.0.0.0` with debug enabled.
- **Secrets:** No `.env`, credentials, or API keys in scanned paths. Pickle files contain game character data only.
- **Pickle caution:** Loading arbitrary pickle files is unsafe in untrusted multi-user deployments (not mitigated here).
- **This summary contains no secrets, keys, or connection strings.**

## 10. Operational picture

- **Local dev:** Install deps from `requeriments.txt` (or use committed `venv` — discouraged); run `python flask_app.py`; browse default Flask port (5000).
- **Deploy:** No GitHub Actions, Dockerfile, or wrangler config in repo. `constantes.py` suggests historical PythonAnywhere hosting with static path resolution via `__file__`.
- **Hardware:** None — standard laptop; no GPU, RPi, or embedded targets.

## 11. Open questions / unknowns

- Exact relationship and sync cadence with `syv-game-system` rules vault — attribute/skill names align thematically but no submodule or import link.
- Whether `historia.html` route is linked from navbar (barra-nav shows PNJs and Mapa only; historia route exists in `flask_app.py` but may be orphaned UI).
- Print/export workflow for `static/images/hojapj*.svg` / PDF assets — not connected to live generator output.
- Why full `venv/` is committed and whether `.gitignore` was intentionally omitted (no `.gitignore` file in clone).
- Production URL, if any, unknown — no CI/CD or deployment manifests in tree.
- Game system edition/version this generator targets — data shapes suggest an older SyV PC/NPC ruleset distinct from the newer WEGO hex wargame focus in `syv-game-system`.
