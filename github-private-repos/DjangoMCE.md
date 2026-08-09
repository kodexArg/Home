---
id: "djangomce"
title: "DjangoMCE — internal Mendoza Central operations portal"
visibility: private
importance: normal
source_repo: "DjangoMCE"
org: "kodexArg"
default_branch: "master"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags: ["django", "python", "postgresql", "mysql", "rest-framework", "pandas", "highcharts", "hr", "casino-operations", "temperature-monitoring", "bootstrap4", "internal-portal"]
problems_solved:
  - "Staff at Mendoza Central needed a single authenticated web portal to publish floor announcements, file HR novedades, and consult operational data without juggling separate tools."
  - "Environmental monitoring (Raspberry Pi temperature sensors) and slot-machine production statistics lived in legacy MySQL/PostgreSQL databases that were not directly usable by non-technical staff."
  - "HR workflows for employee shift changes, leave, and incident reporting required structured forms with per-type field visibility and approval tracking."
technologies:
  - "Django 3.0.3"
  - "Django REST Framework 3.11"
  - "PostgreSQL (default + tragamonedas alias)"
  - "MySQL (db_temp alias)"
  - "django-tables2 + ExportMixin"
  - "django-bootstrap4 + django-compressor + djangobower"
  - "pandas / django-pandas / rest-pandas / pandas-highcharts"
  - "Highcharts (via Bower)"
  - "Bootstrap 4 + jQuery"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# DjangoMCE

