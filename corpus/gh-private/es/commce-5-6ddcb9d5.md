---
id: commce-5-6ddcb9d5
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — 3. Product / idea"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---

## 3. Product / idea is a **small multi-app Django project** with one settings module ( ), root URLconf ( ), and three domain apps mounted at path prefixes. There is no REST API layer; every feature is HTML templates plus minimal view logic. Mental model for users: 1. **Home** ( ) — landing page showing login state; link to temperatura module (primary entry after auth). 2. **Comunicaciones** ( ) — internal message board. 3. **Estadisticas** ( ) — machine inventory table and benefits chart scaffold. 4. **Temperatura** ( ) — environmental charts (default route = 24h view). 5. **Admin** ( ) — Django admin for and standard auth models. 6. **Accounts** ( ) — stock Django auth URLs (login, logout). Each module duplicates a similar Bootstrap 3 nav bar linking all three modules plus auth controls. Spanish UI strings ( language code). Time zone is UTC with . Data topology: **two MySQL databases** on localhost (configurable host in settings). Default DB holds slot data and Django-managed tables (auth, sessions, ). Secondary holds temperature readings; only reads route there via .
