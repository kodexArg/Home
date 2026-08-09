---
id: docker-kmportal-3-988890e5
title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — P2 — Pump-operator fulfillment intranet"
visibility: private
importance: normal
source_repo: "docker-kmportal"
related: []
tags: ["docker-kmportal", "github", "private", "normal", "summary"]
---
### P2 — Pump-operator fulfillment intranet

- **Who hurts:** On-site pump operators who must fulfill queued fuel orders and ExtraCash requests accurately and record actual dispensed liters.
- **Pain today:** Without a dedicated staff UI, operators cannot reliably match incoming orders to physical refueling events, capture photos/documents, or prevent duplicate refueling of finished orders.
- **How this repo answers:** The Django app provides a separate login path ( ) restricted to users in the "Pump Operators" group. Operators access QR scanning ( ), order lists ( ), refueling forms ( ), and ExtraCash attendance ( ). The model links one-to-one to and records actual liters, fuel types, observations, and attached document images stored via S3-backed .
- **Out of scope:** Full HR/payroll for operators, inventory management of underground tank levels, and Instagram OAuth (listed in roadmap but not implemented).
