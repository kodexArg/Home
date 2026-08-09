---
id: engram-8-ca17cc97
title: "engram — persistent memory for AI coding agents — 4. Technology stack"
visibility: public
importance: normal
source_repo: "engram"
related: ["engram"]
tags: ["engram", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Go 1.25, CGO_ENABLED=0 release builds | go.mod, .goreleaser.yaml, .github/workflows/ci.yml | | Persistence | SQLite via /sqlite (pure Go); WAL mode; FTS5 virtual tables | internal/store/store.go, DOCS.md | | Search | FTS5 on observations and prompts; trigger-synced virtual tables | DOCS.md § Database Schema | | Agent protocol | MCP stdio (mark3labs/mcp-go) | internal/mcp/mcp.go, go.mod | | HTTP API | stdlib net/http ServeMux, JSON handlers | internal/server/server.go | | TUI | Bubbletea v1.3, Lipgloss, Bubbles | go.mod, internal/tui/ | | UI templates | templ | go.mod (/a-h/templ) | | Plugins | TypeScript OpenCode plugin; Claude Code hooks + MCP JSON | plugin/opencode/engram.ts, plugin/claude-code/ | | Obsidian plugin | TypeScript + esbuild (separate from Go binary) | plugin/obsidian/package.json | | Testing | go test ./...; E2E tag for server package; dockertest in deps | .github/workflows/ci.yml, go.mod | | Release | GoReleaser — linux/darwin/windows amd64/arm64 archives | .goreleaser.yaml, .github/workflows/release.yml | | CI | GitHub Actions — unit + e2e on Go 1.25 | .github/workflows/ci.yml |
