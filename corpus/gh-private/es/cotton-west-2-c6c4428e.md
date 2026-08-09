---
id: cotton-west-2-c6c4428e
title: "Cotton-West — cannabis club operations SaaS (spec & docs vault) — P1 — Regulatory non-compliance and traceability failure at cannabis clubs"
visibility: private
importance: normal
source_repo: "cotton-west"
related: []
tags: ["cotton-west", "github", "private", "normal", "summary"]
---

### P1 — Regulatory non-compliance and traceability failure at cannabis clubs - **Who hurts:** Club administrators, operators at the counter, REPROCANN-authorized members (socios), and provincial/national health inspectors. - **Pain today:** Clubs must prove batch-level traceability from cultivation through processing, storage, transport, and final dispensación to a named socio. Manual spreadsheets and paper logs break under Resolución 1780/2025 and Mendoza Ley 9617 requirements. Dispensing to members with expired REPROCANN certificates, exceeding monthly gram quotas, or missing cartas de porte creates immediate legal exposure. Semestral reports to the Ministerio de Salud are error-prone when assembled manually. - **How this repo answers:** The PRD (docs/PRD.md) and annexes define four functional surfaces — POS terminal, public store, member portal, and traceability/compliance module — with explicit use cases (UC-POS-*, UC-PS-*, UC-TP-*, UC-TC-*, UC-GA-*) and acceptance criteria per launch milestone. The data model annex (docs/anexos/PRD-ANEXO-III-modelo-datos.md) specifies entities (Socio, ReprocannCertification, ProductBatch, Dispensation, TraceabilityRecord, ComplianceReport) with encryption, immutability, and audit patterns. Legislation pages under docs/legislacion/ ground each requirement in primary legal text. - **Out of scope:** This repo does not execute dispensations,
