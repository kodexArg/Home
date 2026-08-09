---
id: astro-drf-aws-4-bf075f49
title: "astro-drf-aws — Astro SSR + Django DRF template on AWS Fargate — P3 — Safe conversational UI (router vs assistant split)"
visibility: public
importance: high
source_repo: "astro-drf-aws"
related: ["astro-drf-aws"]
tags: ["astro-drf-aws", "github", "public", "high", "summary"]
---

### P3 — Safe conversational UI (router vs assistant split) - **Who hurts:** Product owners wanting chat-like navigation without opening prompt-injection, unbounded LLM prose, or actuator abuse on the choosing path. - **Pain today:** Monolithic chatbots mix intent classification with free-text generation, making security arguments expensive; menus hardcoded in prompts drift from actual permissions. - **How this repo answers:** Two-tier architecture ( , , ): **router** ( ) — Nova Micro on Bedrock, JSON-schema constrained enum, temperature 0, server-built permission-filtered menu, four closed outcomes, audit rows; **assistant** ( ) — page-context free-text answers with registry-validated links only, no actuators. Kill switches / ; rate-abuse guard via DatabaseCache (no Redis). - **Out of scope:** The future router-mediated generating path (designed as possible, not shipped); multi-turn conversation memory; arbitrary tool-calling agents.
