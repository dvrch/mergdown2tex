# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

## [2.1.9] — 2026-09-09

### Renforcé (téléchargements — PC ET mobile)
- **Zone de dépôt `mergdown2tex_cache/` à la racine du vault** (visible dans l'explorateur) : chaque zip téléchargé est d'abord écrit ici, puis décompressé vers le bon dossier du plugin (`wasm/`, `fonts/`) et **effacé**. On peut y déposer soi-même un zip (liens de dépannage, glisser-déposer) : « Télécharger la sélection » le décompresse **au bon endroit sans réseau**, sur PC **et** sur Android.
- **Mobile : extraction non bloquante et économe en mémoire** — sur Android, `requestUrl` téléchargeait tout en mémoire puis une extraction synchrone figeait l'écran (popup « décompression » immobile) et doublait la mémoire en pointe (crashs). Désormais : le zip est écrit sur disque (`mergdown2tex_cache/`), le tampon téléchargé est libéré, puis l'extraction se fait **fichier par fichier avec repaint** (« Décompression et installation : n/N fichiers ») et la source est effacée à la fin.
- Message explicite quand la progression en octets n'est pas affichable (repli `requestUrl` sans streaming) — la barre de balayage reste animée.
- Vérifié : les assets GitHub sont publics ; **aucun compte GitHub n'est requis** pour télécharger (URL signée auto-générée, comme un lien manuel).

## [2.1.8] — 2026-09-08

### Corrigé
- **Popup de téléchargement vide (« ne se ferme jamais ») — cause racine trouvée** : Obsidian a renommé l'API `ProgressBar` → `ProgressBarComponent`. `new ProgressBar(...)` levait « ProgressBar is not a constructor » → la popup s'ouvrait **vide** (juste le titre « Téléchargement WASM ») et le téléchargement ne **démarrait jamais**. La barre de progression est désormais un simple `<div>` natif (sans dépendance à l'API Obsidian), le statut (« Préparation… », progression %, résultat ✅/❌) s'affiche et la popup se ferme à la fin.

### Renforcé (téléchargements)
- **Voie réseau système en priorité sur PC** (`https` natif de Node) : contourne le netlayer Chromium d'Obsidian, parfois bloqué/timeout sur le CDN GitHub alors que le réseau système (navigateur, curl) fonctionne.
- **Timeouts durs partout** (20 s / 90 s) + **3 essais automatiques** avec backoff : plus aucune popup bloquée silencieusement à l'infini (auparavant `requestUrl` sans timeout pouvait pendre pour toujours).
- **`cache-dl/`** : le zip téléchargé est écrit en clair dans `<plugin>/cache-dl/`, décompressé, puis **effacé**. Un zip téléchargé à la main (liens de dépannage) et déposé dans `cache-dl/` est décompressé **sans repasser par le réseau**.
- **`dbg_dl.txt`** : chaque étape de téléchargement est journalisée dans le dossier du plugin (diagnostic express si un cas reste coincé).

### Corrigé (ruban)
- **Icône du bouton « Aperçu PDF côte-à-côte » absente** : `file-pdf` n'existe pas dans le jeu d'icônes d'Obsidian → remplacée par `columns-2` (les 3 icônes du ruban sont désormais vérifiées présentes).

## [2.1.7] — 2026-09-08

### Corrigé (mode PDF Typst)
- **Texte des diagrammes Mermaid absent du PDF** : resvg (utilisé en mode Typst) ignore les `<foreignObject>` HTML que Mermaid utilise pour étiqueter ses nœuds → seules les formes étaient visibles. Le SVG est désormais **aplati avant compilation** (`_flattenSvgForeignObjects`) : chaque `<foreignObject>` est converti en un vrai élément `<text>` (`<tspan>` par ligne, `text-anchor="middle"`, fonte/couleur/taille héritées du style inline), d'où un rendu fidèle des étiquettes dans le PDF.
- **En-tête / pied de page et ligne horizontale absents du PDF (pipeline Pandoc WASM + Typst)** : les commandes LaTeX `\fancyhead`/`\fancyfoot`/`\rule` n'avaient pas d'équivalent Typst. Un bloc `#set page(header: … , footer: …)` est désormais **injecté automatiquement en tête du flux `.typ`** (`applyTypstHeaderFooter`) qui reproduit le comportement LaTeX :
  - en-tête : le **contenu de l'en-tête** aligné à droite (gris, 9 pt, écrasant tout défaut) ;
  - pied de page : le **contenu du pied de page** avec `\thepage` traduit (`#context counter(page).display()`) et le mot « Page » retiré, **numéro de page** toujours affiché à droite ;
  - **ligne horizontale** `#line(length: 100%, stroke: 0.5pt + rgb("#808080"))` présente sous l'en-tête et au-dessus du pied (seulement si le réglage correspondant est activé).
  - Les caractères spéciaux Typst (`\ [ ] # * _ $`, retours à ligne) du contenu saisi par l'utilisateur sont échappés. Désactivable via `opts.headerFooter === false` (inutile de fuiter sur les `.typ` compilés manuellement).

## [2.1.6] — 2026-09-07

### Corrigé
- **Page de garde (PDF Typst) réduite à l'essentiel** : la couverture ne contenait plus qu'**un titre et un auteur**, mais l'ancien repli (absence de métadonnées) aspirait tout le premier bloc du document (`#block[#block[#strong[...]...]]`) comme contenu de la page de garde → « toute la première partie » apparaissait sur la couverture. Désormais :
  - Le titre et l'auteur proviennent **uniquement** des **champs dédiés des Réglages** (« Titre du document », « Auteur du document (Force) ») — en priorité — sinon des métadonnées du document (front matter YAML / `\title` `\author` `\date`) ;
  - Le bloc de titre pandoc n'est **jamais** utilisé comme source de contenu ; s'il existe dans le flux, il est simplement retiré (la page de garde isolée le remplace) ;
  - **Si ni les options ni les métadonnées ne fournissent de titre → aucune page de garde n'est générée** (le document sort tel quel, sans couverture aspirée).

## [2.1.5] — 2026-09-07

### Ajouté
- **Téléchargement du mini vault de test `vault_test`** (~1,4 Mo) : 2 notes + plugin MergDown2TeX pré-installé + fichier `.bib`. Pour vérifier le plugin rapidement (palette, ruban, PDF temps réel) sans le lourd dossier d'exemple.
  - **Commande palette** : *Télécharger vault_test (mini vault de test)* ;
  - **Bouton ruban** : icône ⬇ dans la barre latérale gauche ;
  - **Bouton réglages** : rubrique *Export ZIP*.
  - Nouvel asset CI `docs/assets/vault_test.zip` publié sur la release `bundle` (source unzippée committée dans `vault_test/`).

## [2.1.4] — 2026-09-07

### Ajouté
- **2 nouveaux boutons dans le ruban (barre latérale gauche, icônes de l'édition)** :
  - **Convertir en DOCX (Word)** → `compileDocx()` ;
  - **Convertir en PDF** → `compilePdf()`.
  Ils rejoignent le bouton existant « Aperçu PDF côte-à-côte » : 3 raccourcis d'un clic dans le ruban.

## [2.1.3] — 2026-09-07

### Ajouté
- **Barre de progression des téléchargements** : chaque téléchargement (dossier d'exemple, moteurs WASM, polices, Mermaid) ouvre désormais une fenêtre avec une **barre de progression** qui **reste visible jusqu'à la fin**.
  - Progression **réelle en octets** (**% + Mo reçus / Mo total**) quand le serveur fournit la taille (via `fetch` en streaming sur PC).
  - Repli en barre **indéterminée** (balayage animé) sur mobile/Android ou si la taille est inconnue.
  - Puis phase « décompression / installation » comptée **fichier par fichier** jusqu'à 100 %.
  - La fenêtre ne se ferme qu'une fois tout terminé (+ courte pause finale affichant le résultat ✅/❌).
- Appliqué partout : boutons des réglages (« Télécharger & extraire », « Télécharger la sélection », « Statut & installer » Mermaid) **et** les 5 commandes de la palette ajoutées en 2.1.2.

## [2.1.2] — 2026-09-07

### Ajouté
- **Commandes dans la palette de commandes (Ctrl/Cmd+P)** :
  - « Télécharger le dossier d'exemple (vault) » ;
  - « Télécharger les moteurs WASM (DOCX + PDF + polices) » (les 3 zips) ;
  - « Télécharger le moteur pandoc.wasm (DOCX) » ;
  - « Télécharger le moteur typst.wasm (PDF) » ;
  - « Télécharger les polices typst (PDF) ».

## [2.1.1] — 2026-09-07

### Corrigé
- **Téléchargement typst.wasm sur mobile (Android)** : les téléchargements binaires (`installWasmZip`, pandoc.wasm brut, typst.wasm brut, polices, vault dense, Mermaid, zips) déclarent désormais `responseType: "arraybuffer"`. Sans cet attribut, Obsidian mobile pouvait retourner un `arrayBuffer` vide → `typst.wasm` ne s'installait jamais. Fix appliqué à *tous* les `requestUrl` binaires.

### Ajouté
- **Liens de téléchargement manuels visibles dans les réglages** : sous « Moteurs — téléchargements », un bloc « Liens de téléchargement manuels (dépannage) » expose 3 liens cliquables (`pandoc_wasm.zip`, `typst_wasm.zip`, `typst_fonts.zip`) qui ouvrent la release `bundle` dans le navigateur (openExternal sur PC, window.open sur mobile). Le texte explique où décompresser les fichiers (`<plugin>/wasm/`, `fonts/`).

## [2.0.10] — 2026-09-07

### Amélioré (onglet Réglages)
- **Dossier d'exemple en tête d'onglet** : la rubrique *Export ZIP* (avec le bouton « Télécharger & extraire ») est désormais la **première** de l'onglet, pour pouvoir récupérer le vault d'exemple sans défiler.
- **Cases à cocher + un seul bouton** à la place de plusieurs boutons de téléchargement : la rubrique *Moteurs — téléchargements* propose 3 cases (`pandoc_wasm.zip`, `typst_wasm.zip`, `typst_fonts.zip`) cochées par défaut et **un unique bouton « Télécharger la sélection »** qui lance tous les zips cochés d'un coup (séparés selon les nouveaux méthodes `ensureTypstWasmOnlyZip()` / `ensureTypstFontsOnlyZip()`). Les rubriques de configuration moteur ont été séparées (« Moteurs — configuration »).

## [2.0.9] — 2026-09-07

### Modifié
- **Les polices ne sont plus mélangées au moteur** : `typst_wasm.zip` ne contient plus que `typst.wasm` (~10 Mo), et un **nouveau zip séparé `typst_fonts.zip`** (~8 Mo) regroupe les 17 polices. Chaque composant (pandoc, typst, polices) dispose de **son propre zip** dans la release `bundle`.
- `main.js` : `downloadTypstWasmZip()` ne télécharge plus que le moteur ; nouveau `downloadTypstFontsZip()` pour les polices ; `ensureTypstWasmZip()` garantit les DEUX (`typst_wasm.zip` puis `typst_fonts.zip`), contrôle via `typstFontsOk()` (≥ 4 polices présentes). Bouton réglages « Moteurs WASM compressés » → « Télécharger & installer (les 3) ».
- `docs.yml` : `typst_fonts.zip` ajouté aux assets uploadés sur la release `bundle`.

## [2.0.8] — 2026-09-07

### Ajouté
- **Un zip WASM par moteur** (remplace le `wasm_bundle.zip` unique) : `pandoc_wasm.zip` (~15 Mo, `pandoc.wasm` seul → export **DOCX**) et `typst_wasm.zip` (~18 Mo, `typst.wasm` + les 17 polices → export **PDF**), servis par la release `bundle`. Sur mobile on ne télécharge **que le moteur nécessaire**. Nouveau réglage « Moteurs WASM compressés » ; `ensurePandocWasm` (DOCX) → `pandoc_wasm.zip` et `getTypstCompiler` (PDF) → `typst_wasm.zip` d'abord, téléchargements bruts en secours.
- `scripts/build_assets.js` : support d'un filtre `include` par source pour ne zipper qu'un sous-ensemble d'un dossier (pandoc seul / typst+fonts), toujours comprimé (`-9`).

### Amélioré
- **Page de garde (pipeline Typst)** : la couverture est construite depuis les **métadonnées** du document — titre, auteur et date de la front matter YAML (Markdown) ou `\title`/`\author`/`\date` (LaTeX) — comme le `\maketitle` d'un pipeline LaTeX. Ces champs, absents du corps, sont affichés seuls en page 1, immédiatement suivie du sommaire ; le bloc de titre éventuellement inséré par Pandoc est retiré du flot du document.

### CI
- `docs.yml` : les assets uploadés sur la release `bundle` sont désormais `pandoc_wasm.zip` et `typst_wasm.zip` (au lieu de `wasm_bundle.zip`), toujours en `--clobber`.

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