---
id: figus-3-76d3edc5
title: "Figus — World Cup 2026 Panini sticker album tracker and local trade finder — P2 — Discovering who has your missing stickers nearby"
visibility: public
importance: normal
source_repo: "figus"
related: ["figus"]
tags: ["figus", "github", "public", "normal", "summary"]
---

### P2 — Discovering who has your missing stickers nearby - **Who hurts:** Collectors with duplicates who want to trade efficiently rather than broadcasting "tengo repetidas" into large chat groups without knowing reciprocity or distance. - **Pain today:** Informal WhatsApp/Telegram groups are noisy; you cannot easily filter "who within 50 km has ARG-17 as a duplicate and might want something I have extra." Distance and mutual interest are manual mental work. - **How this repo answers:** Thirty **mock users** ( ) are seeded across Argentina and neighboring capitals with procedurally generated inventories and lists. lists only **tradeable duplicates** (count > 1), sorted by haversine distance from the user's profile coordinates. scores missing stickers by match count, proximity, reciprocity (how many of the other user's wants overlap your duplicates), and rarity bonus—surfacing ranked trade leads on **Sugerencias** and the home dashboard. **Mapa** ( ) plots collector pins on a Leaflet + OpenStreetMap layer. - **Out of scope:** In-app messaging, escrow, shipping logistics, reputation verification, or real user registration—the footer explicitly labels the build as **prototipo frontend · mock data**.
