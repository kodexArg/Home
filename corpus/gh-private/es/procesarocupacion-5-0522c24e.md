---
id: procesarocupacion-5-0522c24e
title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "ProcesarOcupacion"
related: []
tags: ["procesarocupacion", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. Operator runs main.py on a schedule (cron or manual) to pull the latest daily *-daily-device_ocupation.csv attachment(s) from the monitoring inbox. 2. Analyst clones the repo (or copies saved CSVs) to study hourly occupancy columns (hour_10 … hour_05, ocupation_average) per device_id / device_identification. 3. Historical reviewer inspects Mendoza_Sesion_*.csv rows for roulette machines: credits played/won, manual payouts, jackpots, ticket in/out, and occupancy percentage at snapshot time.
