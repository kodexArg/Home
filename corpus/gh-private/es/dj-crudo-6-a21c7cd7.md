---
id: dj-crudo-6-a21c7cd7
title: "dj-crudo — Django WiFi captive portal and survey CRUD — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "dj-crudo"
related: []
tags: ["dj-crudo", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Visitor connects to WiFi** → redirected to portal home → logs in with Google → sees "You're connected to the Internet" in ES/PT/EN. 2. **Staff opens survey list** → navigates to /survey/ → clicks "Nuevo" → submits intake form → record stored in Survey table. 3. **Operator on host** → creates FIFO /pipe, runs pipe_line.sh (optionally with sudo) → Django calls run_on_pipe("iptables ...") → command executes on host with pipe_line.sh's privileges.
