#!/usr/bin/env node
// bundle-release.js
// Encode vlatex_bg.wasm en Base64 et l'injecte dans main.js
// Génère build/main.js + build/manifest.json

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WASM_FILE = path.join(ROOT, 'vlatex_bg.wasm');
const MAIN_JS = path.join(ROOT, 'main.js');
const MANIFEST = path.join(ROOT, 'manifest.json');
const OUT_DIR = path.join(ROOT, 'build');
const OUT_MAIN = path.join(OUT_DIR, 'main.js');
const OUT_MANIFEST = path.join(OUT_DIR, 'manifest.json');

if (!fs.existsSync(WASM_FILE)) {
  console.error(`[bundle] ERR: ${WASM_FILE} introuvable`);
  process.exit(1);
}

// 1. Encode WASM en Base64
const wasmBuffer = fs.readFileSync(WASM_FILE);
const wasmBase64 = wasmBuffer.toString('base64');
console.log(`[bundle] WASM encodé: ${wasmBase64.length} chars`);

// 2. Lire main.js
let mainJs = fs.readFileSync(MAIN_JS, 'utf8');

// 3. Remplacer "let WASM_BASE64 = WASM_BASE64_PLACEHOLDER;" par le vrai Base64
mainJs = mainJs.replace(
  'let WASM_BASE64 = WASM_BASE64_PLACEHOLDER;',
  `let WASM_BASE64 = "${wasmBase64}";`
);

// 4. Remplacer initWasm(wasmPath) par initWasmEmbedded()
mainJs = mainJs.replace(
  'await initWasm(wasmPath);',
  'await initWasmEmbedded();'
);

// 5. Supprimer les lignes wasmPath (définition + existsSync check)
mainJs = mainJs.replace(
  /const wasmPath = path\.join\(pluginDir, "vlatex_bg\.wasm"\);\s+if \(!fs\.existsSync\(wasmPath\)\) \{\s+throw new Error\(`vlatex_bg\.wasm not found: \${wasmPath}`\);\s+}\s+/g,
  ''
);

// 6. Écrire build/main.js
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_MAIN, mainJs, 'utf8');
console.log(`[bundle] ${OUT_MAIN} écrit (${mainJs.length} bytes)`);

// 7. Copier manifest.json
fs.copyFileSync(MANIFEST, OUT_MANIFEST);
console.log(`[bundle] ${OUT_MANIFEST} copié`);

console.log('[bundle] ✅ Terminé');
