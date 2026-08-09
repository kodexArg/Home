---
id: syv-pj-flutter-5-635952a2
title: "SyV PJ Flutter — universe-facing character viewer and Diseño Verde mobile client — 3. Product / idea"
visibility: public
importance: normal
source_repo: "syv-pj-flutter"
related: ["gh-syv-pj-flutter"]
tags: ["syv-pj-flutter", "github", "public", "normal", "summary"]
---

## 3. Product / idea The mental model is **lore → dominio → interfaz**: The app is **the face of the universe** — steered in PRD.md (2026-06-27) beyond a narrow "viewer" toward the **common front-end** for all SyV tools that spin out around the SSOT (character creator now, battle simulator later). Every feature should be conceived as a *view of the universe* (a ficha, an encounter, a facción), not a generic CRUD screen. Current runnable experience: 1. SyvPjApp (lib/app/app.dart) applies syvTheme() and opens HomeView. 2. **Home** — lore paragraph, cuerpo·mente·alma legend, bottom nav: *generar personaje* (live → empty FichaView), *listado de personajes* (inert), *diseño verde* (live → ShowcaseView). 3. **Showcase** — scrollable catalog of every Syv* component with interactive demos (stats, switches, inputs, cards, chips, buttons, logo variants). 4. **Ficha** — SyvScreen header only; body intentionally empty until API-backed sections land. Architecture is **feature folders under lib/features/**, single assembly point in app/app.dart (future router). Presentation package is isolated under packages/syv_ui/ for eventual extraction. **Documentation drift note:** README.md, AGENTS.md, and PRD.md Etapa 1 sections still describe a **Linux desktop** target with window_manager (390×844 borderless window). Canonical docs/ARCHITECTURE.md and docs/REQUIREMENTS.md (F-4) state **mobile-first:
