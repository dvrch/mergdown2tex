const { Plugin, Notice, PluginSettingTab, Setting } = require("obsidian");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const DEFAULT_SETTINGS = {
  vlatexPath: "vlatex",
  latexEngine: "pdflatex",
  documentTitle: "",
  authorName: "",
  bibliographyPath: "",
  preamblePath: "",
  keepNavArrows: true,
  defaultTableWidth: "0.95",
  toc: true,
  lot: true,
  lof: true,
  geometry: "margin=2.5cm",
  enableHeader: false,
  headerContent: "",
  enableFooter: false,
  footerContent: "",
};

module.exports = class VlatexPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "vlatex-convert-to-tex",
      name: "Convert active note to LaTeX (.tex)",
      callback: async () => await this.run(""),
    });

    this.addCommand({
      id: "vlatex-compile-to-pdf",
      name: "Convert and compile to PDF",
      callback: async () => await this.run("--pdf"),
    });

    this.addCommand({
      id: "vlatex-compile-to-docx",
      name: "Convert and compile to DOCX (Word)",
      callback: async () => await this.run("--docx"),
    });

    this.addSettingTab(new VlatexSettingTab(this.app, this));
  }

  async run(flags) {
    const file = this.app.workspace.getActiveFile();
    if (!file || file.extension !== "md") {
      new Notice("No active markdown file.");
      return;
    }

    const vaultRoot = this.app.vault.adapter.getBasePath();
    const mdPath = path.join(vaultRoot, file.path);
    const vlatexBin = this.settings.vlatexPath || "vlatex";

    const args = [`"${mdPath}"`];
    if (flags) args.push(flags);

    const configArgs = [];
    if (this.settings.documentTitle)
      configArgs.push(`--title="${this.settings.documentTitle}"`);
    if (this.settings.authorName)
      configArgs.push(`--author="${this.settings.authorName}"`);
    if (this.settings.bibliographyPath)
      configArgs.push(`--bibliography="${this.settings.bibliographyPath}"`);
    if (this.settings.preamblePath)
      configArgs.push(`--preamble="${this.settings.preamblePath}"`);
    if (!this.settings.keepNavArrows) configArgs.push("--no-arrows");
    if (!this.settings.toc) configArgs.push("--no-toc");
    if (this.settings.geometry)
      configArgs.push(`--geometry="${this.settings.geometry}"`);

    const cmd = `${vlatexBin} ${args.join(" ")} ${configArgs.join(" ")}`;
    const label = flags === "--pdf"
      ? "PDF"
      : flags === "--docx"
        ? "DOCX"
        : "LaTeX";
    new Notice(`Compiling ${label}...`);

    exec(cmd, { cwd: vaultRoot, timeout: 300000 }, (err, stdout, stderr) => {
      if (err) {
        console.error("[vlatex]", stderr || err.message);
        new Notice(`Error: ${err.message}`);
        return;
      }
      const output = stdout.trim();
      if (output) console.log("[vlatex]", output);
      new Notice(`${label} done!`);

      if (flags === "--pdf") {
        const pdfPath = path.join(
          path.dirname(mdPath),
          file.basename + ".pdf",
        );
        if (fs.existsSync(pdfPath))
          exec(`xdg-open "${pdfPath}"`, () => {});
      }
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
};

class VlatexSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "vLaTeX Settings" });

    new Setting(containerEl)
      .setName("vlatex path")
      .setDesc("Path to the vlatex binary")
      .addText((t) =>
        t
          .setPlaceholder("vlatex")
          .setValue(this.plugin.settings.vlatexPath)
          .onChange(async (v) => {
            this.plugin.settings.vlatexPath = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("LaTeX engine")
      .setDesc("pdflatex or xelatex")
      .addDropdown((d) =>
        d
          .addOptions({ pdflatex: "pdflatex", xelatex: "xelatex" })
          .setValue(this.plugin.settings.latexEngine)
          .onChange(async (v) => {
            this.plugin.settings.latexEngine = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Document title")
      .setDesc("Override the document title (optional)")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.documentTitle)
          .onChange(async (v) => {
            this.plugin.settings.documentTitle = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Author name")
      .setDesc("Override the author name (optional)")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.authorName)
          .onChange(async (v) => {
            this.plugin.settings.authorName = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Bibliography path")
      .setDesc("Path to .bib file (relative to vault root)")
      .addText((t) =>
        t
          .setPlaceholder("BIBTEX.bib")
          .setValue(this.plugin.settings.bibliographyPath)
          .onChange(async (v) => {
            this.plugin.settings.bibliographyPath = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Preamble path")
      .setDesc("Path to custom preamble file (optional)")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.preamblePath)
          .onChange(async (v) => {
            this.plugin.settings.preamblePath = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Keep navigation arrows")
      .setDesc("Show citation navigation arrows in PDF")
      .addToggle((t) =>
        t
          .setValue(this.plugin.settings.keepNavArrows)
          .onChange(async (v) => {
            this.plugin.settings.keepNavArrows = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Include table of contents")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.toc).onChange(async (v) => {
          this.plugin.settings.toc = v;
          await this.plugin.saveSettings();
        }),
      );

    new Setting(containerEl)
      .setName("Geometry")
      .setDesc("Page geometry (e.g. margin=2.5cm)")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.geometry)
          .onChange(async (v) => {
            this.plugin.settings.geometry = v;
            await this.plugin.saveSettings();
          }),
      );
  }
}
