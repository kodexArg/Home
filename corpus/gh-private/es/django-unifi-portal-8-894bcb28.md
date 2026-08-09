---
id: django-unifi-portal-8-894bcb28
title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization — 4. Technology stack"
visibility: private
importance: normal
source_repo: "django-unifi-portal"
related: []
tags: ["django-unifi-portal", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 2.7.13 declared; demo uses Django 2.2 | runtime.txt, demo/requirements.txt | | Web framework | Django ≥1.10 (library); Django 2.2.27 (demo) | setup.py, demo/requirements.txt | | UI / forms | django-material, Font Awesome static assets, jQuery 2.1.1 | setup.py, django_unifi_portal/forms.py, django_unifi_portal/static/ | | Auth / OAuth | django.contrib.auth, social-django (Facebook), oauth2_provider, rest_framework_social_oauth2 | demo/demo_unifi_portal/unifi_settings.py, django_unifi_portal/urls.py | | HTTP client | requests, requests-toolbelt SSLAdapter, cookielib cookie jar | django_unifi_portal/unifi_client.py | | Data | SQLite in demo; Django ORM models + migrations | demo/demo_unifi_portal/settings.py, django_unifi_portal/migrations/ | | Media | Pillow ImageField for profile pictures | setup.py, django_unifi_portal/models.py | | Infra / deploy | None in tree — manual Apache/nginx + port 8443 forwarding per README | README.md | | AI / agents | None — .claude/ and .docs/ absent | tree scan | | Tests | unittest-style tests in demo | demo/tests/ |
