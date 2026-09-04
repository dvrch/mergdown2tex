# Cross-References

MergDown2TeX adds bidirectional navigation between citations.

---

## How it works

```mermaid
graph LR
    A[Text] -->|↑| B[Citation]
    B -->|↓| C[Bibliography]
```

---

## Features

### Bidirectional arrows

**In text:**
```latex
As shown by \citep{smith2020}... ↑
```

**In bibliography:**
```latex
\textbf{Smith, J. (2020).} Important Research. ↓
```

### Navigation

- Click **↑** in text → Jump to citation in bibliography
- Click **↓** in bibliography → Jump to citation in text

---

## Implementation

### Text navigation

```latex
As shown by \citep{smith2020}... \hyperlink{smith2020}{↑}
```

### Bibliography navigation

```latex
\hypertarget{smith2020}{\textbf{Smith, J. (2020).} Important Research.} \hyperlink{smith2020}{↓}
```

---

## Configuration

### Enable/disable

```yaml
---
citationNavigation: true
---
```

### Arrow style

```yaml
---
arrowStyle: "↑↓"
---
```

**Options:**
- `↑↓` (default)
- `↗↙`
- `→←`

---

## Example

### Input

```markdown
---
title: "Research Paper"
bibliography: references.bib
---

# Introduction

This paper cites @smith2020.

# Bibliography
```

### Output

```latex
\documentclass[12pt]{report}
\usepackage{cite}
\usepackage{hyperref}

\title{Research Paper}

\begin{document}

\section{Introduction}
This paper cites \citep{smith2020}... \hyperlink{smith2020}{↑}

\bibliographystyle{plain}
\bibliography{references}

\end{document}
```

**In `references.bib`:**
```latex
\hypertarget{smith2020}{\textbf{Smith, J. (2020).} Important Research.} \hyperlink{smith2020}{↓}
```

---

## Troubleshooting

### Arrows not appearing

**Error:**
```
Citation navigation not working
```

**Solution:**
- Check `citationNavigation: true` in YAML
- Verify `hyperref` package is loaded
- Run pdflatex 3 times

### Links not working

**Error:**
```
Hyperlink not found
```

**Solution:**
- Check citation key matches
- Verify `hyperref` package is loaded
- Rebuild PDF

---

## Block Cross-References (DOCX Support)

MergDown2TeX now supports cross-referencing blocks like Tables, Equations, and Figures, with proper hypertargets and labels functioning correctly in DOCX outputs.

### Adding Anchors to Blocks

To enable cross-referencing, add a specific anchor directly after the block. The anchor must be on the immediate next non-empty line.

**Tables:**
```markdown
| Col 1 | Col 2 |
|-------|-------|
| Val 1 | Val 2 |
^table--block-my-table
```

**Equations:**
```markdown
$$
E = mc^2
$$
^eq--block-einstein
```

**Figures:**
```markdown
![Image](path/to/image.png)
^figure--block-my-figure
```

### Referencing Blocks

You can reference these blocks anywhere in your Markdown using standard Obsidian internal links:
- `[[#^table--block-my-table]]`
- `[[#^eq--block-einstein]]`
- `[[#^figure--block-my-figure]]`

These will automatically be compiled into proper LaTeX `\label{...}` and `\hypertarget{...}` tags, ensuring correct numbering and cross-referencing in generated PDF and DOCX files.

---

## Next steps

- [Citations](citations.md) - Citation features
- [Configuration](../getting-started/configuration.md) - Customize settings
- [Compilation](../compilation/pdf.md) - PDF/DOCX options
