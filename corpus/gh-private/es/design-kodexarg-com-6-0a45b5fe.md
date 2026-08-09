---
id: design-kodexarg-com-6-0a45b5fe
title: "design.kodexarg.com — kodexArg design system SSOT — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "design.kodexarg.com"
related: []
tags: ["design.kodexarg.com", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Agent or developer needs brand colors** — opens or imports src/styles/tokens.css, uses semantic aliases in product CSS, optionally toggles [data-theme="light"] for document pages. 2. **Visitor browses the live styleguide** — scrolls brand, CandleLink constellation, color chips, and type specimens on the deployed Worker static site. 3. **Agent builds a WhatsApp report** — copies a docs/report-lineage/templates/*.html specimen, inlines or links report.css, follows mermaid-guide.md classDef kit, embeds Lucide SVG per icons.md, runs validate_mermaid.py before shipping. 4. **Sibling site syncs Wordmark** — copies or vendors src/components/Wordmark.svelte (and optionally CandleLink.svelte) with bidirectional change propagation per sibling repo agent rules.
