---
id: django-kmportal-5-13a3c664
title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — 3. Product / idea"
visibility: private
importance: normal
source_repo: "django-kmportal"
related: []
tags: ["django-kmportal", "github", "private", "normal", "summary"]
---
## 3. Product / idea

The mental model is a **two-surface Django monolith** sharing one MySQL database and one set of domain models: 1. **Customer portal ( )** — Marketing pages (home, about, contact), OAuth login, authenticated , and operational modules: fuel orders, ExtraCash, company profile, vehicles (drivers/tractors/trailers). URLs under so paths are language-prefixed (default ). 2. **Staff intranet ( )** — Non-i18n paths under for pump operators: home, QR scanner, refueling CRUD, order list, ExtraCash list and attend. Uses Django auth with , not allauth. 3. **Shared infrastructure** — configures MySQL, allauth, compressor, tailwind theme app, WhiteNoise static files, and S3 document storage. app is installed but views are empty and REST routes are commented out in . Orders move through a lifecycle: customer creates → generates and QR → operator scans QR on staff side → creates linked one-to-one → uploads → marks finished. ExtraCash follows a parallel model with cash amounts and image proof uploads. Internationalization uses Django's PO files plus a custom + pipeline (makemessages → JSON merge → compilemessages) supporting **en**, **es**, **pt**.
