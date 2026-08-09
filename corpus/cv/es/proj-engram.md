---
id: proj-engram
title: "Engram — memoria persistente para agentes"
related: ["engram", "skill-ia-agentes"]
tags: ["engram", "memoria", "memory", "agentes", "go", "golang", "sqlite", "fts5", "mcp", "tui", "cli", "contexto", "ventana de contexto", "largo plazo"]
---
Engram es un sistema de memoria persistente agnóstico del agente, pensado para agentes de programación con IA. Está escrito en Go como un binario de alto rendimiento, usa SQLite con búsqueda full-text FTS5, y expone servidor MCP, API HTTP, CLI y una TUI interactiva. Resuelve el problema de la ventana de contexto: memoria de largo plazo fuera del modelo.
