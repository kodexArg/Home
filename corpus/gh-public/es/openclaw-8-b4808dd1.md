---
id: openclaw-8-b4808dd1
title: "OpenClaw — personal multi-channel AI assistant — 4. Technology stack"
visibility: public
importance: high
source_repo: "openclaw"
related: ["openclaw"]
tags: ["openclaw", "github", "public", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Node ≥22.12, TypeScript ESM | package.json engines, tsconfig.json | | Package manager | pnpm 10 (bun supported for dev) | package.json packageManager, pnpm-workspace.yaml | | Agent runtime | pi-mono stack (pi-agent-core, pi-ai, pi-coding-agent, pi-tui) | package.json dependencies | | Gateway transport | WebSocket RPC + Express 5 HTTP | src/gateway/, src/gateway/server-http.ts | | Control UI | Vite + Lit | ui/package.json, ui/vite.config.ts | | Native apps | Swift (macOS, iOS), Kotlin/Android Gradle | apps/macos/, apps/ios/, apps/android/ | | Channel SDKs | grammY, Baileys, Bolt, discord.js, signal-cli wrappers, etc. | package.json, src/telegram, src/discord, extensions/* | | Browser automation | playwright-core | package.json, src/browser/ | | Media / images | sharp, pdfjs-dist, file-type | package.json, src/media/ | | Config | JSON5 file at ~/.openclaw/openclaw.json | docs/gateway/configuration.md | | Persistence | JSONL session transcripts, SQLite (memory plugins), local credential stores | docs/concepts/agent.md, extensions/memory-* | | Infra / deploy | Docker Compose, toml, Render.yaml, Nix (sibling repo), GitHub Actions | docker-compose.yml, fly.toml, .github/workflows/ | | AI / agents | Skills, plugins, ACP SDK, mcporter for MCP |
