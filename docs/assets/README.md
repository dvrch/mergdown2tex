# MergDown2TeX Logo Files

## Required Files

| File | Type | Usage |
|---|---|---|
| `logo-icon.png` | Square icon | Favicon, plugin icon, small sizes |
| `logo-horizontal.png` | Horizontal text | README, documentation header |

## How to Save

### From Chat (Manual)

1. **Logo carré (icon)**:
   - Clic droit sur l'image carrée dans le chat
   - "Enregistrer l'image sous"
   - Sauvegarder comme `logo-icon.png`

2. **Logo horizontal (text)**:
   - Clic droit sur l'image horizontale dans le chat
   - "Enregistrer l'image sous"
   - Sauvegarder comme `logo-horizontal.png`

### Upload to GitHub

```bash
cd /tmp/obsidian-vlatex-rust
git add docs/assets/logo-icon.png docs/assets/logo-horizontal.png
git commit -m "Add both logo variants"
git push
```

## Usage Guidelines

| Location | Logo | Size |
|---|---|---|
| MkDocs sidebar | `logo-icon.png` | 32x32 |
| MkDocs header | `logo-horizontal.png` | Full width |
| README header | `logo-horizontal.png` | Centered |
| Plugin icon | `logo-icon.png` | 128x128 |
| Favicon | `logo-icon.png` | 32x32 |
| Social media | `logo-horizontal.png` | Full width |
