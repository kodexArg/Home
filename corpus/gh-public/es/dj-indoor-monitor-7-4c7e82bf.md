---
id: dj-indoor-monitor-7-4c7e82bf
title: "dj-indoor-monitor — Django IoT dashboard for indoor crop sensor monitoring — 3.2 Non-goals"
visibility: public
importance: normal
source_repo: "dj-indoor-monitor"
related: ["dj-indoor-monitor"]
tags: ["dj-indoor-monitor", "github", "public", "normal", "summary"]
---

### 3.2 Non-goals - Dashboard is explicitly **under maintenance** per root README.md — visualization may be suspended while API ingest continues. - Redis is provisioned in compose but project/settings.py uses LocMemCache; switching to Redis is documented as a manual settings change (docs/production.md). - No authentication on public DRF endpoints is evident in settings — API appears open within the trusted LAN (throttle config referenced in README env example but not enforced in inspected REST_FRAMEWORK block). - Not a generic IoT platform: metric codes are single-character (t, h, s, l) and hardware support in the RPI service is limited to DHT11/DHT22, MCP3008, and fake simulators.
