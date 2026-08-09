---
id: django-kmportal-4-097b95ad
title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — P3 — Company-scoped identity for OAuth users"
visibility: private
importance: normal
source_repo: "django-kmportal"
related: []
tags: ["django-kmportal", "github", "private", "normal", "summary"]
---

### P3 — Company-scoped identity for OAuth users - **Who hurts:** Enterprise customers logging in with Google who must only see their own company's drivers, vehicles, and orders. - **Pain today:** Social login alone does not map users to B2B legal entities (CUIT, fantasy name). - **How this repo answers:** CompanySocialAccount links each allauth SocialAccount to a Company. CustomAdapter in app/adapters.py prevents duplicate social registrations when an email already exists. View helpers resolve company from the authenticated user's Google social account for template context and order scoping. - **Out of scope:** Self-service company onboarding; admin must configure Sites and Social applications in Django admin per README.
