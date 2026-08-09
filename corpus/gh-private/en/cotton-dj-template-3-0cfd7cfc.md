---
id: cotton-dj-template-3-0cfd7cfc
title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — P2 — Fragmented Django template organization blocking reusable UI"
visibility: private
importance: normal
source_repo: "cotton-dj-template"
related: []
tags: ["cotton-dj-template", "github", "private", "normal", "summary"]
---

### P2 — Fragmented Django template organization blocking reusable UI - **Who hurts:** Developers maintaining django-cotton or Django template components spread across apps/*/templates/ directories. - **Pain today:** Django's default convention scatters HTML across apps, making refactors painful and component discovery difficult. Inconsistent margin/spacing rules break layouts when components are reused. - **How this repo answers:** Mandates **centralized templates** under /templates/ with TEMPLATES[0]['DIRS'] pointing there; all django-cotton components live in /templates/cotton/{category}/ with dot-notation tags (<c-ui.button>). The **zero exterior margins rule** (constitution constraint #1) ensures container-agnostic components — parents control positioning via space-y-* and grid/flex, never m-* on component roots. - **Out of scope:** Per-app template directories; CSS frameworks other than Tailwind 4; client-side component frameworks (React, Vue, Alpine).
