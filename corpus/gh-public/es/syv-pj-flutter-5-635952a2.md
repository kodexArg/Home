---
id: syv-pj-flutter-5-635952a2
title: "SyV PJ Flutter — universe-facing character viewer and Diseño Verde mobile client — 3. Product / idea"
visibility: public
importance: normal
source_repo: "syv-pj-flutter"
related: ["gh-syv-pj-flutter"]
tags: ["syv-pj-flutter", "github", "public", "normal", "summary"]
---
## 3. Product / idea

The mental model is **lore → dominio → interfaz**: The app is **the face of the universe** — steered in (2026-06-27) beyond a narrow "viewer" toward the **common front-end** for all SyV tools that spin out around the SSOT (character creator now, battle simulator later). Every feature should be conceived as a *view of the universe* (a ficha, an encounter, a facción), not a generic CRUD screen. Current runnable experience: 1. ( ) applies and opens . 2. **Home** — lore paragraph, cuerpo·mente·alma legend, bottom nav: *generar personaje* (live → empty ), *listado de personajes* (inert), *diseño verde* (live → ). 3. **Showcase** — scrollable catalog of every component with interactive demos (stats, switches, inputs, cards, chips, buttons, logo variants). 4. **Ficha** — header only; body intentionally empty until API-backed sections land. Architecture is **feature folders under **, single assembly point in (future router). Presentation package is isolated under for eventual extraction. **Documentation drift note:** , , and Etapa 1 sections still describe a **Linux desktop** target with (390×844 borderless window). Canonical and (F-4) state **mobile-first: Android primary, iOS secondary**, scaffold not maintained, removed. Current and match the mobile-first doc (simple , no dependency). Treat as authoritative for platform strategy.
