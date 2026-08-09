---
id: ryf-2-0b0b89bb
title: "Subordinación y Valor — TTRPG character companion web app — P1 — Immersive character discovery for a narrative TTRPG"
visibility: private
importance: normal
source_repo: "ryf"
related: []
tags: ["ryf", "github", "private", "normal", "summary"]
---

### P1 — Immersive character discovery for a narrative TTRPG - **Who hurts:** Players and GMs running *Subordinación y Valor* sessions who need quick, atmospheric access to pre-generated NPCs and PCs without breaking immersion. - **Pain today:** Character sheets live as disconnected prose, JSON blobs, or AI-generated drafts with no unified visual presentation; secrets and public bios are hard to toggle cleanly at the table. - **How this repo answers:** The SvelteKit frontend renders a horizontal **card deck** ( , ) with portrait art, RyF stat bars ( ), occupation/faction labels, and expandable biography/secret sections. Double-clicking a card stores the character in and navigates to a full detail view ( at ). Static seed data in demonstrates the intended UX while the API path matures. - **Out of scope:** Full character creation wizard, combat tracker, dice roller, or live multiplayer session tooling.
