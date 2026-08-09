---
id: "pihome"
title: "PiHome — Django multimedia hub for Raspberry Pi"
visibility: private
importance: normal
source_repo: "PiHome"
org: "kodexArg"
default_branch: "master"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags: ["django", "python", "raspberry-pi", "multimedia", "mysql", "bootstrap4", "home-server", "legacy", "argentina"]
problems_solved:
  - "No lightweight web interface on a Raspberry Pi to upload, catalog, and list multimedia files for a home LAN."
  - "Ad-hoc file drops on the Pi filesystem lack ordering metadata, display names, and a browsable index."
  - "Need a Django-based home service aligned with Argentina Spanish locale and Mendoza timezone on constrained Pi hardware."
technologies:
  - "Python 3.6"
  - "Django 2.2"
  - "MySQL (mysqlclient)"
  - "django-bootstrap4"
  - "django-crispy-forms (declared in settings; not present in committed venv)"
  - "Bootstrap 4 (via django-bootstrap4 template tags)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# PiHome

> **Problem thesis (required):** PiHome is a small Django web application intended to run on a Raspberry Pi and give household operators a browser-based way to manage multimedia files—upload them, attach metadata (name and sort order), persist records in MySQL, and list what is stored. It targets the constraint of a low-power Pi home server rather than a cloud media platform, with Spanish (Argentina) localization and Mendoza timezone defaults.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/PiHome` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Django home multimedia manager for Raspberry Pi—upload, catalog, and list files through a simple Bootstrap-styled web UI backed by MySQL. |
| Audience | Home operator / developer running a Pi on the LAN; internal kodexArg maintainer reviving or referencing legacy Pi services. |

## 2. Problems it solves

### P1 — Pi-local multimedia without a cloud stack

- **Who hurts:** Someone hosting photos, audio, or video on a Raspberry Pi who wants a minimal web front door instead of SSH and manual folder management.
- **Pain today:** Files land in arbitrary directories with no shared naming scheme, no sort order for playlists or slideshows, and no single page to see what is on the device.
- **How this repo answers:** The `PiMedia` Django app defines an `ArchivosMultimedia` model (name, order, auto date, file field) and exposes routes for listing (`Listado/`), structured add (`Agregar/`), and a scratch upload path (`Subida/`) that writes directly to filesystem storage without touching the database.
- **Out of scope:** Streaming transcoding, CDN delivery, multi-user permissions beyond Django admin, mobile apps, or cloud sync.

### P2 — Repeatable Django project skeleton on Pi-class hardware

- **Who hurts:** A developer standing up another Pi-side Django service who wants a known project layout (settings, WSGI, one domain app, shell runners).
- **Pain today:** Each Pi experiment starts from `django-admin startproject` with no opinionated media paths, locale, or MySQL wiring.
- **How this repo answers:** Ships a complete (if dated) Django 2.2 project with `MEDIA_ROOT` / `MEDIA_URL`, MySQL `DATABASES` block, `es-ar` language and Mendoza timezone, Bootstrap 4 via `django-bootstrap4`, and helper shell scripts (`run.sh`, `src.sh`) for activating a venv and launching `runserver`.
- **Out of scope:** Production hardening (the committed settings use debug mode and empty allowed hosts), container orchestration, or infrastructure-as-code.

### P3 — Quick filesystem-only upload for testing

- **Who hurts:** Developer validating Pi storage or upload plumbing before wiring the ORM form flow.
- **Pain today:** Every test upload requires filling a model form and hitting MySQL.
- **How this repo answers:** `Subida/` accepts a POST with `archivo_multimedia`, saves via `FileSystemStorage`, prints the resulting URL to stdout, and renders a template—explicitly commented as temporary and database-free.
- **Out of scope:** Durable metadata for Subida uploads; they are not registered in `ArchivosMultimedia`.

## 3. Product / idea

PiHome is a two-package Django monolith: the `PiHome` project package (settings, root URLconf, WSGI) and the `PiMedia` application (models, views, templates, static CSS, admin registration). The mental model is “home page + three media workflows + Django admin,” all served from the Pi on the development server or behind a production WSGI stack not defined in-repo.

Users land on a Bootstrap jumbotron home (`Home` class-based `TemplateView`). From there they can add catalogued media (`Agregar/` with `FrmAgregarMM` ModelForm), browse the database-backed list (`Listado/`), or use the experimental direct upload (`Subida/`). In debug mode, uploaded files are also exposed under `/media/` via static file serving helpers in both root and app URLconfs.

Persistence splits: structured records live in MySQL table backing `ArchivosMultimedia`; raw Subida files go to default filesystem storage. File fields upload to date-based paths (`archivos/%Y/%D/` per migrations, with a slightly different path string in the live model—see open questions).

### 3.1 North-star use cases

1. Operator opens the home page on the Pi’s LAN address, navigates to **Agregar**, fills name/order/file, submits, and is redirected to **Listado** showing all `ArchivosMultimedia` rows.
2. Operator uses **Subida** to push a file and confirm storage works before enabling the database form path.
3. Maintainer uses Django **admin** (`admin/`) to inspect or edit `ArchivosMultimedia` records without custom admin views.

### 3.2 Non-goals

- No README, ADR, or constitution files define explicit non-goals; inferred from code: not a production media server, not multi-tenant, not API-first (HTML form views only), not tested (empty `tests.py`).

## 4. Technology stack

Derived from `PiHome/settings.py`, `manage.py`, committed `virtualenvironment/pyvenv.cfg`, and package metadata under `virtualenvironment/lib/python3.6/site-packages/` (vendor tree noted but not ingested line-by-line).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.6.8 | `virtualenvironment/pyvenv.cfg` |
| Web framework | Django 2.2.4 | `virtualenvironment/.../Django-2.2.4.dist-info/METADATA`; `PiHome/settings.py` header |
| Frontend | Django templates + Bootstrap 4 via `django-bootstrap4` | `PiMedia/templates/PiMedia/base.html`; `INSTALLED_APPS` in `PiHome/settings.py` |
| Forms UI | `django-crispy-forms` with `bootstrap4` pack (declared) | `PiHome/settings.py` (`crispy_forms`, `CRISPY_TEMPLATE_PACK`) |
| Backend / API | Django function and class views (HTML, not REST) | `PiMedia/views.py`, `PiMedia/urls.py` |
| Data | MySQL via `django.db.backends.mysql` and `mysqlclient` 1.4.4 | `PiHome/settings.py`; `virtualenvironment/.../mysqlclient-1.4.4-py3.6.egg-info` |
| Media storage | Local filesystem (`MEDIA_ROOT`, `FileSystemStorage`) | `PiHome/settings.py`; `PiMedia/views.py` |
| Infra / deploy | Shell scripts + committed venv (non-standard) | `run.sh`, `src.sh`, `virtualenvironment/` |
| AI / agents | None | No `.claude/`, `.agents/`, or skill trees present |
| Tests | Django `TestCase` scaffold only (no cases) | `PiMedia/tests.py` |

### 4.1 Notable dependencies (curated)

- **Django 2.2.4** — core web framework; migrations generated with 2.1.4 initially, later 2.2.4.
- **mysqlclient 1.4.4** — MySQL database driver for the Pi-side `pihome` database.
- **django-bootstrap4** — loads Bootstrap CSS in templates (`{% bootstrap_css %}`).
- **django-crispy-forms** — listed in `INSTALLED_APPS` for Bootstrap 4 form rendering; package not found in committed venv (install gap).
- **PyMySQL 0.9.3** — present in venv; may have been an alternate driver experiment; settings use `mysql` engine directly.

## 5. Repository map (abstraction)

- **Entrypoints:** `manage.py` (Django CLI); `run.sh` (activate external venv + `runserver`); `src.sh` (activate `../pivenv`); `PiHome/wsgi.py` (WSGI `application`).
- **Project config:** `PiHome/settings.py` (apps, middleware, DB, media, static, locale); `PiHome/urls.py` (admin + PiMedia include + debug media serve).
- **Domain / core:** `PiMedia/models.py` (`ArchivosMultimedia`); `PiMedia/forms.py` (`FrmAgregarMM`); `PiMedia/views.py` (Home, Subida, Agregar, Listado); `PiMedia/admin.py` (model registration).
- **HTTP routing:** `PiMedia/urls.py` (app routes); root urlpatterns in `PiHome/urls.py`.
- **Presentation:** `PiMedia/templates/PiMedia/base.html` (layout with jumbotron); `PiMedia/static/css/generico.css` (orange jumbotron theme). Views reference additional templates (`Home.html`, `Subida.html`, `Agregar.html`, `Listado.html`) not present in the tree—likely missing from the snapshot.
- **Schema history:** `PiMedia/migrations/0001_initial.py`, `0002_auto_20190823_0349.py` (upload path field alteration).
- **Docs vaults:** None (`docs/`, `.docs/` absent).
- **Agent scaffolding:** None (`.claude/` absent).
- **Generated / vendor:** `virtualenvironment/` — full Python 3.6 venv committed (~5k+ files); treat as vendor snapshot, not application source. Standard `.gitignore` excludes `*.pyc`, `__pycache__`, `pivenv`, `.DS_Store` but not `virtualenvironment/`.

## 6. Configuration & contracts (no secrets)

Settings module `PiHome/settings.py` defines the following shapes (values intentionally omitted where credential-like):

- **`SECRET_KEY`** — Django signing key; hardcoded in repo (security risk; must be rotated and externalized for any redeployment).
- **`DEBUG`** — `True` in committed settings.
- **`ALLOWED_HOSTS`** — empty list (development default).
- **`DATABASES['default']`** — MySQL engine, database name `pihome`, user `piuser`, host `localhost`, password set inline (must not be replicated in summaries or RAG corpora).
- **`MEDIA_ROOT` / `MEDIA_URL`** — project-relative `media/` folder served at `/media/` in debug.
- **`STATIC_ROOT` / `STATIC_URL`** — `static/` collection target, `/static/` URL prefix.
- **`LANGUAGE_CODE`** — `es-ar`; **`TIME_ZONE`** — `America/Argentina/Mendoza`.
- **`INSTALLED_APPS`** — Django contrib (admin, auth, sessions, etc.), `bootstrap4`, `crispy_forms`, `PiMedia`.

`run.sh` assumes a venv at a fixed home-directory path and a project copy under a `Django/PiHome` layout—machine-specific, not portable from repo root alone. `src.sh` activates `../pivenv` relative to the script.

### 6.1 HTTP / API endpoints (when applicable)

HTML form views only; no REST or JSON API detected.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home page (`Home` TemplateView) | none |
| `GET`/`POST` | `/Subida/` | Direct filesystem upload (no DB); POST field `archivo_multimedia` | none |
| `GET`/`POST` | `/Agregar/` | ModelForm create for `ArchivosMultimedia`; redirect to Listado on success | none |
| `GET` | `/Listado/` | Renders all `ArchivosMultimedia` records | none |
| `GET` | `/admin/` | Django admin for registered models | Django staff session |
| `GET` | `/media/<path>` | Serves uploaded media files (DEBUG only) | none |

No CSRF-exempt routes; standard Django CSRF middleware applies to POST forms.

### 6.2 Other interfaces

- **Django management CLI:** `manage.py` supports standard commands (`migrate`, `runserver`, `createsuperuser`, etc.).
- **Shell helpers:** `run.sh` starts dev server; `src.sh` only activates virtualenv.

## 7. Data & persistence

- **Primary store:** MySQL database `pihome` on localhost (InnoDB tables via Django ORM).
- **Entity:** `ArchivosMultimedia` — fields `nombre` (CharField 100), `orden` (IntegerField), `fecha` (DateField, auto on create), `archivo` (FileField with date-based `upload_to`).
- **Filesystem:** User uploads land under `MEDIA_ROOT` (project `media/` directory) with subdirectory patterns from the model/migrations.
- **Topology:** Single Pi (or single host) running Django dev/WSGI process + local MySQL + local disk; no edge workers, object storage, or replication configured in-repo.

## 8. Docs & agent memory (required scan)

Scans performed; most conventional doc locations are absent.

1. **Root README** — not present.
2. **`docs/**` and `.docs/**`** — not present.
3. **ADR / PRD / constitution** — not present.
4. **`.claude/**`** — not present.

Evidence drawn from application source and templates instead:

- `PiMedia/templates/PiMedia/base.html` — product title “PiHome”, tagline (Spanish) describing multimedia file management for Raspberry Pi.
- `PiMedia/urls.py` — inline comment on `Subida/` as temporary, non-database route.
- `PiHome/settings.py` — locale, timezone, and stack choices.
- GitHub repo description hint (dispatcher): “Django para Pi”.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository; summary describes architecture without clone URLs or live credentials.
- **Auth model:** No custom login views; public HTML routes are unauthenticated. Django admin uses built-in session auth for staff users only.
- **Committed secrets risk:** `SECRET_KEY` and database password appear inline in `settings.py`—this summary contains **no** secret values. Any redeployment must rotate keys and move credentials to environment variables or a secrets manager.
- **Debug exposure:** `DEBUG=True` enables verbose errors and media static serving; unsuitable for internet-facing deployment.
- **Upload surface:** Unauthenticated POST endpoints accept arbitrary file uploads—LAN-trust assumption only.

## 10. Operational picture

- **Local dev (intended):** Activate Python 3.6 venv (`src.sh` → `../pivenv`, or `run.sh` → external path), ensure MySQL `pihome` database exists, run migrations (`manage.py migrate`), create superuser, then `manage.py runserver` or `./run.sh`.
- **Dependencies:** MySQL server on localhost; Python packages from committed `virtualenvironment/` or a fresh venv installing Django 2.2, mysqlclient, django-bootstrap4, django-crispy-forms.
- **Deploy / CI:** No GitHub Actions, Dockerfile, or compose files in tree. Last git push circa 2019—treat as dormant legacy.
- **Hardware:** Raspberry Pi class device implied by name, description, and shell paths; no GPIO or hardware-specific code in application layer.

## 11. Open questions / unknowns

- **Missing templates:** Views reference `PiMedia/Home.html`, `Subida.html`, `Agregar.html`, and `Listado.html`, but only `base.html` exists in the clone—app may be incomplete or templates were never committed.
- **`Agregar` view logic:** After POST handling, the view unconditionally re-instantiates an empty `FrmAgregarMM()`, likely discarding valid POST results (possible bug).
- **`crispy_forms` vs venv:** Settings require `crispy_forms` but the committed venv does not include it—runtime import would fail unless installed separately.
- **Upload path mismatch:** Model uses `upload_to='media/%Y/%D/'` while migrations reference `archivos/%Y/%D/` and `archivos/%Y/%m/%D/`—may cause inconsistent storage paths.
- **Production deployment:** No gunicorn/uwsgi/nginx configuration, HTTPS, or `ALLOWED_HOSTS` production values documented.
- **Test coverage:** `tests.py` is empty; behavior unverified by automated tests.
- **Relationship to other kodexArg Pi projects:** Unknown whether superseded by a newer home stack (e.g. later Cloudflare or Astro-based home projects).

---
