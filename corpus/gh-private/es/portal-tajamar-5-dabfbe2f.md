---
id: portal-tajamar-5-dabfbe2f
title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "portal-tajamar"
related: []
tags: ["portal-tajamar", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Staff login** — User signs up or logs in via flows; email verification required before full access. 2. **Authenticated upload** — Logged-in user visits home ( ), selects a file, HTMX posts to , receives inline preview link on success. 3. **Operator deploy** — Developer sets , runs migrations locally or relies on EB container commands, deploys with , admin user bootstrapped on first leader deploy if absent.
