---
id: docker-kmportal-6-588234c9
title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "docker-kmportal"
related: []
tags: ["docker-kmportal", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. A fleet dispatcher logs in with Google, creates a fuel order specifying driver, tractor/trailer plates, fuel types, and liters per tank, then shares the operation code or QR with the driver heading to the station. 2. A pump operator logs into the staff intranet, scans the QR or enters the operation code, records actual liters dispensed into Refuelings, uploads dispatch photos to S3, and marks the order finished. 3. A fleet user requests an ExtraCash (cash transfer) for a driver, uploads supporting document images, and a pump operator attends the request through staff/extracash/<operation_code>/. 4. An operator runs docker compose up locally with .env pointing at the bundled MySQL service for full-stack development. 5. On push to main, a GitHub Actions workflow (documented in README) SSHes into EC2, pulls latest code, installs requirements, and runs migrations.
