---
id: proj-kcbd
title: "KCBD — laboratorio de cultivo e IoT"
related: ["dj-indoor-monitor", "skill-infra-iot", "skill-backend"]
tags: ["kcbd", "indoor", "cultivo", "laboratorio", "iot", "sensores", "raspberry pi", "timescaledb", "telemetria", "temperatura", "humedad", "co2", "django", "drf", "angular"]
---

Gabriel co-construyó la red de sensores del laboratorio de cultivo indoor KCBD. Nodos Raspberry Pi miden temperatura, humedad, humedad de sustrato, luz y CO2, y envían telemetría a una API Django REST Framework respaldada por TimescaleDB, con frontend Angular. La telemetría corre en producción sobre AWS. El código está publicado como dj-indoor-monitor.
