---
id: cotton-west-3-4b7a03b2
title: "Cotton-West — cannabis club operations SaaS (spec & docs vault) — P2 — Splitting regulated vs non-regulated commerce in one club operation"
visibility: private
importance: normal
source_repo: "cotton-west"
related: []
tags: ["cotton-west", "github", "private", "normal", "summary"]
---

### P2 — Splitting regulated vs non-regulated commerce in one club operation - **Who hurts:** POS operators who must sell parafernalia and CBD to the general public while separately dispensing medicinal cannabis only to verified socios; finance staff reconciling mixed cash/card flows. - **Pain today:** A single physical counter handles two legally distinct transaction types — commercial **ventas** (non-regulated) and therapeutic **dispensaciones** (regulated). Mixing them in one undifferentiated ledger complicates inventory, receipt types, and audit defense. Member discounts on non-regulated goods add pricing rules layered on top of quota enforcement for regulated goods. - **How this repo answers:** PRD §5.1–5.3 and annex IV ( ) prescribe domain-separated Django apps ( , , , ) with shared core models but distinct presentation layers. Transaction model distinguishes types; links 1:1 to regulated transactions. Use cases cover mixed payment (UC-POS-06), REPROCANN expiry rejection (UC-POS-03), and societal discounts (UC-POS-08). - **Out of scope:** Multi-club multi-tenancy is post-launch evolution (ANEXO-V §6); MVP targets a single club instance.
