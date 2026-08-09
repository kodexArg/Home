---
id: django-kmportal-2-35157e17
title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — P1 — B2B fleet fuel ordering without manual coordination"
visibility: private
importance: normal
source_repo: "django-kmportal"
related: []
tags: ["django-kmportal", "github", "private", "normal", "summary"]
---

### P1 — B2B fleet fuel ordering without manual coordination - **Who hurts:** Fleet dispatchers and transport companies (B2B partners) who must request diesel/gasoline loads across multiple vehicle tanks (tractor, backpack/mochila, chamber/cámara) before trucks arrive at the station. - **Pain today:** Orders spread across phone calls, informal messages, or paper — hard to track agreement status, liters requested vs. loaded, expiration, and which driver/tractor/trailer combination applies. No shared operation code for station handoff. - **How this repo answers:** The app Django application models **Company**, **Drivers**, **Tractors**, **Trailers**, and **FuelOrders** with a six-character operation_code, fuel-type enums (Infinia Diesel, Infinia, Diesel 500, Super), per-tank liter targets (including a sentinel -1 meaning "max"), lifecycle flags (is_locked, is_paused, is_finished), and agreement states (under_negotiation, no_agreement, agreed). Views expose list/create/detail/edit flows under i18n URL prefixes, JSON endpoints for order data/pause/delete/agreement, CSV export per company, and QR PNG generation from the operation code. - **Out of scope:** Full ticketing system (route exists but renders under-construction page). Instagram OAuth (README roadmap mentions it; only Google is configured in settings). Public anonymous order creation.
