---
id: pihome-5-fae5b91b
title: "PiHome — Django multimedia hub for Raspberry Pi — 3. Product / idea"
visibility: private
importance: normal
source_repo: "PiHome"
related: []
tags: ["pihome", "github", "private", "normal", "summary"]
---
## 3. Product / idea

PiHome is a two-package Django monolith: the project package (settings, root URLconf, WSGI) and the application (models, views, templates, static CSS, admin registration). The mental model is “home page + three media workflows + Django admin,” all served from the Pi on the development server or behind a production WSGI stack not defined in-repo. Users land on a Bootstrap jumbotron home ( class-based ). From there they can add catalogued media ( with ModelForm), browse the database-backed list ( ), or use the experimental direct upload ( ). In debug mode, uploaded files are also exposed under via static file serving helpers in both root and app URLconfs. Persistence splits: structured records live in MySQL table backing ; raw Subida files go to default filesystem storage. File fields upload to date-based paths ( per migrations, with a slightly different path string in the live model—see open questions).
