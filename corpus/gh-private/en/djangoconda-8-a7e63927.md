---
id: djangoconda-8-a7e63927
title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — 4. Technology stack"
visibility: private
importance: normal
source_repo: "DjangoConda"
related: []
tags: ["djangoconda", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from conda-meta/, conda-meta/history, lib/python3.7/site-packages/*.dist-info, and bin/ — not from lockfile dumps. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.7.5 (conda) | conda-meta/python-3.7.5-h0371630_0.json, bin/python3.7 | | Environment manager | Conda prefix (committed) | conda-meta/, conda-meta/history | | Web framework | Django 3.0.3 (pip) | lib/python3.7/site-packages/Django-3.0.3.dist-info | | ASGI/WSGI bridge | asgiref 3.2.3 | lib/python3.7/site-packages/asgiref-3.2.3.dist-info | | PostgreSQL adapter | psycopg2 2.8.4 (pip) | lib/python3.7/site-packages/psycopg2-2.8.4.dist-info | | MySQL adapter | mysqlclient 1.4.6 (pip) | pip list via bin/python3.7 -m pip list | | API layer | Django REST Framework 3.11.0 | lib/python3.7/site-packages/djangorestframework-3.11.0.dist-info | | UI / tables | django-tables2, django-bootstrap4, django-octicons, django-bower | site-packages dist-info dirs | | Static pipeline | django-compressor, django-libsass, libsass, rcssmin, rjsmin | site-packages + bin/sassc, bin/pysassc | | Data / viz | pandas 1.0.1, numpy 1.18.1, matplotlib 3.1.3, scipy 1.4.1, scikit-learn 0.22, django-pandas, django-nvd3 | pip list | | Export | tablib, openpyxl, xlrd, xlwt, odfpy | pip list | | CORS | django-cors-headers 3.2.1 | site-packages | | Dev /
