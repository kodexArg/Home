---
id: dj-rpi-monitor-3-34d3f0c6
title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — P2 — Live browser dashboard without a frontend framework"
visibility: private
importance: low
source_repo: "dj-rpi-monitor"
related: []
tags: ["dj-rpi-monitor", "github", "private", "low", "summary"]
---

### P2 — Live browser dashboard without a frontend framework - **Who hurts:** An operator who wants to watch recent environmental readings update in near real time without writing JavaScript polling logic or deploying a separate Angular/Astro frontend. - **Pain today:** Raw API responses require curl or Postman; charting requires exporting CSV or building one-off notebooks; static HTML goes stale immediately. - **How this repo answers:** The page includes HTMX partials: refreshes table body rows every two seconds via ; renders Plotly Express line charts for temperature and humidity over the same ten-minute window ( constant in ). Skeleton CSS provides layout; vendored HTMX and Plotly avoid CDN dependency at runtime (though base layout still references Google Fonts). - **Out of scope:** Historical range selectors, downsampling for long timeframes, room grouping, mobile-optimized UX, or production-ready home page (root is an explicit "under development" placeholder linking to ).
