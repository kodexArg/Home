---
id: django-kmportal-1-c8824ed4
title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — 1. Identity"
visibility: private
importance: normal
source_repo: "django-kmportal"
related: []
tags: ["django-kmportal", "github", "private", "normal", "summary"]
---
## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | |
| Visibility | |
| Default branch | |
| One-line pitch | Enterprise fuel-station portal where B2B fleet customers order fuel online and pump operators fulfill orders and ExtraCash requests through a staff intranet, with Spanish-first i18n and Google OAuth company binding. |
| Audience | B2B fleet dispatchers and company users (customer portal); pump operators and station staff (staff intranet); Django admins (admin site); internal operators deploying on EC2 with RDS MySQL. |
The product name in README is **KM 1151 Enterprise Portal**. It targets Grupo ALVS / KM 1151 operational context (Argentina, Spanish primary language). Customer users authenticate via django-allauth social providers; staff use a traditional username/password login restricted to the **Pump Operators** Django group.
