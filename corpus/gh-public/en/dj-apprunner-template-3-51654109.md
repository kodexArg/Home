---
id: dj-apprunner-template-3-51654109
title: "dj-apprunner-template — Django starter for AWS App Runner with Vite, HTMX, and S3 static delivery — P2 — Frontend toolchain friction on serverless Python hosts"
visibility: public
importance: normal
source_repo: "dj-apprunner-template"
related: ["dj-apprunner-template"]
tags: ["dj-apprunner-template", "github", "public", "normal", "summary"]
---

### P2 — Frontend toolchain friction on serverless Python hosts - **Who hurts:** Teams wanting Vite HMR locally but hashed production bundles on S3 — without shipping to runtime or relying on public CDNs for HTMX/Tailwind. - **Pain today:** App Runner Python runtimes lack Node by default; during build cannot see runtime secrets; django-vite manifest paths drift; favicon and unimported assets get dropped from Vite output; Tailwind v4 + plugin must be configured for Django template/component paths. - **How this repo answers:** Pre-build phase downloads Node 20.x into , runs and , outputting to with . uses , for favicon, and scans , , . toggles dev mode via . bundles HTMX with CSRF-aware defaults. README states the stack is **fully offline in production** once deployed (all assets from S3/CloudFront). - **Out of scope:** SSR frameworks (React/Vue SPA shell), WebSocket real-time, service-worker PWA.
