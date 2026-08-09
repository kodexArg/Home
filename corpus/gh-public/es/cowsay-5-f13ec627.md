---
id: cowsay-5-f13ec627
title: "cowsay — deterministic ASCII cow renderer for AI agents — 3. Product / idea"
visibility: public
importance: normal
source_repo: "cowsay"
related: ["cowsay"]
tags: ["cowsay", "github", "public", "normal", "summary"]
---

## 3. Product / idea The repository is a **skills.sh-style agent skill package** wrapped in a minimal GitHub repo. The repo root holds marketing (README.md), license, demo image, and a skills/cowsay/ subtree that is the actual skill root after install. The mental model is a **pure function pipeline**: 1. **Input:** UTF-8 text (stdin, argv message, or heredoc) plus CLI flags. 2. **Dialog layer:** Normalize text, soft-wrap to display columns (not naive codepoint counts), build rounded Unicode box (╭─╮│╰╯) with minimum three text rows and width floored by cow silhouette. 3. **Art layer:** Load .cow resource, substitute face variables, append below the balloon. 4. **Output:** Single deterministic string to stdout. Agents enter **cowsay mode** when the user invokes /cowsay or equivalent; every subsequent reply is piped through the binary at terminal-aware width. Users can switch art (/cowsay tux), request thought bubbles (cowthink / --think), or exit back to normal chat.
