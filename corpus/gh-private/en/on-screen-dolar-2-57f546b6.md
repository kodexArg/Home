---
id: on-screen-dolar-2-57f546b6
title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — P1 — Static signage cannot keep pace with intraday FX quotes"
visibility: private
importance: normal
source_repo: "on-screen-dolar"
related: []
tags: ["on-screen-dolar", "github", "private", "normal", "summary"]
---
### P1 — Static signage cannot keep pace with intraday FX quotes

- **Who hurts:** Anyone running a physical or on-wall display of informal or official dollar/euro rates in Argentina, where quotes can shift multiple times per day.
- **Pain today:** Updating a TV image or slide deck requires manual graphic work or on-site keyboard access; there is no single source of truth between what is shown and what staff believe is current.
- **How this repo answers:** holds the canonical quote map ( , , , ). polls that file on every marquee frame via , composites scrolling text over a looping MP4 background, and renders fullscreen through OpenCV. When the JSON changes, the ticker text updates without restarting the video loop logic.
- **Out of scope:** Automated scraping of official or parallel-market rates; historical charts; multi-currency conversion calculators; cloud-hosted dashboards.
