---
id: welpdesk-5-8750d9d7
title: "Welp Desk — configurable multi-organization Django help-desk ticketing — 3. Product / idea"
visibility: public
importance: normal
source_repo: "welpdesk"
related: ["welpdesk"]
tags: ["welpdesk", "github", "public", "normal", "summary"]
---

## 3. Product / idea The mental model is a **Django monolith** with three cooperating layers: (1) a **relational permission graph** tying Django membership to UDN and Sector visibility; (2) a **ticket conversation thread** where each carries status and optional files, and ticket status is derived from the latest message; (3) an **HTMX-enhanced template UI** that keeps interaction snappy while logic stays server-side. A ticket is always anchored to four taxonomy foreign keys: , , , and . Creating a ticket walks the user through dependent dropdowns populated via HTMX endpoints. Listing tickets supports multi-select filters (UDN, Sector, Category, Status) with URL-persisted query params and pagination (6 per page). Status filtering uses a subquery on the **last message** per ticket to match current workflow state. Administrators manage the taxonomy and inspect tickets through **Django admin** ( ) with inlines for messages and attachments, autocomplete fields, and image/PDF previews.
