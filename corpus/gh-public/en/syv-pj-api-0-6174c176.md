---
id: syv-pj-api-0-6174c176
title: "SyV Personajes API — procedural character engine (FastAPI + Cloudflare Worker) — syv-pj-api"
visibility: public
importance: high
source_repo: "syv-pj-api"
related: ["gh-syv-pj-api"]
tags: ["syv-pj-api", "github", "public", "high", "summary"]
---
## syv-pj-api

> **Problem thesis (required):** This repository is the **backend motor** for the tabletop RPG *Subordinación y Valor* (SyV). It centralizes procedural character generation, HTTP contract enforcement, canonical persistence, and milestone-driven sheet mutation behind a **Spanish snake_case HTTP surface** defined in the sibling spec repo . Frontends (web, desktop, Godot, agents) consume the API; this repo does not render UI. It solves the pain of duplicating game rules in every client, of non-reproducible random draws, and of lacking a swappable persistence layer from local SQLite dev to Cloudflare D1 production on the same domain model.
