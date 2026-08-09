---
id: commce-4-be573d56
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — P3 — Environmental monitoring without a dedicated SCADA UI"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---

### P3 — Environmental monitoring without a dedicated SCADA UI - **Who hurts:** Operators monitoring server-room or floor-adjacent Raspberry Pi nodes that log temperature and humidity. - **Pain today:** Sensor rows accumulate in tb_temperatura on a separate MySQL database (db_temperatura, routed via Temperatura.dbrouters.MiRouter). Raw SQL or spreadsheets are the fallback. - **How this repo answers:** Temperatura reads TbTemperatura (columns: RPi, Temperatura, Humedad, Fecha) and builds pandas DataFrames via django_pandas.read_frame. **24hs** view aggregates average temperature per RPi per hour for the prior day; **semana** plots raw points over a ~2-day window. Templates render **Chart.js** line charts with per-RPi datasets and show the latest reading timestamp. Humidity is stored but not charted in current views. - **Out of scope:** Alerting thresholds, SMS/email alarms, sensor provisioning, or ingestion code (assumed external to this repo).
