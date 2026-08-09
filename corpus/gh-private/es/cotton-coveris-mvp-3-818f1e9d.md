---
id: cotton-coveris-mvp-3-818f1e9d
title: "Coveris — Healthcare Capacity Planning SaaS — P2 — No preview before committing assignments"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp"
related: []
tags: ["cotton-coveris-mvp", "github", "private", "high", "summary"]
---

### P2 — No preview before committing assignments - **Who hurts:** Managers assigning staff to positions and employees accepting or rejecting proposals. - **Pain today:** Assignments are made without a unified preview of hours impact, eligibility (required tags), or resulting coverage state; mistakes create overtime or uncovered positions discovered later. - **How this repo answers:** Assignment lifecycle with preview endpoints, eligibility validation against position tag requirements (ADR-019), hours ledger as stateless computation (ADR-011), and employee FSM with proposal/accept/reject flows. UI routes under /roster, /org-chart, /coverage, /hours, and control-panel demand surfaces. - **Out of scope:** Employee push notifications for proposals (listed out-of-scope in PRD); automated shift bidding marketplaces.
