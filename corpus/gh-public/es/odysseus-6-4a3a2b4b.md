---
id: odysseus-6-4a3a2b4b
title: "Odysseus — self-hosted AI workspace for chat, agents, and local model workflows — 3. Product / idea (2)"
visibility: public
importance: high
source_repo: "odysseus"
related: ["odysseus"]
tags: ["odysseus", "github", "public", "high", "summary"]
---

Non-admin users are blocked from shell, MCP, email send, vault, and model serving per core/auth.py and src/tool_security.py. **Research path:** routes/research_routes.py and services/research/ run multi-step web research using SearXNG and optional provider APIs, producing sanitized HTML/Markdown reports (src/visual_report.py). **Compare path:** blind side-by-side model evaluation with synthesis (routes/compare_routes.py).
