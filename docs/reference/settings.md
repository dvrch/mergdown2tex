# Réglages

Les réglages de MergDown2TeX se configurent dans Obsidian.

---

## Accéder aux réglages

1. Ouvrez Obsidian
2. **Paramètres** → **Plugins communautaires**
3. Cliquez sur **MergDown2TeX** → **Options**

---

## Moteurs de compilation

### Moteur Pandoc WASM (DOCX)

| Réglage | Type | Description |
|---|---|---|
| `Utiliser Pandoc WASM (Recommandé)` | Toggle (défaut `true`) | Compile le DOCX via `pandoc.wasm` embarqué, sans Pandoc externe ni Podman |
| `Chemin Pandoc` | Texte | Chemin vers `pandoc.wasm` (`wasm/pandoc.wasm`) |

*Le fichier `pandoc.wasm` (~59 MB) est auto-téléchargé au premier lancement ; un bouton permet de forcer le téléchargement manuellement.*

### Moteur Typst WASM (PDF)

| Réglage | Type | Description |
|---|---|---|
| `PDF PC via Wasm+Typst` | Toggle | Sur PC, produit le PDF via `pandoc.wasm + typst.wasm` au lieu de pdflatex/podman (utile sans TeX installé) |

*`typst.wasm` (~28 MB) et les polices sont auto-téléchargés au premier lancement ; bouton de téléchargement manuel disponible.*

### Moteur LaTeX (PDF direct)

| Réglage | Type | Description |
|---|---|---|
| `Moteur LaTeX (PDF direct)` | — | Rendu LaTeX natif via pdflatex + Podman/Docker (PC uniquement) |

### Mode mobile

| Réglage | Type | Description |
|---|---|---|
| `Mode mobile` | Toggle | Sur smartphone/tablette : PDF via Pandoc WASM + Typst, DOCX via Pandoc WASM. Le rendu pdflatex/podman reste réservé au PC. |

---

## Rendu Mermaid

| Réglage | Type | Description |
|---|---|---|
| `Rendu Mermaid (diagrammes)` | Toggle | Convertit les blocs ` ```mermaid ` en images PNG avant le PDF (nécessite le bundle `mermaid.min.js`). Désactivable si le rendu bloque la compilation. |

*Le rendu Mermaid est **client-side** (via `resources/mermaid.min.js`, auto-déployé) — aucun `mmdc`/Node requis, y compris sur mobile.*

---

## Stockage des fichiers

| Réglage | Type | Description |
|---|---|---|
| `Garder le .typ à côté du .tex / PDF` | Toggle | Sauvegarde le fichier Typst intermédiaire (`NOM.typ`) à côté du `.tex`/PDF (sinon il n'existe qu'en mémoire WASM) |
| `Garder le .tex à côté du PDF` | Toggle | Conserve le `.tex` généré à côté du PDF |
| `Garder le .md à côté du PDF` | Toggle | Copie le `.md` original à côté du PDF |
| `Nettoyage auto après export` | Toggle | Supprime les fichiers de sortie générés (PDF, DOCX, MD, TEX) après export |

---

## Images

| Réglage | Type | Description |
|---|---|---|
| `Télécharger les images en ligne` | Toggle | Télécharge les images distantes (`https://…`) lors de la conversion. Désactivé = les URLs sont remplacées par un espace réservé. |

---

## Document

| Réglage | Type | Description |
|---|---|---|
| `Titre du document` | Texte | Titre par défaut |
| `Auteur du document (Force)` | Texte | Auteur forcé |
| `Préambule LaTeX personnalisé` | Textarea | Preamble LaTeX personnalisé |
| `Style de citation (CSL)` | Sélection | Fichier `.csl` utilisé (styles auto-hébergés dans `resources/csl/`) |
| `Chemin de la bibliographie (.bib)` | Texte | Chemin vers le fichier `.bib` |

---

## Mise en page

| Réglage | Type | Description |
|---|---|---|
| `En-tête personnalisé` | Toggle | Active un texte d'en-tête |
| `Contenu de l'en-tête` | Texte | Texte en haut de chaque page |
| `Pied de page personnalisé` | Toggle | Active un texte de pied de page |
| `Contenu du pied de page` | Texte | Texte en bas de chaque page |
| `Largeur par défaut des tableaux` | Nombre (défaut `0.95`) | Fraction de `\textwidth` pour les tableaux sans largeur spécifiée |

---

## Navigation & références

| Réglage | Type | Description |
|---|---|---|
| `Flèches bidirectionnelles entre liens` | Toggle | Ajoute les flèches ↑↓→ et les hyperliens de référencement croisé (PDF et DOCX). Désactiver pour un rendu sans flèches |
| `Numérotation des sections (DOCX)` | Toggle | Numérote les sections dans le DOCX |

---

## ZIP

| Réglage | Type | Description |
|---|---|---|
| `Ajouter .obsidian au ZIP` | Toggle | Inclut le dossier `.obsidian` lors de l'archivage des ressources liées |

---

## Exemples de configurations

### Article académique (Pandoc WASM + Typst)

```yaml
---
utiliserPandocWasm: true
pdfPCViaTypst: true
bibliography: references.bib
csl_path: apa.csl
---
```

### Export minimal (PDF, sans mise en page)

```yaml
---
garderTex: true
garderMd: false
nettoyageAuto: true
---
```

---

## Étapes suivantes

- [Commandes](commands.md) - Commandes disponibles
- [Architecture](architecture.md) - Détails techniques
- [Dépannage](../troubleshooting.md) - Problèmes courants
