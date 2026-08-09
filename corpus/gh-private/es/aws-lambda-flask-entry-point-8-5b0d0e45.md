---
id: aws-lambda-flask-entry-point-8-5b0d0e45
title: "AWS Lambda Flask Entry Point — serverless Telegram echo bot starter — 4. Technology stack"
visibility: private
importance: low
source_repo: "aws-lambda-flask-entry-point"
related: []
tags: ["aws-lambda-flask-entry-point", "github", "private", "low", "summary"]
---

## 4. Technology stack Derived from requirements.txt, README.md, and top-level Python sources. Vendor contents under package/ noted but not ingested line-by-line. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (version not pinned) | *.py sources; no .python-version | | Web framework | Flask 2.2.2 (declared, unused in handlers) | requirements.txt, package/flask/ | | HTTP client | requests (used, not pinned) | telegram_bot.py import | | WSGI toolkit | Werkzeug 2.2.3 | requirements.txt | | Templating | Jinja2 3.1.2 | requirements.txt | | CLI (transitive) | Click 8.1.3 | requirements.txt | | Bot platform | Telegram Bot API | telegram_bot.py sendMessage call | | Cloud runtime | AWS Lambda | lambda.py, telegram_bot.py handler signatures | | API front door | API Gateway (inferred) | Event shape event['body'] in telegram_bot.py | | Infra / deploy | Manual zip upload | README.md, deploy.zip | | Tests | None evident | No test configs or tests/ directory | | CI/CD | None | No .github/workflows/ |
