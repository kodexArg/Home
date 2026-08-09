---
id: django-unifi-portal-6-550d4b6f
title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "django-unifi-portal"
related: []
tags: ["django-unifi-portal", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Club/venue guest WiFi** — Guest connects to branded SSID, registers with email and phone, accepts terms, gets authorized for N minutes, and can browse. 2. **Returning guest via Facebook** — Guest taps "Sign in with Facebook"; pipeline creates or reactivates UnifiUser, downloads avatar, then MAC authorization proceeds on the index view. 3. **Operator inspection** — Demo ListGuestView at /unifi/list-unifi-guest/ lists all UnifiUser records (intended for staff; no login decorator in current code).
