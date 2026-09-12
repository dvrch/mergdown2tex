# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

## [3.0.1] — 2026-09-12

### Ajouté
- **Vault d'exemple appliqué immédiatement SUR MOBILE aussi** : l'application du thème passe désormais par le canal officiel `app.vault.setConfig("cssTheme", …)` (celui qu'emprunte Réglages → Apparence) avec `app.customCss.setTheme` en secours — le thème s'applique instantanément, sans redémarrage, même sur Android/iPhone.
- **Bouton « Vault exemple »** sur la fenêtre de progression (sous les liens pandoc / typst / polices) : ouvre le lien direct `full_manual_repport_exp.zip` (dossier d'exemple complet, ~8 Mo) pour dépôt manuel dans le vault.

### Changé
- **Plus de re-téléchargement inutile du dossier d'exemple** : `downloadExampleVault` vérifie d'abord si `full_manual_repport_exp.zip` est déjà dans le vault → extraction locale **sans réseau** ; sinon, si un premier déploiement existe déjà (`.obsidian/appearance.json` présent) → simple ré-application du thème et des réglages ; sinon téléchargement + extraction, et le **zip est désormais CONSERVÉ à la racine du vault** (et réutilisé la fois suivante). Utile pour Android où les sous-dossiers du gestionnaire de fichiers ne s'affichent pas toujours : le zip reste visible à la racine.
- **Le bouton de téléchargement `vlatex_wasm.zip` a été retiré** du volet de progression : vLaTeX est embarqué en base64 dans le plugin, aucun zip n'est nécessaire.

### Corrigé
- **`_unzipAndExtract` échouait systématiquement** (`skipPrefixes is not defined`) : `Array.from(undefined)` levait une erreur et toute extraction était impossible — désormais le paramètre est reçu (et tolérant).
- **Extraction locale du zip d'exemple : `raw.buffer` illisible** (`Cannot read properties of undefined (reading 'slice')`) quand `vaultReadBinary` renvoie un `Uint8Array`/`Buffer` — le même bug latent existait dans `installWasmZip` pour un zip déposé à la racine.

## [3.0.0] — 2026-09-12

### Changé
- **Un zip n'est JAMAIS plus utilisé en mémoire pour compiler** : l'ancien repli « garder le zip et le dégainer à la compilation » est supprimé. Les moteurs (`pandoc`, `typst`, `vLaTeX`) ne lisent plus que des fichiers **décompressés au bon endroit** : `wasm/pandoc.wasm`, `wasm/typst.wasm`, `wasm/vlatex.wasm` ou, sur mobile quand l'écriture d'un gros fichier unique est refusée, les **pièces décompressées** `wasm/.parts/` (réassemblées à la compilation). Un zip à la racine du vault (ou dans `mergdown2tex_cache/`) n'est qu'une **source d'installation** : il est décompressé au bon endroit (en pièces si besoin) puis supprimé.
- **Échec franc si même les pièces sont refusées** : si un moteur ne peut être écrit ni en fichier unique ni en pièces sur disque, le plugin s'arrête avec un message clair (jamais de repli en mémoire) — le zip reste alors à la racine pour que vous puissiez déposer le fichier décompressé ou décompresser le zip à la main, puis relancer.
- **Les contrôles d'existence ne considèrent plus un zip seul comme une installation** : `pandoc.wasm`/`typst.wasm`/`vlatex.wasm` ne sont « présents » que s'ils existent décompressés (`wasm/` ou `wasm/.parts/`). Un zip complet déposé hors-ligne déclenche une **installation locale** (décompression, sans réseau), pas une erreur, et sans être mis en mémoire.
- **Sur mobile, le téléchargement passe par le CDN jsDelivr en premier** (`fetch` en streaming, CORS `*`, ordre des candidats inversé) — plus rapide et plus fiable que le canal `requestUrl` (base64 en mémoire, lent/OOM sur les gros fichiers). `requestUrl` ne sert plus que de secours. Le fichier réellement téléchargé reste vérifié à l'octet près.

### Ajouté
- **Boutons de téléchargement direct sur la fenêtre de progression** : quatre petits boutons discrets et compacts (pandoc / typst / polices / vLaTeX), avec au survol une infobulle expliquant ce que contient chaque lien (format, taille). Si un téléchargement traîne, cliquez : le navigateur ouvre le lien direct, téléchargez le zip, déposez-le à la racine du vault puis relancez « Télécharger la sélection » — le plugin le décompresse au bon endroit sans repasser par le réseau.
- **Suppression du repli `typst.wasm` caché vers le paquet npm `@myriaddreamin/typst-ts-web-compiler`** : sa taille (9 Mo) ne correspondait pas au `typst.wasm` attendu (28 Mo), le chemin était en réalité inutilisable — il est remplacé par une erreur explicite qui renvoie vers les réglages.

## [2.2.9] — 2026-09-12

### Changé
- **Le dossier d'exemple déploie désormais TOUT, en FORCÉ** : le bouton « Télécharger, remplacer & extraire » (rubrique *Export ZIP*, palette de commandes, ruban) remplace maintenant la configuration **complète** du vault actuel — fichiers de référence, `.obsidian` entier (thème, plugins, workspace, hotkeys…) **et** `data.json` du plugin du vault d'exemple. Plus aucune configuration n'est épargnée.
- **Thème appliqué immédiatement** : après extraction, le plugin lit `.obsidian/appearance.json` restauré et appelle `app.customCss.setTheme(...)` (et recharge les extraits CSS éventuels). Fini le redémarrage d'Obsidian nécessaire pour voir le thème.
- **Les réglages du plugin sont rechargés sur-le-champ** depuis le `data.json` ainsi restauré (appel `loadSettings()` après déploiement) — pas besoin de relancer Obsidian pour que la nouvelle configuration prenne effet.
- **Nouveau `data.json` d'exemple propre et pré-configuré** : les valeurs de test sans pertinence (« dkdfmdmfmdlf », « iheiah », « hdhs »…) sont remplacées par des valeurs saines (titre/variables vides, `pcUseTypstPdf: true` → pipeline Pandoc WASM + Typst partout, `zipIncludeObsidian: false`). Ce `data.json` est maintenant **inclus dans les zips** (vault d'exemple `full_manual_repport_exp.zip` et bundle `mergdowntotex_bundle.zip`) afin qu'un **nouveau vault soit créé pré-configuré**.

## [2.2.8] — 2026-09-11

### Ajouté
- **Mobile (Android/iPhone) — les moteurs sont désormais installés DÉCOMPRESSÉS sur disque** : certains systèmes mobiles refusent l'écriture d'un gros fichier unique via `writeBinary` (`pandoc.wasm` ~59 Mo, `typst.wasm` ~28 Mo) alors que de petits fichiers passent. Le plugin détecte ce refus, découpe alors le moteur en **pièces de 8 Mo** écrites une par une dans `wasm/.parts/` (ex. `pandoc.wasm.000`, `.001`…), puis **supprime le zip à la racine** devenu inutile. À la compilation, les pièces sont réassemblées en mémoire (comme le fichier unique sur PC) — plus besoin de garder un zip et de le re-décompresser à chaque compilation. La logique de pré-vol est ainsi identique sur PC, Android et iPhone : le fichier est « prêt sur disque » et seule la compilation l'assemble.
- Les contrôles d'existence (`wasmFileComplete`) tiennent compte de ce mode : un moteur présent en pièces est considéré installé (pas de re-téléchargement). Repli sûr conservé : si même les pièces sont refusées, le zip à la racine reste et est dégainé en mémoire à la compilation.

### Corrigé
- Message des réglages (« Liens de téléchargement manuels ») mis à jour : l'ancienne limite « Écriture binaire impossible » n'implique plus de garder un zip — le plugin installe automatiquement en pièces.

## [2.2.7] — 2026-09-10

### Ajouté
- **Au premier lancement d'une commande, tous les moteurs WASM sont vérifiés et téléchargés d'un coup** : la toute première conversion (PDF, DOCX, TEX ou TYP) déclenche le contrôle complet — vLaTeX (embarqué), `pandoc.wasm`, `typst.wasm` et les polices typst — et **pré-télécharge ce qui manque via les mêmes liens et canaux que les téléchargements des réglages** (release `bundle` puis miroir jsDelivr), avec la même fenêtre de progression « Moteurs requis ». Après cette première passe, seules les ressources réellement manquantes sont redemandées (contrôle ciblé par commande). Cette passe ne démarre pas automatiquement en aperçu « live ». Le rendu en direct (aperçu PDF pendant la frappe) reste insensible à cette logique pour éviter tout téléchargement surprise.

## [2.2.6] — 2026-09-10

### Changé
- **vLaTeX est de nouveau EMBARQUÉ dans `main.js`** (option 1) : le binaire `vlatex.wasm` (~2,6 Mo) est intégré en base64 directement dans le plugin, comme à l'origine. Plus aucun fichier ou téléchargement `vlatex_wasm.zip` requis — le moteur est chargé en mémoire au démarrage (`initWasmEmbedded`) et fonctionne hors-ligne sur PC comme sur mobile. Le mécanisme de repli automatique (fichier `wasm/vlatex.wasm` ou zip à la racine) reste actif en secours, mais n'est plus nécessaire. La case de téléchargement dédiée a été retirée des réglages.
- `main.js` passe à ~7,4 Mo (base64 embarqué). Le script de transpile a été corrigé pour ne plus toucher aux chaînes littérales : le remplacement des BigInt `123n` → `BigInt(123)` se faisait jusque-là sur TOUT le fichier et corrompait le bloc base64 embarqué (motifs type « +1n/ » dans le wasm) — désormais les littéraux « ' », « " », « ` » et les commentaires sont ignorés. Le base64 est vérifié octet-pour-octet contre le binaire d'origine et instancié réellement en test.

## [2.2.5] — 2026-09-10

### Corrigé
- **« Cannot read properties of undefined (reading '__wbindgen_free') » à chaque conversion PDF / Word (mobile ET PC)** : c'était le **moteur vLaTeX qui avait disparu des releases**. Le glue JavaScript (wasm-bindgen) est bien présent dans `main.js`, mais le binaire `vlatex.wasm` n'existait nulle part : `WASM_BASE64` était resté un texte d'exemple « non initialisé » et `initWasm()` pointait sur un fichier inexistant, alors que chaque transformation (wikiliens, .md → .tex, filtre DOCX, bibliographie…) appelle `wasm.__wbindgen_free`. Le binaire a été **récupéré depuis l'historique** (commit `df36ae7`) puis est de nouveau livré (~2,6 Mo) :
  - **chargement en mémoire** (`initVlatexFromBytes`) depuis `wasm/vlatex.wasm` du plugin ou depuis `vlatex_wasm.zip` (~0,9 Mo) déposé à la racine du vault — même stratégie que pandoc/typst, fonctionne sur mobile sans grosse écriture disque ;
  - le moteur est **pré-chargé au démarrage** (plus de popup d'erreur trompeuse « WASM non initialisé » à l'activation) et **garanti avant toute conversion** : le pré-téléchargement automatique inclut maintenant `vLaTeX` pour *toutes* les commandes (PDF, DOCX, TEX, TYP), y compris « Convertir la note active en LaTeX » ;
  - la taille du binaire est validée (2 634 305 octets) comme pour pandoc/typst — un `vlatex.wasm` « 0 octet » ou tronqué ne passe plus.

### Ajouté
- Nouvelle case à cocher **`vlatex_wasm.zip`** dans Réglages → Moteurs (cochée par défaut), avec bouton de téléchargement et lien manuel.
- Nouveau zip **`docs/assets/vlatex_wasm.zip`** (~0,9 Mo) dans la release `bundle` + miroir jsDelivr (CORS * sur mobile).

## [2.2.4] — 2026-09-10

### Corrigé
- **« Tous les éléments du vault ne sont pas téléchargés »** (dossiers et sous-dossiers manquants après « Télécharger le dossier d'exemple ») : l'extraction ne créait que **un** niveau de dossier parent avant de réécrire. Tout fichier rangé dans un dossier ou sous-dossier (`Writing/…`, `Literature/…`, `.obsidian/themes/…`…) était perdu → on ne voyait que les fichiers principaux à la racine. La création des dossiers est désormais **récursive** (`vaultMkdirRecursive`) : toute l'arborescence du zip est reconstituée, y compris les sous-sous-dossiers et le thème.

### Ajouté
- **Pré-téléchargement automatique des moteurs WASM avant chaque conversion** : lancer *PDF* / *DOCX* / *TEX* / *TYP* vérifie d'abord si `pandoc.wasm`, `typst.wasm` et les **polices typst** sont présents, et les télécharge lui-même (popup de progression « Moteurs requis ») **si absents**, avant d'exécuter réellement la compilation. Plus d'erreurs « vLaTeX WASM non initialisé » ou « moteur manquant » en pleine conversion sur un appareil neuf :
  - PDF / TEX : `pandoc` (+ `typst` + polices pour le PDF) ;
  - DOCX : `pandoc` ;
  - TYP direct : `typst`.

## [2.2.3] — 2026-09-10

### Corrigé
- **« Failed to execute 'atob' on 'window' » à l'activation** (vieilles WebView) : le décodage base64 de secours appelait `atob()` sans protection — une entrée invalide faisait lever une exception au chargement. L'appel est maintenant **gardé par un `try/catch`** : si `atob` échoue, on bascule automatiquement sur le décodeur manuel local (aucun crash possible à l'activation).

### Ajouté / Modifié
- **Un seul vault téléchargeable** : le mini vault de test `vault_test` est **supprimé** (dossier, zip, commandes palette, ruban et réglage). Il ne reste que le **dossier d'exemple complet** (`example_vault`, avec sa config `.obsidian` : réglages, thèmes, plugins) — « le grand complet », comme demandé.
- **Robuste : télécharger le dossier d'exemple** désormais via le **ruban** (icône ⬇ de la barre latérale gauche), en plus de la palette et des réglages.
- **`Télécharger le dossier d'exemple` expliqué à sa vraie fonction** : il **remplace** la configuration Obsidian du vault actuel (`.obsidian` : thème actif, plugins, config…) **en plus** des fichiers de référence — le libellé ne dit plus « sans toucher à votre .obsidian local » (qui était faux) mais « met à jour les réglages et le thème », avec un rappel de redémarrer Obsidian si le thème ne se met pas à jour immédiatement.
- Réglages : un seul bouton *Télécharger, remplacer & extraire*.

## [2.2.2] — 2026-09-10

### Corrigé (compatibilité universelle — PC Linux/Mac/Windows, Android, iOS, vieux appareils)
- **Le plugin refusait de s'activer sur Android 8 (et tout WebView ancien)** : `main.js` contenait le code généré WASM (wasm-bindgen) utilisant des syntaxes modernes que les vieux WebView ne savent pas analyser — champs privés `#x` (ES2022), `??=`/`||=`/`&&=` (ES2021), `?.`/`??` (ES2020), littéraux `0n` (ES2020). Le fichier exigeait une analyse ES2022 (≈ **Chrome/WebView 94+**) : en dessous, Obsidian ne peut pas charger le plugin et désactive l'interrupteur. L'Android 12 (WebView récent) le charge, l'Android 8 (WebView < 94) refuse. D'où « ça marche sur le A12, pas sur le A8 ».
- **Transpilation dans la release** : une étape de build (`node scripts/transpile.js`, esbuild cible **ES2017**) abaisse maintenant `main.js` en syntaxe ES8 — analysable par ~tout moteur depuis 2017 (Chrome/WebView 55+, vieux Android, iOS anciens, vieux navigateurs PC). Vérifié par `es-check es2017` : plus aucun `?.`, `??`, `??=`, `||=`, `&&=`, littéral BigInt ni champ privé.
- **BigInt en dur contourné** : les littéraux `0n` deviennent `BigInt(0)` (analyse ES2016) et le seul BigInt exécuté au chargement du module est mis derrière un `typeof` → un WebView sans BigInt (< Chrome 67) **démarre quand même** le plugin (Pandoc/LaTeX fonctionnent).
- **Message clair sur vieux moteurs** : si BigInt n'existe pas, la conversion Typst affiche « Votre WebView est trop ancien pour le moteur Typst (BigInt requis, Chrome 67+) » au lieu d'une erreur opaque.
- **Dégradation propre** : polyfills locaux pour `String.prototype.replaceAll` et `Object.fromEntries` ; `globalThis` adressé via un alias sûr (`self`→`window`→`global`) — plus aucune dépendance aux API Chrome 71+.
- Fichiers inchangés sinon : mêmes téléchargements, mêmes zips à la racine, mêmes correctifs 2.2.1.

## [2.2.1] — 2026-09-10

### Corrigé (mobile — durable)
- **« Écriture binaire impossible »** : sur Android, `adapter.writeBinary` encode en base64 ; sur les gros fichiers (`typst.wasm` 28 Mo, `pandoc.wasm` 59 Mo) il est refusé ou ne se résout jamais (bug Capacitor documenté). Le zip déposé à la main était bien lu, mais la réécriture du fichier dézippé échouait → « téléchargement manuel échec ».
- **Le plugin ne dépend plus de l'écriture du gros wasm** : la compilation lit le wasm **en mémoire** ; l'écriture disque n'est qu'un cache. Si le système refuse d'écrire le gros fichier, il **garde le zip compressé à la racine du vault** et « dégaine » le fichier en mémoire à chaque compilation.
- `vaultWriteBinary` blindé : vrai `ArrayBuffer` (signature documentée — un `Uint8Array` brut déclenche l'erreur sur mobile), délai de garde 90 s + retry, retourne `false` au lieu d'une erreur trompeuse, vraie cause journalisée.
- **Un zip complet de bonne taille présent au dépôt vaut ressource installée** : `wasmZipUsable()`/`readZipEmbedded()` → fini les fausses erreurs quand on dépose `pandoc_wasm.zip` / `typst_wasm.zip` à la main, et plus de re-téléchargement inutile.
- Repli dans les deux compilateurs (`getPandocWasmEngine`, `getTypstCompiler`) : lecture du zip + extraction en mémoire + **validation pleine taille**.
- `_writePluginResource` (mermaid) : un échec d'écriture est désormais une erreur explicite, jamais un faux « installé ».

### Corporé (téléchargements réseau — mobile)
- `downloadBytes` accepte une **liste d'URL candidates** essayées dans l'ordre ; un zip partiel (HTTP 200, taille courte) est détecté et retenté **immédiatement** (avant : il n'échouait qu'à l'extraction).
- **requestUrl : 5 minutes par essai** (avant 90 s — le pont base64 peut être très lent), 3 essais/source + backoff.
- **Miroir jsDelivr** en 2e position (CDN public, `Access-Control-Allow-Origin: *`) : unique chemin `fetch`-stream possible sur mobile (les assets GitHub n'envoient pas CORS), avec **vraie progression** en % et Mo. Sert la copie d'origine commitée dans `docs/assets/` (chaque zip < 20 Mo, limite jsDelivr).
- GitHub Pages s'est avéré injoignable sur certains réseaux (testé) : ce n'est pas utilisé comme miroir.

## [2.2.0] — 2026-09-10

### Corrigé (mobile)
- **« Échec, téléchargement partiel »** : un corps HTTP qui répond 200 mais avec un zip **trop court** (interruption réseau — très fréquent sur Android) passait l'étape de téléchargement et n'échouait qu'à l'extraction. Chaque téléchargement vérifie désormais la **taille compressée complète** (`pandoc_wasm.zip` 16,19 Mo, `typst_wasm.zip` 10,77 Mo, `typst_fonts.zip` 8,45 Mo) : un partiel est détecté aussitôt et **retenté** (jusqu'à 3 essais par étape, 3 tentatives complètes au besoin).
- Un zip **déposé à la racine du vault** qui s'avère tronqué/incompatible est **automatiquement supprimé** puis re-téléchargé proprement (plus d'échec « sec » si un zip partiel traînait).
- `requestUrl` (API native d'Obsidian, réseau système) est essayé **avant** `fetch` sur mobile : ce pont était essayé en premier et rendait les téléchargements lents/instables alors que le PC passait par le https natif de Node (quasi instantané).
- **Jamais de fichier « 0 octet » qui fait croire que c'est installé** : `pandoc.wasm` (59,1 Mo), `typst.wasm` (28,3 Mo) et `typst_fonts.zip` (≥ 13,4 Mo) sont validés à la **pleine taille** (adapter.stat, pas le stub `statSync` mobile qui répondait 0). Un fichier partiel est rejeté, jamais écrit, source effacée.
- Vérification après écriture dans l'extraction : un fichier revenu à 0 octet est signalé, jamais affiché comme installé.
- Choix demandé : les zips sont cherchés/déposés **à la racine du vault** (plus de sous-dossier nécessité), l'ancien `mergdown2tex_cache/` restant accepté en repli.

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