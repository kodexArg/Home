---
id: syv-frontend-3-b2ec107d
title: "SyV frontend — Astro static site for the Subordinación y Valor universe — P2 — Publishing canon-review handoffs in operator-readable form"
visibility: public
importance: normal
source_repo: "syv-frontend"
related: ["gh-syv-frontend"]
tags: ["syv-frontend", "github", "public", "normal", "summary"]
---

### P2 — Publishing canon-review handoffs in operator-readable form - **Who hurts:** The operator receiving agent-team output after a canon pass — e.g. five resolved inconsistencies, two open decisions, orphan character fixes — who needs a **single scrollable report** rather than parsing git diffs across . - **Pain today:** Agent teams close canon rounds with structured findings (dates, character merges, typo fixes, MOC backlink repairs) that are hard to skim from commit logs alone. Operators need explicit "resolved vs pending" status and decision prompts. - **How this repo answers:** The page is a hand-crafted report template: kicker labels, numbered sections, good/alt cards, chip badges ( , , ), and a Mermaid diagram illustrating the canon-review pipeline (lead → canon/personajes/narrativa → judge → closed or doubts). Content is embedded directly in the Astro page (not fetched from the submodule at build time in the current tree), making it a deliberate publish step when a canon round closes. - **Out of scope:** Automated report generation from detectors, live sync with corpus state, or multi-report archives (only one report page exists today; future reports would add pages or a build step).
