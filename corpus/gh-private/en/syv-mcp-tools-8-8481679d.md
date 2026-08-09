---
id: syv-mcp-tools-8-8481679d
title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — 4. Technology stack"
visibility: private
importance: normal
source_repo: "syv-mcp-tools"
related: []
tags: ["syv-mcp-tools", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python ≥3.12 | pyproject.toml requires-python | | Package manager | uv | pyproject.toml [tool.uv], uv.lock, mcp_server.bat uses uv run | | MCP framework | FastMCP (mcp ≥1.22) | mcp_server.py imports mcp.server.fastmcp | | Validation models | Pydantic 2 (BaseModel) | tools.py ModeloSalida | | Transport | SSE (Server-Sent Events) on port 8000 | mcp_server.py mcp.run(transport="sse"), mcp_server.bat | | HTTP stack (transitive) | FastAPI ≥0.110, Uvicorn | pyproject.toml deps (pulled by MCP SSE stack) | | AI SDK (declared, unused) | anthropic ≥0.75, pydantic-ai ≥1.26 | pyproject.toml only — no imports in *.py | | Config | python-dotenv (declared) | pyproject.toml; README mentions .env with ANTHROPIC_API_KEY but no dotenv usage in source | | Tests | None evident | No tests/ directory or test configs in tree | | CI / deploy | None evident | No .github/workflows/, Dockerfile, or IaC |
