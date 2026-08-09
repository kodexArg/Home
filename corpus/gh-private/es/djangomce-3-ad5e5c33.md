---
id: djangomce-3-ad5e5c33
title: "DjangoMCE — internal Mendoza Central operations portal — P2 — Legacy databases need a readable façade"
visibility: private
importance: normal
source_repo: "DjangoMCE"
related: []
tags: ["djangomce", "github", "private", "normal", "summary"]
---

### P2 — Legacy databases need a readable façade - **Who hurts:** Operations analysts who need coin-in/win summaries and temperature history without writing SQL. - **Pain today:** Temperature readings live in a MySQL tb_temperatura table; slot master list and daily telemetry live in a PostgreSQL tragamonedas database with Spanish column names and underscore-prefixed fields. - **How this repo answers:** Defines unmanaged Django models (TbTemperatura, Masterlist, Tdatos) mapped to existing tables, uses django-pandas DataFrame managers for aggregation, and renders Highcharts JSON (temperature) or styled pandas HTML tables (production per day). - **Out of scope:** Schema migrations for legacy DBs (managed = False on all external models). No ETL or data warehouse layer.
