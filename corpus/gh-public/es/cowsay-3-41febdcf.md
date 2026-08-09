---
id: cowsay-3-41febdcf
title: "cowsay — deterministic ASCII cow renderer for AI agents — P2 — Dependency and sandbox friction"
visibility: public
importance: normal
source_repo: "cowsay"
related: ["cowsay"]
tags: ["cowsay", "github", "public", "normal", "summary"]
---

### P2 — Dependency and sandbox friction - **Who hurts:** Agent sandboxes without apt, air-gapped environments, and skills installers that forbid pip/network during skill activation. - **Pain today:** System cowsay may be missing; Python ports often pull dependencies; ad-hoc scripts duplicate wrap logic poorly and fail on East Asian width or combining marks. - **How this repo answers:** Zero third-party packages — only Python 3 standard library (argparse, pathlib, unicodedata, subprocess in tests). Install via skills ecosystem (npx skills add kodexArg/cowsay). No network at runtime. - **Out of scope:** Packaging as a PyPI wheel, Docker images, or cross-language bindings — the deliverable is a skill tree with an executable script.
