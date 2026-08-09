---
id: qa-reports-4-854b649a
title: "qa-reports — Public HTML archive for multi-agent QA audit deliverables — P3 — Separating audit artifacts from the testing sandbox"
visibility: public
importance: normal
source_repo: "qa-reports"
related: ["qa-reports"]
tags: ["qa-reports", "github", "public", "normal", "summary"]
---
### P3 — Separating audit artifacts from the testing sandbox

- **Who hurts:** QA operators who must never accidentally commit cloned client repos; security reviewers worried about sandbox leakage; CI systems that should only see publishable output.
- **Pain today:** A monorepo mixing clones, scripts, context PDFs, and reports risks pushing sensitive or bloated trees. Per-repo gitignore entries are error-prone when many targets are cloned.
- **How this repo answers:** The QA workspace keeps clones under gitignored and publishes **only** HTML to this separate public repo. The here uses an aggressive whitelist ( then and ), guaranteeing no stray workspace files enter the public archive. The workflow doc ( ) states the critical rule explicitly: cloned repos are never committed from the QA workspace.
- **Out of scope:** Private or redacted report variants; per-client access control (everything published here is public).
