---
id: syv-mcp-tools-7-fc35091e
title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — 3.2 Non-goals"
visibility: private
importance: normal
source_repo: "syv-mcp-tools"
related: []
tags: ["syv-mcp-tools", "github", "private", "normal", "summary"]
---

### 3.2 Non-goals - Not a web CMS, static site generator, or publishing pipeline for SyV content. - Not a search engine or vector index over the vault. - Not a general-purpose Markdown linter (no heading hierarchy, link checking, or spell check). - Does not use the Anthropic API at runtime despite listing anthropic and pydantic-ai as dependencies — those packages are declared in pyproject.toml but not imported in current source (possible future AI-assisted validation or leftover planning). - No .claude/, .docs/, or docs/ vault in this repo — agent instructions live in the parent SyV project.
