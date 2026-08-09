---
id: pi-cam-4-ab633de9
title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — P3 — Evolving from script soup to testable services"
visibility: private
importance: normal
source_repo: "pi-cam"
related: []
tags: ["pi-cam", "github", "private", "normal", "summary"]
---

### P3 — Evolving from script soup to testable services - **Who hurts:** Maintainers of a growing Telegram + RTSP + motion-detection codebase where root-level modules became tightly coupled. - **Pain today:** Direct imports between bot handlers and OpenCV calls make unit testing and feature addition (e.g., REST API, alternate input channels) costly. - **How this repo answers:** A documented layered refactor ( ) introduces , , , and packages. centralizes command types ( , , , etc.), tracks , and coordinates and through a . Legacy root modules ( , , …) remain for gradual migration compatibility. - **Out of scope:** Fully completed migration (some root duplicates still exist); hot configuration reload; REST/WebSocket interfaces (planned only in ).
