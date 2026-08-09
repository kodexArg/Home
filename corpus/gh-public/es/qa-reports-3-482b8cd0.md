---
id: qa-reports-3-482b8cd0
title: "qa-reports — Public HTML archive for multi-agent QA audit deliverables — P2 — Inconsistent audit presentation across runs and projects"
visibility: public
importance: normal
source_repo: "qa-reports"
related: ["qa-reports"]
tags: ["qa-reports", "github", "public", "normal", "summary"]
---
### P2 — Inconsistent audit presentation across runs and projects

- **Who hurts:** Readers comparing audits across , , , and future targets; agents compiling the next report; operators explaining severity and verdict logic to non-technical stakeholders.
- **Pain today:** Without a enforced layout, each audit could drift in structure, scoring display, and remediation grouping—undermining trust in cross-project comparisons and making automated ingestion harder.
- **How this repo answers:** defines the canonical report skeleton: header metadata, ten category score cells with progress bars, severity strip and legend, ten audit sections (Security through Framework), per-finding blocks with ID prefixes and severity badges, strengths grids, pages-tested and summary tables, weighted launch verdict, and tiered action plans (immediate / short / medium / backlog). Generated reports inline the compiled CSS so each file opens standalone in any browser. documents the full pipeline, agent roster, scoring formula, and naming rules in the same design system.
- **Out of scope:** Interactive dashboards, search indexes, or API access to findings—the surface is static HTML only.
