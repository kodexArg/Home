---
id: django-captive-portal-oauth-2-1ef283cb
title: "Django Captive Portal OAuth — WiFi guest authentication via social login — P1 — Guest WiFi needs a login wall before internet access"
visibility: private
importance: normal
source_repo: "django-captive-portal-oauth"
related: []
tags: ["django-captive-portal-oauth", "github", "private", "normal", "summary"]
---

### P1 — Guest WiFi needs a login wall before internet access - **Who hurts:** Venue operators running open or semi-open WiFi (hotels, cafés, coworking spaces) and the network admins who configure captive-portal hardware. - **Pain today:** Raw open WiFi either grants unrestricted access (abuse, liability) or requires brittle manual credential distribution. Captive portals solve interception, but building a maintainable login UI with real identity providers is non-trivial. - **How this repo answers:** Provides a Django project skeleton with wired for social login, a minimal home template that shows login state in three languages (Spanish, Portuguese, English), and URL routes that delegate authentication to allauth's standard account flows. The extended requirements file signals intent to integrate for UniFi controller handshake. - **Out of scope:** Does not include firewall/radius configuration, DHCP, or hardware-side captive-portal redirect rules — those live outside this app on the access point or controller.
