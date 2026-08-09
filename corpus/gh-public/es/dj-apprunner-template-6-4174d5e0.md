---
id: dj-apprunner-template-6-4174d5e0
title: "dj-apprunner-template — Django starter for AWS App Runner with Vite, HTMX, and S3 static delivery — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "dj-apprunner-template"
related: ["dj-apprunner-template"]
tags: ["dj-apprunner-template", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Fork and deploy:** Clone the template, provision RDS + S3 + Secrets Manager secrets matching the documented key names, attach IAM policies to the App Runner instance role, push to main, and let App Runner CI/CD build and run scripts/start.sh. 2. **Local full-stack dev:** Create .env from the sample in .cursor/rules/entorno.mdc, run uv pip install -r requirements.txt, npm install, then either scripts/dev.ps1 (Windows PowerShell, starts Vite job + Django) or parallel python manage.py runserver and npm run dev. 3. **Verify stack after deploy:** Open / and confirm all four technology cards show green; click HTMX health/DB/hello links; confirm ping component renders PONG. 4. **Extend with components:** Follow .cursor/rules/django-components.mdc to add new components under components/{app}/nombre_componente/ and register imports in {app}/apps.py.
