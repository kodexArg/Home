---
id: dj-apprunner-template-5-9934b38c
title: "dj-apprunner-template — Django starter for AWS App Runner with Vite, HTMX, and S3 static delivery — 3. Product / idea"
visibility: public
importance: normal
source_repo: "dj-apprunner-template"
related: ["dj-apprunner-template"]
tags: ["dj-apprunner-template", "github", "public", "normal", "summary"]
---

## 3. Product / idea The mental model is a **single Django monolith** deployed on App Runner that serves server-rendered HTML with progressive enhancement via HTMX, styled by Tailwind (built through Vite), and composed with django-components. In production, the app process handles dynamic requests via Gunicorn on port 8080; static assets and logs (via Loguru S3 sink) land in a configured S3 bucket fronted by CloudFront. In local dev (IS_LOCAL=True), filesystem storage replaces S3 and Vite dev server provides HMR. The repository is intentionally a **template**, not a finished product: core/models.py is empty (no domain models beyond Django auth), and README lists authentication and REST API as next steps.
