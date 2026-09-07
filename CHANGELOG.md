# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

## [2.0.7] — 2026-09-07

### Ajouté
- **Bundle WASM compressé (`wasm_bundle.zip`, ~34 Mo au lieu de ~97 Mo)** : le dossier `wasm/` du plugin (pandoc.wasm, typst.wasm et les 17 polices) est désormais distribué **compressé dans un seul zip**, publié dans la release `bundle` (bande passante illimitée). Nouveau bouton « Bundle WASM compressé » dans les options ; `ensurePandocWasm` et `getTypstCompiler` tentent automatiquement le bundle d'abord, puis retombent sur les téléchargements bruts individuels en secours.

### Corrigé
- **Position du sommaire PDF (pipeline Typst)** : la page de garde était suivie du contenu au lieu du sommaire. Le TOC (`#outline`) est désormais injecté **avant** `isolateTitlePage`, pour que la couverture soit placée juste devant le sommaire — l'ordre final est : page de garde → sommaire → contenu.
- **Bouton « Dossier d'exemple »** : installe désormais aussi le **thème et les réglages `.obsidian/`** (appearance, thème, plugin) contenus dans le vault exemple, pour reproduire l'environnement fourni dans le bundle — seul `data.json` (état local Obsidian) reste préservé.

### CI
- `docs.yml` : le `wasm_bundle.zip` est ajouté à la liste des assets uploadés sur la release `bundle` (avec `--clobber`).

## [2.0.6] — 2026-09-06

### Ajouté
- **Bundle tout-en-un `mergdowntotex_bundle.zip`** : plugin complet **et** vault exemple combinés dans **un seul zip** — disponible via la **release dédiée `bundle`** (assure de GitHub → bande passante illimitée), ainsi qu'en miroir sur le site (`dvrch.github.io/mergdown2tex/assets/mergdowntotex_bundle.zip`).
- Les liens de téléchargement sont désormais centralisés dans le **README** (tableau : bundle / plugin / vault exemple, lien release illimité + miroir site) — retirés de la description du manifest pour la garder propre.

### Corrigé
- **Bouton « Dossier d'exemple » dans les options du plugin** : l'URL pointait vers `raw.githubusercontent.com/.../example_vault/full_manual_repport_exp.zip` (404 — le zip est généré par le CI dans `docs/assets/`). Il pointe maintenant vers l'asset **release `bundle`** (téléchargement fonctionnel et illimité).
- **Vitrine exemple renommée** : `full_manual_repport.md` → `Mergdown_exempl_test.md` (les 2 copies, racine et `Writing/`) ; références de la documentation mises à jour.
- **Installation homogène vault exemple** : `manifest.json` de l'exemple resynchronisé avec la release (2.0.6, identique aux 3 emplacements) et `resources/mermaid.min.js` ajouté (manquant dans l'installation pré-installée du vault).
- **Tailles exactes dans la doc/README** : `main.js` documenté à ~3.7 MB (au lieu de ~8.6 MB obsolète) ; précision que Mermaid n'est **pas** embarqué en Base64 (`MERMAID_BASE64` est vide, bundle téléchargé au runtime).

### CI
- `docs.yml` : création automatique de la **release `bundle`** et upload des 3 zips en `--clobber` à chaque déploiement (permission `contents: write` ajoutée).
- `release.yml` : déclenchement restreint aux **tags versionnés** (`[0-9]*.[0-9]*.[0-9]*`) pour ne pas entrer en collision avec le tag `bundle`.


## [2.0.5] — 2026-09-06

### Ajouté
- **Vault d'exemple téléchargeable** : l'archive `full_manual_repport_exp.zip` est désormais incluse dans le dépôt (`example_vault/`) et accessible depuis la documentation du site — les utilisateurs peuvent l'extraire dans leur vault pour découvrir toutes les fonctionnalités en situation réelle.
- **`mermaid.min.js` pré-installé** dans `mergdowntotex/resources/` : plus besoin de téléchargement au premier rendu — les diagrammes Mermaid fonctionnent immédiatement hors ligne.
- **Références croisées sur blocs** (`^table--block-…`, `^eq--block-…`, `^figure--block-…`) : les ancres Obsidian placées juste après un bloc génèrent automatiquement un `\label{}` + `\hypertarget{}` valides dans le `.tex` — fonctionne aussi dans le pipeline DOCX (LABELED_TABLE / LABELED_EQ).

### Corrigé
- Structure du plugin maintenant miroir de l'installation Obsidian (`mergdowntotex/main.js`, `mergdowntotex/wasm/`, `mergdowntotex/resources/`) — facilite la mise à jour manuelle.
- `main.js` et `manifest.json` restent **à la racine du dépôt** pour satisfaire le Community Plugins checker d'Obsidian.

### Documentation
- Site de documentation (`docs/`) intégralement revu : architecture WASM documentée, nouvelles pages sur les références croisées de blocs, tableau comparatif mis à jour (DOCX maintenant sans dépendance Pandoc externe).
- `index.md` : mention explicite du moteur Pandoc WASM embarqué pour l'export DOCX et du moteur Typst WASM pour le PDF mobile.


## [2.0.4] — 2026-09-05

### Corrigé
- **Téléchargement de `pandoc.wasm` sur mobile** : le fichier est désormais écrit en chemin **relatif au vault** (`.obsidian/plugins/mergdowntotex/wasm/pandoc.wasm`) via l'`adapter`, au lieu d'un chemin système absolu recomposé par le stub `path` — corrige l'apparition d'un **préfixe système doublé** (« base Zotero/android + répertoire actuel + chemin ») dans le vault Android.
- **Erreur « Module natif fs/path indisponible sur mobile »** au lancement de la compilation PDF : `getPandocWasmEngine` ne retombe plus sur le fallback `fs.existsSync`/`fs.readFileSync` (inexistants sur mobile). Il télécharge désormais via `ensurePandocWasm` puis relit le fichier par `adapter.readBinary` — identique sur PC et Android.
- Le Notice d'installation de `pandoc.wasm` affiche maintenant le **chemin exact** où le fichier est stocké (répond au « on ne sait pas où ça se stocke » sur PC).

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