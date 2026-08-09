---
id: syv-game-system-3-7d20c2d9
title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — P2 — Deterministic combat vs. immersive narrative"
visibility: private
importance: normal
source_repo: "syv-game-system"
related: []
tags: ["syv-game-system", "github", "private", "normal", "summary"]
---

### P2 — Deterministic combat vs. immersive narrative - **Who hurts:** Players and designers who want tactically fair, replayable combat logs but also rich "Cronista del Frente" battle reports instead of raw dice tables. - **Pain today:** Mixing narrative generation into combat math makes outcomes hard to audit, balance, or replay; pure numbers bore players. - **How this repo answers:** The **Motor de Resolución «Fricción»** is specified as a deterministic/entropic resolver that simulates up to six one-hour combat rounds per six-hour turn, producing a structured log conforming to . A separate documented pipeline ( ) sends that JSON to the **Gemini API** with system instructions for trench-realism tone, faction jargon, and activation of per-soldier H.I.T.O.S. aspects (Concepto, Perk, Complicación). Math lives in ; story lives in the IA chapter — never merged in this repo's source tree. - **Out of scope:** Actual Gemini API integration code, API keys, or a deployed narrative service. Only the contract and prompt shape are documented.
