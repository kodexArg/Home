---
id: welpdesk-4-ff1f8c70
title: "Welp Desk — configurable multi-organization Django help-desk ticketing — P3 — Lightweight reactive UI without a JavaScript SPA"
visibility: public
importance: normal
source_repo: "welpdesk"
related: ["welpdesk"]
tags: ["welpdesk", "github", "public", "normal", "summary"]
---

### P3 — Lightweight reactive UI without a JavaScript SPA - **Who hurts:** Internal IT teams who want filterable ticket lists, cascading create forms, and attachment widgets with minimal frontend complexity and no separate Node API server in production. - **Pain today:** Full React/Vue SPAs add build pipelines, auth duplication, and API contracts; plain Django templates require full page reloads for every filter change; older jQuery stacks are hard to maintain. - **How this repo answers:** Server-rendered Django templates augmented with **HTMX** (` package.json core/components/ core/static/js/main.js assets/ django-vite /static/ /media/` directly. - **Out of scope:** Mobile-native apps; real-time WebSocket push; offline-first PWA; public unauthenticated ticket submission portal (login required for ticket operations).
