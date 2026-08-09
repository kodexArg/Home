---
id: kdx-pi-signage-7-0495d56c
title: "kdx-pi-signage — autonomous Raspberry Pi 3 A+ digital-signage video looper — 3.2 Non-goals"
visibility: public
importance: normal
source_repo: "kdx-pi-signage"
related: ["kdx-pi-signage"]
tags: ["kdx-pi-signage", "github", "public", "normal", "summary"]
---

### 3.2 Non-goals - No GUI, no web admin panel, no REST API (explicitly headless per PRD in .trae/documents/requisitos_producto_carteleria_pi.md). - No database or persistent state beyond log files and on-disk videos. - Docs mention OpenCV/FFmpeg as future/transcode tooling; they are **not** runtime dependencies in pyproject.toml and are not imported in application code. - psutil and pillow are declared in pyproject.toml but unused in current source — likely reserved or leftover. - Network/WiFi configuration models appear in PRD examples only; no NetworkConfig class ships in config.py.
