---
id: django-captive-portal-oauth-4-8c76c1eb
title: "Django Captive Portal OAuth — WiFi guest authentication via social login — P3 — First-time visitor approval workflow (product intent)"
visibility: private
importance: normal
source_repo: "django-captive-portal-oauth"
related: []
tags: ["django-captive-portal-oauth", "github", "private", "normal", "summary"]
---

### P3 — First-time visitor approval workflow (product intent) - **Who hurts:** Reception staff at venues that want to vet new guests before granting WiFi. - **Pain today:** Without a registration gate, any successful OAuth login immediately grants access — no staff checkpoint. - **How this repo answers (intended):** README describes that registered users navigate freely while first-time visitors are shown a page inviting them to approach reception for access registration. **The checked-in codebase does not yet implement this distinction** — the home template only branches on vs anonymous, with no custom user-registration or approval model. - **Out of scope:** CRM integration, SMS verification, or payment for WiFi access.
