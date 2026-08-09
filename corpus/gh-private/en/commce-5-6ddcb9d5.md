---
id: commce-5-6ddcb9d5
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — 3. Product / idea"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---

## 3. Product / idea ComMCE is a **small multi-app Django project** with one settings module (ComMCE/settings.py), root URLconf (ComMCE/urls.py), and three domain apps mounted at path prefixes. There is no REST API layer; every feature is HTML templates plus minimal view logic. Mental model for users: 1. **Home** (/) — landing page showing login state; link to temperatura module (primary entry after auth). 2. **Comunicaciones** (/comunicaciones/) — internal message board. 3. **Estadisticas** (/estadisticas/) — machine inventory table and benefits chart scaffold. 4. **Temperatura** (/temperatura/) — environmental charts (default route = 24h view). 5. **Admin** (/admin/) — Django admin for Post and standard auth models. 6. **Accounts** (/accounts/) — stock Django auth URLs (login, logout). Each module duplicates a similar Bootstrap 3 nav bar linking all three modules plus auth controls. Spanish UI strings (es-es language code). Time zone is UTC with USE_TZ = False. Data topology: **two MySQL databases** on localhost (configurable host in settings). Default DB holds slot data and Django-managed tables (auth, sessions, Comunicaciones_post). Secondary db_temp holds temperature readings; only TbTemperatura reads route there via DATABASE_ROUTERS.
