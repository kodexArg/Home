---
id: django-unifi-portal-5-6a671529
title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — 3. Product / idea"
visibility: private
importance: normal
source_repo: "django-unifi-portal"
related: []
tags: ["django-unifi-portal", "github", "private", "normal", "summary"]
---

## 3. Product / idea The repository is structured as a **publishable Django app** plus a **demo host project**. The mental model: 1. Guest device associates with guest SSID → UniFi redirects browser to the external portal (must be configured as controller IP; README notes folder paths are not allowed in UniFi external portal settings). 2. Guest hits login (/unifi-portal/login/) or registration (/unifi-portal/registration/) or Facebook OAuth (/auth/login/facebook). 3. On success, Django session is established; UniFi's next redirect (stored in session as mynext) or default index sends the guest to guest/s/default/?id=…&ap=…&url=…. 4. UserAuthorizeView authorizes the MAC via controller API and shows index.html with SSID, timeout, and guest metadata from unifi_context context processor. The UnifiUser model extends Django's User with portal-specific fields: profile picture, language, gender, city, about, date of birth, phone, last seen guest MAC, and last backend login source. A custom permission can_navigate is defined for future authorization gating. The demo project (demo/) shows how a consuming site wires unifi_settings.py into settings.py, imports secrets from a separate unifi_secret module (not present in the tracked tree), mounts django_unifi_portal.urls at root, and adds a small unifi app with ListGuestView for listing registered guests.
