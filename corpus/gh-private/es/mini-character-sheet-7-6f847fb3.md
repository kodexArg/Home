---
id: mini-character-sheet-7-6f847fb3
title: "mini-character-sheet — Warhammer stat overlay on miniature photos — 4. Technology stack"
visibility: private
importance: low
source_repo: "mini-character-sheet"
related: []
tags: ["mini-character-sheet", "github", "private", "low", "summary"]
---

## 4. Technology stack Derived from requirements.txt and testing.py only. No pyproject.toml, Dockerfile, or CI manifests present. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (version not pinned) | testing.py, GitHub primaryLanguage | | Image I/O & drawing | Pillow 9.4.0 | requirements.txt, from PIL import Image, ImageDraw, ImageFont | | Numerics / CV (unused) | numpy 1.24.2, opencv-python 4.7.0.72 | requirements.txt only — no imports in testing.py | | Frontend / API / data | none | — | | Infra / deploy | none — local script execution | — | | AI / agents | none | .claude/ absent | | Tests | none formal; testing.py name suggests manual trial | filename only |
