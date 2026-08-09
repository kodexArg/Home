---
id: gitcon-2-5cd013e5
title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts) — P1 — Daily active-member visibility from Oracle session data"
visibility: private
importance: low
source_repo: "GITCon"
related: []
tags: ["gitcon", "github", "private", "low", "summary"]
---

### P1 — Daily active-member visibility from Oracle session data - **Who hurts:** Gym managers and analysts who need to know how many distinct members (*socios*) actually used the facility, not just raw turnstile events or credit purchases in isolation. - **Pain today:** Session data lives in Oracle (SES_PT_ONLINE) with card IDs (TARJETA_ID), session start timestamps (FECHA_INI), and credit flags (CREDITOS). Extracting a clean per-day unique-member count requires custom SQL, date-boundary logic, and post-processing outside the legacy application UI. - **How this repo answers:** PyGic/clientes_activos.sql selects distinct card visits with credits in a date window (formatted via {0}/{1} placeholders). PyGic/main.py loads that SQL, queries Oracle through cx_Oracle + pandas.read_sql, converts DIA to datetime, assigns a **SESSION** date using a **10:00 cutoff** (sessions before 10:00 roll to the prior calendar day), groups by session, and counts unique Q (card IDs). Chart helpers graficar_clientes_activos_x_dia and graficar_clientes_activos_x_sem produce annotated bar charts with Spanish weekday abbreviations. - **Out of scope:** Member billing, credit purchases, staff scheduling, real-time dashboards, or authenticated multi-user access. Chart calls are commented out in the main flow; the script currently prints the aggregated dataframe and calls plt.show().
