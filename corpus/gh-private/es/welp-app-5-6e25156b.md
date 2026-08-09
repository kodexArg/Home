---
id: welp-app-5-6e25156b
title: "Welp App — internal purchase and payment workflow — 3. Product / idea"
visibility: private
importance: normal
source_repo: "welp-app"
related: []
tags: ["welp-app", "github", "private", "normal", "summary"]
---

## 3. Product / idea Welp App is a **server-first Django monolith**. The browser talks HTTP and HTMX to Gunicorn/Django; Django renders HTML templates with inclusion-tag components (templates/core/components/, templates/welp_payflow/partials/). Interactivity is layered: native HTML5 first, then HTMX partial swaps, then Alpine.js only as last resort, then small Vite-bundled JS modules for attachments and currency. The mental model: Root URL redirects to /payflow/. Users log in via /core/login/; GlobalAuthMiddleware enforces authentication on all non-exempt paths. Payflow home offers navigation to create tickets, list/filter tickets, and view detail pages with Mermaid workflow diagrams per ticket.
