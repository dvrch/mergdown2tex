# Commands

MergDown2TeX provides the following commands.

---

## Command palette

Open with `Ctrl/Cmd + P` and type "MergDown2TeX".

---

## Available commands

| Command | Description |
|---|---|
| `MergDown2TeX: Convertir la note active en LaTeX (.tex)` | Generate `.tex` file |
| `MergDown2TeX: Convertir et compiler en PDF` | Generate PDF |
| `MergDown2TeX: Convertir et compiler en DOCX (Word)` | Generate Word document |

---

## Keyboard shortcuts

### Default shortcuts

| Action | Windows/Linux | macOS |
|---|---|---|
| Command palette | `Ctrl + P` | `Cmd + P` |
| Convert to LaTeX | `Ctrl + Shift + L` | `Cmd + Shift + L` |
| Compile to PDF | `Ctrl + Shift + P` | `Cmd + Shift + P` |
| Compile to DOCX | `Ctrl + Shift + W` | `Cmd + Shift + W` |

### Custom shortcuts

1. Open Obsidian
2. Go to **Settings** → **Hotkeys**
3. Search "MergDown2TeX"
4. Set custom shortcuts

---

## Ribbon buttons

### Available buttons

| Button | Action | Description |
|---|---|---|
| :material-file-document: | Convert to LaTeX | Generate `.tex` file |
| :material-file-pdf-box: | Compile to PDF | Generate PDF |
| :material-file-word: | Compile to DOCX | Generate Word document |

---

## Usage examples

### Convert to LaTeX

1. Open any note
2. Run command: `MergDown2TeX: Convertir la note active en LaTeX (.tex)`
3. `.tex` file appears in same folder

### Compile to PDF

1. Open any note
2. Run command: `MergDown2TeX: Convertir et compiler en PDF`
3. PDF file appears in same folder

### Compile to DOCX

1. Open any note
2. Run command: `MergDown2TeX: Convertir et compiler en DOCX (Word)`
3. DOCX file appears in same folder

---

## Batch operations

### Convert multiple notes

```bash
#!/bin/bash
# batch-convert.sh

for file in *.md; do
    # Convert to LaTeX
    pandoc "$file" -o "${file%.md}.tex"
done
```

### Compile all PDFs

```bash
#!/bin/bash
# batch-compile.sh

for file in *.tex; do
    # Compile
    pdflatex "$file"
    bibtex "${file%.tex}"
    pdflatex "$file"
    pdflatex "$file"
done
```

---

## Next steps

- [Settings](settings.md) - Configuration options
- [Architecture](architecture.md) - Technical details
- [Troubleshooting](../troubleshooting.md) - Common issues
