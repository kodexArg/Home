---
id: djangomce-5-ac0dceaa
title: "DjangoMCE — internal Mendoza Central operations portal — 3. Product / idea"
visibility: private
importance: normal
source_repo: "DjangoMCE"
related: []
tags: ["djangomce", "github", "private", "normal", "summary"]
---

## 3. Product / idea DjangoMCE is a monolithic Django 3.0 project (mce/) with five domain apps under apps/. The mental model is **portal shell + read-mostly analytics adapters + HR CRUD**: - **Home / Anuncios:** TablonView filters Tablon announcements active between publicar_desde and publicar_hasta; this is also mounted at / as the landing page. - **RRHH:** novedades app handles employee roster tables and novedad creation with conditional fields; staff see this in the nav dropdown. - **Temperatura:** Renders a chart page; AJAX calls json_hc which aggregates MySQL sensor rows into Highcharts spline series grouped by Raspberry Pi unit (rpi). - **Operaciones / Estadísticas:** Permission-gated (perms.estadisticas.kdx_ro_estadisticas); shows welcome page and "Producción por día" table merging slot telemetry with master list metadata via pandas. - **API:** Thin DRF ListCreateAPIView exposing temperature rows for programmatic access. Static assets are collected to assets/ (STATIC_ROOT); source static lives in static/ with SCSS compiled via django-libsass and django-compressor. Frontend vendor libs (Bootstrap, Highcharts, moment, underscore) are managed through djangobower. Timezone is America/Argentina/Mendoza; USE_TZ = False (local naive datetimes). UI language is Spanish (LANGUAGE_CODE = 'es').
