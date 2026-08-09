---
id: welpdesk-7-653c4117
title: "Welp Desk — configurable multi-organization Django help-desk ticketing — 3.2 Non-goals"
visibility: public
importance: normal
source_repo: "welpdesk"
related: ["welpdesk"]
tags: ["welpdesk", "github", "public", "normal", "summary"]
---

### 3.2 Non-goals - No REST/JSON API for external integrations — HTTP surface is HTML forms and HTMX fragments only. - No email notifications, webhooks, or chat integrations evident in the tree. - No automated test suite (package.json test script is a stub; no pytest in requirements.txt). - No GitHub Actions or cloud deploy manifests — deployment is manual Docker Compose. - Model/table names (UDN, Sector, etc.) are **not renameable** per initialize-db.md; customization is limited to option values inside those models. - README references .env.example but that file is not present in the cloned tree (only .env is gitignored).
