---
id: on-screen-dolar-5-6e4d7122
title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — 3. Product / idea"
visibility: private
importance: normal
source_repo: "on-screen-dolar"
related: []
tags: ["on-screen-dolar", "github", "private", "normal", "summary"]
---
## 3. Product / idea

The repository is a **two-process Python signage system** with a shared JSON contract, not a web app. The mental model: 1. **Display lane** ( ): reads , renders a horizontal scrolling string of all key–value pairs, alpha-blends it onto video frames, shows fullscreen. 2. **Control lane** ( ): Telegram long-polling bot; authorized chat users issue price-change commands; bot rewrites . 3. **Orchestration stub** ( ): comments describe intent to run display and bot in separate threads, but the file currently only imports , , and without wiring — operators likely run modules independently today. Data flows in one direction: Telegram message → JSON file → marquee text reader. There is no database, queue, or HTTP API between them.
