---
id: alvs-registros-libros-societario-4-e06fc5cb
title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — P2 — Compliance and litigation work must live beside the registry with"
visibility: private
importance: high
source_repo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG"
related: []
tags: ["alvs-registros-libros-societarios-kodexarg", "github", "private", "high", "summary"]
---

### P2 — Compliance and litigation work must live beside the registry without fragmenting access control - **Who hurts:** Compliance analysts tracking tax obligations, regulatory filings, beneficial owners, and administrative proceedings; litigation staff managing case files, procedural deadlines, powers of attorney, and regulated fees. - **Pain today:** Compliance reminders, findings, tax due dates, regulatory filings, proceedings, and renewals — plus litigation dockets, case events, adjustment indexes, jus values, pleading templates — were separate concerns in the legacy stack with inconsistent authorization models. - **How this repo answers:** Three additional domain apps partition the surface while sharing session auth and Django Groups: compliance (reminders, findings, beneficial owners, tax obligations/due dates, regulatory filings, proceedings/renewals), litigation (case files, events, procedural deadlines, powers of attorney, adjustment indexes, jus values, regulated fees, pleading templates), and platform (audit log, module permissions, in-app notifications). Entity-scoped records honor EntityPermission read/write grants; firm-wide litigation catalogs use FirmWideEditorAccess or AdminManagedCatalog as documented in docs/API.md. A cross-entity compliance dashboard aggregates dated items at /compliance/. - **Out of scope:** Full document management replacement, court
