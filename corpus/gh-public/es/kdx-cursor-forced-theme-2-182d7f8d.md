---
id: kdx-cursor-forced-theme-2-182d7f8d
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — P1 — Theme API limits vs. forced chrome styling"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---

### P1 — Theme API limits vs. forced chrome styling - **Who hurts:** Developers using Cursor Agents / Glass mode who want Presentation Orange (ink/cream/orange/teal) instead of Cursor's default cool grays and sky-blue accents; teams aligning desktop Hyprland + AGS chrome with IDE appearance. - **Pain today:** VS Code workbench.colorCustomizations and extension color themes cannot set radial .po-glow backgrounds, remap Glass CSS variables on :root / .ui-1lzgia1, transparent auxiliary bars, or composer-specific surfaces (human message cards vs. sunken prompt input). Cursor's Agents Window hard-codes cool grays that hide intended glow recipes. - **How this repo answers:** Split source CSS under css/ defines tokens, backgrounds, icons, hairlines, and prompt-input rules targeting both data-cursor-glass-mode=true and classic .monaco-workbench selectors. scripts/build-css.js concatenates parts into css/forced-theme.css; scripts/patcher.js injects that bundle as <style id="kodexarg-gradient"> between HTML comment markers in the live workbench.html <head>. - **Out of scope:** Editor syntax highlighting themes (handled separately by kodex.syv-theme / workbench.colorTheme); Codium-only glow (see companion repo kodexarg-theme-gradient-addon); AppImage installs where app files are read-only.
