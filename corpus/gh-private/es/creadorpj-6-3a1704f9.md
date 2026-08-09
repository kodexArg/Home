---
id: creadorpj-6-3a1704f9
title: "CreadorPJ — random character sheet generator for Subordinación y Valor — Generation flow"
visibility: private
importance: normal
source_repo: "CreadorPJ"
related: []
tags: ["creadorpj", "github", "private", "normal", "summary"]
---

### Generation flow 1. User selects class, sex, poder (default 40), optionally expands "+opciones" for name/age/trait overrides. 2. Form submits GET /generar with query params captured as caracter dict. 3. generar_personaje runs randomizers sequentially, then rolls for derived stats. 4. Result rendered in personaje.html as Bootstrap cards: portrait (static/img/{Clase}_{Sexo}_01.png), attribute table, traits + rasgos tables (top rows emphasized via CSS gray scale), skills table, inventory with estorbo/daño/rango columns, cash in pesos. 5. Auto-save to static/pjs/ultimo.pickle; explicit save writes {nombre}.pickle via /guardado.
