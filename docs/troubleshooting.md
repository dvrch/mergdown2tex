# Troubleshooting

Common issues and solutions.

---

## Plugin issues

### Plugin not appearing

**Symptoms:**
- Plugin not listed in Community plugins
- Commands not available

**Solutions:**
1. Check the 2 files (`main.js`, `manifest.json`) are in the same folder (`.obsidian/plugins/mergdowntotex/`)
2. Verify folder name matches `manifest.json` (`mergdowntotex`)
3. Restart Obsidian
4. Check Obsidian console (`Ctrl/Cmd + Shift + I`)

### WASM not loading

**Symptoms:**
- Error: "WASM module not loaded"
- Plugin crashes on startup

**Solutions:**
1. Check `main.js` file size (~8.6 MB) — a smaller file = dev build **without** the embedded WASM engine
2. Re-download the release if the file seems corrupted
3. Verify file permissions
4. Check Obsidian console for errors

!!! info "The WASM engine is embedded"
    The Markdown → LaTeX engine is embedded **inside** `main.js` (Base64). There is no separate `vlatex_bg.wasm` to download. The large binaries `pandoc.wasm` (~59 MB) and `typst.wasm` (~28 MB) are auto-downloaded into `wasm/` for DOCX/PDF compilation only.

### Settings not saving

**Symptoms:**
- Settings reset after restart
- Changes not applied

**Solutions:**
1. Check file permissions
2. Verify Obsidian data folder
3. Restart Obsidian

---

## Compilation issues

### Container not found

**Error:**
```
Error: no such container: mergdown2tex-env
```

**Solution:**
```bash
# Build container
podman build -t mergdown2tex-env -f Dockerfile .

# Or start existing
podman start mergdown2tex-env
```

### Podman not found

**Error:**
```
podman: command not found
```

**Solution:**
1. Install Podman: https://podman.io/getting-started/installation
2. Or use Docker instead
3. **Or use the Typst pipeline**: enable *PDF PC via Wasm+Typst* in settings (no Install required)

### pandoc.wasm / typst.wasm missing

**Error:**
```
pandoc.wasm absent — téléchargement automatique en cours...
```
or
```
Échec installation Typst: ...
```

**Solution:**
1. Wait for the automatic download at first export (layers ~59 MB + ~28 MB, requires internet)
2. Or click the manual download button in the settings (*Moteur Pandoc WASM (DOCX)* / *Moteur Typst WASM (PDF)*)
3. Verify `wasm/` folder exists next to `main.js`

### DOCX compilation error (Pandoc WASM)

**Error:**
```
❌ Erreur Pandoc WASM: ...
```

**Solution:**
1. Verify `pandoc.wasm` is present in `wasm/`
2. Re-download via the settings button
3. Check the console for the detailed message

### Typst compilation error (PDF)

**Error:**
```
❌ Compilation Typst échouée : ...
```

**Solution:**
1. Enable *Garder le .typ* in settings and inspect the intermediate `.typ` file
2. Verify `typst.wasm` and fonts are installed (download button in settings)
3. Simplify the document if the error is a Typst syntax issue

### Compilation timeout

**Error:**
```
Compilation timeout
```

**Solutions:**
1. Increase timeout in settings
2. Simplify document
3. Check for infinite loops
4. Verify container is running

### Permission denied

**Error:**
```
Permission denied
```

**Solution:**
```bash
# Use privileged flag
podman run --rm --privileged mergdown2tex-env pdflatex document.tex
```

---

## LaTeX issues

### Missing package

**Error:**
```
! LaTeX Error: File 'package.sty' not found.
```

**Solution:**
1. Rebuild container with required package
2. Add to custom preamble
3. Use alternative package

### Undefined reference

**Error:**
```
LaTeX Warning: Reference '...' on page ... undefined.
```

**Solution:**
1. Run pdflatex multiple times
2. Check label/cite syntax
3. Verify `.bib` file

### Missing $ inserted

**Error:**
```
! Missing $ inserted.
```

**Solution:**
1. Check math mode
2. Escape special characters: `\$`, `\%`, `\#`
3. Verify LaTeX syntax

---

## Image issues

### Image not found

**Error:**
```
! LaTeX Error: File 'image.png' not found.
```

**Solutions:**
1. Check image path
2. Verify file exists
3. Use absolute path
4. Check case sensitivity

### Image too large

**Error:**
```
! Dimension too large.
```

**Solutions:**
1. Resize image
2. Use `keepaspectratio`
3. Convert to PDF

---

## Citation issues

### Citation not found

**Error:**
```
Citation '...' on page ... undefined.
```

**Solutions:**
1. Check `.bib` file for key
2. Verify spelling
3. Add entry to `.bib` file
4. Run bibtex

### Bibliography not rendering

**Error:**
```
Empty bibliography
```

**Solutions:**
1. Check `bibliography` setting in YAML
2. Verify `.bib` file path
3. Run pdflatex 3 times

---

## Mermaid issues

### Diagram not rendering

**Error:**
```
Mermaid render failed
```

**Solutions:**
1. Check Mermaid syntax
2. Verify special characters
3. Try simpler diagram
4. Check write permissions

### Image not found

**Error:**
```
File not found: figures/diagram_1.png
```

**Solutions:**
1. Check `figures/` folder exists
2. Verify write permissions
3. Check disk space

---

## Performance issues

### Slow conversion

**Solutions:**
1. Reduce embed depth
2. Simplify document
3. Disable unused features
4. Check system resources

### Slow compilation

**Solutions:**
1. Reduce document complexity
2. Optimize images
3. Use faster container
4. Increase timeout

---

## Getting help

### Collect information

1. Obsidian version
2. MergDown2TeX version
3. Error message
4. Console logs (`Ctrl/Cmd + Shift + I`)
5. Document content

### Report issue

1. Go to [GitHub Issues](https://github.com/dvrch/mergdown2tex/issues)
2. Click "New issue"
3. Provide information above
4. Attach relevant files

---

## Next steps

- [FAQ](faq.md) - Frequently asked questions
- [Commands](reference/commands.md) - Available commands
- [Settings](reference/settings.md) - Configuration options
