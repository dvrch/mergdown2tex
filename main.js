const { Plugin, Notice, PluginSettingTab, Setting, requestUrl } = require("obsidian");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { exec } = require("child_process");

const WEB_IMG_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

function getWebImageExt(url) {
  const low = url.toLowerCase();
  for (const ext of WEB_IMG_EXTS) {
    if (low.includes(ext)) return ext;
  }
  return ".png";
}

async function ensureWebImages(mdContent, cacheDir) {
  const re = /!\[([^\]]*)\]\(\s*(https?:\/\/[^)]+)\s*\)/g;
  let match;
  let result = mdContent;
  const seen = new Set();
  while ((match = re.exec(mdContent)) !== null) {
    const full = match[0];
    const alt = match[1];
    const url = match[2];
    if (seen.has(url)) continue;
    seen.add(url);
    const key = crypto.createHash("sha256").update(url).digest("hex").slice(0, 16);
    const ext = getWebImageExt(url);
    const localName = `web_${key}${ext}`;
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const localPath = path.join(cacheDir, localName);
    if (!fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
      try {
        const resp = await requestUrl({
          url,
          method: "GET",
          contentType: "application/octet-stream",
          responseType: "arraybuffer",
        });
        let buf;
        if (resp.arrayBuffer) {
          buf = Buffer.from(resp.arrayBuffer);
        } else {
          // Fallback: encode text bytes manually for binary safety
          const raw = resp.text || "";
          buf = Buffer.alloc(raw.length);
          for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i) & 0xff;
        }
        fs.writeFileSync(localPath, buf);
        console.log("[vlatex] downloaded web image:", url, "→", localPath);
      } catch (e) {
        console.warn("[vlatex] cannot download", url, e.message);
        continue;
      }
    }
    result = result.replace(full, `![${alt}](${localPath})`);
  }
  return result;
}

const DEFAULT_SETTINGS = {
  bibliographyPath: "",
  documentTitle: "",
  authorName: "",
  pandocPath: "pandoc",
  latexEngine: "pdflatex",
  keepNavArrows: true,
  cslPath: "",
  preamblePath: "",
  defaultTableWidth: "0.95",
  enableDocxNumbering: true,
  headerContent: "",
  footerContent: "",
  enableHeader: false,
  enableFooter: false,
};

class VLatexSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "vLaTeX WASM Settings" });

    new Setting(containerEl)
      .setName("Chemin de la bibliographie (.bib)")
      .setDesc(
        "Chemin absolu ou relatif depuis la racine du vault vers votre fichier .bib. Laissé vide pour chercher automatiquement.",
      )
      .addText((text) =>
        text
          .setPlaceholder("ex: References/BIBTEX.bib")
          .setValue(this.plugin.settings.bibliographyPath)
          .onChange(async (value) => {
            this.plugin.settings.bibliographyPath = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Titre du document (Force)")
      .setDesc("Écrase le titre extrait du Markdown.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.documentTitle)
          .onChange(async (value) => {
            this.plugin.settings.documentTitle = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Auteur du document (Force)")
      .setDesc("Écrase l'auteur extrait du Markdown.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.authorName)
          .onChange(async (value) => {
            this.plugin.settings.authorName = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Moteur LaTeX")
      .setDesc(
        "Commande ou chemin (ex: pdflatex, xelatex, lualatex). Défaut: pdflatex",
      )
      .addText((text) =>
        text
          .setValue(this.plugin.settings.latexEngine)
          .onChange(async (value) => {
            this.plugin.settings.latexEngine = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Chemin Pandoc")
      .setDesc("Commande ou chemin pour Pandoc. Défaut: pandoc")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.pandocPath)
          .onChange(async (value) => {
            this.plugin.settings.pandocPath = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Conserver les flèches de navigation")
      .setDesc("Garder les flèches ↑↓→ et les hyperliens de référencement croisé dans le DOCX (pratique pour la navigation interactive).")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.keepNavArrows)
          .onChange(async (value) => {
            this.plugin.settings.keepNavArrows = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Fichier CSL (style de citation)")
      .setDesc("Chemin absolu ou relatif depuis la racine du vault vers votre fichier .csl.")
      .addText((text) =>
        text
          .setPlaceholder("ex: Styles/apa.csl")
          .setValue(this.plugin.settings.cslPath)
          .onChange(async (value) => {
            this.plugin.settings.cslPath = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Préambule LaTeX personnalisé")
      .setDesc("Chemin vers un fichier .tex dont le contenu remplacera le préambule généré automatiquement (entre \\documentclass et \\begin{document}).")
      .addText((text) =>
        text
          .setPlaceholder("ex: includes/mypreamble.tex")
          .setValue(this.plugin.settings.preamblePath)
          .onChange(async (value) => {
            this.plugin.settings.preamblePath = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Largeur par défaut des tableaux")
      .setDesc("Fraction de \\textwidth pour les tableaux sans largeur spécifiée (DOCX + PDF). Défaut: 0.95")
      .addText((text) =>
        text
          .setPlaceholder("0.95")
          .setValue(this.plugin.settings.defaultTableWidth)
          .onChange(async (value) => {
            this.plugin.settings.defaultTableWidth = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Numérotation des sections (DOCX)")
      .setDesc("Activer la numérotation automatique des sections dans le document Word.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableDocxNumbering)
          .onChange(async (value) => {
            this.plugin.settings.enableDocxNumbering = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Activer l'en-tête personnalisé")
      .setDesc("Ajouter un texte en haut de chaque page du DOCX.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableHeader)
          .onChange(async (value) => {
            this.plugin.settings.enableHeader = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Contenu de l'en-tête")
      .setDesc("Texte à afficher en en-tête (LaTeX autorisé).")
      .addText((text) =>
        text
          .setPlaceholder("ex: Rapport — \thetitle")
          .setValue(this.plugin.settings.headerContent)
          .onChange(async (value) => {
            this.plugin.settings.headerContent = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Activer le pied de page personnalisé")
      .setDesc("Ajouter un texte en bas de chaque page du DOCX.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableFooter)
          .onChange(async (value) => {
            this.plugin.settings.enableFooter = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Contenu du pied de page")
      .setDesc("Texte à afficher en pied de page (LaTeX autorisé).")
      .addText((text) =>
        text
          .setPlaceholder("ex: Page \thepage")
          .setValue(this.plugin.settings.footerContent)
          .onChange(async (value) => {
            this.plugin.settings.footerContent = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}

module.exports = class VLatexRustPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new VLatexSettingTab(this.app, this));

    try {
      let pluginDir;
      if (this.app.vault.adapter.getBasePath) {
        pluginDir = path.join(
          this.app.vault.adapter.getBasePath(),
          this.manifest.dir,
        );
      } else if (this.app.vault.adapter.getFullPath) {
        pluginDir = this.app.vault.adapter.getFullPath(this.manifest.dir);
      } else {
        pluginDir = path.join(
          process.cwd(),
          this.app.vault.configDir,
          "plugins",
          this.manifest.id,
        );
      }

      const wasmPath = path.join(pluginDir, "vlatex_bg.wasm");
      if (!fs.existsSync(wasmPath)) {
        throw new Error(`vlatex_bg.wasm introuvable: ${wasmPath}`);
      }

      const vlatexPath = path.join(pluginDir, "vlatex.js");
      const vlatexCode = fs.readFileSync(vlatexPath, "utf8");

      // Bypass Obsidian/Electron require() ESM bug
      const vlatexModule = { exports: {} };
      const fn = new Function(
        "module",
        "exports",
        "require",
        "__dirname",
        "__filename",
        vlatexCode,
      );
      fn(vlatexModule, vlatexModule.exports, require, pluginDir, vlatexPath);
      const vlatex = vlatexModule.exports;

      this.vlatex = vlatex;
      await vlatex.initWasm(wasmPath); // Re-enabled: vlatex.js is patched to use initWasm
      new Notice("vLaTeX Rust (WASM) chargé avec succès !");
    } catch (e) {
      console.error("[vlatex] FATAL:", e);
      new Notice("Erreur vLaTeX : " + e.message);
    }

    this.addCommand({
      id: "vlatex-convert-to-tex",
      name: "vLaTeX Rust: Convertir la note active en LaTeX (.tex)",
      callback: async () => {
        await this.convertToTex();
      },
    });

    this.addCommand({
      id: "vlatex-compile-to-pdf",
      name: "vLaTeX Rust: Convertir et compiler en PDF",
      callback: async () => {
        await this.compilePdf();
      },
    });

    this.addCommand({
      id: "vlatex-compile-to-docx",
      name: "vLaTeX Rust: Convertir et compiler en DOCX (Word)",
      callback: async () => {
        await this.compileDocx();
      },
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async getFilePaths() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      new Notice("Aucun fichier actif.");
      return null;
    }
    if (activeFile.extension !== "md") {
      new Notice("Le fichier actif n'est pas un fichier Markdown.");
      return null;
    }
    const vaultRoot = this.app.vault.adapter.getBasePath();
    const mdPath = path.join(vaultRoot, activeFile.path);
    const parentDir = path.dirname(mdPath);
    const fileStem = activeFile.basename;
    const content = await this.app.vault.read(activeFile);
    console.log("[vlatex] active file:", mdPath);
    return { vaultRoot, mdPath, parentDir, fileStem, content, activeFile };
  }

  /// Resolve Dataview inline queries (`=expression`) using the Dataview API if available.
  /// Falls back to stripping the raw inline code if Dataview is not available.
  processDataviewInline(content, sourceFile) {
    const dvApi = this.app.plugins?.plugins?.dataview?.api;
    return content.replace(/`=([^`]+)`/g, (full, expr) => {
      const trimmed = expr.trim();
      let resolved = "";
      if (dvApi && dvApi.evaluateInline) {
        try {
          // evaluateInline expects the full inline span (`` `=choice(...)` ``) not just the inner expression
          resolved = dvApi.evaluateInline(full, sourceFile)?.value?.toString() || "";
        } catch (e) {
          console.log("[vlatex] Dataview evalInline failed:", full, e.message);
        }
      } else if (dvApi && dvApi.tryEvaluate) {
        try {
          // tryEvaluate expects the expression without the leading =
          resolved = dvApi.tryEvaluate(trimmed, {})?.toString() || "";
        } catch (e) {
          console.log("[vlatex] Dataview tryEvaluate failed:", trimmed, e.message);
        }
      }
      // If both fail, keep the original expression so the user can see it wasn't resolved
      if (!resolved) resolved = full;
      return resolved;
    });
  }

  async processEmbeds(content, sourceFile, vaultRoot, parentDir, depth = 0) {
    if (depth > 10) return { processed: content, vfs: {} };
    const vfs = {};
    let processed = content;

    // 1. Process mermaid blocks first
    const mermaidRegex = /```mermaid\s*\n([\s\S]+?)```/g;
    let mermaidMatch;
    let mermaidIndex = 0;
    const cacheDir = path.join(parentDir, "mermaid_diagrams");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Use an array to store replacements so we can replace them asynchronously
    const mermaidReplacements = [];
    while ((mermaidMatch = mermaidRegex.exec(content)) !== null) {
      const def = mermaidMatch[1];
      const original = mermaidMatch[0];
      const mmdPath = path.join(
        cacheDir,
        `diagram_${Date.now()}_${mermaidIndex}.mmd`,
      );
      const pngPath = path.join(
        cacheDir,
        `diagram_${Date.now()}_${mermaidIndex}.png`,
      );
      fs.writeFileSync(mmdPath, def);
      mermaidReplacements.push({ original, def, mmdPath, pngPath });
      mermaidIndex++;
    }

    for (let i = 0; i < mermaidReplacements.length; i++) {
      const r = mermaidReplacements[i];
      const original = r.original, def = r.def, mmdPath = r.mmdPath, pngPath = r.pngPath;
      try {
        await new Promise((resolve, reject) => {
          const mmdcCmd = `mmdc -i "${mmdPath}" -o "${pngPath}" -b white`;
          exec(mmdcCmd, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        // Use simple relative path: mermaid_diagrams/xxx.png (from parentDir)
        const captionText = (def.trim().split('\n')[0] || 'Diagramme')
          .replace(/[&%$#_{}~^\\<>|]/g, (c) => '\\' + c)
          .slice(0, 60);
        processed = processed.replace(
          original,
          `\\begin{figure}[H]\n\\centering\n\\includegraphics[width=1.0\\linewidth,height=0.4\\textheight,keepaspectratio]{mermaid_diagrams/${path.basename(pngPath)}}\n\\caption{${captionText}}\n\\end{figure}`,
        );
        fs.unlinkSync(mmdPath);
      } catch (e) {
        console.error("[vlatex] mermaid error:", e);
      }
    }

    // 2. Process regular Obsidian embeds ![[...]]
    const pattern = /!\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]\n]+))?\]\]/g;
    const matches = [];
    let m;
    while ((m = pattern.exec(processed)) !== null) {
      matches.push({ full: m[0], fileRef: m[1] });
    }

    for (const { full, fileRef } of matches) {
      let resolved = this.app.metadataCache.getFirstLinkpathDest(
        fileRef,
        sourceFile.path,
      );
      let absPath = "";
      let extension = "";

      if (!resolved) {
        // It might be an absolute path (like our generated mermaid pngs)
        if (path.isAbsolute(fileRef) && fs.existsSync(fileRef)) {
          absPath = fileRef;
          extension = path.extname(fileRef).slice(1);
        } else {
          console.log("[vlatex] cannot resolve embed:", fileRef);
          continue;
        }
      } else {
        absPath = path.join(vaultRoot, resolved.path);
        extension = resolved.extension;
      }

      if (extension === "md") {
        if (!vfs[absPath] && resolved) {
          const rawContent = await this.app.vault.read(resolved);
          const { processed: pContent } = await this.processEmbeds(
            rawContent,
            resolved,
            vaultRoot,
            parentDir,
            depth + 1,
          );
          vfs[absPath] = pContent;
        }
      } else if (
        ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(extension)
      ) {
        // Use relative path for portability and Podman compatibility
        const relPath = path.relative(parentDir, absPath);
        processed = processed.replaceAll(
          full,
          `\\includegraphics[width=0.95\\linewidth]{${relPath}}`,
        );
      }
    }
    return { processed, vfs };
  }

  assembleFullDocument(content, body, includeToc, vaultRoot, parentDir) {
    console.log("[vlatex] assembling full document...");
    let bibPaths = [];
    try {
      const inlineBibPathsJson =
        this.vlatex.extract_bibliography_paths(content);
      bibPaths = JSON.parse(inlineBibPathsJson);
    } catch (e) {
      console.error("[vlatex] bib paths error:", e);
    }

    if (bibPaths.length === 0 && this.settings.bibliographyPath) {
      let configuredPath = this.settings.bibliographyPath;
      if (!path.isAbsolute(configuredPath)) {
        configuredPath = path.join(vaultRoot, configuredPath);
      }
      bibPaths.push(configuredPath);
    }

    let cites = [];
    try {
      const citationsJson = this.vlatex.extract_citations(body);
      cites = JSON.parse(citationsJson);
    } catch (e) {
      console.error("[vlatex] citations error:", e);
    }

    if (bibPaths.length === 0 && cites.length > 0) {
      // Auto-detect .bib files in parentDir
      try {
        const files = fs.readdirSync(parentDir);
        for (const file of files) {
          if (file.endsWith(".bib")) {
            bibPaths.push(path.join(parentDir, file));
          }
        }
      } catch (e) {
        console.error("[vlatex] Error scanning for .bib files:", e);
      }
    }

    let bibSection = "";
    if (cites.length > 0 || bibPaths.length > 0) {
      const bibStyle = cites.length === 0 ? "" : "References";
      // Convert bibPaths to be relative to parentDir for LaTeX
      const relBibPaths = bibPaths.map((p) => path.relative(parentDir, p));
      bibSection =
        this.vlatex.generate_full_bibliography(
          JSON.stringify(cites),
          JSON.stringify(relBibPaths),
          bibStyle,
        ) + "\n";
    }

    const titleOverride = this.settings.documentTitle || "";
    const authorOverride = this.settings.authorName || "";

    let header = this.vlatex.generate_tex_header(
      "default",
      content,
      titleOverride,
      authorOverride,
      includeToc,
      includeToc,
      includeToc,
    );
    const footer = this.vlatex.generate_tex_footer();

    // Manual injection of bib resources if WASM is not updated
    if (bibPaths.length > 0 && !header.includes("\\addbibresource")) {
      bibPaths.forEach((p) => {
        const rel = path.relative(parentDir, p);
        header = header.replace(
          "\\begin{document}",
          `\\addbibresource{${rel}}\n\\begin{document}`,
        );
      });
    }

    // Extract title to return it for DOCX
    let title = titleOverride;
    if (!title) {
      const titleMatch = /^title:\s*(.*)$/m.exec(content);
      if (titleMatch) title = titleMatch[1].trim();
      else {
        const h1Match = /^#\s+(.*)$/m.exec(content);
        if (h1Match) title = h1Match[1].trim();
      }
    }

    let finalTex = header + "\n" + body + "\n" + bibSection + footer;

    // Custom preamble override
    if (this.settings.preamblePath) {
      const preambleAbs = path.isAbsolute(this.settings.preamblePath)
        ? this.settings.preamblePath
        : path.join(vaultRoot, this.settings.preamblePath);
      try {
        const customPreamble = fs.readFileSync(preambleAbs, "utf-8");
        // Replace everything between \documentclass and \begin{document}
        const docClassRe = /^(.*?\\documentclass[^\n]*\n)([\s\S]*?)(\\begin\{document\})/m;
        finalTex = finalTex.replace(docClassRe, "$1" + customPreamble + "\n$3");
        console.log("[vlatex] custom preamble applied from", preambleAbs);
      } catch (e) {
        console.error("[vlatex] cannot read preamble:", e);
      }
    }

    // Remove duplicate first section heading if it matches the document title
    if (title) {
      const sectionRe = new RegExp(`\\\\section\\{${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\s*`);
      const firstSection = finalTex.match(/(?:\n|^)(\\section\{.*?\})/);
      if (firstSection && firstSection[1].includes(title)) {
        finalTex = finalTex.replace(firstSection[1], "");
      }
    }

    return {
      tex: finalTex,
      title: title,
    };
  }

  async convertToTex() {
    if (!this.vlatex) {
      new Notice("vLaTeX WASM non initialisé.");
      return;
    }
    const fp = await this.getFilePaths();
    if (!fp) return;
    const { vaultRoot, mdPath, parentDir, fileStem, content: rawContent, activeFile } = fp;
    let content = this.processDataviewInline(rawContent, activeFile);
    try {
      new Notice("Conversion WASM en cours...");
      console.log("[vlatex] processing embeds + building VFS...");
      let { processed, vfs } = await this.processEmbeds(
        content,
        activeFile,
        vaultRoot,
        parentDir,
      );
      const webCacheDir = path.join(parentDir, "embedded_images");
      processed = await ensureWebImages(processed, webCacheDir);
      const vfsJson = JSON.stringify(vfs);
      console.log("[vlatex] expanding content...");
      const expanded = this.vlatex.expand_wikilinks_with_vfs(
        processed,
        vaultRoot,
        mdPath,
        vfsJson,
      );
      console.log("[vlatex] converting to LaTeX body...");
      const body = this.vlatex.markdown_to_latex_with_vfs(
        expanded,
        "default",
        vfsJson,
      );
      const fullTex = this.assembleFullDocument(
        content,
        body,
        true,
        vaultRoot,
        parentDir,
      );

      const texPath = path.join(parentDir, fileStem + ".tex");
      fs.writeFileSync(texPath, fullTex.tex, "utf-8");
      // Nettoyer les anciens fichiers auxiliaires (labels périmés → \endcsname crash, .bbl flèches périmées)
      for (const ext of [".aux", ".bbl", ".bcf", ".out", ".log", ".toc", ".lof", ".lot"]) {
        const p = path.join(parentDir, fileStem + ext);
        try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch {}
      }
      console.log(
        "[vlatex] .tex written to",
        texPath,
        fullTex.tex.length,
        "bytes",
      );
      new Notice(
        "✅ LaTeX généré: " +
          fileStem +
          ".tex (" +
          fullTex.tex.length +
          " bytes)",
      );
    } catch (err) {
      console.error("[vlatex] convert error:", err);
      new Notice("❌ Erreur: " + err.message);
    }
  }

  runPdflatex(texPath, parentDir, fileStem, vaultRoot, callback, fullTexString) {
    let pass = 0;
    const engine = this.settings.latexEngine || "pdflatex";
    // Mount the entire vault root to /vault. Input file is relative to vault root.
    const relTexPath = path.relative(vaultRoot, texPath);
    const relParentDir = path.relative(vaultRoot, parentDir);

    const cmd = `podman run --rm -v "${vaultRoot}:/vault" vlatex-env ${engine} -interaction=nonstopmode -shell-escape -output-directory="/vault/${relParentDir}" "/vault/${relTexPath}"`;
    const opts = { cwd: parentDir };
    const runPass = () => {
      pass++;
      console.log(`[vlatex] ${engine} pass ${pass} (podman)`);
      exec(cmd, opts, (err, stdout, stderr) => {
        console.log(`[vlatex] ${engine} pass ${pass} done`);
        if (stdout) console.log(`[vlatex] stdout:`, stdout.slice(-500));
        if (stderr) console.log(`[vlatex] stderr:`, stderr.slice(-500));
        if (err) console.log(`[vlatex] err:`, err.message);
        if (pass < 3) runPass();
        else {
          const runFinalPass = () => {
            exec(cmd, opts, () => {
              const pdfPath = path.join(parentDir, fileStem + ".pdf");
              if (fs.existsSync(pdfPath)) callback(null, pdfPath);
              else callback(new Error("PDF not generated"), pdfPath);
            });
          };
          const postProcessBbl = () => {
            try {
              const bblPath = path.join(parentDir, fileStem + ".bbl");
              if (fs.existsSync(bblPath)) {
                const bblContent = fs.readFileSync(bblPath, "utf-8");
                if (fullTexString && this.vlatex.add_citation_arrows_to_bbl) {
                  const modifiedBbl = this.vlatex.add_citation_arrows_to_bbl(bblContent, fullTexString);
                  fs.writeFileSync(bblPath, modifiedBbl, "utf-8");
                  const arrowCount = (modifiedBbl.match(/hyperlink\{cite-call-/g) || []).length;
                  console.log("[vlatex] per-entry citation arrows injected into .bbl — arrows added:", arrowCount);
                }
              } else {
                console.log("[vlatex] bbl NOT FOUND at", bblPath);
              }
            } catch (bblErr) {
              console.error("[vlatex] bbl arrows error:", bblErr);
            }
            runFinalPass();
          };
          // Try running biber (biblatex) or bibtex (natbib)
          const bcfPath = path.join(parentDir, fileStem + ".bcf");
          const auxPath = path.join(parentDir, fileStem + ".aux");
          if (fs.existsSync(bcfPath)) {
            console.log(`[vlatex] running biber (podman)`);
            const biberCmd = `podman run --rm -v "${vaultRoot}:/vault" --workdir="/vault/${relParentDir}" vlatex-env biber "${fileStem}"`;
            exec(biberCmd, opts, () => { postProcessBbl(); });
          } else if (fs.existsSync(auxPath)) {
            // Check if .aux has \bibstyle command (natbib/bibtex)
            const auxContent = fs.readFileSync(auxPath, "utf-8");
            if (auxContent.includes("\\bibstyle")) {
              console.log(`[vlatex] running bibtex (podman)`);
              const bibtexCmd = `podman run --rm -v "${vaultRoot}:/vault" --workdir="/vault/${relParentDir}" vlatex-env bibtex "${fileStem}"`;
              exec(bibtexCmd, opts, () => { postProcessBbl(); });
            } else {
              runFinalPass();
            }
          } else {
            runFinalPass();
          }
        }
      });
    };
    runPass();
  }

  async compilePdf() {
    if (!this.vlatex) {
      new Notice("vLaTeX WASM non initialisé.");
      return;
    }
    const fp = await this.getFilePaths();
    if (!fp) return;
    const { vaultRoot, mdPath, parentDir, fileStem, content: rawContent, activeFile } = fp;
    let content = this.processDataviewInline(rawContent, activeFile);
    try {
      new Notice(
        `Conversion WASM + compilation PDF (${this.settings.latexEngine || "pdflatex"})...`,
      );
      console.log("[vlatex] processing embeds + building VFS...");
      let { processed, vfs } = await this.processEmbeds(
        content,
        activeFile,
        vaultRoot,
        parentDir,
      );
      const webCacheDir = path.join(parentDir, "embedded_images");
      processed = await ensureWebImages(processed, webCacheDir);
      const vfsJson = JSON.stringify(vfs);
      console.log("[vlatex] expanding content...");
      const expanded = this.vlatex.expand_wikilinks_with_vfs(
        processed,
        vaultRoot,
        mdPath,
        vfsJson,
      );
      console.log("[vlatex] converting to LaTeX body...");
      const body = this.vlatex.markdown_to_latex_with_vfs(
        expanded,
        "default",
        vfsJson,
      );
      const { tex: plainTex } = this.assembleFullDocument(
        content,
        body,
        true,
        vaultRoot,
        parentDir,
      );

      // Add citation navigation arrows (↑/↓) for PDF
      let fullTexString = plainTex;
      try {
        fullTexString = this.vlatex.add_citation_navigation(plainTex);
        console.log("[vlatex] citation navigation arrows added");
      } catch (e) {
        console.log("[vlatex] citation navigation not available (old WASM):", e.message);
      }

      // Inject header/footer for PDF via fancyhdr — same as DOCX: header right, footer left text + right page#, gray
      let fancySetup = "";
      if (this.settings.enableHeader || this.settings.enableFooter) {
        fancySetup += "\\usepackage{fancyhdr}\n\\pagestyle{fancy}\n\\fancyhf{}\n\\renewcommand{\\headrule}{{\\color{gray}\\rule{\\headwidth}{\\headrulewidth}}}\n\\renewcommand{\\footrule}{{\\color{gray}\\rule{\\headwidth}{\\headrulewidth}}}\n";
        if (this.settings.enableHeader && this.settings.headerContent) {
          fancySetup += "\\fancyhead[R]{{\\color{gray!60}\\small " + this.settings.headerContent + "}}\n";
        }
        if (this.settings.enableFooter && this.settings.footerContent) {
          // Strip \thepage from user text to avoid duplication (page number is added on the right)
          let cleanFooter = this.settings.footerContent.replace(/\\(?:thepage|thePage|thePage)\b/g, "").replace(/Page\b/g, "").trim();
          if (cleanFooter) {
            fancySetup += "\\fancyfoot[L]{{\\color{gray!60}\\small " + cleanFooter + "}}\n";
          }
          fancySetup += "\\fancyfoot[R]{\\thepage}\n";
        }
      }
      if (fancySetup) {
        fullTexString = fullTexString.replace("\\begin{document}", fancySetup + "\\begin{document}\n");
      }

      const texPath = path.join(parentDir, fileStem + ".tex");
      fs.writeFileSync(texPath, fullTexString, "utf-8");
      console.log("[vlatex] .tex written:", fullTexString.length, "bytes");
      this.runPdflatex(
        texPath,
        parentDir,
        fileStem,
        vaultRoot,
        (error, pdfPath) => {
          if (error) {
            new Notice("⚠️ PDF avec avertissements (pdflatex)");
          } else {
            new Notice("✅ PDF compilé!");
            exec(`xdg-open "${pdfPath}"`, () => {});
          }
        },
        fullTexString,
      );
    } catch (err) {
      console.error("[vlatex] pdf error:", err);
      new Notice("❌ Erreur: " + err.message);
    }
  }

  async compileDocx() {
    if (!this.vlatex) {
      new Notice("vLaTeX WASM non initialisé.");
      return;
    }
    const fp = await this.getFilePaths();
    if (!fp) return;
    const { vaultRoot, mdPath, parentDir, fileStem, content: rawContent, activeFile } = fp;
    let content = this.processDataviewInline(rawContent, activeFile);
    try {
      new Notice(
        `Conversion WASM + compilation DOCX (${this.settings.pandocPath || "pandoc"})...`,
      );
      console.log("[vlatex] processing embeds + building VFS...");
      let { processed, vfs } = await this.processEmbeds(
        content,
        activeFile,
        vaultRoot,
        parentDir,
      );
      const webCacheDir = path.join(parentDir, "embedded_images");
      processed = await ensureWebImages(processed, webCacheDir);
      const vfsJson = JSON.stringify(vfs);
      console.log("[vlatex] expanding content...");
      const expanded = this.vlatex.expand_wikilinks_with_vfs(
        processed,
        vaultRoot,
        mdPath,
        vfsJson,
      );
      console.log("[vlatex] converting to LaTeX body...");
      const body = this.vlatex.markdown_to_latex_with_vfs(
        expanded,
        "default",
        vfsJson,
      );
      const { tex: fullTex, title: docTitle } = this.assembleFullDocument(
        content,
        body,
        false,
        vaultRoot,
        parentDir,
      );

      console.log("[vlatex] preparing for pandoc...");
      const docxTex = this.vlatex.prepare_latex_for_docx_full(fullTex, this.settings.keepNavArrows, this.settings.defaultTableWidth || "0.95");

      const docxTexPath = path.join(parentDir, fileStem + "_docx.tex");

      // Evaluate LATEXBLOCK markers (```latex code blocks) via pdflatex+pdftotext
      // so the rendered text appears in the DOCX instead of being dropped by pandoc.
      const renderLatex = async (latexCode) => {
        return new Promise((resolve, reject) => {
          const tmpDir = parentDir;
          const stem = `_latexblock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
          const texTmp = path.join(tmpDir, stem + ".tex");
          const pdfTmp = path.join(tmpDir, stem + ".pdf");
          const txtTmp = path.join(tmpDir, stem + ".txt");
          const doc = `\\documentclass{article}\\usepackage[utf8]{inputenc}\\usepackage[T1]{fontenc}\\usepackage{amsmath,amssymb,graphicx,hyperref}\\usepackage{lipsum}\\begin{document}\\nohyperpage\\nopagecolor\\pagestyle{empty}${latexCode}\\end{document}`;
          fs.writeFileSync(texTmp, doc, "utf-8");
          const rel = path.relative(vaultRoot, tmpDir);
          const base = path.basename(stem);
          exec(`podman run --rm -v "${vaultRoot}:/vault" vlatex-env pdflatex -interaction=nonstopmode "/vault/${rel}/${stem}.tex"`, (err) => {
            if (err) { resolve(latexCode); cleanup(); return; }
            exec(`podman run --rm -v "${vaultRoot}:/vault" vlatex-env pdftotext "/vault/${rel}/${stem}.pdf" "/vault/${rel}/${stem}.txt"`, (err2) => {
              if (err2) { resolve(latexCode); cleanup(); return; }
              try {
                const txt = fs.readFileSync(txtTmp, "utf-8").trim();
                resolve(txt || latexCode);
              } catch { resolve(latexCode); }
              cleanup();
            });
          });
          const cleanup = () => {
            try { fs.unlinkSync(texTmp); } catch {}
            try { fs.unlinkSync(pdfTmp); } catch {}
            try { fs.unlinkSync(txtTmp); } catch {}
            try { fs.unlinkSync(path.join(tmpDir, stem + ".log")); } catch {}
            try { fs.unlinkSync(path.join(tmpDir, stem + ".aux")); } catch {}
            try { fs.unlinkSync(path.join(tmpDir, stem + ".out")); } catch {}
          };
        });
      };
      let docxTexEval = docxTex;
      const lbRe = /% LATEXBLOCK\n([\s\S]*?)% \/LATEXBLOCK/g;
      let lbMatch;
      while ((lbMatch = lbRe.exec(docxTex)) !== null) {
        const code = lbMatch[1].trim().replace(/#&/g, "&");
        const rendered = await renderLatex(code);
        docxTexEval = docxTexEval.replace(lbMatch[0], rendered);
      }
      // Strip any stray \begin{document} / \end{document} / \documentclass / \usepackage
      // that may have leaked into body (pandoc doesn't tolerate these in the body)
      docxTexEval = docxTexEval
        .replace(/\\begin\{document\}/g, '')
        .replace(/\\end\{document\}/g, '')
        .replace(/\\documentclass\s*\[[^\]]*\]\s*\{[^}]*\}/g, '')
        .replace(/\\documentclass\s*\{[^}]*\}/g, '')
        .replace(/\\usepackage\s*(?:\[[^\]]*\])?\s*\{[^}]*\}/g, '')
        .replace(/\\RequirePackage\s*(?:\[[^\]]*\])?\s*\{[^}]*\}/g, '')
        .replace(/\\documentstyle\s*(?:\[[^\]]*\])?\s*\{[^}]*\}/g, '')
        .replace(/\\providecommand\{\\defaulttablewidth\}\{[^}]*\}/g, '');
      // Wrap in a minimal preamble with hypersetup so pandoc enables colored links in DOCX
      const docxPreamble = `\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage{hyperref}\n\\usepackage{xcolor}\n\\hypersetup{\n  colorlinks=true,\n  linkcolor=blue,\n  urlcolor=blue,\n  citecolor=blue\n}\n\\begin{document}\n`;
      fs.writeFileSync(docxTexPath, docxPreamble + docxTexEval + "\n\\end{document}\n", "utf-8");

      // Extract bibPaths again for pandoc
      let bibPaths = [];
      try {
        bibPaths = JSON.parse(this.vlatex.extract_bibliography_paths(content));
      } catch (e) {}
      if (bibPaths.length === 0 && this.settings.bibliographyPath) {
        bibPaths.push(
          path.isAbsolute(this.settings.bibliographyPath)
            ? this.settings.bibliographyPath
            : path.join(vaultRoot, this.settings.bibliographyPath),
        );
      }
      if (bibPaths.length === 0) {
        try {
          const files = fs.readdirSync(parentDir);
          for (const file of files)
            if (file.endsWith(".bib"))
              bibPaths.push(path.join(parentDir, file));
        } catch (e) {}
      }

      const pandocBin = this.settings.pandocPath || "pandoc";
      const docxFileName = fileStem + ".docx";
      const docxTexFileName = fileStem + "_docx.tex";
      const relParentDir = path.relative(vaultRoot, parentDir);

      const numberSectionsFlag = this.settings.enableDocxNumbering ? " --number-sections" : "";
      let pandocArgs = `podman run --rm -v "${vaultRoot}:/vault" vlatex-env ${pandocBin} "/vault/${relParentDir}/${docxTexFileName}" -o "/vault/${relParentDir}/${docxFileName}" --mathml --resource-path="/vault:/vault/${relParentDir}" --embed-resources --standalone --toc --toc-depth=6${numberSectionsFlag}`;

      if (bibPaths.length > 0) {
        const bibPath = bibPaths[0];
        const relBibPath = path.relative(vaultRoot, bibPath);
        pandocArgs += ` --bibliography="/vault/${relBibPath}" --citeproc`;
      }
      if (this.settings.cslPath) {
        const cslAbs = path.isAbsolute(this.settings.cslPath)
          ? this.settings.cslPath
          : path.join(vaultRoot, this.settings.cslPath);
        const relCsl = path.relative(vaultRoot, cslAbs);
        pandocArgs += ` --csl="/vault/${relCsl}"`;
      }

      console.log("[vlatex] docx cmd:", pandocArgs);
      exec(pandocArgs, (error, stdout, stderr) => {
        if (stdout) console.log("[vlatex] pandoc stdout:", stdout);
        if (error) {
          console.log("[vlatex] pandoc error:", error);
          console.log("[vlatex] pandoc stderr:", stderr);
          new Notice("❌ Erreur pandoc: " + error.message);
        } else {
          console.log("[vlatex] DOCX success");
          // Post-process DOCX: add bidirectional citation arrows (↑/↓)
          let docxPath = path.join(parentDir, fileStem + ".docx");
          try {
            let docxBytes = fs.readFileSync(docxPath);
            const arrowBytes = this.vlatex.modify_docx_arrows(docxBytes, docxTex);
            docxBytes = arrowBytes;
            console.log("[vlatex] arrows: ok");
            // Post-process DOCX: add headers/footers
            const hfBytes = this.vlatex.add_docx_header_footer(
              docxBytes,
              this.settings.headerContent || "",
              this.settings.footerContent || "",
              this.settings.enableHeader || false,
              this.settings.enableFooter || false,
            );
            docxBytes = hfBytes;
            console.log("[vlatex] header/footer: ok");
            // Post-process DOCX: add table cell colors from \rowcolor
            const tcBytes = this.vlatex.add_docx_table_colors(docxBytes, docxTex);
            docxBytes = tcBytes;
            console.log("[vlatex] table colors: ok");
            fs.writeFileSync(docxPath, docxBytes);
          } catch (postErr) {
            console.error("[vlatex] post-processing error:", postErr);
          }
          new Notice("✅ DOCX compilé!");
          exec(
            `xdg-open "${path.join(parentDir, fileStem + ".docx")}"`,
            () => {},
          );
        }
      });
    } catch (err) {
      console.error("[vlatex] docx error:", err);
      new Notice("❌ Erreur: " + err.message);
    }
  }
};
