---
id: dj-rpi-monitor-0-1a2f8841
title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — dj-rpi-monitor"
visibility: private
importance: low
source_repo: "dj-rpi-monitor"
related: []
tags: ["dj-rpi-monitor", "github", "private", "low", "summary"]
---

# dj-rpi-monitor > **Problem thesis (required):** dj-rpi-monitor is a **minimal Django monolith** that solves a narrow IoT monitoring need: Raspberry Pi devices POST temperature and humidity readings to a small REST endpoint; data lands in a single table; operators view the **last ten minutes** of readings as a live-updating HTML table (HTMX polling every two seconds) and as server-rendered Plotly line charts on a development dashboard branded for KCBD. It deliberately trades the full sensor suite, TimescaleDB, Docker, and auth hardening of sibling repos for the smallest possible deployable footprint — suitable as a prototype or private lab monitor, not as a production cultivation platform.
