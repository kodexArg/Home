---
id: qa-reports-2-0c98d4ac
title: "qa-reports — Public HTML archive for multi-agent QA audit deliverables — P1 — No durable public home for QA deliverables"
visibility: public
importance: normal
source_repo: "qa-reports"
related: ["qa-reports"]
tags: ["qa-reports", "github", "public", "normal", "summary"]
---

### P1 — No durable public home for QA deliverables - **Who hurts:** Operators running full or partial audits in the private kodexArg/QA workspace; project owners who need to circulate findings; anyone blocked from the gitignored github-repositories/ clone sandbox. - **Pain today:** Audit output lived only on the operator machine inside a nested reports/ directory. Sharing meant ad-hoc file transfer or granting workspace access. Historical audits were hard to discover across machines and sessions. - **How this repo answers:** Finished reports are written as self-contained HTML files and auto-committed here via a PostToolUse hook in the upstream QA workspace. The repo tracks **only** .html files (plus .gitignore), so every push is a clean artifact drop. Filename convention YYYY-MM-DD_owner-repo_audit-type.html makes chronology and target project obvious at a glance. - **Out of scope:** Storing cloned target repositories, Python automation scripts, agent skills, or markdown companions (.md reports are generated locally but explicitly excluded by .gitignore here).
