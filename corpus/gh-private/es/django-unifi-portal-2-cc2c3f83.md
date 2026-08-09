---
id: django-unifi-portal-2-cc2c3f83
title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — P1 — UniFi external portal requires post-auth MAC authorizati"
visibility: private
importance: normal
source_repo: "django-unifi-portal"
related: []
tags: ["django-unifi-portal", "github", "private", "normal", "summary"]
---

### P1 — UniFi external portal requires post-auth MAC authorization - **Who hurts:** Operators of UniFi access points with guest policies who configure an external captive portal instead of UniFi's built-in hotspot manager. - **Pain today:** UniFi redirects unauthenticated guests to the external portal with query parameters (id = guest MAC, ap = AP MAC, url = original destination, ssid). After the guest proves identity, something must call the controller's authorize-guest command or the device remains blocked. Manual voucher systems do not tie authorization to individual user records. - **How this repo answers:** The UserAuthorizeView at guest/s/default/ is the UniFi landing path. After @login_required succeeds, the view reads MAC/AP/URL from the query string, persists MAC and login timestamp on the UnifiUser profile, instantiates UnifiClient, logs into the controller API, checks whether the MAC is already authorized, and if not posts cmd: authorize-guest with UNIFI_TIMEOUT_MINUTES from settings. Failure renders forbidden.html. - **Out of scope:** UniFi built-in voucher/hotspot UI; RADIUS integration; per-SSID rate limiting; automatic deauthorization scheduling beyond the minutes parameter.
