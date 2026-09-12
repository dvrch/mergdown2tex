#!/usr/bin/env bash
# =============================================================================
#  release.sh — « push intelligent » de la release MergDown2TeX
#
#  Un seul point d'entrée pour TOUTE la chaîne de release, en local :
#  1. bump de version (patch|minor|major — défaut patch)
#  2. embed du dernier vlatex.wasm publié par dvrch/vlatex (via GitHub, donc
#     AUCUN build rust en local) — si aucune release, garde le wasm committé
#  3. transpile ES2022 -> ES2017 (main.js + copies mergdowntotex/exemple)
#  4. vérifications (node --check, es-check, aucun débris dbg_* dans l'index)
#  5. git add UNIQUEMENT la liste blanche ci-dessous — JAMAIS dbg_*, wasm
#     binaires, gros zips, etc.
#  6. commit + tag + push main & tag
#
#  Usage :
#    ./scripts/release.sh            # bump patch
#    ./scripts/release.sh minor      # bump minor
#    ./scripts/release.sh 3.1.0      # version explicite
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

VERSION_ARG="${1:-patch}"

# --- 1) bump -----------------------------------------------------------------
if [[ "$VERSION_ARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  NEW_VERSION="$VERSION_ARG"
else
  OLD="$(node -p "require('./package.json').version")"
  IFS='.' read -r MAJOR MINOR PATCH <<<"$OLD"
  case "$VERSION_ARG" in
    patch) PATCH=$((PATCH + 1)) ;;
    minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
    major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
    *) echo "usage: $0 [patch|minor|major|<x.y.z>]"; exit 1 ;;
  esac
  NEW_VERSION="$MAJOR.$MINOR.$PATCH"
fi
echo "==> version : $NEW_VERSION"

node -e '
  const fs = require("fs");
  const v = process.argv[1];
  for (const f of ["package.json", "manifest.json", "mergdowntotex/manifest.json", "example_vault/.obsidian/plugins/mergdowntotex/manifest.json"]) {
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    d.version = v;
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n");
  }
  const pl = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
  if (pl.version) pl.version = v;
  fs.writeFileSync("package-lock.json", JSON.stringify(pl, null, 2) + "\n");
' "$NEW_VERSION"

# --- 2) embed dernier wasm vLaTeX (dvrch/vlatex), AUCUN build rust en local --
if command -v gh &>/dev/null; then
  VLTAG="$(gh release list -R dvrch/vlatex --limit 1 --json tagName --jq '.[0].tagName' 2>/dev/null || true)"
  rm -rf .vltmp && mkdir -p .vltmp
  if [ -n "$VLTAG" ] && gh release download "$VLTAG" -R dvrch/vlatex -p 'vlatex_wasm.zip' -D .vltmp --clobber 2>/dev/null && [ -s .vltmp/vlatex_wasm.zip ]; then
    echo "==> embed wasm vLaTeX $VLTAG (aucun build rust local)"
    node scripts/embed-wasm.js .vltmp/vlatex_wasm.zip
  else
    echo "==> pas de release dvrch/vlatex -> on garde le wasm déjà committé"
  fi
else
  echo "==> gh absent -> on garde le wasm déjà committé"
fi

# --- 3) transpile ------------------------------------------------------------
node scripts/transpile.js

# --- 4) vérifications --------------------------------------------------------
node --check main.js
node --check mergdowntotex/main.js
npx --no-install es-check es2017 mergdowntotex/main.js >/dev/null 2>&1 || { echo "es-check KO"; exit 1; }
echo "==> vérifications OK"

# --- 5) git add liste blanche ------------------------------------------------
git add \
  main.js \
  manifest.json \
  package.json \
  package-lock.json \
  CHANGELOG.md \
  mergdowntotex/main.js \
  mergdowntotex/manifest.json \
  mergdowntotex/wasm/vlatex.wasm \
  docs/assets/vlatex_wasm.zip \
  example_vault/.obsidian/plugins/mergdowntotex/main.js \
  example_vault/.obsidian/plugins/mergdowntotex/manifest.json \
  scripts/transpile.js scripts/build_assets.js scripts/embed-wasm.js scripts/release.sh \
  .github/workflows/docs.yml .github/workflows/release.yml

# refus de stage quoique ce soit de débris
STAGED=$(git diff --cached --name-only)
if grep -qE 'dbg_|\.parts/|\.tmp' <<<"$STAGED"; then
  echo "!! débris détectés dans l'index, abort"
  git reset -q
  exit 1
fi
echo "==> fichiers stagés :"
echo "$STAGED" | tee /tmp/opencode/release_staged_last.txt

# --- 6) commit + tag + push --------------------------------------------------
git commit -m "release $NEW_VERSION : $(git diff --cached --stat | tail -1 | sed -E 's/[0-9]+ files? changed//')"
git tag "$NEW_VERSION"
git push origin main
git push origin "$NEW_VERSION"
echo "==> release $NEW_VERSION poussée (workflows GitHub déroulent transpile+attestation)"