# LaTeXify

> **Merge everything. Compile anywhere.**  
> Zero dependencies. Runs inside Obsidian via WASM.

[![Obsidian](https://img.shields.io/badge/Obsidian-Plugin-blue)](https://obsidian.md)

---

## What it does

One click. Your Obsidian note becomes a **publication-ready** LaTeX document.

| Input | Output |
|---|---|
| `[[Wikilinks]]` | `\hyperref[...]{}` cross-references |
| `![[Embedded notes]]` | Recursive expansion |
| `![[image.png]]` | `\includegraphics{}` |
| `@citation` | `\citep{}` + bidirectional arrows (↑↓) |
| `$math$` / `$$math$$` | LaTeX equations |
| Mermaid diagrams | Auto-rendered to PNG |
| `> [!note]` callouts | `tcolorbox` environments |
| Footnotes, tables, lists | Full LaTeX support |

**→ PDF** via local TeX Live (podman)  
**→ DOCX** via Pandoc  
**→ .tex** for manual editing  
**→ InDesign** compatible output

---

## Why LaTeXify?

| | Pandoc Plugin | Pandoc CLI | **LaTeXify** |
|---|---|---|---|
| Install required | Pandoc + TeX Live | Pandoc + TeX Live | **None** (WASM) |
| Wikilink resolution | ❌ | ❌ | ✅ |
| Embed expansion | ❌ | ❌ | ✅ |
| Citation arrows (↑↓) | ❌ | ❌ | ✅ |
| Mermaid → PNG | ❌ | ❌ | ✅ |
| Custom preamble | Partial | Manual | ✅ |

---

## Install

1. Download `main.js`, `manifest.json`, `vlatex_bg.wasm` from [Releases](https://github.com/dvrch/obsidian-vlatex-rust/releases)
2. Copy to `.obsidian/plugins/latexify/`
3. Enable in **Settings → Community Plugins**

---

## Commands

| Command | Action |
|---|---|
| `LaTeXify: Convert to LaTeX` | Generate `.tex` |
| `LaTeXify: Compile to PDF` | Generate PDF |
| `LaTeXify: Compile to DOCX` | Generate Word |

---

## Requirements

- Obsidian desktop (Electron)
- TeX Live + Podman (for PDF/DOCX compilation)

---

## Architecture

```
main.js          56 KB   ← plugin + WASM bindings (merged)
manifest.json   351 B   ← metadata
vlatex_bg.wasm  2.1 MB  ← Rust converter engine
```

**3 files. 2.2 MB total. Zero build step.**

---

## License

Free for personal, academic, community use.  
Commercial: [contact author](https://github.com/dvrch).
