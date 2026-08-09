---
id: portal-tajamar-3-3ebb2859
title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — P2 — AWS deployment bootstrap for a Django portal"
visibility: private
importance: normal
source_repo: "portal-tajamar"
related: []
tags: ["portal-tajamar", "github", "private", "normal", "summary"]
---
### P2 — AWS deployment bootstrap for a Django portal

- **Who hurts:** Developers who must stand up a Django app on AWS with MySQL, S3 static/media, and EB deploy hooks without reinventing settings splits and container commands.
- **Pain today:** Manual EB configuration, migrate/collectstatic on deploy, and environment-specific storage backends are repetitive and error-prone when starting from a blank Django project.
- **How this repo answers:** Ships (pip install, migrate, collectstatic, conditional superuser bootstrap on leader instance) and (nginx proxy, WSGI path , MariaDB client libs, health check on ). Settings split across , , and with selecting the module via and . S3 bucket name is derived from via env var pattern . README documents as the deployment path.
- **Out of scope:** A dedicated settings module (README mentions production but only and modules exist in tree). CI/CD beyond EB CLI, infrastructure-as-code (no Terraform/CloudFormation in repo), and multi-region HA patterns.
