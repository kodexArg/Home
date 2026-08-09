---
id: djangoconda-4-1981bb7f
title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — P3 — Portable deployment artifact for server paths"
visibility: private
importance: normal
source_repo: "DjangoConda"
related: []
tags: ["djangoconda", "github", "private", "normal", "summary"]
---
### P3 — Portable deployment artifact for server paths

- **Who hurts:** Operators who deploy to fixed paths on Linux hosts (conda history references ).
- **Pain today:** Shipping a venv or conda env as a tarball is opaque; git clone gives audit history and a known layout ( , , ).
- **How this repo answers:** The repo root **is** the environment prefix — not a wrapper project. , , and are entrypoints. and provide Anaconda glibc backwards-compatibility for older Linux targets.
- **Out of scope:** Cross-platform macOS/Windows support (layout is Linux conda); automated activation scripts beyond what conda normally provides.
