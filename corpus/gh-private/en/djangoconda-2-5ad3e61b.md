---
id: djangoconda-2-5ad3e61b
title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — P1 — Reproducible Django + Postgres runtime without depen"
visibility: private
importance: normal
source_repo: "DjangoConda"
related: []
tags: ["djangoconda", "github", "private", "normal", "summary"]
---

### P1 — Reproducible Django + Postgres runtime without dependency resolution - **Who hurts:** Developers and operators who deploy internal Django apps that require Python 3.7, Django, and PostgreSQL connectivity on Linux servers. - **Pain today:** Building a conda environment from scratch requires matching Python minor version, conda channel packages, and pip extras; version skew between machines causes import errors, migration failures, and psycopg2 binary mismatches. - **How this repo answers:** The entire conda prefix is version-locked in git: records the original transaction (dated 2019-12-22), and holds the pip-upgraded stack (Django 3.0.3, psycopg2 2.8.4, DRF, tables2, etc.). Cloning the repo reproduces the same interpreter and site-packages tree. - **Out of scope:** Application source code, database migrations, WSGI server process management (Gunicorn/uWSGI binaries are not present), container images, or modern Python 3.10+ runtimes.
