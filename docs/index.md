![MergDown2TeX Logo](assets/logo-horizontal.png)

# MergDown2TeX

<div class="hero" markdown>

# **Merge everything. Convert anywhere.**

The fastest way to go from Obsidian to LaTeX. Zero dependencies inside Obsidian.

[Plugin](https://community.obsidian.md/plugins/mergdowntotex){ .md-button }
[Get Started](getting-started/installation.md){ .md-button .md-button--primary }
[View on GitHub](https://github.com/dvrch/mergdown2tex){ .md-button }

</div>

---

## What is MergDown2TeX?

MergDown2TeX is an Obsidian plugin that transforms your notes into **publication-ready** LaTeX documents. It merges everything — embeds, citations, Mermaid diagrams, equations, cross-references — into a single `.tex` file.

```mermaid
graph LR
    A[Obsidian Note] --> B[WASM Engine]
    B --> C[.tex File]
    C --> D[PDF]
    C --> E[DOCX]
    C --> F[InDesign]
```

---

## Features

<div class="grid cards" markdown>

-   :material-link-variant:{ .lg .middle } **Wikilinks**

    ---

    `[[Note]]` → `\hyperref[...]{}` with bidirectional navigation

    [:octicons-arrow-right-24: Learn more](features/cross-references.md)

-   :material-file-document:{ .lg .middle } **Embeds**

    ---

    `![[Note]]` → Recursive expansion with depth limit

    [:octicons-arrow-right-24: Learn more](features/embeds.md)

-   :material-book-open-variant:{ .lg .middle } **Citations**

    ---

    `@citation` → `\citep{}` with ↑↓ arrows

    [:octicons-arrow-right-24: Learn more](features/citations.md)

-   :material-chart-line:{ .lg .middle } **Equations**

    ---

    `$math$` → LaTeX equations with numbering

    [:octicons-arrow-right-24: Learn more](features/equations.md)

-   :material-chart-timeline:{ .lg .middle } **Mermaid Diagrams**

    ---

    `` ```mermaid`` `` → Rendered PNG images

    [:octicons-arrow-right-24: Learn more](features/mermaid.md)

-   :material-file-pdf-box:{ .lg .middle } **PDF Compilation**

    ---

    One click to PDF — Pandoc WASM + Typst (default, mobile OK) *or* TeX Live + Podman

    [:octicons-arrow-right-24: Learn more](compilation/pdf.md)

</div>

---

## How it works

```mermaid
sequenceDiagram
    participant U as User
    participant O as Obsidian
    participant W as WASM Engine (embedded)
    participant T as Typst WASM
    participant L as TeX Live (Podman, PC)

    U->>O: Click "Compile to PDF"
    O->>W: Send markdown content
    W->>W: Expand embeds
    W->>W: Resolve wikilinks
    W->>W: Convert to LaTeX
    W->>O: Return .tex file
    alt Typst pipeline (default / mobile)
        O->>T: pandoc.wasm + typst.wasm
        T->>O: Generate PDF
    else native LaTeX (PC, optional)
        O->>L: Launch container (vlatex-env)
        L->>L: pdflatex x3
        L->>O: Generate PDF
    end
    O->>U: Open PDF
```

---

## Quick Example

**Input:**
```markdown
---
title: "My Paper"
---

# Introduction

This paper discusses [[Related Work]] and cites @smith2020.

![[Figure 1.png]]

## Methods

We use the formula $E = mc^2$.
```

**Output:**
```latex
\documentclass[12pt]{report}
\usepackage{hyperref}
\usepackage{cite}

\title{My Paper}

\begin{document}

\section{Introduction}
This paper discusses \hyperref[related-work]{Related Work} and cites \citep{smith2020}.

\includegraphics{figures/figure_1.png}

\section{Methods}
We use the formula $E = mc^2$.

\end{document}
```

---

## Install in 3 steps

1. **Download** `main.js`, `manifest.json` from [Releases](https://github.com/dvrch/mergdown2tex/releases)
2. **Copy** to `.obsidian/plugins/mergdowntotex/` (the WASM engine is embedded in `main.js`; `pandoc.wasm`/`typst.wasm` auto-download at first export)
3. **Enable** in Settings → Community Plugins

---

## Requirements

| Step | What you need |
|---|---|
| Markdown → LaTeX | **None** (WASM embedded in `main.js`) |
| LaTeX → PDF (default) | **None** (Pandoc WASM + Typst, auto-downloaded) |
| LaTeX → PDF (native) | TeX Live + Podman/Docker (optional, PC) |
| LaTeX → DOCX | **None** (Pandoc WASM, auto-downloaded) |

---

## Why MergDown2TeX?

| | Pandoc Plugin | Pandoc CLI | **MergDown2TeX** |
|---|---|---|---|
| Install required | Pandoc + TeX Live | Pandoc + TeX Live | **WASM only (Pandoc via WASM)** |
| Wikilink resolution | ❌ | ❌ | ✅ |
| Embed expansion | ❌ | ❌ | ✅ |
| Citation arrows (↑↓) | ❌ | ❌ | ✅ |
| Mermaid → PNG | ❌ | ❌ | ✅ |
| Custom preamble | Partial | Manual | ✅ |
| InDesign output | ❌ | ❌ | ✅ |
| Cross-platform | ⚠️ | ⚠️ | ✅ |

---

## Support
- [GitHub Issues](https://github.com/dvrch/mergdown2tex/issues)
- [Documentation](https://dvrch.github.io/mergdown2tex/)
- [Discord](https://discord.gg/mergdown2tex) (coming soon)

---

## License

Free for personal, academic, community use.  
Commercial: [contact author](https://github.com/dvrch).
