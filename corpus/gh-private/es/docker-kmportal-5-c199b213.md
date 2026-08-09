---
id: docker-kmportal-5-c199b213
title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — 3. Product / idea"
visibility: private
importance: normal
source_repo: "docker-kmportal"
related: []
tags: ["docker-kmportal", "github", "private", "normal", "summary"]
---

## 3. Product / idea The central idea is a **two-surface Django monolith** for a fuel-station enterprise: 1. **Customer portal ( )** — OAuth-authenticated B2B users linked to a via . They manage fleet metadata (drivers, tractors, trailers), create and track fuel orders and ExtraCash requests, and export CSV reports. Pages are internationalized (Spanish default, English and Portuguese) via Django i18n plus a custom workflow. 2. **Staff intranet ( )** — Username/password login for pump operators. QR-based order lookup converts a operation code into a record. Operators record actual liters dispensed per tank, attach photos, and mark orders finished. 3. **Container runtime** — Nginx terminates HTTP on port 8000 (host) and proxies to Gunicorn on 8080 inside the container. MySQL persists data in a named volume. The Django tree is bind-mounted for development. Mental model: **Order creation (customer) → QR/share operation code → Staff scan/lookup → Refueling record (operator) → Order finished**. ExtraCash follows a parallel cash-transfer workflow with document image uploads. The project README explicitly states it is **work in progress and not production-ready**, with incomplete ticketing, partial OAuth (Google only, not Instagram), and ongoing S3 document storage setup.
