# Settings

MergDown2TeX settings are configured in Obsidian.

---

## Access settings

1. Open Obsidian
2. Go to **Settings** → **Community plugins**
3. Click **MergDown2TeX** → **Options**

---

## General settings

### Document class

| Setting | Type | Default | Description |
|---|---|---|---|
| `documentclass` | Select | `report` | LaTeX document class |

**Options:**
- `article` - Short documents
- `report` - Longer documents (default)
- `book` - Full books
- `letter` - Letters
- `beamer` - Presentations

### Font size

| Setting | Type | Default | Description |
|---|---|---|---|
| `fontsize` | Select | `12pt` | Font size |

**Options:** `10pt`, `11pt`, `12pt`, `14pt`

---

## Bibliography settings

### Bibliography file

| Setting | Type | Default | Description |
|---|---|---|---|
| `bibliography` | Text | `""` | Path to `.bib` file |

**Example:**
```yaml
---
bibliography: references.bib
---
```

### Citation style

| Setting | Type | Default | Description |
|---|---|---|---|
| `citationStyle` | Select | `authoryear` | Citation style |

**Options:**
- `authoryear` - `\citep{smith2020}`
- `numeric` - `\cite{smith2020}`
- `alphabetic` - `\cite{smith2020}`
- `super` - `\cite{smith2020}`

---

## Preamble settings

### Custom preamble

| Setting | Type | Default | Description |
|---|---|---|---|
| `customPreamble` | Textarea | `""` | Custom LaTeX preamble |

**Example:**
```yaml
---
customPreamble: |
  \usepackage{tikz}
  \usepackage{siunitx}
---
```

---

## Features settings

### Minted

| Setting | Type | Default | Description |
|---|---|---|---|
| `useMinted` | Toggle | `true` | Syntax highlighting with minted |

### Tcolorbox

| Setting | Type | Default | Description |
|---|---|---|---|
| `useTcolorbox` | Toggle | `true` | Callouts as tcolorbox |

---

## Mermaid settings

### DPI

| Setting | Type | Default | Description |
|---|---|---|---|
| `mermaidDpi` | Select | `150` | Mermaid diagram resolution |

**Options:** `72`, `96`, `150`, `300`

### Image format

| Setting | Type | Default | Description |
|---|---|---|---|
| `mermaidFormat` | Select | `png` | Image format for Mermaid |

**Options:** `png`, `svg`

---

## Image settings

### Image folder

| Setting | Type | Default | Description |
|---|---|---|---|
| `imageFolder` | Text | `""` | Custom image folder |

**Example:**
```yaml
---
imageFolder: assets/images
---
```

---

## Compilation settings

### Podman path

| Setting | Type | Default | Description |
|---|---|---|---|
| `podmanPath` | Text | `podman` | Path to Podman executable |

### Container name

| Setting | Type | Default | Description |
|---|---|---|---|
| `containerName` | Text | `mergdown2tex-env` | Container image name |

### Timeout

| Setting | Type | Default | Description |
|---|---|---|---|
| `compilationTimeout` | Number | `60` | Compilation timeout in seconds |

---

## Advanced settings

### Embed depth limit

| Setting | Type | Default | Description |
|---|---|---|---|
| `embedDepthLimit` | Number | `10` | Maximum embed recursion depth |

### Citation navigation

| Setting | Type | Default | Description |
|---|---|---|---|
| `citationNavigation` | Toggle | `true` | Enable citation arrows |

### Arrow style

| Setting | Type | Default | Description |
|---|---|---|---|
| `arrowStyle` | Text | `↑↓` | Citation arrow style |

---

## Example configurations

### Academic paper

```yaml
---
title: "Research Paper"
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
documentclass: beamer
fontsize: 10pt
bibliography: references.bib
citationStyle: numeric
---
```

---

## Next steps

- [Commands](commands.md) - Available commands
- [Architecture](architecture.md) - Technical details
- [Troubleshooting](../troubleshooting.md) - Common issues
