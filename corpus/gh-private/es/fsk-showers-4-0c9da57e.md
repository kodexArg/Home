---
id: fsk-showers-4-0c9da57e
title: "FSK Showers — Flask CRUD for roadside shower registrations — 3. Product / idea"
visibility: private
importance: normal
source_repo: "fsk-showers"
related: []
tags: ["fsk-showers", "github", "private", "normal", "summary"]
---

## 3. Product / idea The mental model is a **single-tenant operator console**: an attendant opens the site, creates a ticket linking a responsible staff member, a client, and a plan/price tier, then reviews or deletes entries from a table view. The domain schema anticipates normalized entities — users belong to roles, clients have name fields, plans carry prices, and tickets join those foreign keys — even though parts of the view layer still use simplified string fields from an earlier iteration. The UI is Spanish-first (navbar: Lista, Nuevo; flash messages in Spanish). Page metadata in app/templates/base.html explicitly describes the app as a CRUD for shower use in Uspallata, anchoring the business context.
