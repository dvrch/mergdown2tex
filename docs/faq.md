# FAQ

Frequently asked questions.

---

## General

### What is MergDown2TeX?

MergDown2TeX is an Obsidian plugin that converts Obsidian notes to LaTeX documents. It merges everything — embeds, citations, Mermaid diagrams, equations, cross-references — into a single `.tex` file.

### Is it free?

Yes! MergDown2TeX is free for personal, academic, and community use. Commercial use requires author authorization.

### Does it work with Obsidian sync?

Yes! MergDown2TeX works with Obsidian sync. The generated `.tex` files are synced like any other file.

---

## Installation

### Do I need to install anything?

- **For conversion:** No (WASM engine is embedded in `main.js`, runs in Obsidian)
- **For DOCX compilation:** No (uses `pandoc.wasm`, auto-downloaded at first export)
- **For PDF compilation:** No for the default **Pandoc WASM + Typst** pipeline (auto-downloaded, works on PC **and** mobile). Only the optional native LaTeX route needs Podman/Docker + TeX Live.

### How do I install the plugin?

1. Download `main.js`, `manifest.json` from [Releases](https://github.com/dvrch/mergdown2tex/releases)
2. Copy to `.obsidian/plugins/mergdowntotex/`
3. Enable in Settings → Community Plugins

### Why 2 files only?

- `main.js` - Plugin + embedded WASM converter engine (~8.6 MB, Base64)
- `manifest.json` - Obsidian metadata

!!! tip "Auto-downloaded binaries"
    `pandoc.wasm` (~59 MB) and `typst.wasm` (~28 MB) are **auto-downloaded** into `wasm/` at the first DOCX/PDF export (or via the manual button in settings). They are not part of the release.

---

## Usage

### How do I convert a note?

1. Open any note
2. Run command: `MergDown2TeX: Convertir la note active en LaTeX (.tex)`
3. `.tex` file appears in same folder

### How do I compile to PDF?

1. Open any note
2. Run command: `MergDown2TeX: Convertir et compiler en PDF`
3. PDF file appears in same folder

### How do I compile to DOCX?

1. Open any note
2. Run command: `MergDown2TeX: Convertir et compiler en DOCX (Word)`
3. DOCX file appears in same folder

---

## Features

### Does it support wikilinks?

Yes! `[[Note]]` is converted to `\hyperref[...]{}`.

### Does it support embeds?

Yes! `![[Note]]` is recursively expanded.

### Does it support citations?

Yes! `@citation` is converted to `\citep{}` with bidirectional arrows.

### Does it support Mermaid diagrams?

Yes! `` ```mermaid`` `` is rendered to PNG images.

### Does it support equations?

Yes! `$math$` and `$$math$$` are converted to LaTeX equations.

---

## Compilation

### Do I need TeX Live?

Only for the **optional** native LaTeX PDF pipeline (pdflatex + Podman/Docker). The default **Pandoc WASM + Typst** pipeline requires nothing.

### Do I need Pandoc?

No. DOCX compilation uses **`pandoc.wasm`**, auto-downloaded at first export.

### How do I produce the PDF?

Two pipelines:

- **Pandoc WASM + Typst** (default on mobile; enable *PDF PC via Wasm+Typst* on PC) — no install
- **pdflatex + Podman** (PC, native LaTeX):

```bash
podman build -t vlatex-env -f Dockerfile.vlatex .
```

### How long does compilation take?

- **Markdown → LaTeX:** 0.24s
- **LaTeX → PDF (Typst):** a few seconds
- **LaTeX → PDF (pdflatex + Podman):** 30-60s
- **LaTeX → DOCX (Pandoc WASM):** ~5s

---

## Troubleshooting

### Plugin not appearing?

- Check the 2 files (`main.js`, `manifest.json`) are in the same folder (`.obsidian/plugins/mergdowntotex/`)
- Verify folder name matches `manifest.json`
- Restart Obsidian

### WASM not loading?

- Check `main.js` file size (~8.6 MB) — smaller = dev build without embedded engine
- Re-download if corrupted
- Check Obsidian console for errors

### DOCX / PDF compilation failed?

- Verify `pandoc.wasm` / `typst.wasm` are present in `wasm/` (auto-downloaded at first export)
- Check Podman/Docker is installed + container built (for the native LaTeX pipeline only)
- Check timeout settings

---

## Support

### Where can I get help?

- [GitHub Issues](https://github.com/dvrch/mergdown2tex/issues)
- [Documentation](https://dvrch.github.io/mergdown2tex/)
- [Discord](https://discord.gg/mergdown2tex) (coming soon)

### How do I report a bug?

1. Go to [GitHub Issues](https://github.com/dvrch/mergdown2tex/issues)
2. Click "New issue"
3. Provide:
   - Obsidian version
   - MergDown2TeX version
   - Error message
   - Console logs
   - Document content

---

## Next steps

- [Quick Start](getting-started/quickstart.md) - Convert your first note
- [Features](features/overview.md) - Explore all features
- [Troubleshooting](troubleshooting.md) - Common issues
