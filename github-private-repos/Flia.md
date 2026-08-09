---
id: "flia"
title: "Flia — family household expense tracker (Django admin)"
visibility: private
importance: low
source_repo: "Flia"
org: "kodexArg"
default_branch: "master"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags: ["django", "python", "sqlite", "family", "expenses", "admin", "conda", "bootstrap4", "legacy"]
problems_solved:
  - "Household members need a single place to record purchases, who paid, how they were paid, and what category they belong to — without spreadsheets scattered across people."
  - "Recurring subscriptions and one-off purchases need different treatment (service flag, infinite/recurring flag) while still sharing the same categorization model."
  - "A single household item (e.g. a utility or subscription) may accrue multiple payment amounts over time; the schema must link many dated amounts to one article."
technologies:
  - "Python 3.7"
  - "Django 2.2.5"
  - "SQLite"
  - "django-bootstrap4 1.0.1"
  - "mysqlclient 1.4.4 (bundled; not wired in settings)"
  - "Conda prefix environment"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Flia

> **Problem thesis (required):** Flia is a private, legacy Django application for **family household economics** — tracking articles (purchases and services), who is responsible, payment method, category, and dated payment amounts. It exists to give a small household a structured back-office (Django admin) instead of ad-hoc notes or spreadsheets, with Argentine Spanish labels and a data model sketched in draw.io before implementation.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/Flia` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Django admin–backed family expense ledger with articles, categories, payers, payment types, and recurring amount history. |
| Audience | Internal household operators (family members) entering and reviewing expenses via Django admin; originally built for personal/family use circa 2019. |

## 2. Problems it solves

### P1 — Centralized family purchase and expense records

- **Who hurts:** Household members who share bills, groceries, subscriptions, and occasional large purchases and need one shared record.
- **Pain today:** Expenses live in memory, paper, or disconnected spreadsheets; nobody agrees on category, date, or who “owns” the line item.
- **How this repo answers:** The `App` Django application defines `Articulos` (items), `Categorias`, `Responsables`, `Pagos`, and `Importes` models. Operators use the built-in Django admin (`admin/` URL) to create and maintain records with Spanish field labels (`es-ar` locale).
- **Out of scope:** No public-facing UI, no bank import, no multi-tenant SaaS, no mobile app, no reporting dashboards beyond what Django admin provides.

### P2 — Recurring services vs one-time purchases

- **Who hurts:** Families with both monthly subscriptions (“infinite” / service items) and one-off buys that should not be modeled the same way.
- **Pain today:** Flat expense lists mix recurring and ephemeral spending, making monthly burn hard to reason about.
- **How this repo answers:** `Articulos` carries `servicio` (is it a service?) and `infinito` (is it recurring/infinite?) booleans plus `fecha` (purchase/start date) and optional `comentario` text.
- **Out of scope:** No cron jobs, reminders, or automatic renewal detection — flags are metadata only unless extended later.

### P3 — Multiple payment amounts per item over time

- **Who hurts:** Operators tracking utilities or installment-style spending where one logical “item” receives several dated payments.
- **Pain today:** Early schema tied a single `Importes` row directly to `Articulos`; that does not scale when history matters.
- **How this repo answers:** Migration `0005` refactored the relationship so `Importes` holds `item_id` → `Articulos` with `importe` (decimal) and `fecha`, enabling one-to-many amount history per article. Admin registers both `Articulos` and `Importes`.
- **Out of scope:** No amortization math, currency conversion, or tax reporting.

## 3. Product / idea

Flia wraps a single Django project named **vaneconomic** inside the repository root. The mental model is a **small CRUD ledger**: every spending event rolls up to an `Articulo` classified by category, payment type, and responsible person; actual money movements over time live in child `Importes` rows.

There are **no custom HTTP views** — `App/views.py` is empty and `vaneconomic/urls.py` only mounts `admin/`. The product surface is entirely the Django admin site plus whatever data already sits in the committed `db.sqlite3` file (local dev artifact).

A bundled **Conda prefix** at `envs/` was created on 2019-10-14 with `python=3.7`, `django`, and `mysqlclient`, so the original developer could run the project without a separate virtualenv setup. Runtime settings nonetheless point at **SQLite**, not MySQL.

### 3.1 North-star use cases

1. **Log a new household purchase** — Create `Articulos` with item name, purchase date, category, responsible person, payment type, service/infinite flags, and optional comment via admin.
2. **Record a payment against an existing item** — Add `Importes` rows with amount and date linked to the parent article (post-migration model).
3. **Review spending history** — Browse and filter articles and import rows in Django admin (lookup tables for categories, payers, and payment types exist in models but most are not registered in admin — see §5).

### 3.2 Non-goals

- No REST/JSON API, no user-facing templates beyond admin defaults.
- No authentication hardening beyond Django defaults (`DEBUG = True`, empty `ALLOWED_HOSTS` in settings — development posture).
- No CI/CD, Docker, or cloud deploy manifests in tree.
- No README or formal ADRs; design intent partially captured in `Varios/Untitled Diagram.drawio` only.

## 4. Technology stack

Derived from `vaneconomic/vaneconomic/settings.py`, `envs/conda-meta/history`, and package metadata under `envs/lib/python3.7/site-packages/` (names/versions only).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.7.4 | `envs/conda-meta/python-3.7.4-h265db76_1.json` |
| Web framework | Django 2.2.5 | `settings.py` header; `envs/conda-meta/django-2.2.5-py37_1.json` |
| Admin UI styling | django-bootstrap4 1.0.1 | `settings.py` `INSTALLED_APPS`; `envs/lib/python3.7/site-packages/django_bootstrap4-1.0.1.dist-info/` |
| Data | SQLite (active); MySQL client bundled unused | `settings.py` `DATABASES`; `envs/conda-meta/mysqlclient-1.4.4-py37he6710b0_0.json` |
| Env packaging | Conda prefix committed in-repo | `envs/conda-meta/history` |
| Frontend | None (admin only) | empty `views.py`; no `templates/` tree |
| Infra / deploy | None evident | no `.github/`, no `Dockerfile`, no `wrangler.jsonc` |
| AI / agents | None | `.claude/` absent (scanned) |
| Tests | Django `TestCase` stub only | `vaneconomic/App/tests.py` |

### 4.1 Notable dependencies (curated)

- `django` 2.2.5 — core web framework and ORM; LTS-era version from 2019.
- `django-bootstrap4` 1.0.1 — listed in `INSTALLED_APPS` for admin/form styling (no custom templates observed).
- `mysqlclient` 1.4.4 — installed in conda env but not selected in `DATABASES` (likely planned alternate backend).
- `sqlparse`, `pytz` — standard Django transitive stack in conda env.

## 5. Repository map (abstraction)

Top-level zones:

- **`vaneconomic/`** — Django project root (`manage.py`, `db.sqlite3`).
  - **`vaneconomic/vaneconomic/`** — project package: `settings.py`, `urls.py`, `wsgi.py`.
  - **`vaneconomic/App/`** — sole application: `models.py` (domain), `admin.py` (registration), empty `views.py`, five migrations from 2019-10-17.
- **`envs/`** — full Conda prefix (Python, Django, OpenSSL, SQLite libs, site-packages). **Vendor/generated tree — do not ingest file-by-file;** treat as portable runtime bundle.
- **`Varios/`** — miscellaneous assets; contains `Untitled Diagram.drawio` (entity-relationship sketch from 2019-10-14).

**Entrypoints:** `vaneconomic/manage.py` (CLI); `vaneconomic/vaneconomic/wsgi.py` (WSGI).

**Domain / core:** `vaneconomic/App/models.py` — `Articulos`, `Categorias`, `Responsables`, `Pagos`, `Importes`.

**Adapters:** Django ORM → SQLite file at `vaneconomic/db.sqlite3`.

**Docs vaults:** No `docs/`, `.docs/`, ADR, or README at repository root (scanned). Design diagram only in `Varios/`.

**Agent scaffolding:** No `.claude/`, `.agents/`, or `SKILL.md` trees present (scanned).

**Generated / vendor:** `envs/` (entire conda env), `**/__pycache__/`, committed `db.sqlite3`.

## 6. Configuration & contracts (no secrets)

### Django settings (`vaneconomic/vaneconomic/settings.py`)

| Setting | Purpose |
|---------|---------|
| `SECRET_KEY` | Django signing key — **present in repo; must not be quoted in summaries or redeployed as-is** |
| `DEBUG` | `True` (development mode) |
| `ALLOWED_HOSTS` | Empty list |
| `LANGUAGE_CODE` | `es-ar` (Argentine Spanish) |
| `TIME_ZONE` | `UTC` |
| `DATABASES['default']` | SQLite engine, file `db.sqlite3` under project base |
| `INSTALLED_APPS` | Django contrib apps + `App` + `bootstrap4` |
| `STATIC_URL` | `/static/` |

No `.env` files observed at repository root. No `requirements.txt` or `pyproject.toml` — dependency contract is implicit via committed `envs/` prefix.

### 6.1 HTTP / API endpoints (when applicable)

No custom routes beyond Django admin. No REST framework, no OpenAPI.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `*` | `/admin/` | Django admin CRUD for registered models | Django session / staff user (default) |
| `GET` | `/static/…` | Static assets (admin CSS/JS) | none |

No other HTTP surface. No health check route.

### 6.2 Other interfaces

- **CLI:** `python manage.py runserver`, `migrate`, `createsuperuser`, etc. (standard Django).
- **WSGI:** `vaneconomic.wsgi:application` for production-style hosting (not configured in-repo).

## 7. Data & persistence

**Store:** SQLite file `vaneconomic/db.sqlite3` (committed; likely contains sample or real household data — **do not scrape row contents**).

**Entities (ORM models):**

| Model | Role |
|-------|------|
| `Articulos` | Named item/purchase; FKs to `Responsables`, `Categorias`, `Pagos`; flags `servicio`, `infinito`; `fecha`, `comentario` |
| `Importes` | Dated decimal amount; FK `item_id` → `Articulos` (CASCADE) |
| `Categorias` | Short category label |
| `Responsables` | Who is responsible for the expense |
| `Pagos` | Payment type label (cash, card, transfer, etc. — values are free text) |

**Schema evolution:** Initial migration created `Articulos.importe_id` → `Importes`; migration `0005` removed that FK and added `Importes.item_id` → `Articulos`, inverting to one-article-many-importes.

**Topology:** Single-machine, file-backed SQLite; no edge, queue, or cloud data plane. MySQL support was provisioned in conda but not activated in settings.

## 8. Docs & agent memory (required scan)

| Source | Result |
|--------|--------|
| Root `README*` | **Not found** |
| `docs/**` | **Not present** |
| `.docs/**` | **Not present** (scanned) |
| ADR / PRD / constitution | **Not present** |
| `.claude/**` | **Not present** (scanned) |
| `Varios/Untitled Diagram.drawio` | draw.io ER diagram (2019-10-14); binary/compressed XML — confirms early modeling of entities before migrations |
| `vaneconomic/App/migrations/` | Implicit documentation of schema churn on 2019-10-17 |
| `envs/conda-meta/history` | Records conda create command and package pins |

No agent instruction trees to summarize. Operational knowledge must be inferred from Django project layout and migrations.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repository; household financial data model — treat any committed `db.sqlite3` as sensitive if reused.
- **Auth model:** Standard Django admin authentication (staff users). No custom OIDC or API tokens.
- **Development leaks:** `DEBUG = True`, hardcoded `SECRET_KEY` in `settings.py`, empty `ALLOWED_HOSTS` — not production-hardened.
- **Bundled env:** `envs/ssl/` contains OpenSSL config and CA material from conda packaging — not application secrets but should not be quoted.
- **This summary contains no secrets, keys, connection strings with passwords, or `.env` contents.**

## 10. Operational picture

**Local run (inferred):**

1. Activate or use Python from `envs/` prefix (conda activate equivalent pointing at `./envs`).
2. `cd vaneconomic && python manage.py runserver` (or `manage.py migrate` on fresh checkout without relying on committed DB).

**Deploy:** No GitHub Actions, Makefile, or hosting config in tree. Last git push was 2019-10-17 — dormant legacy artifact.

**Hardware:** No special constraints; standard x86_64 Linux assumed (conda history from Fedora-era workstation per draw.io agent string).

## 11. Open questions / unknowns

- Whether **Flia** is an abbreviation of “Familia” or another name — not documented in-repo.
- Why **mysqlclient** was installed but SQLite is configured — alternate deployment never committed?
- Whether **`bootstrap4`** was intended for future custom templates — no templates directory exists.
- **`Pagos`, `Categorias`, `Responsables`** are commented out in `admin.py` — intentional simplification or work in progress?
- Contents of **`db.sqlite3`** — real household data vs. seed; not inspected (binary/sensitive).
- No **`.gitignore`** at root — conda env and sqlite DB are fully tracked; modern hygiene unknown.
