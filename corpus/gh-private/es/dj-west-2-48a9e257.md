---
id: dj-west-2-48a9e257
title: "dj-west — Django inventory and point-of-sale for Argentine retail — P1 — Fragmented inventory and sales tracking"
visibility: private
importance: normal
source_repo: "dj-west"
related: []
tags: ["dj-west", "github", "private", "normal", "summary"]
---

### P1 — Fragmented inventory and sales tracking - **Who hurts:** Small retail operators (owner, stock clerk, counter staff) managing SKU catalogs, supplier relationships, and daily sales without a single system of record. - **Pain today:** Product costs, sale prices, and on-hand stock live in disconnected spreadsheets or memory. When a sale happens, stock is not decremented automatically; movement history is incomplete; low-stock situations are discovered too late. - **How this repo answers:** A single core Django app models **Categoria**, **Proveedor**, **Cliente**, **Producto**, **Venta**, **ItemVenta**, and **MovimientoStock**. CRUD views cover catalog entities. Completing a sale creates Venta + ItemVenta rows, decrements Producto.stock, and logs a MovimientoStock of type VENTA. Manual **ENTRADA** and **AJUSTE** movements provide an audit trail. LOW_STOCK_THRESHOLD (default 5) drives dashboard and UI alerts via Producto.stock_bajo. - **Out of scope:** Multi-store franchise management, purchase-order workflows, barcode hardware integration, and full accounting/ledger beyond sales totals.
