# Installation

MergDown2TeX s'installe en 3 étapes simples. **Aucune étape de compilation n'est requise** : le moteur de conversion (WASM) est directement embarqué dans `main.js`.

---

## Vue d'ensemble

| Élément | Où il se trouve | Taille |
|---|---|---|
| Moteur de conversion Markdown → LaTeX (WASM) | **Embarqué** dans `main.js` (Base64) | inclus |
| `pandoc.wasm` (DOCX) | Auto-téléchargé dans `wasm/` au 1er lancement | ~59 MB |
| `typst.wasm` + polices (PDF) | Auto-téléchargés dans `wasm/` au 1er lancement | ~28 MB |
| `mermaid.min.js` (rendu Mermaid) | Auto-déployé dans `resources/` | ~3.5 MB |

!!! info "Aucune dépendance externe"
    La conversion **Markdown → LaTeX** tourne à 100 % dans Obsidian via le WASM embarqué. La compilation **DOCX** utilise `pandoc.wasm` embarqué. Aucun Pandoc, Podman ou TeX Live n'est requis pour ces étapes.

---

## Prérequis

- **Obsidian** v1.0.0 ou supérieur (desktop et mobile)

### Options de compilation PDF (facultatif)

Le **PDF** peut être produit de deux façons :

1. **Pandoc WASM + Typst** (recommandé, fonctionne partout — y compris mobile) : procède au premier export PDF.
2. **pdflatex + Podman/Docker** (PC uniquement, rendu LaTeX natif) : nécessite l'image container `vlatex-env`.

Aucune de ces deux options n'est requise pour *générer* un `.tex` ou un `.docx`.

---

## Étape 1 : Télécharger

Téléchargez la **release** depuis GitHub. La release ne contient volontairement que l'essentiel :

```
main.js         ~8.6 MB   ← plugin + moteur de conversion WASM embarqué (Base64)
manifest.json       351 B ← métadonnées
```

!!! tip "Pourquoi seulement 2 fichiers ?"
    Le moteur WASM de conversion est encodé en Base64 **dans** `main.js`. Les gros binaires `pandoc.wasm` (~59 MB) et `typst.wasm` (~28 MB) sont **auto-téléchargés** par le plugin dans le dossier `wasm/` lors du premier export. Vous n'avez donc rien à copier à la main.

---

## Étape 2 : Copier dans Obsidian

### Localiser le dossier du vault

1. Ouvrez Obsidian
2. **Paramètres** → **Fichiers et liens**
3. Notez l'emplacement de votre vault

### Créer le dossier du plugin

```
.obsidian/
└── plugins/
    └── mergdowntotex/    ← dossier du plugin (nom exact = id)
```

### Copier les fichiers

Copiez ces **2 fichiers** dans `.obsidian/plugins/mergdowntotex/` :

```
mergdowntotex/
├── main.js
└── manifest.json
```

!!! warning "Nom du dossier"
    Le nom du dossier doit correspondre à l'`id` du plugin (`mergdowntotex`). À la première conversion, le plugin crée lui-même `wasm/` et `resources/` (auto-téléchargement de `pandoc.wasm`, `typst.wasm`, `mermaid.min.js`).

---

## Étape 3 : Activer le plugin

