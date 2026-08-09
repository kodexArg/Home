---
id: django-unifi-portal-5-6a671529
title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — 3. Product / idea"
visibility: private
importance: normal
source_repo: "django-unifi-portal"
related: []
tags: ["django-unifi-portal", "github", "private", "normal", "summary"]
---

## 3. Product / idea The repository is structured as a **publishable Django app** plus a **demo host project**. The mental model: 1. Guest device associates with guest SSID → UniFi redirects browser to the external portal (must be configured as controller IP; README notes folder paths are not allowed in UniFi external portal settings). 2. Guest hits login ( ) or registration ( ) or Facebook OAuth ( ). 3. On success, Django session is established; UniFi's redirect (stored in session as ) or default sends the guest to . 4. authorizes the MAC via controller API and shows with SSID, timeout, and guest metadata from context processor. The model extends Django's with portal-specific fields: profile picture, language, gender, city, about, date of birth, phone, last seen guest MAC, and last backend login source. A custom permission is defined for future authorization gating. The demo project ( ) shows how a consuming site wires into , imports secrets from a separate module (not present in the tracked tree), mounts at root, and adds a small app with for listing registered guests.
