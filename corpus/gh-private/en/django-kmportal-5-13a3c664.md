---
id: django-kmportal-5-13a3c664
title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — 3. Product / idea"
visibility: private
importance: normal
source_repo: "django-kmportal"
related: []
tags: ["django-kmportal", "github", "private", "normal", "summary"]
---

## 3. Product / idea The mental model is a **two-surface Django monolith** sharing one MySQL database and one set of domain models: 1. **Customer portal (app)** — Marketing pages (home, about, contact), OAuth login, authenticated user_home, and operational modules: fuel orders, ExtraCash, company profile, vehicles (drivers/tractors/trailers). URLs under i18n_patterns so paths are language-prefixed (default es). 2. **Staff intranet (staff)** — Non-i18n paths under staff/ for pump operators: home, QR scanner, refueling CRUD, order list, ExtraCash list and attend. Uses Django auth LoginView with CustomLoginForm, not allauth. 3. **Shared infrastructure** — portal/portal/settings.py configures MySQL, allauth, compressor, tailwind theme app, WhiteNoise static files, and S3 document storage. api app is installed but views are empty and REST routes are commented out in urls.py. Orders move through a lifecycle: customer creates FuelOrders → generates operation_code and QR → operator scans QR on staff side → creates Refuelings linked one-to-one → uploads Documents → marks finished. ExtraCash follows a parallel model with cash amounts and image proof uploads. Internationalization uses Django's locale/ PO files plus a custom translations.json + translations.py pipeline (makemessages → JSON merge → compilemessages) supporting **en**, **es**, **pt**.
