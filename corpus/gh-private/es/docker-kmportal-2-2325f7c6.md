---
id: docker-kmportal-2-2325f7c6
title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — P1 — B2B fleet fuel ordering without manual coordination"
visibility: private
importance: normal
source_repo: "docker-kmportal"
related: []
tags: ["docker-kmportal", "github", "private", "normal", "summary"]
---

### P1 — B2B fleet fuel ordering without manual coordination - **Who hurts:** Fleet dispatchers and transport companies (B2B partners) who regularly send trucks to KM 1151 for multi-tank refueling. - **Pain today:** Coordinating fuel loads by phone or paper is error-prone: wrong driver, wrong plate, unclear liters per tank (tractor / backpack / chamber), and no shared audit trail of order state (paused, locked, agreed, finished). - **How this repo answers:** The Django application models with operation codes, company-scoped drivers, tractors, and trailers, fuel-type choices (Infinia Diesel, Infinia, Diesel 500, Super), liters-to-load per tank, agreement workflow, and pause/lock/finish flags. Customer users authenticate via Google OAuth (django-allauth), land on a localized user home, and manage orders through module views ( , , ). QR codes tie orders to the staff fulfillment flow. - **Out of scope:** Consumer retail fuel purchases, payment processing, real-time pump hardware integration, and the ticketing/helpdesk module (still marked under construction).
