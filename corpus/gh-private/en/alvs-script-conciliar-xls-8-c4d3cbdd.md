---
id: alvs-script-conciliar-xls-8-c4d3cbdd
title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — 4. Technology stack"
visibility: private
importance: normal
source_repo: "alvs-script-conciliar-xls"
related: []
tags: ["alvs-script-conciliar-xls", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from source imports and file layout only; no requirements.txt, pyproject.toml, or lockfile exists in the tracked tree. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (type hints use tuple[...] and DataFrame \| None syntax) | gui.py, logic.py | | Data processing | pandas | import pandas as pd in both modules | | Excel I/O | pandas read_excel / to_excel (typically backed by openpyxl) | gui.py import helpers, generate_output | | GUI | tkinter + scrolledtext, filedialog, messagebox | gui.py | | Backend / API | none | no HTTP modules | | Data | in-memory DataFrames only; file-based Excel | logic.py, gui.py | | Infra / deploy | local desktop execution | no CI, Docker, or IaC | | AI / agents | none | .claude/ not present | | Tests | none evident | no tests/ or test configs |
