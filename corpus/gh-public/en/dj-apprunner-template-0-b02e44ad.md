---
id: dj-apprunner-template-0-b02e44ad
title: "dj-apprunner-template — Django starter for AWS App Runner with Vite, HTMX, and S3 static delivery — dj-apprunner-template"
visibility: public
importance: normal
source_repo: "dj-apprunner-template"
related: ["dj-apprunner-template"]
tags: ["dj-apprunner-template", "github", "public", "normal", "summary"]
---

# dj-apprunner-template > **Problem thesis (required):** This repository is a **production-oriented Django starter template** for AWS App Runner. It solves the recurring pain of bootstrapping a Django web app that must run on App Runner behind HTTPS, talk to RDS PostgreSQL, serve static and media assets from S3 via CloudFront (no external CDNs), inject secrets from AWS Secrets Manager, and ship a modern frontend built with Vite, Tailwind v4, HTMX, and django-components — all with a documented build pipeline split across App Runner pre-build, build, and runtime phases. The home page doubles as a **Technology Verification Dashboard** so operators can confirm each stack layer is alive after deploy. Authentication, REST APIs, and OAuth2 are explicitly marked as future work.
