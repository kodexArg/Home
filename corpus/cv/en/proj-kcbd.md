---
id: proj-kcbd
title: "KCBD — cultivation lab and IoT"
related: ["dj-indoor-monitor", "skill-infra-iot", "skill-backend"]
tags: ["kcbd", "indoor", "crop", "lab", "iot", "sensors", "raspberry pi", "timescaledb", "telemetry", "temperature", "humidity", "django", "drf"]
---

Gabriel co-built the sensor network for the KCBD indoor cultivation lab. Raspberry Pi nodes measure temperature, humidity, moisture, light and CO2 and stream telemetry into a Django REST Framework API backed by TimescaleDB, with an Angular frontend. The telemetry runs in production on AWS. The code is published as dj-indoor-monitor.
