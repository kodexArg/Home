---
id: welpdesk-6-a5f340b8
title: "Welp Desk — configurable multi-organization Django help-desk ticketing — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "welpdesk"
related: ["welpdesk"]
tags: ["welpdesk", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Operator files a ticket:** Authenticated user opens create flow, selects UDN → Sector → Category → Issue via HTMX partials, writes a description, attaches screenshots, submits; first Message is created with status open. 2. **Support agent triages queue:** Agent opens ticket list, filters by UDN and status open, sees only tickets for their assigned groups; clicks into detail view to reply and change status to solved or feedback. 3. **Admin bootstraps new site:** Operator clones initialize-db.yaml, edits UDN/Sector/Issue names for a new franchise, runs docker-compose up; post_migrate seeds taxonomy and permission groups automatically. 4. **Manager closes resolved ticket:** Agent or authorized user triggers close flow via HTMX confirmation modal (htmx-confirm-close) and close_ticket endpoint; final message status becomes closed.
