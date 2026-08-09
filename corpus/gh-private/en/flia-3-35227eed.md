---
id: flia-3-35227eed
title: "Flia — family household expense tracker (Django admin) — P2 — Recurring services vs one-time purchases"
visibility: private
importance: low
source_repo: "Flia"
related: []
tags: ["flia", "github", "private", "low", "summary"]
---

### P2 — Recurring services vs one-time purchases - **Who hurts:** Families with both monthly subscriptions (“infinite” / service items) and one-off buys that should not be modeled the same way. - **Pain today:** Flat expense lists mix recurring and ephemeral spending, making monthly burn hard to reason about. - **How this repo answers:** Articulos carries servicio (is it a service?) and infinito (is it recurring/infinite?) booleans plus fecha (purchase/start date) and optional comentario text. - **Out of scope:** No cron jobs, reminders, or automatic renewal detection — flags are metadata only unless extended later.
