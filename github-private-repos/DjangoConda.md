---
id: "django-conda"
title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages"
visibility: private
importance: normal
source_repo: "DjangoConda"
org: "kodexArg"
default_branch: "master"
primary_language: "Python"
repo_kind: "infrastructure"
status: "legacy"
related: []
tags: ["conda", "python-3.7", "django", "psycopg2", "postgres", "pip", "wsgi", "django-rest-framework", "django-tables2", "pylint", "legacy", "environment"]
problems_solved:
  - "Internal Django projects need a reproducible Python 3.7 runtime with Django, PostgreSQL bindings, and common Django UI/data packages without rebuilding conda and pip stacks on every machine."
  - "Operators deploying DjangoMCE-style workloads on Linux hosts need a portable conda prefix that can be cloned from git and activated directly instead of resolving dependency versions from scratch."
technologies:
  - "Conda (frozen prefix layout)"
  - "Python 3.7.5"
  - "Django 3.0.3"
  - "psycopg2 2.8.4"
  - "Django REST Framework 3.11"
  - "django-tables2 / django-bootstrap4 / django-octicons"
  - "django-compressor / django-libsass / django-cors-headers"
  - "pandas / matplotlib / scikit-learn / scipy"
  - "pylint / flake8 / coverage / IPython"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# DjangoConda

> **Problem thesis (required):** This repository is **not a Django application** — it is a **complete, pre-built Conda environment prefix** checked into git. It exists to give kodexArg operators and developers a frozen, copy-paste Python 3.7 runtime already containing Django 3, PostgreSQL adapter (psycopg2), WSGI-capable framework dependencies (via Django + asgiref), and a broad set of Django ecosystem packages (tables, Bootstrap, REST framework, compressor, analytics). The pain it attacks is environment drift: instead of running `conda create` and dozens of `pip install` commands on each server or laptop, one shallow clone yields an executable tree under `bin/`, `lib/`, and `conda-meta/` ready for activation or path-based use.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/DjangoConda` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Frozen Conda prefix with Python 3.7, Django 3, psycopg2, and curated Django/pip packages for internal legacy deployments. |
| Audience | Internal operators and developers running or maintaining DjangoMCE-era Django projects on Linux; not end users or public consumers. |

## 2. Problems it solves

### P1 — Reproducible Django + Postgres runtime without dependency resolution

- **Who hurts:** Developers and operators who deploy internal Django apps that require Python 3.7, Django, and PostgreSQL connectivity on Linux servers.
- **Pain today:** Building a conda environment from scratch requires matching Python minor version, conda channel packages, and pip extras; version skew between machines causes import errors, migration failures, and psycopg2 binary mismatches.
- **How this repo answers:** The entire conda prefix is version-locked in git: `conda-meta/` records the original `conda create -p ./cda python=3.7.5 django psycopg2` transaction (dated 2019-12-22), and `lib/python3.7/site-packages/` holds the pip-upgraded stack (Django 3.0.3, psycopg2 2.8.4, DRF, tables2, etc.). Cloning the repo reproduces the same interpreter and site-packages tree.
- **Out of scope:** Application source code, database migrations, WSGI server process management (Gunicorn/uWSGI binaries are not present), container images, or modern Python 3.10+ runtimes.

### P2 — Pre-bundled Django ecosystem for data-heavy internal UIs

- **Who hurts:** Teams building Django admin-style interfaces with tables, charts, Excel export, SCSS compression, and REST APIs without assembling each library manually.
- **Pain today:** Each project repeats pip installs for django-tables2, tablib, django-bootstrap4, django-octicons, django-compressor, django-pandas, matplotlib, and related tooling; transitive conflicts (libsass, rcssmin, numpy/pandas versions) waste time.
- **How this repo answers:** Pip packages are already installed in the prefix: django-tables2 2.2.1, tablib 0.14.0, django-bootstrap4 1.1.1, django-octicons 1.0.2, django-compressor 2.4, djangorestframework 3.11.0, django-pandas 0.6.1, matplotlib 3.1.3, pandas 1.0.1, scikit-learn 0.22, plus SCSS/sass tooling (`libsass`, `pyScss`, `django-libsass`, `django-sass-processor`, binaries `sassc`, `pysassc`, `less2scss`).
- **Out of scope:** Frontend SPA frameworks, modern Tailwind/CSS pipelines, or package updates — versions are frozen at 2019–2020 era.

### P3 — Portable deployment artifact for server paths

- **Who hurts:** Operators who deploy to fixed paths on Linux hosts (conda history references `/opt/DjangoMCE/cda`).
- **Pain today:** Shipping a venv or conda env as a tarball is opaque; git clone gives audit history and a known layout (`bin/python3.7`, `bin/django-admin`, `lib/python3.7/site-packages/`).
- **How this repo answers:** The repo root **is** the environment prefix — not a wrapper project. `bin/django-admin`, `bin/python3.7`, and `bin/pip` are entrypoints. `compiler_compat/` and `x86_64-conda_cos6-linux-gnu/` provide Anaconda glibc backwards-compatibility for older Linux targets.
- **Out of scope:** Cross-platform macOS/Windows support (layout is `x86_64` Linux conda); automated activation scripts beyond what conda normally provides.

## 3. Product / idea

The central idea is **environment-as-repository**: treat a Conda prefix like source code. There is no Django `manage.py`, no `settings.py`, and no `urls.py` in this tree — only the **runtime** that other repos (e.g. DjangoMCE-family projects) consume.

Mental model:

```
git clone DjangoConda → prefix directory
    ├── bin/python3.7          # interpreter
    ├── bin/django-admin       # Django management CLI
    ├── lib/python3.7/site-packages/  # Django + pip stack
    └── conda-meta/            # conda package provenance
