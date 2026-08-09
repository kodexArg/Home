---
id: dj-apprunner-template-4-03fa8a31
title: "dj-apprunner-template — Django starter for AWS App Runner with Vite, HTMX, and S3 static delivery — P3 — Post-deploy confidence without manual smoke testing"
visibility: public
importance: normal
source_repo: "dj-apprunner-template"
related: ["dj-apprunner-template"]
tags: ["dj-apprunner-template", "github", "public", "normal", "summary"]
---
### P3 — Post-deploy confidence without manual smoke testing

- **Who hurts:** Operators who deploy and need to know immediately whether DB, S3, Vite build, HTMX, and django-components are correctly wired.
- **Pain today:** Generic health checks return 200 even when static manifest is broken; DB failures surface only on first ORM query; component CSS/JS registration errors appear as blank UI.
- **How this repo answers:** Home page ( ) renders a four-card **Technology Verification Dashboard** (Vite, Tailwind, HTMX, Components) with live HTMX probes to , , , and an HTMX demo endpoint. A django-component demonstrates per-component Media (CSS/JS). runs migrations, , superuser bootstrap, and the full pytest suite before Gunicorn starts — failing fast on misconfiguration.
- **Out of scope:** Synthetic monitoring SaaS, APM dashboards, load testing.
