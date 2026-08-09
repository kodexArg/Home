---
id: dj-crudo-3-7206cc3c
title: "dj-crudo — Django WiFi captive portal and survey CRUD — P2 — WiFi captive portal with social login"
visibility: private
importance: normal
source_repo: "dj-crudo"
related: []
tags: ["dj-crudo", "github", "private", "normal", "summary"]
---
### P2 — WiFi captive portal with social login

- **Who hurts:** WiFi hotspot operators who need visitors to authenticate before granting Internet access, with a lightweight branded landing page.
- **Pain today:** Commercial captive-portal appliances are expensive; rolling OAuth from scratch is tedious; trilingual messaging (Spanish, Portuguese, English) is often bolted on late.
- **How this repo answers:** The root route ( ) renders inside a Bootstrap base template titled "KM1107 - WiFi Portal". Authenticated users see welcome/connected messages in three languages; unauthenticated users are prompted to log in. **django-allauth** provides routes with **Google** as the configured social provider. and point to . Email is required for account authentication ( , ). A stub function in hints at future WiFi-grant logic that is not implemented.
- **Out of scope:** RADIUS integration, MAC-address bypass lists, bandwidth shaping, session timeout enforcement, and automated iptables ACCEPT rules wired to successful login (the pipe hook exists but is commented out).
