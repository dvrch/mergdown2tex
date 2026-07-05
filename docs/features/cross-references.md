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

## Next steps

- [Citations](citations.md) - Citation features
- [Configuration](../getting-started/configuration.md) - Customize settings
- [Compilation](../compilation/pdf.md) - PDF/DOCX options
