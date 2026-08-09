---
id: "gitcon"
title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts)"
visibility: private
importance: low
source_repo: "GITCon"
org: "kodexArg"
default_branch: "master"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags:
  - "python"
  - "django"
  - "oracle"
  - "cx-oracle"
  - "pandas"
  - "matplotlib"
  - "reportlab"
  - "gym"
  - "analytics"
  - "sqlite"
  - "legacy"
  - "private"
problems_solved:
  - "Gym operators need visibility into how many active members (socios) use the facility per day, derived from Oracle session tables, without relying solely on the legacy POS/access-control UI."
  - "Analysts need repeatable SQL plus Python charting to visualize member attendance trends over rolling multi-week windows, with Spanish weekday labels and session-boundary logic tied to a 10:00 cutoff."
  - "A future web console namespace (Django GICCon + PT app) was scaffolded to host gym-related tooling, even though most value today lives in standalone PyGic scripts."
technologies:
  - "Django 2.2 (project scaffold; not present in committed venv)"
  - "Python 3.7"
  - "cx_Oracle 7.1"
  - "pandas 0.24"
  - "matplotlib 3.0"
  - "ReportLab 3.5"
  - "SQLite (Django default dev DB)"
  - "Oracle Database (external read-only analytics source)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# GITCon

