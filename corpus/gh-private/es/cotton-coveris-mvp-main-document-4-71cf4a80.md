---
id: cotton-coveris-mvp-main-document-4-71cf4a80
title: "Coveris MVP — interactive ADR study and architecture documentation — P2 — Coveris-e org model is hospital-specific; target vision is domain-agnostic"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp-main-documentation"
related: []
tags: ["cotton-coveris-mvp-main-documentation", "github", "private", "high", "summary"]
---

### P2 — Coveris-e org model is hospital-specific; target vision is domain-agnostic - **Who hurts:** Architects defining OrgUnit rules for a product meant to serve clinics, retail chains, or government hierarchies equally. - **Pain today:** Coveris-e ADR E-027 replaced a configurable org-level catalog (E-026, superseded) with a **fixed five-level Spanish hospital taxonomy** (CLINICA → AREA → DEPTO → SERVICIO → UNIDAD), plus a manager_position OneToOne hack (0.01h for zero-hour managers, hard-delete on clear). The target project's north star is **OrgUnit agnostic** — generic depth levels with editable labels, English code identifiers (ADR-001-b), and no "clinic" baked into the schema. - **How this repo answers:** Theme 1 in both index.html and source/coveris-e-adr-study.md is explicitly titled around the agnostic opportunity: take E-027's good ideas (depth derived from parent, manager as unit attribute not sibling node) while rejecting the fixed hospital enum. source/jefatura-tratamiento-especial.md is a dedicated finding that evaluates four options and recommends **rejecting** Coveris-e's manager_position model — a manager is not demand to cover, and forcing it into Position created all the hacks. The interactive banner in index.html states the governing decision: OrgUnit agnostic, manager is role/attribute not Position, weekly hours arithmetic is sacred (ADR-011). - **Out of
