---
id: cf-ng-eurotrip2026-5-3d42abb5
title: "Eurotrip 2026 — Angular trip companion on Cloudflare — 3. Product / idea"
visibility: public
importance: normal
source_repo: "cf-ng-eurotrip2026"
related: ["cf-ng-eurotrip2026"]
tags: ["cf-ng-eurotrip2026", "github", "public", "normal", "summary"]
---
## 3. Product / idea

The application is a **client-rendered Angular SPA** deployed on **Cloudflare Pages**, with **Pages Functions** serving a JSON API backed by **D1** and **R2**. The mental model is: **one trip, one database, many views**. **Core user journeys:** 1. **Plan review (default):** Land on (month view, city color-coding, event chips). Tap a day to drill into itinerary detail. Browse for the full vertical timeline grouped by city → day → activity slot. 2. **Logistics check:** Open for a filterable flat list of all bookings (transport, stays, activities) with confirmation badges. shows Leaflet pins, great-circle and OSRM/rail waypoints between cities. 3. **City context:** (and legacy slug redirects like ) show per-city — reference blocks and personal markdown—plus linked external URLs and inline photos. 4. **Memories:** gallery groups media by itinerary city order; owners upload images/video via multipart POST; lightbox supports swipe, keyboard nav, and rotation. 5. **Owner maintenance:** for CRUD on events (guarded by owner role). for access requests, session management, and magic-link invites. post-auth welcome. for access-request flow. **Language rule (binding):** All code, routes, docs, and variable names are **English**. All user-visible UI strings are **Spanish**. **Design rule (binding):** PrimeNG components first; Tailwind v4 utilities second; no hand-rolled
