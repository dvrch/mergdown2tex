# Equations

MergDown2TeX converts Obsidian equations to LaTeX.

---

## Syntax

### Inline equation

**Input:**
```markdown
The equation $E = mc^2$ is famous.
```

**Output:**
```latex
The equation $E = mc^2$ is famous.
```

### Display equation

**Input:**
```markdown
$$E = mc^2$$
```

**Output:**
```latex
\begin{equation}
E = mc^2
\end{equation}
```

### Aligned equations

**Input:**
```markdown
$$
\begin{aligned}
a &= b + c \\
d &= e + f
\end{aligned}
$$
```

**Output:**
```latex
\begin{equation}
\begin{aligned}
a &= b + c \\
d &= e + f
\end{aligned}
\end{equation}
```

---

## Math packages

MergDown2TeX automatically includes:

```latex
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{mathtools}
```

---

## Examples

### Example 1: Simple equation

**Input:**
```markdown
The area of a circle is $A = \pi r^2$.
```

**Output:**
```latex
The area of a circle is $A = \pi r^2$.
```

### Example 2: Numbered equation

**Input:**
```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

**Output:**
```latex
\begin{equation}
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
\end{equation}
```

### Example 3: Matrix

**Input:**
```markdown
$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix}
$$
```

**Output:**
```latex
\begin{equation}
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix}
\end{equation}
```

---

## Equation numbering

### Automatic numbering

```latex
\begin{equation}
E = mc^2
\end{equation}
```

### Unnumbered equation

**Input:**
```markdown
$$
E = mc^2
$$
```

**Output:**
```latex
\[
E = mc^2
\]
```

### Custom numbering

**Input:**
```markdown
$$
\begin{equation}
\label{eq:einstein}
E = mc^2
\end{equation}
$$
```

**Output:**
```latex
\begin{equation}
\label{eq:einstein}
E = mc^2
\end{equation}
```

---

## Troubleshooting

### Equation not rendering

**Error:**
```
Missing $ inserted
```

**Solution:**
- Check for unmatched `$`
- Escape special characters: `\$`, `\%`, `\#`
- Verify LaTeX syntax

### Undefined control sequence

**Error:**
```
Undefined control sequence
```

**Solution:**
- Check package is loaded
- Verify command spelling
- Add package to custom preamble

---

## Next steps

- [Mermaid Diagrams](mermaid.md) - Diagram support
- [Configuration](../getting-started/configuration.md) - Customize settings
- [Compilation](../compilation/pdf.md) - PDF/DOCX options
