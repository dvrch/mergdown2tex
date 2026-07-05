# vLaTeX Rust

Convert Obsidian notes to LaTeX/PDF using Rust WASM and local TeX Live.

## Features

- Full Obsidian-to-LaTeX conversion (85+ LaTeX commands, 100+ aliases)
- Images and wikilinks resolved relative to the markdown file
- PDF compilation via local TeX Live (pdflatex, biber/bibtex)
- DOCX export support
- Custom preamble support
- Bibliography management with natbib
- Navigation arrows between citations and references

## Requirements

- Obsidian desktop (Electron-based)
- Local TeX Live installation (pdflatex, biber or bibtex)

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings → Community Plugins
2. Search for "vLaTeX Rust"
3. Install and enable the plugin

### Manual Installation

1. Download `main.js`, `manifest.json`, `vlatex.js`, `vlatex_bg.js`, and `vlatex_bg.wasm` from the latest release
2. Copy them to your vault's `.obsidian/plugins/vlatex-rust/` directory
3. Enable the plugin in Obsidian Settings → Community Plugins

## Usage

1. Open a markdown note in Obsidian
2. Click the LaTeX icon in the left sidebar (or use the command palette: "vLaTeX: Convert to LaTeX")
3. The plugin will generate a `.tex` file next to your markdown file
4. Use "vLaTeX: Compile to PDF" to generate a PDF (requires local TeX Live)

## Configuration

Open the plugin settings to configure:

- **Document title**: Override the document title
- **Author name**: Override the author name
- **LaTeX engine**: Choose between pdflatex and xelatex
- **Bibliography path**: Path to your .bib file
- **CSL path**: Path to your .csl file for citation styling
- **Preamble path**: Path to a custom preamble file
- **Keep navigation arrows**: Show/hide citation navigation arrows
- **Table width**: Default table width (0.0-1.0)
- **Include TOC/LOT/LOF**: Toggle table/list of contents/tables/figures

## License

Custom License - see [LICENSE](LICENSE) for details.
