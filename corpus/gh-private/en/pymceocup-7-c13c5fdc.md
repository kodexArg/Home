---
id: pymceocup-7-c13c5fdc
title: "PyMceOcup — Casino Mendoza slot occupancy ETL — 4. Technology stack"
visibility: private
importance: low
source_repo: "PyMceOcup"
related: []
tags: ["pymceocup", "github", "private", "low", "summary"]
---

## 4. Technology stack No requirements.txt, pyproject.toml, or Pipfile is present. Dependencies are inferred from import statements only. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 | .gitignore (standard Python template); GitHub primaryLanguage | | Data processing | pandas | join_csvs.py | | Email / IMAP | imap_tools | download_emails.py | | Excel output | pandas Excel writer (requires openpyxl or xlsxwriter at runtime) | join_csvs.py → to_excel | | Frontend / API | none | app.py empty | | Data | flat CSV + XLSX on disk | csvs/, ocupacion.xlsx | | Infra / deploy | none (manual scripts) | no CI, Docker, or IaC | | AI / agents | none | .claude/ not present | | Tests | none | no test configs |
