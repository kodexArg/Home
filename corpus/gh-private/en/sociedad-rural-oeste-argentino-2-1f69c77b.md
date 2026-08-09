---
id: sociedad-rural-oeste-argentino-2-1f69c77b
title: "SROA — institutional website and moderated institutional blog — P1 — No owned institutional digital presence"
visibility: private
importance: normal
source_repo: "sociedad-rural-oeste-argentino"
related: []
tags: ["sociedad-rural-oeste-argentino", "github", "private", "normal", "summary"]
---
### P1 — No owned institutional digital presence

- **Who hurts:** SROA leadership, Comisión Directiva, allied member entities, and external stakeholders (press, provincial/national officials) who need authoritative institutional information.
- **Pain today:** Without a dedicated site, positioning as a technical and guild reference for western Argentine livestock depends on person-to-person outreach; the 30-year strategic plan, authorities roster, member entities, and public positions lack a stable canonical channel ( objectives OB-01 through OB-03).
- **How this repo answers:** Public institutional sections (about, authorities, member entities, strategic plan) are modeled as entities and member cards, pre-rendered or SSR-served from Astro consuming Django catalog endpoints. Content is editable by via Django admin for low-frequency entities ( , , ) and via the Astro admin panel for high-volume editorial work ( , ).
- **Out of scope:** Full observatory/open-data portal, legal/fiscal repository, interactive member directory, and producer services portal — all explicitly deferred in PRD §5.2 roadmap.
