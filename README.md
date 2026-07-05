# vLaTeX

Convert Obsidian notes to LaTeX/PDF/DOCX using the [vlatex](https://github.com/dvrch/vlatex) CLI.

## Requirements

- Obsidian desktop (Electron-based)
- [vlatex](https://github.com/dvrch/vlatex) binary installed and in your PATH

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings → Community Plugins
2. Search for "vLaTeX"
3. Install and enable the plugin

### Manual Installation

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/dvrch/obsidian-vlatex-rust/releases)
2. Copy them to your vault's `.obsidian/plugins/vlatex/` directory
3. Enable the plugin in Obsidian Settings → Community Plugins

## Usage

1. Open a markdown note in Obsidian
2. Use the command palette:
   - **vLaTeX: Convert active note to LaTeX** → generates `.tex` file
   - **vLaTeX: Convert and compile to PDF** → generates PDF
   - **vLaTeX: Convert and compile to DOCX** → generates Word document

## Configuration

Open the plugin settings to configure:

- **vlatex path**: Path to the vlatex binary (default: `vlatex`)
- **LaTeX engine**: `pdflatex` or `xelatex`
- **Document title**: Override the document title
- **Author name**: Override the author name
- **Bibliography path**: Path to your `.bib` file
- **Preamble path**: Path to a custom preamble file
- **Keep navigation arrows**: Show citation navigation arrows
- **Include table of contents**: Add TOC to the document
- **Geometry**: Page geometry (e.g., `margin=2.5cm`)

## License

Custom License - see [LICENSE](LICENSE) for details.
