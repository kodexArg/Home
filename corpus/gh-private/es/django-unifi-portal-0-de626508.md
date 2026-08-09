---
id: django-unifi-portal-0-de626508
title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — Django UniFi Portal"
visibility: private
importance: normal
source_repo: "django-unifi-portal"
related: []
tags: ["django-unifi-portal", "github", "private", "normal", "summary"]
---
## Django UniFi Portal

> **Problem thesis (required):** When a guest connects to a UniFi wireless network with guest policy and an **external portal** configured, the access point redirects HTTP traffic to a captive portal server. That server must (1) authenticate the guest, (2) receive UniFi query parameters identifying the guest device MAC and access point, and (3) call the UniFi Controller API to **authorize-guest** for a configurable duration. This private repository is a **reusable Django application** ( ) that implements that full loop: Django username/password login, self-service registration with profile fields, Facebook OAuth2 sign-in, and programmatic MAC authorization against UniFi Controller versions 3–5. It originated as a fork of the open-source project and is packaged for internal reuse with a demo project illustrating integration.
