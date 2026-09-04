# Commandes

MergDown2TeX fournit les commandes suivantes, accessibles via la palette de commandes (`Ctrl/Cmd + P`).

---

## Commandes disponibles

| Commande | Description |
|---|---|
| `Convertir la note active en LaTeX (.tex)` | Génère le fichier `.tex` |
| `Convertir et compiler en PDF` | Génère le PDF (pipeline automatique) |
| `Convertir et compiler en DOCX (Word)` | Génère le Word (Pandoc WASM) |
| `Générer le Markdown étendu (.expanded.md)` | Produit un `.private/.expanded.md` autonome |
| `Reconvertir le .tex (jumeau) de la note active en Markdown` | `.tex` → Markdown |
| `Compile le .tex jumeau en PDF (reprend le .tex produit)` | `.tex` → PDF |
| `Compile le .tex jumeau en DOCX (reprend le .tex produit)` | `.tex` → DOCX |
| `Convertit le .tex jumeau en .typ (reprend le .tex produit)` | `.tex` → Typst |
| `Compile le .typ jumeau en PDF (reprend le .typ produit)` | `.typ` → PDF |
| `Aperçu PDF côte-à-côte (mode interactif md → pdf)` | Aperçu côte-à-côte |
| `ZIP des ressources liées de la note (_exp.zip)` | Archive les ressources liées |

---

## Raccourcis clavier

### Raccourcis par défaut

| Action | Windows/Linux | macOS |
|---|---|---|
| Palette de commandes | `Ctrl + P` | `Cmd + P` |

### Raccourcis personnalisés

1. Ouvrez Obsidian
2. **Paramètres** → **Raccourcis**
3. Recherchez "MergDown2TeX"
4. Définissez vos raccourcis

---

## Bouton du ruban

| Bouton | Action |
|---|---|
| :material-file-pdf: (PDF) | `Aperçu PDF côte-à-côte (md → pdf)` |

---

## Exemples d'utilisation

### Convertir en LaTeX

1. Ouvrez une note
2. Commande : `Convertir la note active en LaTeX (.tex)`
3. Le `.tex` apparaît dans le même dossier

### Compiler en PDF

1. Ouvrez une note
2. Commande : `Convertir et compiler en PDF`
3. Le PDF apparaît dans le même dossier (pipeline Typst ou pdflatex selon la config)

### Compiler en DOCX

1. Ouvrez une note
2. Commande : `Convertir et compiler en DOCX (Word)`
3. Le DOCX apparaît dans le même dossier (via Pandoc WASM)

### Générer le Markdown étendu

1. Ouvrez une note
2. Commande : `Générer le Markdown étendu (.expanded.md)`
3. Un fichier `.private/*.expanded.md` **autonome** est produit (embeds résolus, flèches ↓↑, marqueurs BACKLINK) — voir [Embeds](../features/embeds.md)

### ZIP des ressources liées

1. Ouvrez une note
2. Commande : `ZIP des ressources liées de la note (_exp.zip)`
3. Un `.zip` complet des ressources liées est créé (utile pour partager le document complet)

---

## Étapes suivantes

- [Réglages](settings.md) - Options de configuration
- [Architecture](architecture.md) - Détails techniques
- [Dépannage](../troubleshooting.md) - Problèmes courants
