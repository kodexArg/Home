---
id: gitcon-2-5cd013e5
title: "GITCon — GIC gym analytics console (Django shell + Oracle reporting scripts) — P1 — Daily active-member visibility from Oracle session data"
visibility: private
importance: low
source_repo: "GITCon"
related: []
tags: ["gitcon", "github", "private", "low", "summary"]
---
### P1 — Daily active-member visibility from Oracle session data

- **Who hurts:** Gym managers and analysts who need to know how many distinct members (*socios*) actually used the facility, not just raw turnstile events or credit purchases in isolation.
- **Pain today:** Session data lives in Oracle ( ) with card IDs ( ), session start timestamps ( ), and credit flags ( ). Extracting a clean per-day unique-member count requires custom SQL, date-boundary logic, and post-processing outside the legacy application UI.
- **How this repo answers:** selects distinct card visits with credits in a date window (formatted via / placeholders). loads that SQL, queries Oracle through + , converts to datetime, assigns a **SESSION** date using a **10:00 cutoff** (sessions before 10:00 roll to the prior calendar day), groups by session, and counts unique (card IDs). Chart helpers and produce annotated bar charts with Spanish weekday abbreviations.
- **Out of scope:** Member billing, credit purchases, staff scheduling, real-time dashboards, or authenticated multi-user access. Chart calls are commented out in the main flow; the script currently prints the aggregated dataframe and calls .
