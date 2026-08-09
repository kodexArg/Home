---
id: welpdesk-2-c9a0338e
title: "Welp Desk — configurable multi-organization Django help-desk ticketing — P1 — Hierarchical ticket visibility across business units"
visibility: public
importance: normal
source_repo: "welpdesk"
related: ["welpdesk"]
tags: ["welpdesk", "github", "public", "normal", "summary"]
---

### P1 — Hierarchical ticket visibility across business units - **Who hurts:** Help-desk managers at organizations with multiple branches or business units (UDNs) and functional areas (Sectors) — e.g. two fuel stations each with Full, Playa, Administración, and Parador zones — where agents must only see tickets for sites and areas they support. - **Pain today:** Generic ticketing tools offer flat queues or coarse role-based access; mapping real org charts (UDN × Sector intersections) requires custom fields, manual filtering, or expensive enterprise tiers. Agents either see too much (privacy/noise) or too little (missed escalations). - **How this repo answers:** Core domain models , , , and form a configurable taxonomy. in filters tickets so non-staff users see only rows where they belong to **both** the ticket's UDN group (or admin permission group) **and** its Sector group. Staff users bypass filtering. HTMX list views ( , ) respect the same queryset. Django objects are auto-created per UDN ( ) and Sector ( ) during seeding in . - **Out of scope:** Federated identity across external orgs (SAML/OIDC not implemented); cross-tenant SaaS billing; automatic SLA timers or escalation rules; email-to-ticket ingestion.
