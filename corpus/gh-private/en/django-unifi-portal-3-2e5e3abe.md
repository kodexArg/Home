---
id: django-unifi-portal-3-2e5e3abe
title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — P2 — Per-user guest accounts with registration and social log"
visibility: private
importance: normal
source_repo: "django-unifi-portal"
related: []
tags: ["django-unifi-portal", "github", "private", "normal", "summary"]
---

### P2 — Per-user guest accounts with registration and social login on a captive portal - **Who hurts:** Venues (clubs, hotels, events) that want identifiable guest accounts, marketing opt-in, and Facebook sign-in rather than shared passwords or vouchers. - **Pain today:** Captive portals are often static HTML forms or vendor-locked. Django's auth stack is powerful but does not include UniFi integration or Material-styled portal templates out of the box. - **How this repo answers:** Ships UnifiUserLogin (email-as-username login form), UnifiUserRegistration (extended profile: phone, gender, terms acceptance, newsletter opt-in), and Facebook OAuth via rest_framework_social_oauth2 at /auth/. A custom SOCIAL_AUTH_PIPELINE in pipeline.py creates UnifiUser profiles, pulls Facebook avatar/locale/city/birthday, and handles AuthAlreadyAssociated by logging out instead of raising. Forms use django-material layouts with Font Awesome social buttons. - **Out of scope:** Google/Apple/other OAuth providers (backends are commented as extensible only); email verification workflows beyond social-auth mail validation; admin approval of new registrations.
