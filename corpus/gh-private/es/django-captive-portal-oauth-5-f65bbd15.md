---
id: django-captive-portal-oauth-5-f65bbd15
title: "Django Captive Portal OAuth — WiFi guest authentication via social login — 3. Product / idea"
visibility: private
importance: normal
source_repo: "django-captive-portal-oauth"
related: []
tags: ["django-captive-portal-oauth", "github", "private", "normal", "summary"]
---
## 3. Product / idea

The mental model is a **thin Django portal layer** sitting behind captive-portal hardware: 1. Guest connects to WiFi; the access point redirects HTTP to this Django app. 2. Guest lands on (home), sees a trilingual prompt to log in. 3. Guest follows the login link → allauth social flow (Google configured; Facebook planned). 4. On success, sends them back to , which displays a welcome message confirming internet access. 5. (Planned) UniFi integration via would authorize the client MAC/session on the controller after successful login. The repository is **small and incomplete**: there are no custom Django apps ( , packages are absent). Business logic is limited to Django admin, allauth, and a for the landing page. Settings contain a developer comment marking OAuth provider configuration as work-in-progress.