> **Problem thesis (required):** DjangoMCE is the base Django web application for the Mendoza Central (MCE) internal portal. It unifies announcement publishing, HR novedades management, environmental temperature dashboards, and slot-machine production analytics behind one Spanish-language, session-authenticated site. It is designed to run alongside the companion **DjangoConda** repository (conda environment at path `./cda`), reading from existing operational databases rather than replacing them.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/DjangoMCE` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Internal Django portal for casino-floor staff: announcements, HR novedades, temperature charts, and slot production tables. |
| Audience | MCE staff (HR, operations analysts, floor supervisors), authenticated via Django users; admin users manage master data. |

## 2. Problems it solves

### P1 — Fragmented internal tools for floor and HR staff

- **Who hurts:** HR coordinators, shift supervisors, and floor staff at Mendoza Central who need to communicate changes and consult live operational data.
- **Pain today:** Announcements, employee incident/leave reporting, temperature monitoring, and slot statistics were spread across separate systems and raw database access.
- **How this repo answers:** Provides a single Bootstrap-styled portal with navigation zones for Anuncios (bulletin board), RRHH (novedades + employee directory), Temperatura (charts), and Operaciones (production statistics). Django auth gates staff-only sections; the admin site handles master employee data.
- **Out of scope:** Does not replace the upstream slot telemetry pipeline or the Raspberry Pi sensor ingestion stack; it reads their databases. Does not provide a public-facing marketing site.

### P2 — Legacy databases need a readable façade

- **Who hurts:** Operations analysts who need coin-in/win summaries and temperature history without writing SQL.
- **Pain today:** Temperature readings live in a MySQL `tb_temperatura` table; slot master list and daily telemetry live in a PostgreSQL `tragamonedas` database with Spanish column names and underscore-prefixed fields.
- **How this repo answers:** Defines unmanaged Django models (`TbTemperatura`, `Masterlist`, `Tdatos`) mapped to existing tables, uses `django-pandas` DataFrame managers for aggregation, and renders Highcharts JSON (temperature) or styled pandas HTML tables (production per day).
- **Out of scope:** Schema migrations for legacy DBs (`managed = False` on all external models). No ETL or data warehouse layer.

### P3 — Structured HR novedades with type-driven forms

- **Who hurts:** HR staff tracking vacations, shift swaps, incidents, and other employee events.
- **Pain today:** Paper or ad-hoc spreadsheets lack approval workflow fields and per-type form requirements.
- **How this repo answers:** `TipoNovedad` defines boolean flags (`requiere_fecha`, `requiere_dias`, `requiere_turno`, etc.) that drive dynamic form visibility via a JSON `campos_dict()` injected into create views. `SeguimientoNovedad` tracks approval states (Visto, Aprobado, Denegado, En espera). List views use `django-tables2` with export support.
- **Out of scope:** Full workflow engine or email notifications; `DEFAULT_FROM_EMAIL` is configured but outbound mail integration is not evident in views.

## 3. Product / idea

DjangoMCE is a monolithic Django 3.0 project (`mce/`) with five domain apps under `apps/`. The mental model is **portal shell + read-mostly analytics adapters + HR CRUD**:

- **Home / Anuncios:** `TablonView` filters `Tablon` announcements active between `publicar_desde` and `publicar_hasta`; this is also mounted at `/` as the landing page.
- **RRHH:** `novedades` app handles employee roster tables and novedad creation with conditional fields; staff see this in the nav dropdown.
- **Temperatura:** Renders a chart page; AJAX calls `json_hc` which aggregates MySQL sensor rows into Highcharts spline series grouped by Raspberry Pi unit (`rpi`).
- **Operaciones / Estadísticas:** Permission-gated (`perms.estadisticas.kdx_ro_estadisticas`); shows welcome page and "Producción por día" table merging slot telemetry with master list metadata via pandas.
- **API:** Thin DRF `ListCreateAPIView` exposing temperature rows for programmatic access.

Static assets are collected to `assets/` (`STATIC_ROOT`); source static lives in `static/` with SCSS compiled via `django-libsass` and `django-compressor`. Frontend vendor libs (Bootstrap, Highcharts, moment, underscore) are managed through `djangobower`.

Timezone is `America/Argentina/Mendoza`; `USE_TZ = False` (local naive datetimes). UI language is Spanish (`LANGUAGE_CODE = 'es'`).

### 3.1 North-star use cases

1. Staff logs in, sees current floor announcements on the home tablón, and reads important notices filtered by date range.
2. HR user creates a novedad (e.g., vacation) — form shows only the fields required for that `TipoNovedad`, attaches optional file, and lists entries in a paginated exportable table.
3. Operations analyst with estadísticas permission opens "Producción por día" to view color-graded daily coin-in and win aggregates for the last N months.
4. Facilities staff opens the temperature chart, selects frequency and day range, and zooms Highcharts splines per RPi sensor.

### 3.2 Non-goals

- Not a greenfield data platform; external DB schemas are mirrored, not owned.
- Not API-first; only one REST endpoint is wired (`api/temp/`).
- Not production-hardened as checked in: `DEBUG=True`, permissive `ALLOWED_HOSTS`, and credentials are inline in `settings.py` (must be externalized before any redeploy).
- Companion conda environment and deployment orchestration live in **DjangoConda**, not here.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.7 (inferred from `__pycache__`), Django 3.0.3 | `mce/__pycache__/*.cpython-37.pyc`, `requeriments.txt` |
| Frontend | Bootstrap 4, jQuery 3.4, Highcharts, SCSS via compressor | `mce/settings.py`, `templates/base.html`, `package-lock.json`, `BOWER_INSTALLED_APPS` |
| Backend / API | Django 3 + DRF 3.11, rest-pandas | `requeriments.txt`, `apps/apis/` |
| Data | PostgreSQL (default + tragamonedas), MySQL (db_temp) | `mce/settings.py` `DATABASES` |
| Infra / deploy | No CI/CD or Docker manifests at repo root; PyCharm/VS Code IDE configs present | tree scan (no `.github/`), `.idea/`, `.vscode/` |
| AI / agents | None present | no `.claude/` or `.agents/` |
| Tests | Django `tests.py` stubs per app (minimal) | `apps/*/tests.py` |

### 4.1 Notable dependencies (curated)

- `Django==3.0.3` — core web framework (2020-era LTS line).
- `djangorestframework` + `rest-pandas` — API layer and pandas serialization bridge.
- `django-pandas` + `pandas` + `numpy` — DataFrame queries and aggregations for charts/tables.
- `pandas-highcharts` — chart config generation support (temperature view builds JSON manually).
- `django-tables2` — sortable/paginated HR tables with export mixin.
- `django-bootstrap4` + `django-octicons` — UI components and icons.
- `django-compressor` + `django-libsass` — SCSS pipeline and static minification.
- `djangobower` — vendors Highcharts, moment, underscore into static tree.
- `mysqlclient` + `psycopg2` — dual-database drivers.
- `django-model-utils` — `Choices` helper for novedad approval states.
- `django-braces` — listed in requirements (usage not prominent in scanned views).

## 5. Repository map (abstraction)

- **Entrypoints:** `manage.py` → `mce.settings`; `mce/urls.py` mounts all app routes; `mce/wsgi.py` / `mce/asgi.py` for deployment.
- **Domain / core:**
  - `apps/novedades/` — HR models (`Empleado`, `Puesto`, `Turno`, `Novedad`, `TipoNovedad`, `SeguimientoNovedad`), forms, tables, class-based views.
  - `apps/tablon/` — announcement model and date-filtered list view.
  - `apps/temperatura/` — unmanaged MySQL model, chart view, pandas aggregation helper.
  - `apps/estadisticas/` — unmanaged PostgreSQL slot models, `funciones.py` merge/aggregate logic, tabular views.
  - `apps/apis/` — DRF serializer and temperature list/create endpoint.
- **Adapters:** Multi-DB routing via `.using('db_temp')` and `.using('db_tragamonedas')`; file uploads to `media/` under `STATIC_ROOT`.
- **Templates:** `templates/` (base layout, nav, auth pages); per-app templates under `apps/*/templates/`.
- **Static / assets:** `static/` (source), `assets/` (collected output including vendored Bootstrap, Highcharts, admin copies). Large vendor trees — not summarized file-by-file.
- **Docs vaults:** Only root `README.md` (one line). No `docs/`, `.docs/`, ADRs, or PRDs found.
- **Agent scaffolding:** `.claude/` and `.docs/` **not present** in tree (scanned at clone root).
- **IDE metadata:** `.idea/` (PyCharm), `.vscode/` — local editor configs only.
- **Generated / vendor:** `node_modules/`, `assets/`, `static/bower/`, `static/bootstrap/`, `static/admin/` — third-party; existence noted, contents not ingested.

## 6. Configuration & contracts (no secrets)

Configuration is centralized in `mce/settings.py`. **This summary intentionally omits all secret values** (Django `SECRET_KEY`, database passwords, email addresses) found inline in that file — they must be rotated and moved to environment variables before reuse.

### Environment / settings shapes

| Setting area | Purpose |
|--------------|---------|
| `DATABASES['default']` | PostgreSQL — Django-managed models (novedades, tablon, auth) |
| `DATABASES['db_temp']` | MySQL — temperature sensor table `tb_temperatura` |
| `DATABASES['db_tragamonedas']` | PostgreSQL — slot `masterlist` and `tdatos` tables |
| `INSTALLED_APPS` | Django contrib + bootstrap4, compressor, bower, tables2, DRF, five local apps |
| `REST_FRAMEWORK` | PageNumberPagination, page size 10 |
| `LOGIN_REDIRECT_URL` | `/` after auth |
| `TIME_ZONE` | `America/Argentina/Mendoza` |
| `STATIC_ROOT` / `STATICFILES_DIRS` | Collect to `assets/`, serve from `static/` + `media/` |
| `BOWER_INSTALLED_APPS` | underscore, moment, highcharts |
| `BOOTSTRAP4` | jQuery included |
| `COMPRESS_*` | SCSS precompiler via libsass; offline compression enabled |

No `.env` file or `wrangler.jsonc` present. No feature-flag module beyond Django settings.

### 6.1 HTTP / API endpoints

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Active announcements (TablonView) | public (login optional for nav) |
| `GET/POST` | `/admin/` | Django admin for master data | staff |
| `GET/POST` | `/accounts/login/` etc. | Django auth URLs (`django.contrib.auth.urls`) | public |
| `GET` | `/novedades/` | Novedades list (alias to lista) | authenticated |
| `GET` | `/novedades/lista/` | Paginated novedades table | authenticated |
| `GET` | `/novedades/empleados/` | Employee directory table | staff (nav gated) |
| `GET` | `/novedades/lista/detalle/<pk>/` | Novedad detail | authenticated |
| `GET/POST` | `/novedades/nueva/` | Create novedad form | authenticated |
| `GET/POST` | `/novedades/nuevo_single/` | Alternate single-page create form | authenticated |
| `GET` | `/temperatura/chart` | Temperature chart page | authenticated (nav link) |
| `GET` | `/temperatura/data` | Highcharts JSON (query: `frecuencia`, `dias`) | same session |
| `GET` | `/anuncios/` | Announcement board | public |
| `GET` | `/estadisticas/` | Statistics welcome page | permission `estadisticas.kdx_ro_estadisticas` |
| `GET` | `/estadisticas/ppd` | Production-per-day styled table (query: `meses`, `cmap`) | permission-gated |
| `GET` | `/estadisticas/testing` | Internal testing view | permission-gated |
| `GET/POST` | `/api/temp/` | DRF list/create temperature rows | DRF (session auth via `/api/auth/`) |
| `GET` | `/api/auth/` | DRF browsable API login | session |

Custom error handlers: `handler403` and `handler404` render `templates/404or403.html`.

### 6.2 Other interfaces

- **Django management CLI:** `manage.py runserver`, `migrate`, `collectstatic`, `compress` (standard Django commands; no custom management commands found).
- **File upload interface:** `Novedad.adjunto` and `Empleado.documentos_adjuntos` FileFields write to `archivo/` paths under media.
- **Table export:** `ExportMixin` on `NovedadesView` enables django-tables2 export formats (exact formats depend on tables2 config).
- No MCP, Telegram, systemd, or CLI binary beyond Django's `manage.py`.

## 7. Data & persistence

**Stores:**

| Alias | Engine | Database name | Django usage |
|-------|--------|---------------|--------------|
| `default` | PostgreSQL | `djangoprojects` | Managed models: HR, tablón, auth tables |
| `db_temp` | MySQL | `db_temperatura` | Unmanaged `TbTemperatura` → `tb_temperatura` |
| `db_tragamonedas` | PostgreSQL | `tragamonedas` | Unmanaged `Masterlist`, `Tdatos` |

**Key entities (Django-managed):**

- `Empleado`, `Puesto`, `Turno` — HR roster structure.
- `Novedad`, `TipoNovedad`, `SeguimientoNovedad` — incident/leave records with approval metadata.
- `Tablon` — timed announcements (`tipo` Anuncio/Importante).

**Key entities (unmanaged / legacy):**

- `TbTemperatura` — columns `RPi`, `Temperatura`, `Humedad`, `Fecha`.
- `Masterlist` — slot inventory metadata (Spanish DB column names mapped).
- `Tdatos` — per-slot daily metrics (`_IN`, `_WIN`, `_DROP`, etc.).

**Topology:** Single Django app server connects to three databases on localhost (as configured). Sensor data originates from Raspberry Pi units writing to MySQL; slot telemetry is pre-aggregated in PostgreSQL. No edge Workers or object storage integration in this repo.

## 8. Docs & agent memory (required scan)

| Source | Finding |
|--------|---------|
| `README.md` | One-line description: base MCE site; use with companion **DjangoConda** repo at path `./cda`. |
| `docs/**` | Not present. |
| `.docs/**` | **Scanned — not present** in clone root. |
| `.claude/**` | **Scanned — not present** in clone root. |
| ADR / PRD / constitution | Not found. |
| Inline code comments | Spanish comments in `novedades/views.py`, `temperatura/views.py`, `settings.py` document intent (e.g., AJAX chart flow, initial-form pitfalls). |
| `templates/home.html` | Documents user-facing capabilities: admin for employees, novedades link, temperature report. |
| `templates/nav.html` | Documents permission-gated nav structure for RRHH and Operaciones sections. |

No agent skill trees or harness files to summarize.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — internal MCE operational data models include employee PII (DNI, phone, address, email fields on `Empleado`).
- **Auth model:** Django session authentication via `ModelBackend`; staff flag controls RRHH nav; custom permission `estadisticas.kdx_ro_estadisticas` gates operations analytics. DRF exposes browsable API login at `/api/auth/`.
- **Risk surface (configuration):** `DEBUG=True`, wildcard `ALLOWED_HOSTS`, inline secrets in `settings.py`, and disabled password validators (minimum length/common password checks commented out). These are legacy dev-posture settings unfit for production without hardening.
- **This summary contains no secrets, keys, passwords, or `.env` contents.**

## 10. Operational picture

**Local development (inferred):**

1. Set up Python environment via companion **DjangoConda** (`./cda` path referenced in README).
2. `pip install -r requeriments.txt` (note filename spelling).
3. Ensure PostgreSQL and MySQL instances match `DATABASES` host/name/user shapes in `settings.py` (values not repeated here).
4. `python manage.py migrate` for managed apps.
5. `python manage.py collectstatic` / `compress` for asset pipeline.
6. `python manage.py runserver` — typical Django dev server.

**Deployment:** No GitHub Actions, Dockerfile, or wrangler config in repo. Deployment method is unknown from tree; likely manual WSGI (gunicorn/uWSGI) behind a reverse proxy on internal infrastructure. PyCharm run configurations may exist under `.idea/` but were not ingested.

**Hardware context:** Temperature feature assumes Raspberry Pi (`rpi` field) sensor network writing to MySQL. Slot statistics assume an existing tragamonedas PostgreSQL warehouse.

## 11. Open questions / unknowns

- Exact production deployment topology (host, WSGI server, reverse proxy) — not documented in repo.
- Whether outbound email (novedad notifications) was ever implemented — `DEFAULT_FROM_EMAIL` set but no mail-sending views found.
- Current operational status — last migrations dated March 2020; Django 3.0 and Python 3.7 are end-of-life.
- Contents and install steps of companion **DjangoConda** repo — only referenced, not cloned for this summary.
- Whether `estadisticas.kdx_ro_estadisticas` permission is created via migration or manual admin setup — permission string appears in nav template but no `permissions` Meta found on models in scanned files.
- `.gitignore` file absent from repo root — risk of accidental commits of `__pycache__`, `assets/`, or local secrets (some already present in clone).
- Full slot analytics roadmap — `estadisticas/urls.py` has commented routes for additional PPD variants and group views not wired.