> **Problem thesis (required):** GITCon (internal project name **GICCon**) is a **private, early-2019 Python workspace** for gym/fitness-club (**GIC**) operations analytics. Its active code path is `PyGic/main.py`, which connects to a corporate **Oracle** database, runs `clientes_activos.sql` against the `SES_PT_ONLINE` session table, aggregates unique member card IDs per calendar session day (with a 10:00 boundary rule), and was designed to render **matplotlib** bar charts titled *Socios x Día*. Alongside that, the repo carries a **stock Django 2.2** project (`GICCon`) with an empty `PT` app stub and a committed `gicvenv` virtualenv. The repository has had **no commits since May 2019**, contains **no README**, and stores **hardcoded database credentials** in source — treat it as a **legacy prototype**, not a deployable product.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/GITCon` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Internal gym-member analytics toolkit: Oracle SQL + pandas/matplotlib reporting, with an unused Django admin shell for future GIC web tooling. |
| Audience | Internal operators/analysts for a gym chain using Oracle-backed session tracking; original developer workstation paths suggest a single-maintainer dev setup. No agent harness or external consumer docs exist. |

## 2. Problems it solves

### P1 — Daily active-member visibility from Oracle session data

- **Who hurts:** Gym managers and analysts who need to know how many distinct members (*socios*) actually used the facility, not just raw turnstile events or credit purchases in isolation.
- **Pain today:** Session data lives in Oracle (`SES_PT_ONLINE`) with card IDs (`TARJETA_ID`), session start timestamps (`FECHA_INI`), and credit flags (`CREDITOS`). Extracting a clean per-day unique-member count requires custom SQL, date-boundary logic, and post-processing outside the legacy application UI.
- **How this repo answers:** `PyGic/clientes_activos.sql` selects distinct card visits with credits in a date window (formatted via `{0}`/`{1}` placeholders). `PyGic/main.py` loads that SQL, queries Oracle through `cx_Oracle` + `pandas.read_sql`, converts `DIA` to datetime, assigns a **SESSION** date using a **10:00 cutoff** (sessions before 10:00 roll to the prior calendar day), groups by session, and counts unique `Q` (card IDs). Chart helpers `graficar_clientes_activos_x_dia` and `graficar_clientes_activos_x_sem` produce annotated bar charts with Spanish weekday abbreviations.
- **Out of scope:** Member billing, credit purchases, staff scheduling, real-time dashboards, or authenticated multi-user access. Chart calls are commented out in the main flow; the script currently prints the aggregated dataframe and calls `plt.show()`.

### P2 — PDF chart prototyping for reports

- **Who hurts:** Someone exploring printable gym reports mixing narrative text and charts.
- **Pain today:** Matplotlib alone does not produce polished PDF documents with embedded vector charts and legends in a single pipeline.
- **How this repo answers:** `PyGic/examplepie.py` demonstrates **ReportLab** `SimpleDocTemplate` flowables with an inline pie chart, legend, and before/after paragraphs. A sample output artifact `PyGic/flowable_with_chart.pdf` is committed as evidence of a successful run (April 2019 timestamp in PDF metadata).
- **Out of scope:** Production report templates, scheduled PDF generation, or integration with live Oracle data — the example uses static numeric data only.

### P3 — Django namespace for future GIC web console

- **Who hurts:** A developer who wants a conventional Django project layout ready for future gym admin features.
- **Pain today:** Without a project skeleton, ad-hoc scripts lack a path toward authenticated web UIs, migrations, or admin CRUD.
- **How this repo answers:** `manage.py` + `GICCon/` provide a standard Django 2.2 project (per settings header) with SQLite, debug mode, and `/admin/` routing. A `PT` app directory exists with empty `models.py`, `views.py`, and `admin.py`.
- **Out of scope:** The `PT` app is **not registered** in `INSTALLED_APPS`, has no models, no URL includes, and no templates — the Django layer is a **non-functional scaffold**.

## 3. Product / idea

The **central idea** is a two-track workspace for **GIC** (gym) data work:

1. **Analytics track (`PyGic/`)** — pull member-session facts from Oracle, reshape them in pandas, visualize attendance in matplotlib (and experiment with ReportLab PDFs).
2. **Web track (`GICCon/` + `PT/`)** — reserve a Django project name and app slot for future gym tooling, currently untouched beyond `startproject` / `startapp` boilerplate.

The mental model is **read-mostly analytics against a legacy Oracle schema**, with optional local Django experimentation on SQLite. There is no unified service boundary: scripts run standalone; Django runs separately via `run.sh` or `manage.py runserver`.

### 3.1 North-star use cases

1. **Weekly active-member report** — analyst runs `PyGic/main.py`, gets a 14-week rolling window of unique members per session day, reviews printed dataframe (charts were intended but commented out).
2. **Session-day normalization** — operator applies the 10:00 rule so early-morning visits count toward the prior business session day, matching gym operating semantics.
3. **Django admin exploration** — developer starts the dev server and uses stock Django admin on SQLite (no custom models registered).

### 3.2 Non-goals

- No README, ADR, or constitution defines explicit non-goals.
- Inferred from the tree: no production deployment, no REST API, no user-facing web pages, no test coverage beyond empty `PT/tests.py`, no CI/CD, no containerization, and no requirements manifest separate from the committed venv.

## 4. Technology stack

Derived from project settings, source imports, and `gicvenv` package names (versions from `*.dist-info` folder names). The committed venv is treated as a **signal manifest** only; its full contents were not ingested.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.7 | `gicvenv/lib/python3.7/`, `manage.py` shebang pattern |
| Web framework | Django 2.2 (scaffold) | `GICCon/settings.py` header comment |
| Analytics | pandas 0.24, numpy 1.16 | `PyGic/main.py` imports; `pandas-0.24.2.dist-info` |
| Visualization | matplotlib 3.0, tkinter | `PyGic/main.py`; `matplotlib-3.0.3.dist-info` |
| PDF | ReportLab 3.5 | `PyGic/examplepie.py`; `reportlab-3.5.19.dist-info` |
| Oracle client | cx_Oracle 7.1 | `PyGic/main.py`; `cx_Oracle-7.1.2.dist-info` |
| Data (Django dev) | SQLite file `db.sqlite3` | `GICCon/settings.py` `DATABASES` |
| Data (analytics) | Oracle (`SES_PT_ONLINE` table) | `PyGic/clientes_activos.sql`, `PyGic/main.py` |
| Linting (venv) | pylint 2.3, isort 4.3, astroid 2.2 | `gicvenv` dist-info folders |
| Infra / deploy | None evident | no CI, Dockerfile, or IaC in tree |

**Notable inconsistency:** Django is referenced throughout `GICCon/` and `manage.py`, but **no Django package** appears in the committed `gicvenv/site-packages` listing. The venv may be incomplete relative to the Django scaffold, or Django was installed globally on the original workstation.

### 4.1 Notable dependencies (curated)

- `cx_Oracle` — Oracle thick-client bridge; required for all live analytics queries in `PyGic/main.py`.
- `pandas` — SQL result ingestion, datetime coercion, groupby unique counts, and matplotlib-friendly dataframes.
- `matplotlib` — bar charts for daily and weekly-average member counts with Spanish axis labels.
- `reportlab` — PDF document generation with embedded vector pie charts (`examplepie.py`).
- `python-dateutil` — imported in `main.py` (relativedelta available though primary windowing uses `datetime.timedelta`).

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `manage.py` — Django management CLI (`GICCon.settings`).
  - `run.sh` — convenience script activating a venv and starting `runserver` (paths hardcoded to a developer home directory, not portable).
  - `PyGic/main.py` — primary analytics script (`clientes_activos()` + optional `plt.show()`).
  - `PyGic/examplepie.py` — standalone ReportLab PDF demo.

- **Domain / core:**
  - `PyGic/clientes_activos.sql` — Oracle query template for active members with credits in a date range.
  - `PyGic/main.py` — session-day logic, aggregation, chart functions (mostly commented in main flow).

- **Adapters:**
  - `iniciar_oracle()` in `PyGic/main.py` — Oracle connection + `pandas.read_sql` (credentials hardcoded; **not reproduced in this summary**).
  - Django ORM — configured for SQLite but unused (no models).

- **Web scaffold:**
  - `GICCon/settings.py`, `GICCon/urls.py`, `GICCon/wsgi.py` — stock Django 2.2 project.
  - `PT/` — empty Django app (not in `INSTALLED_APPS`).

- **Docs vaults:** **none** — no `README*`, `docs/`, `.docs/`, ADRs, or PRDs.

- **Agent scaffolding:** **none** — `.claude/` not present; no `SKILL.md` or harness files.

- **Generated / vendor:**
  - `gicvenv/` — full Python 3.7 virtualenv committed to git (anti-pattern; should normally be gitignored).
  - `GICCon/__pycache__/`, `db.sqlite3` — local artifacts present in clone.
  - `PyGic/flowable_with_chart.pdf` — generated sample PDF.
  - `PyGic/.vscode/settings.json` — editor path to venv interpreter on original machine.

## 6. Configuration & contracts (no secrets)

### Django settings (`GICCon/settings.py`)

| Setting | Purpose |
|---------|---------|
| `SECRET_KEY` | Django signing key — **present in repo; value omitted here** |
| `DEBUG` | `True` (development only) |
| `ALLOWED_HOSTS` | Empty list |
| `DATABASES['default']` | SQLite at `db.sqlite3` relative to project root |
| `INSTALLED_APPS` | Django contrib apps only — **`PT` not included** |
| `STATIC_URL` | `/static/` |
| `LANGUAGE_CODE` / `TIME_ZONE` | `en-us` / `UTC` |

No `.env` file, `requirements.txt`, or `pyproject.toml` exists. Oracle connection parameters are **inline in `PyGic/main.py`** (user/password/host/service name) — **must be rotated and moved to environment variables if this code is ever revived**; this summary does not reproduce them.

### SQL contract (`PyGic/clientes_activos.sql`)

- **Source table:** `SES_PT_ONLINE`
- **Filters:** `CREDITOS > 0`, `FECHA_INI` between two `TO_DATE` bounds (placeholders `{0}` start, `{1}` end) with `10:00` time component.
- **Output columns:** `Q` (card ID), `DIA` (date string `DD/MM/YYYY`), `HORA` (hour string).
- **Grouping:** per card, day, hour.

### 6.1 HTTP / API endpoints (when applicable)

Django exposes only the stock admin site. No custom views or REST routes exist.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/admin/` | Django admin index | Django staff session (no custom users configured in tree) |
| `GET` | `/admin/login/` | Admin login form | none until credentials created via `createsuperuser` |

