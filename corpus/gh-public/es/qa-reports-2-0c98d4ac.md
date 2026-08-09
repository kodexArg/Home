---
id: qa-reports-2-0c98d4ac
title: "qa-reports — Public HTML archive for multi-agent QA audit deliverables — P1 — No durable public home for QA deliverables"
visibility: public
importance: normal
source_repo: "qa-reports"
related: ["qa-reports"]
tags: ["qa-reports", "github", "public", "normal", "summary"]
---
### P1 — No durable public home for QA deliverables

- **Who hurts:** Operators running full or partial audits in the private workspace; project owners who need to circulate findings; anyone blocked from the gitignored clone sandbox.
- **Pain today:** Audit output lived only on the operator machine inside a nested directory. Sharing meant ad-hoc file transfer or granting workspace access. Historical audits were hard to discover across machines and sessions.
- **How this repo answers:** Finished reports are written as self-contained HTML files and auto-committed here via a PostToolUse hook in the upstream QA workspace. The repo tracks **only** files (plus ), so every push is a clean artifact drop. Filename convention makes chronology and target project obvious at a glance.
- **Out of scope:** Storing cloned target repositories, Python automation scripts, agent skills, or markdown companions ( reports are generated locally but explicitly excluded by here).
