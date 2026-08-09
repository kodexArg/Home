---
id: syv-game-system-5-d891049f
title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — 3. Product / idea"
visibility: private
importance: normal
source_repo: "syv-game-system"
related: []
tags: ["syv-game-system", "github", "private", "normal", "summary"]
---

## 3. Product / idea SyV is a **hex-grid WEGO wargame** where two players (MVP: symmetric Confederación Azul vs. Ejército Rojo) command **escuadras** (squad tokens) on a map where **1 hex = 1 km**. A full in-fiction day spans four six-hour strategic turns (Mañana, Tarde, Noche, Madrugada). Each turn has three phases: 1. **Fase I · Mando** — simultaneous secret order assignment from a limited pool tied to leadership stats. 2. **Fase II · Combate** — orders revealed; movement by initiative; collisions trigger individual combat resolved hour-by-hour (up to 6 hours) by «Fricción». 3. **Fase III · Reabastecimiento** — logistics, recovery (e.g. 1d4 restoration), supply checks. Individual **unidades** (soldiers) have FIS/TAC/MEN attributes, H.I.T.O.S. aspect phrases, tags, weapons, and health — but only **escuadras** occupy hexes. Combat uses **3d10 roll-under** with median (standard), min (favorable), or max (desfavorable) selection; triple-zero is heroic crit with automatic in-match XP; triple-nine is catastrophic fumble. The repository is structured as an **Obsidian vault** (.obsidian/ config present) with three top-level zones: - **reglamento/** — numbered rule chapters from introduction through initiative, dice, combat, and future plans. - **arquitectura/** — JSON schemas plus mathematical "píldoras" for designers and implementers. - **lore/** — factions, default map, and named
