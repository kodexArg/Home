---
id: syv-mcp-tools-5-a2bdc338
title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — 3. Product / idea"
visibility: private
importance: normal
source_repo: "syv-mcp-tools"
related: []
tags: ["syv-mcp-tools", "github", "private", "normal", "summary"]
---
## 3. Product / idea

The central idea is a **thin MCP adapter** over a pure-Python metadata validation library: The validator encodes the SyV metadata contract as code: ten ordered fields ( → ), three list-type fields requiring vertical syntax, prohibition of English keys ( , , ), and personaje detection logic (presence of or triggers both being required). This is the same ruleset documented in the parent project's metadata guide, but executable.
