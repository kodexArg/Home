---
id: django-unifi-portal-4-333770c7
title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — P3 — Encapsulating UniFi Controller API complexity in a Djang"
visibility: private
importance: normal
source_repo: "django-unifi-portal"
related: []
tags: ["django-unifi-portal", "github", "private", "normal", "summary"]
---
### P3 — Encapsulating UniFi Controller API complexity in a Django library

- **Who hurts:** Django developers who do not want to reimplement controller login, cookie sessions, SSL quirks, and commands for every deployment.
- **Pain today:** UniFi's HTTPS API on port 8443 uses self-signed certificates, version-specific login paths ( vs ), and site-scoped endpoints ( ). Direct integration is error-prone.
- **How this repo answers:** in wraps session management (LWPCookieJar persisted under ), SSLAdapter for handshake issues, , , , (via ), and the orchestration method . Settings drive server host, port, version, site ID, and controller credentials.
- **Out of scope:** UniFi Network Application 6+ API changes; multi-site orchestration; guest analytics dashboards; firmware management.
