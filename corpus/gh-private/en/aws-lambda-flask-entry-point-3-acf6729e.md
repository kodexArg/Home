---
id: aws-lambda-flask-entry-point-3-acf6729e
title: "AWS Lambda Flask Entry Point — serverless Telegram echo bot starter — P2 — Python dependency packaging for AWS Lambda"
visibility: private
importance: low
source_repo: "aws-lambda-flask-entry-point"
related: []
tags: ["aws-lambda-flask-entry-point", "github", "private", "low", "summary"]
---

### P2 — Python dependency packaging for AWS Lambda - **Who hurts:** Python developers deploying to Lambda who hit import errors because Lambda's runtime lacks pip-installed packages. - **Pain today:** Lambda requires dependencies to be bundled inside the deployment artifact (or provided via a Lambda layer). The pip install -r requirements.txt on a dev machine does not automatically produce a Lambda-compatible tree. - **How this repo answers:** README documents the vendor workflow: pip install --target ./package -r requirements.txt, then zip -ur deploy.zip * -x '*package*'. The repo already contains a populated package/ directory (Flask, Werkzeug, Jinja2, Click, MarkupSafe, itsdangerous) and a deploy.zip artifact demonstrating the output shape. - **Out of scope:** No Lambda layers, no container-image packaging, no automated CI build pipeline. requests (used by telegram_bot.py) is not listed in requirements.txt — a gap that would cause runtime import failure unless added manually.
