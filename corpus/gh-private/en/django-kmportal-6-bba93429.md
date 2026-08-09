---
id: django-kmportal-6-bba93429
title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "django-kmportal"
related: []
tags: ["django-kmportal", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Fleet dispatcher** logs in with Google, opens orders/, creates a new fuel order selecting driver, tractor, trailer, fuel types and liters per tank, shares the QR/operation code with the driver. 2. **Pump operator** logs into staff/, scans the QR, fills refueling liters and photos, completes the refueling record tied to the fuel order. 3. **Company admin** manages drivers and vehicle plates under vehicles/ and company/, exports order CSV via export_csv/<company_id>/. 4. **ExtraCash requester** submits a cash-transfer order under extracash/; staff attends via staff/extracash/<operation_code>/.
