---
id: names-rand-8-8c1fa6cd
title: "Names.rand — fantasy and real-name desktop generator — 4. Technology stack"
visibility: private
importance: normal
source_repo: "names.rand"
related: []
tags: ["names.rand", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from manifests and source structure only. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.x (CI: 3.10; README recommends 3.8+) | appveyor.yml, README.md | | UI framework | Flet | requirements.txt, main.py | | Packaging | PyInstaller via flet pack | appveyor.yml build_script | | Data format | JSON syllable pools, plain-text name lists | names/fantasy/, names/real/ | | CI / release | AppVeyor matrix (VS2019, macOS, Ubuntu) | appveyor.yml | | License | GNU GPL v3+ | COPYING, README.md |
