---
id: dj-rpi-monitor-7-d12eeb92
title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — 4. Technology stack"
visibility: private
importance: low
source_repo: "dj-rpi-monitor"
related: []
tags: ["dj-rpi-monitor", "github", "private", "low", "summary"]
---

## 4. Technology stack Derived from requirements.txt, project/settings.py, and static asset paths. Dependency versions are **unpinned** in requirements (no lockfile in tree). | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (implicit; no .python-version in tree) | manage.py, requirements.txt | | Web framework | Django | project/settings.py, INSTALLED_APPS | | API | Django REST Framework | rest_framework in INSTALLED_APPS, core/views.py APIView | | Realtime UI | django-htmx + vendored HTMX | django_htmx middleware, core/static/js/htmx.min.js, partial templates | | Charts | Plotly Express + vendored Plotly JS | core/views.py px.line, core/static/js/plotly-2.35.2.min.js | | Data | SQLite default; env-overridable RDBMS | project/settings.py DATABASES block | | Config | python-dotenv | load_dotenv(BASE_DIR / '.env') in settings | | Logging | loguru + Django LOGGING dict | project/settings.py | | Styling | Skeleton CSS, normalize, custom styles.css | core/static/css/ | | Tests | Django TestCase scaffold only | core/tests.py (empty) | | Infra / deploy | None evident | no docker-compose, no .github/workflows, no Dockerfile |
