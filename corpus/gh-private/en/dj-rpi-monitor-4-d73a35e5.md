---
id: dj-rpi-monitor-4-d73a35e5
title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — 3. Product / idea"
visibility: private
importance: low
source_repo: "dj-rpi-monitor"
related: []
tags: ["dj-rpi-monitor", "github", "private", "low", "summary"]
---

## 3. Product / idea The mental model is a **tight loop**: (1) edge Raspberry Pi scripts JSON to ; (2) Django persists flat rows in SQLite (or an env-configured SQL backend); (3) a single development dashboard page composes server-rendered Plotly HTML plus an HTMX-driven table that polls partial endpoints. There is **no separation** between API and presentation — both live in the Django app. Charts are generated server-side with Plotly Express ( ) and embedded via in templates. The data model is intentionally flat: one table, four payload fields plus auto timestamp, no foreign keys to rooms or sensor catalogs. The project branding ( ) and Spanish locale ( , ) align it with the broader KCBD indoor cultivation monitoring lineage documented in sibling repos (public production monolith) and (private headless refactor). This repo appears to be an **earlier, slimmer experiment** — created mid-November 2024, last touched days later, with no README, CI, or container story.
