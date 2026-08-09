---
id: djangoconda-6-862399d8
title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "DjangoConda"
related: []
tags: ["djangoconda", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. Operator clones the repo to a server path, uses bin/python3.7 and bin/django-admin from the prefix to run migrations and management commands for a sibling Django application. 2. Developer activates the prefix locally to match production package versions when debugging legacy Django 3 + psycopg2 issues. 3. Operator runs bin/pylint, bin/flake8, or bin/coverage against application code using the pre-installed lint/test toolchain. 4. Data-oriented Django views use pre-installed pandas, matplotlib, django-pandas, django-nvd3, and export libraries (tablib, openpyxl, xlrd/xlwt) without additional pip steps.
