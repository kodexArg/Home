---
id: welp-app-4-f345b845
title: "Welp App — internal purchase and payment workflow — P3 — Maintainable internal UI for Argentine currency context"
visibility: private
importance: normal
source_repo: "welp-app"
related: []
tags: ["welp-app", "github", "private", "normal", "summary"]
---

### P3 — Maintainable internal UI for Argentine currency context - **Who hurts:** Users entering amounts in USD or ARS; finance staff needing official exchange rates without blocking page renders. - **Pain today:** Live FX calls on every page slow ticket lists; toggling display currency requires heavy JS frameworks. - **How this repo answers:** Amounts stored in USD ( ); optional per-ticket . Official ARS rate fetched from DolarAPI, cached three hours ( ), refreshed via HTMX background endpoint with for reactive UI updates. Currency preference stored in a cookie; minimal JS confined to where HTMX cannot suffice. - **Out of scope:** Treasury hedging, multi-currency beyond USD/ARS, or guaranteed real-time FX during API outages (falls back to last cache or "no rate").
