---
id: django-captive-portal-oauth-3-81251466
title: "Django Captive Portal OAuth — WiFi guest authentication via social login — P2 — Social OAuth beats local guest accounts"
visibility: private
importance: normal
source_repo: "django-captive-portal-oauth"
related: []
tags: ["django-captive-portal-oauth", "github", "private", "normal", "summary"]
---

### P2 — Social OAuth beats local guest accounts - **Who hurts:** Front-desk staff and guests who would otherwise need disposable usernames/passwords printed on receipts. - **Pain today:** Local Django User registration creates support burden; guests forget passwords; staff reset accounts manually. - **How this repo answers:** INSTALLED_APPS registers allauth, allauth.account, allauth.socialaccount, and allauth.socialaccount.providers.google. Settings configure email-based account authentication and Google as a SOCIALACCOUNT_PROVIDERS entry. README states Facebook is also a target provider, but Facebook is not present in the active provider list in settings at the time of this summary. - **Out of scope:** Enterprise SSO (SAML, OIDC beyond social), per-device MAC authorization, or bandwidth quotas.
