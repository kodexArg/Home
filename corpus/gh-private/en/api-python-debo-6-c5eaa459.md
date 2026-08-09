---
id: api-python-debo-6-c5eaa459
title: "API Python DEBO — read-only MSSQL facade for YPF station operations — Business context"
visibility: private
importance: high
source_repo: "api-python-debo"
related: []
tags: ["api-python-debo", "github", "private", "high", "summary"]
---

### Business context Two YPF "Full" stations share legal entity **KM 1107**: | Trade name | Default? | Notes | |------------|----------|-------| | KM 1151 | Yes | Uspallata, Mendoza — default when docs say "the station" | | Las Bóvedas | No | Same legal entity | Operations run 24/7 in three canonical shifts (Night, Morning, Afternoon) with approximate hours (ADR 003). Sectors: **Tienda** (convenience store) and **Playa** (fuel: Pesados / Livianos). Fuel types are static constants mapped from DEBO product codes: INFINIA, NS XXI, GO-INFINIA DIESEL, D.DIESEL500; everything else is OTROS (liters apply only to the four fuels).