**No other HTTP surface.** `PT/views.py` is empty; no `urls.py` includes for `PT`.

### 6.2 Other interfaces

- **CLI — analytics:** `python PyGic/main.py` (shebang `#!/bin/python3`) runs `clientes_activos()` then `plt.show()`.
- **CLI — PDF demo:** `python PyGic/examplepie.py` writes `flowable_with_chart.pdf` in the working directory.
- **CLI — Django:** `python manage.py runserver` (after activating a venv with Django installed).
- **Shell — `run.sh`:** activates venv at a fixed home path and starts Django dev server.

No MCP tools, Telegram bots, systemd units, or message-queue consumers.

## 7. Data & persistence

- **Oracle (external):** Read-only analytics against gym session data. Key entity surface: `SES_PT_ONLINE` with `TARJETA_ID`, `FECHA_INI`, `CREDITOS`. The analytics pipeline treats `TARJETA_ID` as the member identifier (`Q` column alias).
- **SQLite (local Django):** `db.sqlite3` at repo root — empty/zero-byte in the shallow clone; Django migrations for `PT` were never created (only `PT/migrations/__init__.py` exists).
- **In-memory pandas:** All transformation (session assignment, groupby, unique counts) happens in-process; no local warehouse or cache layer.

Topology: **edge workstation script → corporate Oracle LAN** for analytics; **local SQLite** for Django scaffold only. No cloud or edge Workers involvement.

