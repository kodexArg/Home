---
id: portal-tajamar-4-5724863e
title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — 3. Product / idea"
visibility: private
importance: normal
source_repo: "portal-tajamar"
related: []
tags: ["portal-tajamar", "github", "private", "normal", "summary"]
---

## 3. Product / idea The mental model is a **small authenticated portal monolith**: 1. **Auth layer** — django-allauth with email-as-username, mandatory email verification (including verification-by-code), session cookies with long TTL, logout-on-get enabled. 2. **Core app** — custom core.User (AbstractUser subclass, migration 0001_initial), HomeView rendering upload UI, UploadFileView accepting POST with file field. 3. **Presentation** — server-rendered templates with layout inheritance (layouts/base.html → content.html / box.html), partials for navbar, success/error boxes, and a minimal allauth entrance layout override. 4. **Future zone** — autogestion Django app scaffold (empty models/views, not installed) reserved for self-service features per naming convention. Non-debug deployments serve static and media from S3 (storages.backends.s3boto3); debug mode uses local core/static and a media/ directory.
