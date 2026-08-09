---
id: djangomce-7-668ebe9c
title: "DjangoMCE — internal Mendoza Central operations portal — 3.2 Non-goals"
visibility: private
importance: normal
source_repo: "DjangoMCE"
related: []
tags: ["djangomce", "github", "private", "normal", "summary"]
---

### 3.2 Non-goals - Not a greenfield data platform; external DB schemas are mirrored, not owned. - Not API-first; only one REST endpoint is wired (api/temp/). - Not production-hardened as checked in: DEBUG=True, permissive ALLOWED_HOSTS, and credentials are inline in settings.py (must be externalized before any redeploy). - Companion conda environment and deployment orchestration live in **DjangoConda**, not here.