1. Ouvrez Obsidian
2. **Paramètres** → **Plugins communautaires**
3. Cliquez **Activer les plugins communautaires** (si ce n'est pas déjà fait)
4. Trouvez **MergDown2TeX** dans la liste
5. Activez le toggle

!!! success "C'est fait !"
    Vous devriez voir la notification : `MergDown2TeX (WASM) chargé avec succès !`

---

## Vérifier l'installation

### Commandes disponibles

Ouvrez la palette de commandes (`Ctrl/Cmd + P`), tapez "MergDown2TeX". Vous devriez voir :

- `MergDown2TeX: Convertir la note active en LaTeX (.tex)`
- `MergDown2TeX: Convertir et compiler en PDF`
- `MergDown2TeX: Convertir et compiler en DOCX (Word)`
- `MergDown2TeX: Générer le Markdown étendu (.expanded.md)`
- ... et d'autres (voir [Commandes](../reference/commands.md)).

### Premier export (auto-téléchargement)

Lors du **premier** export DOCX ou PDF, le plugin télécharge automatiquement les binaires manquants :

```
Chargement de Pandoc WASM...
Chargement de Typst WASM...
```

Un **bouton de téléchargement manuel** est également disponible dans les réglages du plugin (rubriques *Moteur Pandoc WASM (DOCX)* et *Moteur Typst WASM (PDF)*) si vous préférez déclencher le téléchargement à la main.

---

## Utiliser le vault exemple

Un **vault exemple** complet est fourni : notes, blocs numérotés, tableaux, figures, Mermaid, citations et bibliographie — avec le plugin déjà installé. Téléchargez-le directement depuis ce site :

**→ [Télécharger le vault exemple (`full_manual_repport_exp.zip`)](../assets/full_manual_repport_exp.zip)**

### Déployer le vault

1. Téléchargez le zip ci-dessus (le vault exemple est stocké dézippé dans `example_vault/` du dépôt ; le zip n'est généré que pour ce site)
2. Dézippez `full_manual_repport_exp.zip`
3. Ouvrez le dossier dézippé comme vault dans Obsidian (`Fichier` → `Ouvrir un vault`)
4. Le plugin **MergDown2TeX est déjà installé** dans `.obsidian/plugins/mergdowntotex/` (même version que la release)

!!! info "Plugin homogène dans tout le dépôt"
    La même installation (`main.js`, `manifest.json`, `wasm/`, `resources/`) est présente **à deux endroits identiques** :
    - La structure de release `mergdowntotex/` à la racine du dépôt
    - L'installation dans le vault exemple `.obsidian/plugins/mergdowntotex/`

    Ces deux emplacements sont maintenus **identiques et fusionnés** : une modification de l'un doit être répercutée dans l'autre.

### Notes embeds

- `Writing/full_manual_repport.md` : document principal complet (sections, tableaux, équations, figures, Mermaid, citations)
- `Writing/table blocks/`, `Writing/figure blocks/`, `Writing/equation blocks/` : blocs numérotés avec ancres (`^table--block-…`, etc.)
- `BIBTEX.bib` : bibliographie

---

## Installer l'environnement PDF natif (pdflatex, PC uniquement)

Si vous souhaitez utiliser le rendu **LaTeX natif** (pdflatex) plutôt que Typst, construisez le conteneur :

```bash
# Construire l'image (une seule fois)
podman build -t vlatex-env -f Dockerfile.vlatex .

# Ou avec Docker
docker build -t vlatex-env -f Dockerfile.vlatex .
```

!!! note "PDF sur mobile"
    Sur smartphone/tablette, le PDF est toujours produit via **Pandoc WASM + Typst** (pas d'accès à Podman/pdflatex). Cela fonctionne sans aucune installation.

---

## Dépannage

### Le plugin n'apparaît pas

- Vérifiez que les 2 fichiers sont dans le bon dossier (`.obsidian/plugins/mergdowntotex/`)
- Vérifiez que le nom du dossier correspond à l'`id` du `manifest.json`
- Redémarrez Obsidian

### Le WASM ne se charge pas

- Vérifiez la taille de `main.js` (~8.6 MB). Un fichier plus petit = version de développement sans WASM embarqué.
- Re-téléchargez la release si le fichier semble corrompu
- Consultez la console (`Ctrl/Cmd + Shift + I`)

### `pandoc.wasm` / `typst.wasm` introuvable

- Lancez un export, ou cliquez sur le bouton de téléchargement dans les réglages
- Vérifiez la connexion internet (les binaires font 59 MB + 28 MB)
- Vérifiez que le dossier `wasm/` existe à côté de `main.js`

### Erreur Podman pour le PDF natif

- Assurez-vous que Podman/Docker est installé et démarré
- Construisez l'image : `podman build -t vlatex-env -f Dockerfile.vlatex .`
- Ou basculez en mode **Pandoc WASM + Typst** dans les réglages (conseillé)

---

## Étapes suivantes

- [Démarrage rapide](quickstart.md) - Convertissez votre première note
- [Configuration](configuration.md) - Personnalisez les réglages
- [Fonctionnalités](../features/overview.md) - Explorez toutes les fonctions
