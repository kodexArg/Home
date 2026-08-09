---
id: multimedia-handler-for-rpi-7-3450bd7e
title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet — 4. Technology stack"
visibility: private
importance: normal
source_repo: "multimedia-handler-for-rpi"
related: []
tags: ["multimedia-handler-for-rpi", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from requirements.txt, app.py, forms.py, utils.py, and templates. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3, Flask 2.1.2 | requirements.txt, app.py | | Web framework | Flask + Jinja2 3.1 | app.py, templates/ | | Forms / CSRF | Flask-WTF 1.0.1, WTForms 3 | forms.py | | Frontend | Bootstrap 5 via CDN links in templates/base.html | templates/base.html | | Media processing | ffmpeg CLI (subprocess, shell=True) | utils.py | | Declared but unused in reviewed code | opencv-python 4.5, numpy 1.22 | requirements.txt only | | Tooling / lint | autopep8, pycodestyle | requirements.txt | | Data | Filesystem only (no SQL/ORM) | utils.VIDEOS_PATH, utils.CONVERTER_PATH | | Infra / deploy | Local app.run() debug server | app.py if __name__ block | | Tests | None found | — | | AI / agents | None (.claude/ absent) | tree scan |
