---
id: alvs-registros-libros-societario-6-109586af
title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — P3 — Operators need a governed full-stack harness, not ad-hoc feature "
visibility: private
importance: high
source_repo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG"
related: []
tags: ["alvs-registros-libros-societarios-kodexarg", "github", "private", "high", "summary"]
---

### P3 — Operators need a governed full-stack harness, not ad-hoc feature sprawl - **Who hurts:** kodexArg maintainers and AI agents extending a large, multi-domain legal application on shared ALVS AWS infrastructure. - **Pain today:** Repositories with 170+ declared HTTP endpoints, 136 backend TDD documents, extensive frontend test suites, M365 capability, Bedrock router, and strict RBAC are easy to break with undeclared routes, env-var drift, or documentation rot. - **How this repo answers:** The project inherits the complete astro-drf-aws harness: Obsidian-flavored docs/ vault, 24 ADRs mirrored into .claude/rules/, guardian subagents (astro-drf-aws-prd, -adr, -api), enforcement hooks (check_api.py, check_variables.py, dispatch_guardians.py, load_ssot.py), vendored skills under .claude/skills/, and the markdown-vault-docs MCP for vault-first doc reads. The ABC gate requires every change to align with docs/PRD.md, ADRs, and docs/API.md. Backend work follows API row → TDD → models; frontend work follows BDD entries in docs/bdds/. - **Out of scope:** Being a public reusable template — this is a private ALVS production application that still carries template reference defaults (notably PROJECT_SLUG=astro-drf-aws in deploy workflow seeds) pending full rename to a project-specific slug.
