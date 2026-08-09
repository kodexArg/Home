---
id: pycreadorpj-8-d72340ee
title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — 4. Technology stack"
visibility: private
importance: normal
source_repo: "PyCreadorPJ"
related: []
tags: ["pycreadorpj", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from requeriments.txt, flask_app.py, templates, and static data layout. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (shebang #!/bin/python3) | flask_app.py, creador_personajes.py | | Web framework | Flask 2.3.2 | requeriments.txt, flask_app.py | | Templates / UI | Jinja2, Bootstrap 5 + jQuery (CDN), custom CSS | templates/base.html, static/base_ryf.css | | Forms | WTForms 3.0.1, Bootstrap-Flask 2.2.0 | requeriments.txt, templates/form_*.html | | Data crunching | pandas 2.0.1, numpy 1.24.3 | requeriments.txt, creador_personajes.py | | Data | JSON + CSV game tables; pickle character saves | static/*.json, static/spanish-names/*.csv, static/pjs/*.pickle | | Infra / deploy | None in-repo; dev server app.run(debug=True, host="0.0.0.0") | flask_app.py | | AI / agents | None | — | | Tests | Ad-hoc worksheet script only | worksheets/test.py |
