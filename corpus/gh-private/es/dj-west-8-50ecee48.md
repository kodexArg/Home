---
id: dj-west-8-50ecee48
title: "dj-west — Django inventory and point-of-sale for Argentine retail — 3.2 Non-goals"
visibility: private
importance: normal
source_repo: "dj-west"
related: []
tags: ["dj-west", "github", "private", "normal", "summary"]
---

### 3.2 Non-goals - Not a public API product — one legacy JSON price endpoint exists; primary surface is server-rendered HTML. - Not multi-tenant SaaS — single-deployment inventory for one business context. - django-afip and live MP integration are specified in agent docs but not shipped in current dependencies. - No GitHub Actions CI in tree — deployment is App Runner + optional ECR push script. - Sentry SDK is declared in pyproject.toml but not initialized in project/settings.py.
