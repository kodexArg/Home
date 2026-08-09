---
id: fsk-showers-8-01f84011
title: "FSK Showers — Flask CRUD for roadside shower registrations — 4.1 Notable dependencies (curated)"
visibility: private
importance: normal
source_repo: "fsk-showers"
related: []
tags: ["fsk-showers", "github", "private", "normal", "summary"]
---

### 4.1 Notable dependencies (curated) - Flask — core HTTP app and blueprint routing. - Flask-SQLAlchemy — declarative models and session management for User, Role, Client, Plan, Ticket. - Flask-Migrate / alembic — database migration support (migration directory gitignored). - Flask-WTF — CSRF-protected TicketForm. - PyMySQL — MySQL dialect for SQLALCHEMY_DATABASE_URI. - djlint — HTML/Jinja template linting in dev workflows. - flask_bootstrap — imported in app/__init__.py for Bootstrap asset helpers and wtf.quick_form; **not listed in requirements.txt** (likely install gap).
