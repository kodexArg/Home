---
id: djangomce-5-ac0dceaa
title: "DjangoMCE — internal Mendoza Central operations portal — 3. Product / idea"
visibility: private
importance: normal
source_repo: "DjangoMCE"
related: []
tags: ["djangomce", "github", "private", "normal", "summary"]
---
## 3. Product / idea

DjangoMCE is a monolithic Django 3.0 project ( ) with five domain apps under . The mental model is **portal shell + read-mostly analytics adapters + HR CRUD**: - **Home / Anuncios:** filters announcements active between and ; this is also mounted at as the landing page. - **RRHH:** app handles employee roster tables and novedad creation with conditional fields; staff see this in the nav dropdown. - **Temperatura:** Renders a chart page; AJAX calls which aggregates MySQL sensor rows into Highcharts spline series grouped by Raspberry Pi unit ( ). - **Operaciones / Estadísticas:** Permission-gated ( ); shows welcome page and "Producción por día" table merging slot telemetry with master list metadata via pandas. - **API:** Thin DRF exposing temperature rows for programmatic access. Static assets are collected to ( ); source static lives in with SCSS compiled via and . Frontend vendor libs (Bootstrap, Highcharts, moment, underscore) are managed through . Timezone is ; (local naive datetimes). UI language is Spanish ( ).
