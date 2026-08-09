---
id: rpi-door-access-rfid-5-813b5139
title: "rpi-door-access-rfid — Raspberry Pi RFID shower-door access control with admin panel — 3. Product / idea"
visibility: public
importance: normal
source_repo: "rpi-door-access-rfid"
related: ["rpi-door-access-rfid"]
tags: ["rpi-door-access-rfid", "github", "public", "normal", "summary"]
---

## 3. Product / idea The mental model is a **single-process edge appliance**: one FastAPI app on a Raspberry Pi serves both the door-control daemon and the admin web UI on port 8000. SQLite is the sole datastore, co-located on the Pi. No external services are required at runtime. Three layers (documented in root PRD.md §6): 1. **API layer** — FastAPI routers for REST (/api/*), server-rendered Jinja2 templates with HTMX partials (/ui/*), auth (/login, /ui/login), and SSE (/sse/events). 2. **Domain layer** — process_swipe, grant_access, deny_access, audit helpers; publishes events to the broadcaster after each swipe or admin mutation. 3. **Infrastructure layer** — SQLAlchemy models and sessions (app/infrastructure/), hardware factory strategy, platform detection (app/infrastructure/hardware/platform.py). Domain entities map to a Spanish operational context (ADR 0002 SSOT): Company (empresa), User (usuario/cliente), Account (tarjeta/ficha RFID), AccessLog, credits as remaining uses. Cards support key_type variants: particulares (sold credits), cuenta_corriente (company-covered), ticket_carga (credits tied to a load-ticket invoice number).
