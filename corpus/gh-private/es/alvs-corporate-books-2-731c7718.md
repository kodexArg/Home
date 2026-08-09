---
id: alvs-corporate-books-2-731c7718
title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — P1 — Fragmented corporate and compliance record-keeping"
visibility: private
importance: high
source_repo: "alvs-corporate-books"
related: []
tags: ["alvs-corporate-books", "github", "private", "high", "summary"]
---

### P1 — Fragmented corporate and compliance record-keeping - **Who hurts:** Corporate secretaries, compliance officers, and entity administrators at Grupo ALVS. - **Pain today:** Statutory books, beneficial-owner declarations, tax obligations, regulatory filings, proceedings, and renewals live across disconnected tools; deadlines are easy to miss; there is no single entity-scoped view of "what is due and what is sealed." - **How this repo answers:** Django domain apps ( , , ) expose a large, permission-filtered REST API declared in . The Astro frontend renders directory pages, detail views, and editor-gated forms for entities, books/folios (with immutable close + SHA-256 hash), shareholders/shareholdings, officers (with an admin approval queue), compliance reminders/findings/beneficial owners, tax catalogs and due dates, regulatory filings, proceedings/renewals, case files, procedural deadlines, powers of attorney, regulated fees, pleading templates, and a cross-entity compliance dashboard. Entity-level grants scope read vs write access; admins see all. - **Out of scope:** General ERP, payroll, accounting ledger, or external court e-filing integrations beyond what the API models capture.
