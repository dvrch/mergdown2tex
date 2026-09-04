# Configuration

Customize MergDown2TeX to match your workflow.

---

## Access settings

1. Open Obsidian
2. Go to **Settings** → **Community plugins**
3. Click **MergDown2TeX** → **Options**

---

## General settings

### Document class

| Setting | Default | Description |
|---|---|---|
| `documentclass` | `report` | LaTeX document class |

**Options:** `article`, `report`, `book`, `letter`, `beamer`

```latex
\documentclass[12pt]{report}  % Default
\documentclass[12pt]{article} % Alternative
```

### Font size

| Setting | Default | Description |
|---|---|---|
| `fontsize` | `12pt` | Font size |

**Options:** `10pt`, `11pt`, `12pt`, `14pt`

---

## Bibliography settings

### Bibliography file

| Setting | Default | Description |
|---|---|---|
| `bibliography` | `""` | Path to `.bib` file |

**Usage:**

```yaml
---
bibliography: references.bib
---
```

**Example `references.bib`:**

```bibtex
@article{smith2020,
  author  = {Smith, John},
  title   = {Important Research},
  journal = {Journal of Science},
  year    = {2020},
  volume  = {1},
  pages   = {1-10}
}
```

### Citation style

| Setting | Default | Description |
|---|---|---|
| `citationStyle` | `authoryear` | Citation style |

**Options:**

- `authoryear` → `\citep{smith2020}`
- `numeric` → `\cite{smith2020}`
- `alphabetic` → `\cite{smith2020}`
- `super` → `\cite{smith2020}`

---

## Preamble settings

### Custom preamble

| Setting | Default | Description |
|---|---|---|
| `customPreamble` | `""` | Custom LaTeX preamble |

**Usage:**

```yaml
---
customPreamble: |
  \usepackage{custom-package}
  \newcommand{\mycommand}{...}
---
```

**Example:**

```latex
% Auto-generated preamble
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}

% Your custom preamble
\usepackage{tikz}
\usepackage{siunitx}

% Continue...
\begin{document}
```

---

## Features settings

### Minted (syntax highlighting)

| Setting | Default | Description |
|---|---|---|
| `useMinted` | `true` | Syntax highlighting with minted |

**When enabled:**

```latex
\usepackage{minted}

\begin{document}

\begin{minted}{python}
def hello():
    print("Hello, World!")
\end{minted}

\end{document}
```

### Tcolorbox (callouts)

| Setting | Default | Description |
|---|---|---|
| `useTcolorbox` | `true` | Callouts as tcolorbox |

**When enabled:**

```latex
\usepackage{tcolorbox}

\begin{document}

\begin{tcolorbox}[colback=blue!5!white, colframe=blue!75!black]
This is a callout.
\end{tcolorbox}

\end{document}
```

---

## Mermaid settings

### DPI

| Setting | Default | Description |
|---|---|---|
| `mermaidDpi` | `150` | Mermaid diagram resolution |

**Options:** `72`, `96`, `150`, `300`

**Usage:**

```yaml
---
mermaidDpi: 300
---
```

!!! info "Higher DPI"
    Higher DPI produces clearer diagrams but larger files.

---

## Images settings

### Image folder

| Setting | Default | Description |
|---|---|---|
| `imageFolder` | `""` | Custom image folder |

**Usage:**

```yaml
---
imageFolder: assets/images
---
```

### Image format

| Setting | Default | Description |
|---|---|---|
| `imageFormat` | `png` | Image format for Mermaid |

**Options:** `png`, `svg`

---

## Compilation settings

!!! info "Default PDF/DOCX pipeline is WASM-based"
    By default, **DOCX** uses `pandoc.wasm` and **PDF** uses Pandoc WASM + Typst (works on PC and mobile, no install). Podman/pdflatex below is **optional**, only needed for native-LaTeX PDF output on a PC — see [Compilation PDF](../compilation/pdf.md). Set *PDF PC via Wasm+Typst* to use the WASM pipeline on PC too.

### Podman path

| Setting | Default | Description |
|---|---|---|
| `podmanPath` | `podman` | Path to Podman executable (native-LaTeX PDF, PC only) |

### Container name

| Setting | Default | Description |
|---|---|---|
| `containerName` | `vlatex-env` | Container image name (native-LaTeX PDF, PC only) |

### Timeout

| Setting | Default | Description |
|---|---|---|
| `compilationTimeout` | `60` | Compilation timeout in seconds |

---

## Example configuration

### Academic paper

```yaml
---
title: "Research Paper"
author: "John Doe"
documentclass: article
fontsize: 11pt
bibliography: references.bib
citationStyle: authoryear
useMinted: true
useTcolorbox: true
mermaidDpi: 300
---
```

### Thesis

```yaml
---
title: "My Thesis"
author: "Jane Doe"
documentclass: report
fontsize: 12pt
bibliography: bibliography.bib
citationStyle: authoryear
customPreamble: |
  \usepackage{glossaries}
  \makeglossaries
useMinted: true
useTcolorbox: true
mermaidDpi: 300
---
```

### Beamer presentation

```yaml
---
title: "Presentation"
author: "John Doe"
documentclass: beamer
fontsize: 10pt
bibliography: references.bib
citationStyle: numeric
---
```

---

## Next steps

- [Features](../features/overview.md) - Explore all features
- [Compilation](../compilation/pdf.md) - PDF/DOCX options
- [Reference](../reference/commands.md) - Commands list
