---
id: fsk-showers-3-aac27ab6
title: "FSK Showers — Flask CRUD for roadside shower registrations — P2 — Lightweight internal ops tooling without enterprise overhead"
visibility: private
importance: normal
source_repo: "fsk-showers"
related: []
tags: ["fsk-showers", "github", "private", "normal", "summary"]
---

### P2 — Lightweight internal ops tooling without enterprise overhead - **Who hurts:** Small teams that need a database-backed registry but do not want a full ERP or POS integration for a single amenity (showers). - **Pain today:** Generic tools are either too heavy or too unstructured; bespoke spreadsheets lack referential integrity across clients, plans, and staff. - **How this repo answers:** Uses Flask, SQLAlchemy, and Docker Compose for MySQL to deliver a locally runnable CRUD stack with Bootstrap-styled forms and Spanish labels ( , , , ). - **Out of scope:** Authentication/authorization UI, audit trails, automated backups, production hardening, and CI/CD pipelines (none present in tree).
