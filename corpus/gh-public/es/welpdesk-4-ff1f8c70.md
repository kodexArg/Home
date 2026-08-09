---
id: welpdesk-4-ff1f8c70
title: "Welp Desk — configurable multi-organization Django help-desk ticketing — P3 — Lightweight reactive UI without a JavaScript SPA"
visibility: public
importance: normal
source_repo: "welpdesk"
related: ["welpdesk"]
tags: ["welpdesk", "github", "public", "normal", "summary"]
---

### P3 — Lightweight reactive UI without a JavaScript SPA - **Who hurts:** Internal IT teams who want filterable ticket lists, cascading create forms, and attachment widgets with minimal frontend complexity and no separate Node API server in production. - **Pain today:** Full React/Vue SPAs add build pipelines, auth duplication, and API contracts; plain Django templates require full page reloads for every filter change; older jQuery stacks are hard to maintain. - **How this repo answers:** Server-rendered Django templates augmented with **HTMX** ( via package.json) for partial swaps: ticket list content, cascading UDN/Sector/Category/Issue selectors, attachment add/remove rows, and close-ticket confirmation modals. **django-components** (core/components/) encapsulates reusable UI pieces (buttons, nav links, status switches, tag switches). **Vite + Tailwind CSS 4** bundles core/static/js/main.js into assets/ for modern CSS/JS assets served via django-vite. Nginx terminates TLS-facing traffic and serves /static/ and /media/ directly. - **Out of scope:** Mobile-native apps; real-time WebSocket push; offline-first PWA; public unauthenticated ticket submission portal (login required for ticket operations).
