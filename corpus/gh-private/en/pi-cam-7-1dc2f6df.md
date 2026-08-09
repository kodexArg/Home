---
id: pi-cam-7-1dc2f6df
title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — 3.2 Non-goals"
visibility: private
importance: normal
source_repo: "pi-cam"
related: []
tags: ["pi-cam", "github", "private", "normal", "summary"]
---

### 3.2 Non-goals - Public HTTP API or WebSocket control surface (mentioned as future in TASK.md, not implemented). - Multi-tenant auth beyond optional TELEGRAM_ALLOWED_USERS allow-list (enforcement depth in bot layer is limited). - Cloud deployment, container orchestration, or GitHub Actions CI (no .github/ workflows in tree). - Guaranteed production-hardening: configuration hot-reload, CONFIGURE_SYSTEM command, and some TASK.md notifier extensions remain stubs or placeholders. - Storing or indexing historical footage beyond the local FIFO cache.
