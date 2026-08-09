---
id: cf-ng-eurotrip2026-4-10cb4371
title: "Eurotrip 2026 — Angular trip companion on Cloudflare — P3 — Controlled sharing with owners who need write access on the road"
visibility: public
importance: normal
source_repo: "cf-ng-eurotrip2026"
related: ["cf-ng-eurotrip2026"]
tags: ["cf-ng-eurotrip2026", "github", "public", "normal", "summary"]
---
### P3 — Controlled sharing with owners who need write access on the road

- **Who hurts:** Trip owners who must upload photos, edit events, and invite trusted viewers without exposing write APIs to the public internet.
- **Pain today:** A fully public itinerary leaks planning detail; a fully private app blocks family from following along. Passphrase-only gates are brittle; full account systems are overkill.
- **How this repo answers:** Layered access: site-gate password ( , ), session-based owner auth ( , table), admin invite flow ( , ), and scaffolding for Cloudflare Access + Google IdP ( , env vars). Middleware distinguishes view-only GET from owner-only mutations. Owner editing UI lives at with ; visitors see read-only views.
- **Out of scope:** Public comments, social sharing, push notifications (listed as out of scope in ).