```

An operator points `PATH` or conda activation at this prefix, then runs a separate application repo's Django project against the bundled packages. WSGI deployment is **implicit** (Django is WSGI-capable; `asgiref` includes WSGI-to-ASGI adapters) but this repo does **not** ship Gunicorn, uWSGI, or mod_wsgi binaries — an external WSGI server or platform layer is assumed.

`INSTALACION.md` documents an older creation recipe (`conda create -p ./cda python=3.6 django psycopg2` plus pip extras), which diverges from the actual frozen state (Python 3.7.5, Django 3.0.3). Treat `INSTALACION.md` as historical hint, not SSOT for the checked-in prefix.

### 3.1 North-star use cases

1. Operator clones the repo to a server path, uses `bin/python3.7` and `bin/django-admin` from the prefix to run migrations and management commands for a sibling Django application.
2. Developer activates the prefix locally to match production package versions when debugging legacy Django 3 + psycopg2 issues.
3. Operator runs `bin/pylint`, `bin/flake8`, or `bin/coverage` against application code using the pre-installed lint/test toolchain.
4. Data-oriented Django views use pre-installed pandas, matplotlib, django-pandas, django-nvd3, and export libraries (tablib, openpyxl, xlrd/xlwt) without additional pip steps.

### 3.2 Non-goals

- Hosting HTTP traffic (no WSGI server binary, no nginx, no application routes).
- Modern Python or Django versions (frozen at 3.7 / Django 3.0.3).
- Minimal/slim images — the repo is large (full conda prefix with tk, openssl, scipy stack, etc.).
- Secret or environment configuration management (no `.env` templates in repo).
- Agent scaffolding or hidden docs vaults (`.claude/` and `.docs/` absent).

## 4. Technology stack

Derived from `conda-meta/`, `conda-meta/history`, `lib/python3.7/site-packages/*.dist-info`, and `bin/` — not from lockfile dumps.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.7.5 (conda) | `conda-meta/python-3.7.5-h0371630_0.json`, `bin/python3.7` |
| Environment manager | Conda prefix (committed) | `conda-meta/`, `conda-meta/history` |
| Web framework | Django 3.0.3 (pip) | `lib/python3.7/site-packages/Django-3.0.3.dist-info` |
| ASGI/WSGI bridge | asgiref 3.2.3 | `lib/python3.7/site-packages/asgiref-3.2.3.dist-info` |
| PostgreSQL adapter | psycopg2 2.8.4 (pip) | `lib/python3.7/site-packages/psycopg2-2.8.4.dist-info` |
| MySQL adapter | mysqlclient 1.4.6 (pip) | pip list via `bin/python3.7 -m pip list` |
| API layer | Django REST Framework 3.11.0 | `lib/python3.7/site-packages/djangorestframework-3.11.0.dist-info` |
| UI / tables | django-tables2, django-bootstrap4, django-octicons, django-bower | site-packages dist-info dirs |
| Static pipeline | django-compressor, django-libsass, libsass, rcssmin, rjsmin | site-packages + `bin/sassc`, `bin/pysassc` |
| Data / viz | pandas 1.0.1, numpy 1.18.1, matplotlib 3.1.3, scipy 1.4.1, scikit-learn 0.22, django-pandas, django-nvd3 | pip list |
| Export | tablib, openpyxl, xlrd, xlwt, odfpy | pip list |
| CORS | django-cors-headers 3.2.1 | site-packages |
| Dev / QA | pylint 2.4.4, pylint-django 2.0.13, flake8 3.7.9, coverage 5.0.3, autopep8, isort | `bin/pylint`, `bin/flake8`, `bin/coverage` |
| REPL | IPython 7.12.0 | `bin/ipython`, `bin/ipython3` |
| System libs (conda) | openssl 1.1.1d, sqlite 3.30.1, ncurses, readline, tk 8.6.8, zlib, xz | `conda-meta/*.json` |
| Compatibility | Anaconda compiler_compat + cos6 sysroot | `compiler_compat/README`, `x86_64-conda_cos6-linux-gnu/` |

### 4.1 Notable dependencies (curated)

- `Django 3.0.3` — core web framework; provides WSGI application contract (`wsgi.py` pattern in consuming projects).
- `psycopg2 2.8.4` — PostgreSQL adapter; originally conda-installed then removed and re-added via pip per `conda-meta/history`.
- `djangorestframework 3.11.0` — REST API layer for consuming Django projects.
- `django-tables2 2.2.1` + `tablib 0.14.0` — sortable HTML tables and export (per `INSTALACION.md` intent).
- `django-compressor 2.4` + `libsass` + `rcssmin`/`rjsmin` — static asset compression and SCSS compilation.
- `django-pandas 0.6.1` + `pandas` + `matplotlib` — dataframe/chart integrations in Django views.
- `pylint-django 2.0.13` — Django-aware static analysis; added when pylint was conda-installed at `/opt/DjangoMCE/cda`.
- `mysqlclient 1.4.6` — optional MySQL support alongside psycopg2.

## 5. Repository map (abstraction)

Describe zones of the **conda prefix**, not a Django project:

- **Entrypoints (`bin/`):** `python3.7`, `pip`, `django-admin`, `django-admin.py`, `ipython`, `pylint`, `flake8`, `coverage`, SCSS compilers (`sassc`, `pysassc`, `less2scss`), and standard conda utilities (~105 binaries). No `gunicorn`, `uwsgi`, or `mod_wsgi`.
- **Python packages (`lib/python3.7/site-packages/`):** All pip and setuptools-installed Django ecosystem and scientific stack. This is the bulk of repo content.
- **Conda provenance (`conda-meta/`):** 23 conda package JSON manifests plus `history` log of create/install/uninstall commands.
- **Headers / shared libs (`include/`, `lib/` beyond site-packages):** OpenSSL, Python headers, tk/tcl, sqlite native libs.
- **SSL certs (`ssl/`):** OpenSSL config and `cacert.pem` — standard conda prefix artifacts; not application secrets.
- **Share data (`share/`):** man pages, readline examples, xz docs, locale — vendor documentation only.
- **Compiler compatibility (`compiler_compat/`, `x86_64-conda_cos6-linux-gnu/`):** Anaconda backwards-compat layer for older glibc targets.
- **Docs:** Only `INSTALACION.md` (3-line Spanish install hint) and `compiler_compat/README`. No `docs/`, `.docs/`, ADRs, or README at root.
- **Agent scaffolding:** `.claude/` — **not present**. `.docs/` — **not present**.
- **Generated / vendor:** Entire `lib/`, `include/`, `share/`, `ssl/` trees are vendor/conda artifacts — summarized by zone, not ingested file-by-file.

## 6. Configuration & contracts (no secrets)

This prefix has **no application-level configuration**. Relevant contracts:

- **Conda prefix layout:** Repo root acts as `-p` target (originally `./cda` per history; deployed references include `/opt/DjangoMCE/cda`).
- **Python interpreter:** `bin/python3.7` / `bin/python3.7m` — CPython 3.7.5.
- **Django management:** `bin/django-admin` wrapper pointing at installed Django 3.0.3.
- **No `.env` files, no `settings.py`, no wrangler/bindings** in this repo.

### 6.1 HTTP / API endpoints (when applicable)

**N/A — no HTTP surface in this repository.** This is a Python environment artifact, not a web service. Consuming Django projects define their own `urls.py` and WSGI entrypoints elsewhere. This repo supplies importable packages only.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | — | No routes; environment-only repo | — |

WSGI note: Django and asgiref in this prefix support the WSGI application protocol, but deployment requires an external WSGI server process not bundled here.

### 6.2 Other interfaces

- **CLI — Python:** `bin/python3.7`, `bin/pip`, `bin/ipython3`.
- **CLI — Django:** `bin/django-admin` (management commands for external projects).
- **CLI — quality:** `bin/pylint`, `bin/flake8`, `bin/coverage`, `bin/autopep8` (via `bin/autopep8` module wrapper).
- **CLI — assets:** `bin/sassc`, `bin/pysassc`, `bin/less2scss` for SCSS/CSS pipeline used by django-compressor/libsass stack.
- **Conda activation:** Standard conda `activate` against this prefix path (conda not required if PATH is set to `bin/`).

## 7. Data & persistence

- **No application database** in this repo. Persistence is entirely in consuming Django projects.
- **sqlite 3.30.1** is bundled as a conda system library (usable by Django's sqlite backend if a project configures it).
- **psycopg2** enables PostgreSQL connectivity in consuming apps.
- **mysqlclient** enables MySQL connectivity in consuming apps.
- Topology: single Linux x86_64 conda prefix, typically copied to a server filesystem path; not edge, not cloud-native by itself.

## 8. Docs & agent memory (required scan)

Scanned paths per assignment:

1. **`INSTALACION.md`** — Short Spanish note: original recipe `conda create -p ./cda python=3.6 django psycopg2` plus pip installs for django_tables2, django-octicons, django-bootstrap4, tablib. Actual frozen env uses Python 3.7.5 and broader pip stack.
2. **`compiler_compat/README`** — Points to Anaconda issue about backwards compatibility with older compilers; not project-specific docs.
3. **`conda-meta/history`** — Provenance log: created 2019-12-22 with django 2.2.5 + psycopg2 via conda; psycopg2 later conda-removed; pylint added 2020-02-14 at `/opt/DjangoMCE/cda` prefix.
4. **Root `README*`** — **not present**.
5. **`docs/**`** — **not present**.
6. **`.docs/**`** — **not present** (confirmed absent).
7. **`.claude/**`** — **not present** (confirmed absent).
8. **ADRs / PRDs / constitution** — **not present**.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` — environment may mirror internal production paths; do not treat as a public reusable template without review.
- **Auth model:** None in this repo (no HTTP layer).
- **Secrets:** No `.env`, credentials, or API keys found in tracked tree. `ssl/cacert.pem` is a standard CA bundle artifact, not a private key.
- **Legacy risk:** Python 3.7, Django 3.0.3, and many 2019-era packages are end-of-life; security patches require rebuilding the environment, not incremental edits.
- **Binary blobs:** Large committed binaries (`.so`, conda packages) — clone size and supply-chain trust are operational concerns.

## 10. Operational picture

- **Local use:** Clone repo; set `PATH` to `{prefix}/bin` or `conda activate` the prefix; run `python3.7` or `django-admin` against a separate Django project tree.
- **Historical deploy path:** `conda-meta/history` references `/opt/DjangoMCE/cda` — suggests deployment alongside DjangoMCE-family applications on Linux servers.
- **Rebuild (from `INSTALACION.md`, outdated):** `conda create -p ./cda python=3.6 django psycopg2` then pip install tables2/octicons/bootstrap4/tablib — **does not match** current frozen 3.7.5 / Django 3.0.3 state.
- **CI/CD:** No GitHub Actions, Dockerfile, or wrangler config in repo.
- **Hardware:** x86_64 Linux conda build (`x86_64-conda_cos6-linux-gnu` sysroot hints at older enterprise Linux compatibility).

## 11. Open questions / unknowns

- Which active kodexArg Django project(s) still depend on this exact prefix versus modern Docker/venv workflows — not documented in repo.
- Why psycopg2 was conda-uninstalled and re-added via pip (history shows removal of libpq/krb5 conda deps) — likely binary compatibility; exact rationale unknown.
- Whether Gunicorn/uWSGI was ever intended to be added (GitHub description mentions "wsgi" but no server binary is present).
- Current production usage status in 2026 — repo appears legacy; `INSTALACION.md` still references Python 3.6 recipe.
- No `.gitignore` — entire conda prefix including tk, scipy, and openssl artifacts is tracked; intentional for portability but unusual for modern git practice.
