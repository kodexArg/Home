---
id: cotton-3-84e6a749
title: "Cotton — Cotton-West PRD, regulatory docs, and MkDocs knowledge base — P2 — Operational confusion between regulated and non-regulated commerce"
visibility: private
importance: high
source_repo: "cotton"
related: []
tags: ["cotton", "github", "private", "high", "summary"]
---
### P2 — Operational confusion between regulated and non-regulated commerce

- **Who hurts:** Front-desk operators who must sell CBD/parafernalia to the general public while separately dispensing medicinal cannabis only to authorized members with valid certifications.
- **Pain today:** A single manual workflow mixes retail sales and therapeutic handoffs, causing inventory errors, financial reconciliation gaps, and accidental dispensations to unqualified persons.
- **How this repo answers:** The PRD defines three differentiated surfaces — Terminal POS (sales vs dispensaciones), Tienda Pública (unauthenticated catalog for non-regulated products), and Portal de Socios (authenticated self-service for members) — with 50+ enumerated use cases in §6 and detailed domain separation in ( , , , ).
- **Out of scope:** Payment processor internals (Mercado Pago is an integration boundary, not owned code); third-party delivery carriers.
