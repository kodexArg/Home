---
id: docs-portal-8-d7cd24b1
title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — 3.2 Non-goals"
visibility: private
importance: high
source_repo: "docs-portal"
related: []
tags: ["docs-portal", "github", "private", "high", "summary"]
---

### 3.2 Non-goals - Not a general-purpose CMS or wiki server with server-side rendering or databases. - Not a Workers application (Pages-only by token/policy choice documented in CLOUDFLARE.md). - Not responsible for implementing HTTP APIs described inside vault content (e.g. SyV API.md is a **contract document** for downstream implementers, not a live service in this repo). - Does not host content on the dev DNS subtree without explicit sub-zone delegation workflow. - .claude/ is gitignored locally and absent from the remote tree; agent config lives in .agents/ instead.
