---
id: sociedad-rural-oeste-argentino-4-faaf6b83
title: "SROA — institutional website and moderated institutional blog — P3 — Membership recruitment and censused audience building"
visibility: private
importance: normal
source_repo: "sociedad-rural-oeste-argentino"
related: []
tags: ["sociedad-rural-oeste-argentino", "github", "private", "normal", "summary"]
---

### P3 — Membership recruitment and censused audience building - **Who hurts:** Prospective members evaluating adhesion, SROA staff tracking institutional outreach, and future marketing operators who need a first-party contact base ( OB-04, OB-07 — high priority). - **Pain today:** Interested producers cannot self-serve information and contact flows; every Google login creates potential audience data but without a system there is no structured user census or contributor onboarding. - **How this repo answers:** Public "Sumate" form posts to (email to Comisión Directiva, no persistence). Google OAuth via Cognito creates atomically on first signup ( signal). invite contributors by email; lazy token validation elevates role on first login. Profile exposes comment history including moderated items. KPIs K-01 through K-03 (comment volume, reaction distribution, visit analytics) are defined in PRD §4 for future measurement. - **Out of scope:** Paid membership billing, CRM integration, newsletter campaigns (audience DB is foundational but campaign tooling is not in MVP).
