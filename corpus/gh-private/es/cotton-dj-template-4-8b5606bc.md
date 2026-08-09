---
id: cotton-dj-template-4-8b5606bc
title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — P3 — Server-rendered interactivity without JavaScript frameworks"
visibility: private
importance: normal
source_repo: "cotton-dj-template"
related: []
tags: ["cotton-dj-template", "github", "private", "normal", "summary"]
---

### P3 — Server-rendered interactivity without JavaScript frameworks - **Who hurts:** Teams wanting modern UX (partial page updates, modals, infinite scroll) without maintaining a separate frontend build pipeline or SPA. - **Pain today:** HTMX + Tailwind + Django integration patterns are documented ad hoc; teams fall back to React or write custom JS, violating simplicity goals. - **How this repo answers:** **Zero JavaScript policy** — HTML5 semantic elements (<details>, <dialog>), modern CSS (:has(), container queries), and HTMX served from /static/js/htmx.min.js with django-htmx middleware (request.htmx). Documented HTMX patterns in docs/architecture.md and docs/cotton-components.md: form submissions, modals, lazy loading, OOB swaps. Tailwind compiled via django-tailwind-cli with **no Node.js**. - **Out of scope:** WebSockets, Django Channels, async views, SPA architectures, npm/package.json frontend builds.
