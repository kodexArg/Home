---
id: djangomce-2-8d227c30
title: "DjangoMCE — internal Mendoza Central operations portal — P1 — Fragmented internal tools for floor and HR staff"
visibility: private
importance: normal
source_repo: "DjangoMCE"
related: []
tags: ["djangomce", "github", "private", "normal", "summary"]
---

### P1 — Fragmented internal tools for floor and HR staff - **Who hurts:** HR coordinators, shift supervisors, and floor staff at Mendoza Central who need to communicate changes and consult live operational data. - **Pain today:** Announcements, employee incident/leave reporting, temperature monitoring, and slot statistics were spread across separate systems and raw database access. - **How this repo answers:** Provides a single Bootstrap-styled portal with navigation zones for Anuncios (bulletin board), RRHH (novedades + employee directory), Temperatura (charts), and Operaciones (production statistics). Django auth gates staff-only sections; the admin site handles master employee data. - **Out of scope:** Does not replace the upstream slot telemetry pipeline or the Raspberry Pi sensor ingestion stack; it reads their databases. Does not provide a public-facing marketing site.
