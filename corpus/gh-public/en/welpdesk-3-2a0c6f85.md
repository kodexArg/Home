---
id: welpdesk-3-2a0c6f85
title: "Welp Desk — configurable multi-organization Django help-desk ticketing — P2 — Fast deployment with org-specific taxonomy pre-seeded"
visibility: public
importance: normal
source_repo: "welpdesk"
related: ["welpdesk"]
tags: ["welpdesk", "github", "public", "normal", "summary"]
---
### P2 — Fast deployment with org-specific taxonomy pre-seeded

- **Who hurts:** Teams rolling out a new help desk who would otherwise spend days manually entering dozens of issue types, categories, and org nodes through Django admin before the system is usable.
- **Pain today:** Greenfield ticketing installs start empty; every UDN, sector, category, and issue type must be typed by hand. Copy-paste from spreadsheets is error-prone and does not wire up permission groups.
- **How this repo answers:** declares the full hierarchy (UDNs, Sectors, IssueCategories, Issues) in YAML. On , loads this file, creates model rows, and assigns Django groups to each UDN and Sector. Documentation in explains customization limits (model names are fixed; each Issue belongs to one IssueCategory). Default role groups ( , , , ) receive curated Django permissions in . A real-world example targets fuel-station operations (DEBO, YPF, Soporte IT categories).
- **Out of scope:** Hot-reloading taxonomy without migration/restart; multi-format seed loaders beyond YAML (TOML/JSON mentioned in docs but only YAML loader implemented in ); UI for editing YAML inside the app.
