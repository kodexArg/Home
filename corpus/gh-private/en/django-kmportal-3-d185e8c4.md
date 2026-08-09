---
id: django-kmportal-3-d185e8c4
title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — P2 — Pump-operator fulfillment at the physical station"
visibility: private
importance: normal
source_repo: "django-kmportal"
related: []
tags: ["django-kmportal", "github", "private", "normal", "summary"]
---
### P2 — Pump-operator fulfillment at the physical station

- **Who hurts:** Pump operators who must receive an order, record actual liters dispensed per tank, attach evidence photos, and mark refueling complete — often while the customer user is not at the console.
- **Pain today:** Disconnect between what the customer ordered online and what happens at the pump; risk of duplicate refueling records; no structured document capture.
- **How this repo answers:** The app provides a **separate login surface** ( ) gated by and membership in the **Pump Operators** group. Operators scan QR codes (POST to ), open refueling forms keyed by , and persist **Refuelings** (one-to-one with ) plus related **Documents** images stored via custom S3-backed . Staff list views cover active orders and ExtraCash queues; attend flows exist for ExtraCash by operation code.
- **Out of scope:** Full i18n for staff UI (explicit TODO in ). Replacing with Pump Operators group checks everywhere (noted as incomplete).
