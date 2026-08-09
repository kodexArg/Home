---
id: syv-mcp-tools-2-8a35e6fc
title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — P1 — Enforcing SyV Markdown metadata schema at edit time"
visibility: private
importance: normal
source_repo: "syv-mcp-tools"
related: []
tags: ["syv-mcp-tools", "github", "private", "normal", "summary"]
---

### P1 — Enforcing SyV Markdown metadata schema at edit time - **Who hurts:** SyV writers, lore editors, and AI agents generating or refactoring Markdown files across the six top-level content zones (0_proyecto through 5_aventuras). - **Pain today:** The SyV metadata guide (0_proyecto/guias-para-colaboradores/guia-de-metadatos.md in the parent repo) defines precise rules — Spanish field names, strict field ordering, vertical list syntax for tags/facciones/spoilers, conditional personaje fields — but nothing prevents non-compliant frontmatter from landing in the vault. Manual review is slow and inconsistent. - **How this repo answers:** The validar_metadatos_markdown MCP tool runs a deterministic validator (tools.py) that checks file existence, YAML frontmatter presence, key casing, field order, required fields (titulo, carpeta, descripcion), list formatting, and personaje-specific conditional rules. Returns structured JSON with status (bool) and message (error detail on failure). - **Out of scope:** Does not validate Markdown body content, internal links, spoiler policy in prose, or render/publish pipelines. Does not modify files — read-only validation.
