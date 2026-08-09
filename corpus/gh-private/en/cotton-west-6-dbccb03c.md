---
id: cotton-west-6-dbccb03c
title: "Cotton-West — cannabis club operations SaaS (spec & docs vault) — 3. Product / idea"
visibility: private
importance: normal
source_repo: "cotton-west"
related: []
tags: ["cotton-west", "github", "private", "normal", "summary"]
---

## 3. Product / idea Cotton-West (code name; final branding chosen by the club) is conceived as a **browser-only SaaS web application** — no local install — integrating three user-facing surfaces plus a compliance backbone: **Current repository state:** The tree is a **documentation product**, not the application. Source lives in docs/; built static HTML is pre-generated in site/ (MkDocs output). wrangler.toml configures Cloudflare Pages to build via pip install -r requirements.txt && mkdocs build and publish site/. The planned application architecture is monolithic Django with modular apps, server-side components (django-cotton), HTMX interactivity, and dual logging (immutable files + database queries) for ANMAT-grade auditability.
