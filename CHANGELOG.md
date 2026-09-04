# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

## [2.0.3] — 2026-09-05

### Corrigé
- **Suppression de la balise `<script>` dynamique** (`document.createElement("script")`) dans `_getMermaid` : code bloquant relevé par la revue automatique Obsidian. Le module Mermaid est désormais chargé par évaluation directe du bundle (IIFE) — plus aucune injection de balise au runtime.
- **README** : premier titre aligné sur le nom du manifest (`# mergdowntotex`), corrigeant l'avertissement de la revue automatique.

## [2.0.2] — 2026-09-05

### Changé
- **`main.js` repassé sous la limite des 5 Mo** (3 852 Ko au lieu de 8 608 Ko) : le module `mermaid.min.js` n'est plus embarqué en base64 dans le bundle. Il est désormais téléchargé **au runtime** depuis l'hébergeur du plugin (`dvrch.github.io/mergdown2tex/javascripts/mermaid.min.js`, fallback `unpkg`) puis mis **en cache local** (`resources/mermaid.min.js`) — même logique que `pandoc.wasm`/`typst.wasm`.
- Nouveau bouton « **Statut & installer** » dans les réglages (rubrique moteurs) pour vérifier/télécharger le module Mermaid à la demande.

### Ajouté
- Rubrique **Export ZIP** : bouton « **Télécharger le dossier d'exemple** » — récupère le dossier d'exemple déjà présent dans le dépôt du plugin et l'extrait dans la racine du vault actuel (le `.obsidian/` du zip est ignoré pour ne pas écraser la configuration locale).

## [2.0.1] — 2026-09-04

### Corrigé
- Publication Obsidian : `main.js` et `manifest.json` exposés **à la racine** du dépôt (structure requise par `obsidian-releases`), release générée par GitHub Actions avec les notes du changelog.

## [2.0.0] — 2026-09-04

### Ajouté
- Moteur **Pandoc en WASM embarqué** (`PandocWasmEngine`, `WasmFileSystem`) : plus aucune dépendance à un binaire Pandoc externe, même sur mobile. Auto-download de la release `pandoc-wasm` (inflate Raw DEFLATE portable inclus).
- Compilation **PDF plein WASM** sur mobile (`compilePdfMobile`) : pipeline Pandoc WASM + serveur Typst WASM embarqué (`TypstCompiler`, `IncrServer`, fonts dans le vault) — sans `pdflatex` ni `pandoc` système.
- Compilation **DOCX sur mobile** (`compileDocxMobile`) : Pandoc WASM → `prepare_latex_for_docx` → DOCX.
- Rendu **Mermaid sur mobile** (`renderMermaidMobile`) : extrait `MERMAID_BASE64` embarqué, safe-mode (blocage `fetch`/`XMLHttpRequest`), export PNG.
- Export **standalone Markdown** (`expandToMd`, `expand_to_standalone_markdown`) avec VFS (`buildVfsMobile`).
- Conversion **TeX → Markdown** mobile (`texToMarkdownMobile`, `latex_to_markdown`).
- Édition **DOCX native** : flèches de citation (`add_citation_arrows_to_bbl`, `modify_docx_arrows`), en-têtes/pieds de page (`add_docx_header_footer`), couleurs de tableaux (`add_docx_table_colors`).

### Corrigé
- Unités `vh` émises par le writer pandoc→typst rejetées par le `typst.wasm` (v0.14) : remplacement inconditionnel `Nvh → N%` (`sanitizeVhUnits`) — la compilation Typst n'échoue plus sur les images portrait.
- `#align(center)[#title]` au lieu de `#align(center)[+ title]` (variable interpolée correctement).
- Détection `mpTables` fiabilisée (`kind: table`).

## [1.0.2] — 2026-07-06

- Publication communautaire initiale.