---
id: creadorpj-4-8d1eb65d
title: "CreadorPJ — random character sheet generator for Subordinación y Valor — P3 — Scenario reference scattered outside the play session"
visibility: private
importance: normal
source_repo: "CreadorPJ"
related: []
tags: ["creadorpj", "github", "private", "normal", "summary"]
---

### P3 — Scenario reference scattered outside the play session - **Who hurts:** GMs running published or draft SyV scenarios who need location prose, NPC roster blurbs, and sample dialogue at hand. - **Pain today:** Lore and scenario text may live in separate design repos or notebooks; switching context mid-session breaks pacing. - **How this repo answers:** static/historia.json embeds multiple named scenarios (e.g. asylum, hotel, embassy, police/intelligence sites, sewer basements) with structured fields: Localización (paragraph array), Personajes (name → description lines), and Diálogos (name → quote lines). The /historia route and historia.html template provide a dropdown browser. static/images/mapa.png is shown via /mapa for geographic orientation. - **Out of scope:** Dynamic state tracking for scenario progression, combat resolution, or the WEGO turn engine documented in syv-game-system.
