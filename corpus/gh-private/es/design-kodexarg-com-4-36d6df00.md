---
id: design-kodexarg-com-4-36d6df00
title: "design.kodexarg.com — kodexArg design system SSOT — P3 — Polished one-file HTML reports for mobile sharing"
visibility: private
importance: high
source_repo: "design.kodexarg.com"
related: []
tags: ["design.kodexarg.com", "github", "private", "high", "summary"]
---

### P3 — Polished one-file HTML reports for mobile sharing - **Who hurts:** An operator who wants to turn markdown summaries into dark, branded HTML artifacts sent over WhatsApp and opened on phones — without a separate design pass each time. - **Pain today:** Generic HTML exports look off-brand; mermaid diagrams break on {{ }} placeholder collisions; CDN-dependent assets fail in offline in-app webviews; light lavender mermaid theme variables render ugly on dark backgrounds. - **How this repo answers:** The docs/report-lineage/ vault distills Presentation Orange into src/styles/report.css (self-contained :root, Nunito + DM Mono type, mobile-first 480px column, progressive desktop enhancement). Five complete HTML templates (status-report, concept-explainer, comparison, stat-highlight, decision-summary) serve as copy-paste specimens. mermaid-guide.md defines the canonical %%{init}%% block and classDef component kit (hero, cool, ok, bad, step). icons.md documents Lucide inline SVG conventions for offline WhatsApp webviews. tools/validate_mermaid.py provides Tier-1 static lint (brace collision, bad state ids) and Tier-2 mmdc parse when available. EXTRACTED-DESIGN-SYSTEM.md preserves the original Presentation Orange spec without re-fetching auth-walled sources. - **Out of scope:** A markdown-to-HTML generator CLI in this repo (generation is expected via the kdx-reporte-html skill
