---
id: rpi-door-access-rfid-5-813b5139
title: "rpi-door-access-rfid — Raspberry Pi RFID shower-door access control with admin panel — 3. Product / idea"
visibility: public
importance: normal
source_repo: "rpi-door-access-rfid"
related: ["rpi-door-access-rfid"]
tags: ["rpi-door-access-rfid", "github", "public", "normal", "summary"]
---
## 3. Product / idea

The mental model is a **single-process edge appliance**: one FastAPI app on a Raspberry Pi serves both the door-control daemon and the admin web UI on port 8000. SQLite is the sole datastore, co-located on the Pi. No external services are required at runtime. Three layers (documented in root §6): 1. **API layer** — FastAPI routers for REST ( ), server-rendered Jinja2 templates with HTMX partials ( ), auth ( , ), and SSE ( ). 2. **Domain layer** — , , , audit helpers; publishes events to the broadcaster after each swipe or admin mutation. 3. **Infrastructure layer** — SQLAlchemy models and sessions ( ), hardware factory strategy, platform detection ( ). Domain entities map to a Spanish operational context (ADR 0002 SSOT): (empresa), (usuario/cliente), (tarjeta/ficha RFID), , credits as remaining uses. Cards support variants: (sold credits), (company-covered), (credits tied to a load-ticket invoice number).
