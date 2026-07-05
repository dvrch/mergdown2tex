# Installation

MergDown2TeX installs in 3 simple steps. No build step required.

---

## Prerequisites

### Required

- **Obsidian** desktop (Electron) v1.0.0 or higher

### For PDF/DOCX compilation

- **Podman** or **Docker** (for container management)
- **TeX Live** (inside container)
- **Pandoc** (inside container)

!!! info "WASM Engine"
    The conversion from Markdown to LaTeX happens entirely inside Obsidian via WASM. No external tools are needed for this step.

---

## Step 1: Download

Download the latest release from GitHub:

<div class="grid cards" markdown>

-   :material-github:{ .lg .middle } **GitHub Releases**

    ---

    Download `main.js`, `manifest.json`, `vlatex_bg.wasm` from the latest release

    [:octicons-arrow-right-24: Download v1.0.0](https://github.com/dvrch/mergdown2tex/releases/tag/v1.0.0)

</div>

---

## Step 2: Copy to Obsidian

### Find your vault folder

1. Open Obsidian
2. Go to **Settings** → **Files & Links**
3. Note your vault location

### Create plugin folder

```
.obsidian/
└── plugins/
    └── mergdown2tex/    ← Create this folder
```

### Copy files

Copy these 3 files into `.obsidian/plugins/mergdown2tex/`:

```
mergdown2tex/
├── main.js          56 KB
├── manifest.json   351 B
└── vlatex_bg.wasm  2.1 MB
```

!!! warning "File locations"
    All 3 files must be in the same folder. The WASM binary (`vlatex_bg.wasm`) must be named exactly this.

---

## Step 3: Enable plugin

1. Open Obsidian
2. Go to **Settings** → **Community plugins**
3. Click **Turn on community plugins** (if not already enabled)
4. Find **MergDown2TeX** in the list
5. Click the toggle to enable it

!!! success "Done!"
    You should see a notice: "MergDown2TeX (WASM) chargé avec succès !"

---

## Verify installation

### Check commands

Open the command palette (`Ctrl/Cmd + P`) and type "MergDown2TeX". You should see:

- `MergDown2TeX: Convertir la note active en LaTeX (.tex)`
- `MergDown2TeX: Convertir et compiler en PDF`
- `MergDown2TeX: Convertir et compiler en DOCX (Word)`

### Check settings

Go to **Settings** → **Community plugins** → **MergDown2TeX** → **Options**

You should see the settings panel with all configuration options.

---

## Install compilation environment

### For PDF/DOCX compilation

You need to build the LaTeX container:

```bash
# Download the Dockerfile from the release
# Or create it manually (see Dockerfile section below)

# Build with Podman
podman build -t mergdown2tex-env -f Dockerfile .

# Or with Docker
docker build -t mergdown2tex-env -f Dockerfile .
```

### Dockerfile

```dockerfile
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-plain-generic \
    texlive-science \
    texlive-pictures \
    texlive-bibtex-extra \
    biber \
    python3-pygments \
    pandoc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /vault
```

### Verify container

```bash
# List images
podman images | grep mergdown2tex-env

# Test container
podman run --rm mergdown2tex-env pdflatex --version
```

---

## Troubleshooting

### Plugin not appearing

- Ensure all 3 files are in the same folder
- Check folder name matches manifest.json (`mergdown2tex`)
- Restart Obsidian

### WASM not loading

- Check `vlatex_bg.wasm` file size (should be ~2.1 MB)
- Ensure file is not corrupted (re-download if needed)
- Check Obsidian console for errors (`Ctrl/Cmd + Shift + I`)

### Container build fails

- Ensure Podman/Docker is installed and running
- Check internet connection (downloading packages)
- Try with `--no-cache` flag:
  ```bash
  podman build --no-cache -t mergdown2tex-env -f Dockerfile .
  ```

---

## Next steps

- [Quick Start](quickstart.md) - Convert your first note
- [Configuration](configuration.md) - Customize settings
- [Features](../features/overview.md) - Explore all features
