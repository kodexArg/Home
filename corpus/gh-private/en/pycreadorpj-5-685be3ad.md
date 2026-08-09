---
id: pycreadorpj-5-685be3ad
title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — 3. Product / idea"
visibility: private
importance: normal
source_repo: "PyCreadorPJ"
related: []
tags: ["pycreadorpj", "github", "private", "normal", "summary"]
---
## 3. Product / idea

PyCreadorPJ is a **single-process Flask application** with server-rendered Jinja2 templates and Bootstrap 5 styling. The mental model: 1. User opens the home page and chooses **Generar**, **Cargar**, or **Guardar** from the navbar dropdown. 2. On generate, a GET form submits class, optional subclass ("Multiclase"), gender, optional fixed name/age/bio, and a power slider. 3. The server builds a character dict (attributes, skills, inventory, money, traits stub, initiative, defense) and pickles it under . 4. renders card columns: portrait, attribute table, skill list (top skills emphasized), inventory, money. 5. Separate routes expose a static city map image and a lore browser fed by . Code identifiers, comments, and UI copy are predominantly **Spanish**, matching the source RPG system ("Rápido y Fácil"). The dependency manifest is named (typo for "requirements").
