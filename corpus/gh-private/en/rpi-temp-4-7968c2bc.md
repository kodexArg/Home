---
id: rpi-temp-4-7968c2bc
title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — P3 — Noisy humidity readings distort trends"
visibility: private
importance: normal
source_repo: "rpi-temp"
related: []
tags: ["rpi-temp", "github", "private", "normal", "summary"]
---
### P3 — Noisy humidity readings distort trends

- **Who hurts:** Anyone reading live humidity who would misinterpret spikes caused by sensor glitches.
- **Pain today:** Unfiltered time series show impossible values (e.g., humidity > 110%) that break chart scaling.
- **How this repo answers:** filters out rows where before JSON serialization.
- **Out of scope:** Broader data-quality pipelines, calibration, or per-device thresholds.
