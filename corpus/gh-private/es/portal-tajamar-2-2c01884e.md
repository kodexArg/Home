---
id: portal-tajamar-2-2c01884e
title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — P1 — No centralized company information portal"
visibility: private
importance: normal
source_repo: "portal-tajamar"
related: []
tags: ["portal-tajamar", "github", "private", "normal", "summary"]
---
### P1 — No centralized company information portal

- **Who hurts:** Tajamar TV staff and operators who need a single authenticated place to manage and present company-related files and information.
- **Pain today:** Company assets may live in scattered shares, email attachments, or unmanaged static hosting without access control or a consistent branded UI.
- **How this repo answers:** Provides a Django monolith with mandatory login ( on home), a Spanish ( ) dark-themed UI, navbar with auth links, and an HTMX-driven multipart upload form that stores files via Django’s default storage backend (local media in debug, S3 in staging/non-debug) and returns inline success/error partials showing the uploaded asset URL.
- **Out of scope:** Content management workflows (pages, news, video catalogs), public anonymous browsing, fine-grained permissions beyond Django auth groups, and the planned self-service module (app exists but is empty and not in ).
