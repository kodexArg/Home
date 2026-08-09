---
id: djangoconda-3-311aa4f8
title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — P2 — Pre-bundled Django ecosystem for data-heavy internal"
visibility: private
importance: normal
source_repo: "DjangoConda"
related: []
tags: ["djangoconda", "github", "private", "normal", "summary"]
---
### P2 — Pre-bundled Django ecosystem for data-heavy internal UIs

- **Who hurts:** Teams building Django admin-style interfaces with tables, charts, Excel export, SCSS compression, and REST APIs without assembling each library manually.
- **Pain today:** Each project repeats pip installs for django-tables2, tablib, django-bootstrap4, django-octicons, django-compressor, django-pandas, matplotlib, and related tooling; transitive conflicts (libsass, rcssmin, numpy/pandas versions) waste time.
- **How this repo answers:** Pip packages are already installed in the prefix: django-tables2 2.2.1, tablib 0.14.0, django-bootstrap4 1.1.1, django-octicons 1.0.2, django-compressor 2.4, djangorestframework 3.11.0, django-pandas 0.6.1, matplotlib 3.1.3, pandas 1.0.1, scikit-learn 0.22, plus SCSS/sass tooling ( , , , , binaries , , ).
- **Out of scope:** Frontend SPA frameworks, modern Tailwind/CSS pipelines, or package updates — versions are frozen at 2019–2020 era.
