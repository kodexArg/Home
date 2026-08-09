---
id: syv-godot-4-4e790421
title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — P2 — Repeatable local dev for Godot + backend services"
visibility: private
importance: normal
source_repo: "syv-godot"
related: []
tags: ["syv-godot", "github", "private", "normal", "summary"]
---

### P2 — Repeatable local dev for Godot + backend services - **Who hurts:** Solo or small-team developers who must run Godot, a Python API, Redis, PostgreSQL, and a reverse proxy together every session. - **Pain today:** Manual container orchestration, missing health checks, and "did I start the server?" friction block iteration on a game that needs both GUI and headless processes. - **How this repo answers:** docker/docker-compose.yml defines syv-api, syv-redis, syv-db, and syv-traefik with healthchecks and Traefik routing for /api. Makefile wraps make dev, make test, make health, make psql, make redis-cli. scripts_py/setup.py verifies Docker, uv, Godot; copies docker/.env.example → docker/.env; builds containers. scripts_py/run_client.py (via run_client.sh) is a smart launcher: starts Docker if needed, waits for healthy services, launches Godot, optionally tears down on exit. Shell wrappers setup.sh and run_client.sh delegate to Python for single source of truth. - **Out of scope:** Production deployment, CI/CD pipelines (no .github/ workflows in tree), Steam packaging, or cloud hosting. Dev secrets in compose use placeholder values only.
