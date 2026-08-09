---
id: djangomce-4-994687b0
title: "DjangoMCE — internal Mendoza Central operations portal — P3 — Structured HR novedades with type-driven forms"
visibility: private
importance: normal
source_repo: "DjangoMCE"
related: []
tags: ["djangomce", "github", "private", "normal", "summary"]
---

### P3 — Structured HR novedades with type-driven forms - **Who hurts:** HR staff tracking vacations, shift swaps, incidents, and other employee events. - **Pain today:** Paper or ad-hoc spreadsheets lack approval workflow fields and per-type form requirements. - **How this repo answers:** defines boolean flags ( , , , etc.) that drive dynamic form visibility via a JSON injected into create views. tracks approval states (Visto, Aprobado, Denegado, En espera). List views use with export support. - **Out of scope:** Full workflow engine or email notifications; is configured but outbound mail integration is not evident in views.
