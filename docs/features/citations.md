# Citations

MergDown2TeX converts Obsidian citations to LaTeX with bidirectional navigation.

---

## How it works

```mermaid
graph LR
    A[Text] -->|↑| B[Citation]
    B -->|↓| C[Bibliography]
```

---

## Syntax

### Basic citation

**Input:**
```markdown
As shown by @smith2020...
```

**Output:**
```latex
As shown by \citep{smith2020}...
```

### Multiple citations

**Input:**
```markdown
Research shows @smith2020 and @doe2021...
```

**Output:**
```latex
Research shows \citep{smith2020,doe2021}...
```

### Citation with page

**Input:**
```markdown
As shown by @smith2020[p. 42]...
```

**Output:**
```latex
As shown by \citep[p.~42]{smith2020}...
```

---

## Citation styles

| Style | Syntax | Output |
|---|---|---|
| `authoryear` | `@smith2020` | `\citep{smith2020}` |
| `numeric` | `@smith2020` | `\cite{smith2020}` |
| `alphabetic` | `@smith2020` | `\cite{smith2020}` |
| `super` | `@smith2020` | `\cite{smith2020}` |

**Configuration:**
```yaml
---
citationStyle: authoryear
---
```

---

## Navigation arrows

MergDown2TeX adds **bidirectional arrows** to citations:

### In text

```latex
As shown by \citep{smith2020}... ↑
```

### In bibliography

```latex
\textbf{Smith, J. (2020).} Important Research. ↓
```

```mermaid
graph LR
    A[Text] -->|↑| B[Citation]
    B -->|↓| C[Bibliography]
```

---

## Bibliography file

### BibTeX format

**File:** `references.bib`

```bibtex
@article{smith2020,
  author  = {Smith, John},
  title   = {Important Research},
  journal = {Journal of Science},
  year    = {2020},
  volume  = {1},
  pages   = {1-10}
}

@book{doe2021,
  author    = {Doe, Jane},
  title     = {Advanced Topics},
  publisher = {Academic Press},
  year      = {2021}
}
```

### Configuration

```yaml
---
bibliography: references.bib
---
```

---

## Citation extraction

MergDown2TeX automatically extracts citations from your note:

```mermaid
graph TD
    A[Note Content] --> B[Regex: @citation]
    B --> C[Extract citation keys]
    C --> D[Generate \citep{}]
    D --> E[Generate bibliography]
```

### Supported patterns

| Pattern | Example | Output |
|---|---|---|
| `@key` | `@smith2020` | `\citep{smith2020}` |
| `@key[p. 1]` | `@smith2020[p. 1]` | `\citep[p.~1]{smith2020}` |
| `@key[text]` | `@smith2020[see]` | `\citep[see]{smith2020}` |

---

## Example

### Input

```markdown
---
title: "Research Paper"
bibliography: references.bib
---

# Introduction

This paper discusses [[Related Work]] and cites @smith2020.

## Methods

Research shows @doe2021 that...

## Results

Our findings confirm @smith2020[p. 42].
```

### Output

```latex
\documentclass[12pt]{report}
\usepackage{cite}
\usepackage{hyperref}

\title{Research Paper}

\begin{document}

\section{Introduction}
This paper discusses \hyperref[related-work]{Related Work} and cites \citep{smith2020}.

\section{Methods}
Research shows \citep{doe2021} that...

\section{Results}
Our findings confirm \citep[p.~42]{smith2020}.

\bibliographystyle{plain}
\bibliography{references}

\end{document}
```

---

## Troubleshooting

### Citation not found

**Error:**
```
Citation not found: smith2020
```

**Solution:**
- Check `references.bib` for this key
- Verify spelling (case-sensitive)
- Add entry to `.bib` file

### Bibliography not rendering

**Error:**
```
Citation undefined
```

**Solution:**
- Run pdflatex 3 times
- Check `bibliography` setting in YAML frontmatter

---

## Next steps

- [Cross-References](cross-references.md) - Navigation arrows
- [Configuration](../getting-started/configuration.md) - Customize settings
- [Compilation](../compilation/pdf.md) - PDF/DOCX options
