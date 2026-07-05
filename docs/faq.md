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

- **For conversion:** No (WASM engine runs in Obsidian)
- **For PDF/DOCX compilation:** Yes (TeX Live + Podman/Docker)

### How do I install the plugin?

1. Download `main.js`, `manifest.json`, `vlatex_bg.wasm` from [Releases](https://github.com/dvrch/mergdown2tex/releases)
2. Copy to `.obsidian/plugins/mergdown2tex/`
3. Enable in Settings → Community Plugins

### Why 3 files?

- `main.js` - Plugin code + WASM bindings (merged)
- `manifest.json` - Obsidian metadata
- `vlatex_bg.wasm` - Rust converter engine

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

Yes, for PDF compilation. You can install it via the included Dockerfile.

### Do I need Pandoc?

Yes, for DOCX compilation. It's included in the Dockerfile.

### How do I build the container?

```bash
podman build -t mergdown2tex-env -f Dockerfile .
```

### How long does compilation take?

- **Markdown → LaTeX:** 0.24s
- **LaTeX → PDF:** 30-60s
- **LaTeX → DOCX:** 5-10s

---

## Troubleshooting

### Plugin not appearing?

- Check all 3 files are in the same folder
- Verify folder name matches `manifest.json`
- Restart Obsidian

### WASM not loading?

- Check `vlatex_bg.wasm` file size (~2.1 MB)
- Re-download if corrupted
- Check Obsidian console for errors

### Compilation failed?

- Check Podman/Docker is installed
- Verify container is built
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
