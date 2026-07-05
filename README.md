# vLaTeX — Obsidian to LaTeX

> Convert Obsidian vaults to professional LaTeX/PDF/DOCX documents.  
> **No external tools required** — runs entirely inside Obsidian via WebAssembly.

[![Obsidian](https://img.shields.io/badge/Obsidian-Plugin-blue)](https://obsidian.md)
[![License](https://img.shields.io/badge/License-Free-green)](LICENSE)

---

## Why vLaTeX?

| Feature | Obsidian Pandoc Plugin | pandoc直接调用 | **vLaTeX** |
|---|---|---|---|
| External install required | Pandoc + TeX Live | Pandoc + TeX Live | **None** (WASM) |
| Wikilink `[[...]]` resolution | ❌ | ❌ | ✅ |
| Embed `![[...]]` expansion | ❌ | ❌ | ✅ (recursive, depth-limited) |
| 85+ LaTeX command mappings | ❌ | ❌ | ✅ |
| Citation navigation arrows (↑/↓) | ❌ | ❌ | ✅ |
| Mermaid → PNG auto-render | ❌ | ❌ | ✅ |
| Custom preamble support | Partial | Manual | ✅ |
| Table of contents/figures/tables | Manual | Manual | ✅ (auto) |
| DOCX export | ✅ | ✅ | ✅ |
| Image path resolution (relative) | ❌ | ❌ | ✅ |

**Bottom line:** Other tools require you to install Pandoc + TeX Live and manually handle wikilinks/embeds. vLaTeX does it all inside Obsidian with zero setup.

---

## How It Works

```
┌─────────────┐    WASM     ┌──────────────┐    podman    ┌──────────┐
│  Obsidian    │ ──────────→ │  vlatex.js   │ ──────────→ │ pdflatex │
│  .md file    │             │  (converter) │             │ biber    │
└─────────────┘             └──────────────┘             └──────────┘
                                     │                         │
                                     ▼                         ▼
                              .tex (LaTeX)              .pdf (output)
```

1. **WASM Engine** (`vlatex_bg.wasm`, 2.1 MB) — Rust-compiled converter handles all markdown→LaTeX transformations
2. **JS Glue** (`vlatex.js`) — bridges Obsidian's Electron environment with the WASM module
3. **Plugin** (`main.js`) — integrates into Obsidian's UI with commands and settings

---

## Installation

### Option A: Community Plugins (recommended)

1. Open **Settings → Community Plugins → Browse**
2. Search for **"vLaTeX"**
3. Click **Install**, then **Enable**

### Option B: Manual

1. Download `main.js`, `manifest.json`, `vlatex.js`, `vlatex_bg.js`, `vlatex_bg.wasm` from [Releases](https://github.com/dvrch/obsidian-vlatex-rust/releases)
2. Create folder `.obsidian/plugins/vlatex-rust/` in your vault
3. Copy the 5 files into that folder
4. Enable in **Settings → Community Plugins**

---

## Commands

| Command | Description |
|---|---|
| `vLaTeX Rust: Convertir la note active en LaTeX` | Generate `.tex` file next to the markdown |
| `vLaTeX Rust: Convertir et compiler en PDF` | Generate PDF via local TeX Live (podman) |
| `vLaTeX Rust: Convertir et compiler en DOCX` | Generate Word document via Pandoc |

---

## Settings

| Setting | Default | Description |
|---|---|---|
| LaTeX engine | `pdflatex` | `pdflatex` or `xelatex` |
| Document title | *(from frontmatter)* | Override the `\title{}` |
| Author name | *(from frontmatter)* | Override the `\author{}` |
| Bibliography path | — | Path to `.bib` file (relative to vault) |
| CSL path | — | Citation Style Language file |
| Preamble path | — | Custom preamble (replaces default packages) |
| Keep navigation arrows | ✅ | Bidirectional citation links (↑↓) |
| Default table width | `0.95` | Table width fraction |
| TOC / LOT / LOF | ✅ | Auto-generate table/list of contents |
| Geometry | `margin=2.5cm` | Page margins |

---

## Supported Markdown Features

### Basic Elements
- Headings (`#` → `\section{}`)
- Bold/italic/strikethrough
- Lists (bullet, numbered, todo)
- Blockquotes
- Horizontal rules

### Obsidian-Specific
- `[[Wikilinks]]` → `\hyperref[...]{}` cross-references
- `![[Embedded notes]]` → recursive expansion
- `![[image.png]]` → `\includegraphics{}`
- `==Highlights==` → `\hl{}`
- Callouts (`> [!note]`) → `tcolorbox` environments

### Code & Math
- Inline `code` → `\texttt{}`
- Fenced code blocks → `lstlisting` / `minted`
- Inline `$math$` → `$math$`
- Display `$$math$$` → `\begin{equation}`
- LaTeX blocks preserved as-is

### References
- `@citation` → `\citep{}` / `\cite{}`
- `[^footnote]` → `\footnote{}`
- `![[note#^block]]` → block reference links
- `![[note#heading]]` → heading reference links

### Diagrams
- Mermaid code blocks → auto-rendered to PNG via `mmdc`
- Excalidraw drawings → embedded as images

---

## Requirements

- **Obsidian** desktop v1.0.0+ (Electron-based, not mobile)
- **TeX Live** installed locally (for PDF compilation)
- **Podman** or **Docker** (for sandboxed LaTeX compilation)
- **mmdc** (mermaid-cli) — optional, for Mermaid diagram support

The WASM converter runs inside Obsidian with zero dependencies.  
PDF/DOCX compilation shells out to local tools via `podman run vlatex-env`.

---

## Architecture

```
vlatex-rust/
├── main.js           (40 KB)  — Obsidian plugin, UI integration
├── manifest.json     (305 B)  — Plugin metadata
├── vlatex.js         (21 KB)  — WASM JS bindings
├── vlatex_bg.js      (13 KB)  — WASM import bridge
└── vlatex_bg.wasm    (2.1 MB) — Rust converter (compiled to WASM)
```

Total: **2.2 MB** — all self-contained, no npm install, no build step.

---

## For Reviewers

This plugin solves a real gap in the Obsidian ecosystem:

1. **No existing plugin** handles full Obsidian→LaTeX conversion with wikilink/embed resolution
2. **Zero-install WASM** means users don't need to manage Pandoc/TeX Live PATH issues
3. **85+ LaTeX mappings** cover the full Obsidian syntax surface
4. **Citation navigation** (↑ arrows in PDF linking back to text) is unique
5. **Desktop-only** by necessity (WASM + podman + TeX Live)

Source code: https://github.com/dvrch/vlatex (Rust core)  
Bug reports: https://github.com/dvrch/obsidian-vlatex-rust/issues

---

## License

Free for personal, academic, and community use.  
Commercial use requires authorization. See [LICENSE](LICENSE).
