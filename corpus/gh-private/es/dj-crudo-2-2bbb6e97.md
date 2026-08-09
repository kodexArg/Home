---
id: dj-crudo-2-2bbb6e97
title: "dj-crudo — Django WiFi captive portal and survey CRUD — P1 — Google Form dependency for simple visitor intake"
visibility: private
importance: normal
source_repo: "dj-crudo"
related: []
tags: ["dj-crudo", "github", "private", "normal", "summary"]
---
### P1 — Google Form dependency for simple visitor intake

- **Who hurts:** Operators collecting new-customer or visitor information (personal data, nationality, document number, free-text comment) who do not want to rely on Google Forms or external form builders.
- **Pain today:** Google Forms ties data to a Google account, offers limited branding, and may not fit captive-portal or on-premise network contexts. Export and schema control are indirect.
- **How this repo answers:** A single Django model ( ) captures , , , , , (South American country choices), , , and timestamp. Class-based and under provide list and create flows with Bootstrap-styled templates ( , ). Django admin registers the model for back-office review.
- **Out of scope:** Multi-question dynamic forms, branching logic, file uploads, analytics dashboards, GDPR export tooling, and API-first mobile clients.
