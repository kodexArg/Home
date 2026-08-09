---
id: kodexbot-6-285877fa
title: "kodexBot — offline Hyprland voice dictation and command station — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "kodexBot"
related: []
tags: ["kodexbot", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Flow A — dictation:** Hard switch on → green state → user speaks → words appear at cursor in near-real-time (measured 0.44–0.85 s for a 3 s clip on CUDA without brain resident). 2. **Flow B — command while dictating:** User says "switch to workspace two and write hello" → regex or brain catches workspace command → workspace switches, command phrase stripped, "hello" typed. 3. **Flow C — context action:** User says "press accept" → focused window receives Return via wtype. 4. **Flow D — stack correction:** User says «borra lo último» → router reads exact typed text from sqlite-vec stack → precise BackSpace erasure. 5. **Flow E — off:** Hard switch off → process exits, indicator disappears, mic released.
