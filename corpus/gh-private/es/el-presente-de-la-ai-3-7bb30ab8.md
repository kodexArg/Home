---
id: el-presente-de-la-ai-3-7bb30ab8
title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory — P2 — Repeatable agent operations without content drift"
visibility: private
importance: normal
source_repo: "El-presente-de-la-aI"
related: []
tags: ["el-presente-de-la-ai", "github", "private", "normal", "summary"]
---
### P2 — Repeatable agent operations without content drift

- **Who hurts:** Presenters and agents who would otherwise edit Google Slides directly, losing version history, design consistency, and the link between spoken narrative and on-screen text.
- **Pain today:** Blind overwrites in Slides, invented slide copy, restated typography rules per slide, and no checklist of which deck slides actually exist versus which are still spec-only.
- **How this repo answers:** declares agents **operational only** — content is fixed in per-slide markdown. Workflow invariants: read current deck state before edit; one slide per iteration unless batched; confirm completion; record new design decisions in before proceeding. tracks pending vs created in the live deck (all twenty-six entries currently pending in the index snapshot). enforces frontmatter ( , , , , ) plus sections: Tipo, Intención, Contenido, Estáticos (optional), Instrucciones (deviations only — never restate layout defaults). Skills in ( , , , ) document Drive MCP auth and API usage; symlinks into as authoritative.
- **Out of scope:** Autonomous content rewriting, speculative slide additions, or browser/curl shortcuts for Drive — and mandate Google Drive MCP for deck operations.
