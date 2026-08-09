---
id: syv-mcp-tools-6-9b148fa2
title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "syv-mcp-tools"
related: []
tags: ["syv-mcp-tools", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Agent pre-commit check:** Before saving a SyV Markdown file, an MCP-connected agent calls validar_metadatos_markdown with the file path; on status: false, reads message and fixes the specific line/format error. 2. **Metadata-aware navigation:** An agent calls obtener_metadatos_markdown to learn a document's carpeta, tags, and region before deciding how to cross-link or summarize it. 3. **Operator debugging:** Maintainer runs mcp_server.bat (Windows) or uv run mcp_server.py, pipes stderr through reverse_logger.py to capture reverse-chronological MCP traffic in mcp_server.log.
