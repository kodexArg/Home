---
id: cf-ng-eurotrip2026-2-c95d5a46
title: "Eurotrip 2026 — Angular trip companion on Cloudflare — P1 — Fragmented trip logistics during a complex multi-city journey"
visibility: public
importance: normal
source_repo: "cf-ng-eurotrip2026"
related: ["cf-ng-eurotrip2026"]
tags: ["cf-ng-eurotrip2026", "github", "public", "normal", "summary"]
---

### P1 — Fragmented trip logistics during a complex multi-city journey - **Who hurts:** Two senior travelers on a carry-on-only route across seven European cities plus long-haul flights from South America, managing dozens of confirmed and tentative bookings. - **Pain today:** Flight locators, Airbnb refs, museum tickets, train times, and day plans live in email, screenshots, and mental notes. On mobile, finding "what happens Tuesday afternoon in Madrid" requires digging through multiple sources. - **How this repo answers:** A unified model in Cloudflare D1 powers calendar ( ), scrollable itinerary ( ), bookings list ( ), and map ( ). Each event is typed as (transport), (activity), or (lodging), with , , and flags surfaced in the UI. Canonical markdown fallbacks ( , ) allow rebuilding data if the database is lost. - **Out of scope:** General-purpose travel planning for arbitrary users, price comparison, or automated booking.
