---
id: names-rand-4-d517a18e
title: "Names.rand — fantasy and real-name desktop generator — P3 — Offline, cross-platform desktop delivery"
visibility: private
importance: normal
source_repo: "names.rand"
related: []
tags: ["names.rand", "github", "private", "normal", "summary"]
---

### P3 — Offline, cross-platform desktop delivery - **Who hurts:** Users who want a double-clickable tool without installing Python, and maintainers who need reproducible builds for three OS targets. - **Pain today:** Python GUI apps are hard to distribute to non-technical users. Platform-specific packaging is boilerplate-heavy. - **How this repo answers:** Flet provides a Flutter-backed UI from pure Python ( ). AppVeyor CI ( ) runs on Visual Studio 2019, macOS, and Ubuntu images, producing zip/tar.gz artifacts versioned at 0.2.0. manages a git tag for triggering builds. README documents Linux dependency for Flet 0.20+. - **Out of scope:** No auto-update mechanism, no installer/signing pipeline beyond AppVeyor artifacts, no mobile builds yet.
