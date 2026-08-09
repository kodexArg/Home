---
id: cotton-coveris-2-2aad5d04
title: "cotton-coveris — reserved empty namespace for Coveris (cotton family) — P1 — Reserved namespace before code lands"
visibility: private
importance: low
source_repo: "cotton-coveris"
related: []
tags: ["cotton-coveris", "github", "private", "low", "summary"]
---

### P1 — Reserved namespace before code lands - **Who hurts:** Org maintainers and agents that enumerate kodexArg repositories and need predictable naming (cotton-<product>) without ad-hoc renames later. - **Pain today:** Coveris work is spread across multiple repositories with different prefixes (coveris for the production-oriented app, cotton-coveris-mvp for the MVP stack, cotton-coveris-mvp-main-documentation for ADR study). An empty cotton-coveris slot may have been created to hold the canonical cotton-prefixed name before deciding which repo becomes long-term SSOT. - **How this repo answers:** By existing as a **zero-byte private repository** created on 2026-07-04, it prevents external parties from claiming the cotton-coveris name and gives kodexArg a clean target for future git push --mirror, template seeding, or repo promotion workflows. - **Out of scope:** Does not host application code, CI, documentation, or agent harnesses today. Does not replace coveris or cotton-coveris-mvp for any operational workflow.
