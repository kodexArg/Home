---
id: rpi-temp-3-94cb04a4
title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — P2 — Reproducible small-footprint deployment"
visibility: private
importance: normal
source_repo: "rpi-temp"
related: []
tags: ["rpi-temp", "github", "private", "normal", "summary"]
---
### P2 — Reproducible small-footprint deployment

- **Who hurts:** Someone who wants the API + chart on a Pi or small VM without manual Python virtualenv juggling.
- **Pain today:** Mixing dev Flask, production WSGI, and reverse-proxy config by hand is error-prone on constrained hardware.
- **How this repo answers:** defines two services— (Python 3.8 image, uWSGI via ) and (reverse proxy to uWSGI socket on port 8080)—with volume-mounted source for iterative dev.
- **Out of scope:** Kubernetes, Terraform, CI/CD pipelines, secrets management (credentials are currently inlined in source—see §9).
