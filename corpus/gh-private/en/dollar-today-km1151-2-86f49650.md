---
id: dollar-today-km1151-2-86f49650
title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay) — P1 — Manual marquee price updates"
visibility: private
importance: low
source_repo: "dollar-today-km1151"
related: []
tags: ["dollar-today-km1151", "github", "private", "low", "summary"]
---

### P1 — Manual marquee price updates - **Who hurts:** Staff responsible for a currency-exchange or retail marquee that must show "dollar today" and related rates (official dollar, blue dollar, euros, etc.). - **Pain today:** Updating a signboard image often means opening a design tool, typing numbers, aligning text, and exporting — repetitive work every trading day, easy to misalign or use stale dates. - **How this repo answers:** loads a fixed , prompts for a numeric value, draws it centered in large white Arial text (512 pt via ), and saves . holds structured rate entries (name, date, price) that is intended to consume after JSON normalization (date formatting, float prices). - **Out of scope:** Live API feeds from central banks or brokers; multi-currency layout on one canvas; scheduling or cron; web UI; authentication; production deployment manifests.
