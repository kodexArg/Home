---
id: on-screen-dolar-4-9b9d8215
title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — P3 — Professional-looking TV output from simple Python tooling"
visibility: private
importance: normal
source_repo: "on-screen-dolar"
related: []
tags: ["on-screen-dolar", "github", "private", "normal", "summary"]
---

### P3 — Professional-looking TV output from simple Python tooling - **Who hurts:** Operators who want a broadcast-style ticker (dimmed lower band, custom LED fonts, fullscreen) without a dedicated signage SaaS or video editor pipeline. - **Pain today:** Plain text overlays look amateurish; achieving marquee motion and video underlay usually means After Effects or proprietary signage boxes. - **How this repo answers:** onscreen.py blends a background MP4 (src/background.mp4, other src/*.mp4 ignored per .gitignore except the example) with a Pillow-drawn RGBA marquee layer. configuration.py tunes speed, font, band fade, and frame timing. Custom TTF fonts under src/fonts/ (monosphere, LED board variants) give an electronic-ticker aesthetic. Escape key exits fullscreen. - **Out of scope:** Logo overlays, news crawl integration (mentioned as future Scrapy idea in README), multi-monitor orchestration.