## 8. Docs & agent memory (required scan)

Agents scanned the following locations:

| Location | Result |
|----------|--------|
| Root `README*` | **Absent** — no project documentation |
| `docs/**` | **Absent** |
| `.docs/**` | **Absent** |
| ADR / PRD / constitution | **Absent** |
| `.claude/**` | **Absent** — no agent instruction trees |
| `.agents/`, `SKILL.md` | **Absent** |

**Evidence used (paths only):**

- `GICCon/settings.py` — Django version, database config, installed apps.
- `GICCon/urls.py` — sole URL pattern (`admin/`).
- `PyGic/main.py` — Oracle analytics pipeline, session logic, chart helpers.
- `PyGic/clientes_activos.sql` — Oracle query contract.
- `PyGic/examplepie.py` — ReportLab PDF experiment.
- `PT/models.py`, `PT/views.py`, `PT/admin.py` — confirm empty Django app.
- `run.sh` — local dev invocation pattern.
- `gicvenv/lib/python3.7/site-packages/*.dist-info` — dependency name/version signals (package names only).
- GitHub API metadata — private repo, Python primary language, created April 2019, last push May 2019.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg`. This summary describes purpose and structure without clone URLs or live connection strings.
- **Critical finding:** `PyGic/main.py` contains a **hardcoded Oracle DSN with username and password**. `GICCon/settings.py` contains a **committed Django `SECRET_KEY`**. Both are security defects; this summary intentionally omits their values. Any revival of this repo must rotate credentials, externalize secrets, and add `.gitignore` rules for venv, `db.sqlite3`, `__pycache__`, and `.env*`.
- **Auth model:** Django stock session auth for admin only; no custom auth, OIDC, or API tokens. Analytics scripts have no authentication layer — they rely on network access to Oracle.
- **Data sensitivity:** Queries return member card IDs and visit timestamps — personally identifiable operational data. Handle aggregates responsibly; do not commit query results.
- **This summary contains no secrets, private keys, connection strings with passwords, or `.env` contents.**

## 10. Operational picture

### Local development

1. Activate a Python 3.7 venv with Django 2.2, cx_Oracle, pandas, matplotlib (the committed `gicvenv` is a reference but may be incomplete and is not portable).
2. For Django: `python manage.py migrate` then `python manage.py runserver` (or use `run.sh` after fixing hardcoded paths).
3. For analytics: run `PyGic/main.py` from a machine with Oracle client libraries and network reachability to the corporate DB (original code assumed LAN access).
4. For PDF demo: run `PyGic/examplepie.py` — no external dependencies beyond ReportLab.

### Deployment

- **No CI/CD** workflows, Dockerfiles, or Cloudflare/AWS config found.
- `DEBUG = True`, empty `ALLOWED_HOSTS`, and committed secrets indicate **never production-ready** as checked in.
- Last GitHub push: **May 2019** — treat as archived prototype.

### Hardware constraints

- `tkinter` + `matplotlib` `plt.show()` imply a **desktop GUI environment** for interactive charts.
- Oracle thick client (`cx_Oracle`) requires compatible Oracle Instant Client libraries on the host.

## 11. Open questions / unknowns

- **What does GIC / GITCon stand for?** No README or inline comment defines the acronym; context from table names (`SES_PT_ONLINE`, *socios*, *clientes activos*) strongly suggests a **gym/fitness club** operational system, possibly Mendoza-region based (Oracle service name hints in source — not quoted here).
- **Why is the GitHub repo named `GITCon` while the Django project is `GICCon`?** Likely a naming typo or rebranding; no documentation reconciles them.
- **Why is `PT` not in `INSTALLED_APPS`?** Unknown — may have been abandoned mid-scaffold.
- **Why is Django missing from `gicvenv`?** The committed venv may be partial, or Django was system-installed on the original dev machine.
- **Are the chart functions still intended for use?** `graficar_*` calls are commented out in `clientes_activos()`; current behavior prints dataframe only.
- **Is Oracle still reachable?** Network topology and credentials from 2019 are almost certainly stale; connectivity unknown.
- **No `.gitignore` in repo** — explains committed venv, `__pycache__`, and empty `db.sqlite3`.
