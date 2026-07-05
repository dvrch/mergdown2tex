# MergDown2TeX

> **Merge everything. Convert anywhere.**  
> WASM engine runs inside Obsidian. No build step required.

[![Obsidian](https://img.shields.io/badge/Obsidian-Plugin-blue)](https://obsidian.md)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## What it does

MergDown2TeX takes your Obsidian note and transforms it into a **publication-ready** LaTeX document. Everything is merged automatically:

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

**Output formats:**
- **PDF** via TeX Live + Podman
- **DOCX** via Pandoc
- **.tex** for manual editing
- **InDesign** compatible output

---

## How it works

```
┌─────────────────────────────────────────────────────────┐
│  Obsidian Note                                          │
│  ├── [[Note A]]          ──→  \input{note_a}           │
│  ├── ![[Note B]]         ──→  recursive expansion      │
│  ├── ![[image.png]]      ──→  \includegraphics{}       │
│  ├── @citation           ──→  \citep{} + arrows ↑↓     │
│  ├── $math$              ──→  LaTeX equation            │
│  └── ```mermaid```       ──→  rendered PNG              │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  WASM Engine (inside Obsidian)                          │
│  ├── Markdown → LaTeX conversion (pure Rust)            │
│  ├── Embed expansion (filesystem)                       │
│  ├── Citation extraction + navigation                   │
│  └── Mermaid → PNG rendering                            │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Output Files                                           │
│  ├── document.tex    (LaTeX source)                     │
│  ├── document.pdf    (compiled PDF)                     │
│  └── document.docx   (Word document)                    │
└─────────────────────────────────────────────────────────┘
```

---

## Dependencies

| Step | What you need | Status |
|---|---|---|
| Markdown → LaTeX | WASM engine | **None** (runs in Obsidian) |
| LaTeX → PDF | TeX Live + Podman | Required |
| LaTeX → DOCX | Pandoc | Required |

### For PDF/DOCX compilation

Install the LaTeX environment using the included Dockerfile:

```bash
# Build the container (one time)
podman build -t mergdown2tex-env -f Dockerfile .

# Or use Docker
docker build -t mergdown2tex-env -f Dockerfile .
```

The container includes:
- TeX Live (full)
- Pandoc
- Python3 + Pygments (for minted)
- All required LaTeX packages

---

## Install

### Manual install

1. Download `main.js`, `manifest.json`, `vlatex_bg.wasm` from [Releases](https://github.com/dvrch/mergdown2tex/releases)
2. Copy to `.obsidian/plugins/mergdown2tex/`
3. Enable in **Settings → Community Plugins**

### Folder structure

```
.obsidian/
└── plugins/
    └── mergdown2tex/
        ├── main.js          56 KB   ← plugin + WASM bindings
        ├── manifest.json   351 B   ← metadata
        ├── vlatex_bg.wasm  2.1 MB  ← Rust converter engine
        └── Dockerfile        1 KB  ← LaTeX compilation environment
```

---

## Commands

| Command | Action |
|---|---|
| `MergDown2TeX: Convert to LaTeX` | Generate `.tex` file |
| `MergDown2TeX: Compile to PDF` | Generate PDF |
| `MergDown2TeX: Compile to DOCX` | Generate Word document |

---

## Settings

| Setting | Default | Description |
|---|---|---|
| `documentclass` | `report` | LaTeX document class |
| `fontsize` | `12pt` | Font size |
| `bibliography` | `""` | Path to `.bib` file |
| `customPreamble` | `""` | Custom LaTeX preamble |
| `useMinted` | `true` | Syntax highlighting with minted |
| `useTcolorbox` | `true` | Callouts as tcolorbox |
| `mermaidDpi` | `150` | Mermaid diagram resolution |

---

## Why MergDown2TeX?

| | Pandoc Plugin | Pandoc CLI | **MergDown2TeX** |
|---|---|---|---|
| Install required | Pandoc + TeX Live | Pandoc + TeX Live | **WASM only** |
| Wikilink resolution | ❌ | ❌ | ✅ |
| Embed expansion | ❌ | ❌ | ✅ |
| Citation arrows (↑↓) | ❌ | ❌ | ✅ |
| Mermaid → PNG | ❌ | ❌ | ✅ |
| Custom preamble | Partial | Manual | ✅ |
| InDesign output | ❌ | ❌ | ✅ |

---

## Architecture

```
main.js          56 KB   ← plugin + WASM bindings (merged)
manifest.json   351 B   ← metadata
vlatex_bg.wasm  2.1 MB  ← Rust converter engine
Dockerfile        1 KB  ← LaTeX compilation environment
```

**4 files. 2.2 MB total. Zero build step.**

---

## Troubleshooting

### "WASM module not loaded"
- Ensure `vlatex_bg.wasm` is in the same folder as `main.js`
- Restart Obsidian

### "Podman not found"
- Install Podman: https://podman.io/getting-started/installation
- Or use Docker instead

### "Compilation failed"
- Check that the container is built: `podman images | grep mergdown2tex-env`
- Rebuild if needed: `podman build -t mergdown2tex-env -f Dockerfile .`

---

## License

Free for personal, academic, community use.  
Commercial: [contact author](https://github.com/dvrch).

---

## Support

- [GitHub Issues](https://github.com/dvrch/mergdown2tex/issues)
- [Documentation](https://dvrch.github.io/mergdown2tex/)
