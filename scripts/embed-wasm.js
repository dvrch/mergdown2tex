#!/usr/bin/env node
/*
 * Embarque un moteur vLaTeX fraîchement compilé (binaire wasm) dans main.js et
 * resynchronise toutes les copies du repo :
 *   1. remplace la constante WASM_BASE64 (base64) dans main.js (source ES2022),
 *   2. écrase mergdowntotex/wasm/vlatex.wasm (source non compressée commitée),
 *   3. recalcule WASM_EXPECTED_BYTES["vlatex.wasm"] (taille wasm),
 *   4. régénère docs/assets/vlatex_wasm.zip via build_assets.js et recalcule
 *      WASM_ZIP_EXPECTED_BYTES["vlatex_wasm.zip"] (taille compressée).
 *
 * Usage :
 *   node scripts/embed-wasm.js <vlatex.wasm|vlatex_bg.wasm|vlatex_wasm.zip>
 *
 * Le binaire peut venir de la release dvrch/vlatex (construite par GitHub Actions)
 * ou d'un wasm-pack local. Idempotent : relancer sur le même binaire ne change
 * rien.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const MAIN = path.join(ROOT, "main.js");
const WASM_FILE = path.join(ROOT, "mergdowntotex", "wasm", "vlatex.wasm");
const ZIP_FILE = path.join(ROOT, "docs", "assets", "vlatex_wasm.zip");

function fail(msg) {
  console.error("[embed-wasm] " + msg);
  process.exit(1);
}

function main() {
  const input = process.argv[2];
  if (!input || !fs.existsSync(input)) fail("chemin binaire manquant : " + input);

  let wasmBytes;
  if (input.endsWith(".wasm")) {
    wasmBytes = fs.readFileSync(input);
  } else if (input.endsWith(".zip")) {
    wasmBytes = extractWasmFromZip(fs.readFileSync(input));
  } else {
    fail("extension inconnue (attendu .wasm ou .zip) : " + input);
  }

  const b64 = Buffer.from(wasmBytes).toString("base64");
  if (wasmBytes.length < 100) fail("binaire trop petit (" + wasmBytes.length + " o) — vérifie l'entrée");

  // 1) remplace UNIQUEMENT la constante active WASM_BASE64 (le placeholder
  //    statique reste tel quel : la source les a séparés).
  let src = fs.readFileSync(MAIN, "utf8");
  if (!/let WASM_BASE64 = "[^"]*";/.test(src)) fail("aucune constante mur WASM_BASE64 (let) trouvée");
  src = src.replace(/let WASM_BASE64 = "[^"]*";/, `let WASM_BASE64 = "${b64}";`);

  // 2) copie binaire non compressé dans mergdowntotex/wasm/.
  fs.mkdirSync(path.dirname(WASM_FILE), { recursive: true });
  fs.writeFileSync(WASM_FILE, wasmBytes);

  // 3) recalcule la taille attendue du wasm.
  src = src.replace(/("vlatex\.wasm"\s*:\s*)[0-9]+/, "$1" + wasmBytes.length);

  // 4) régénère docs/assets/vlatex_wasm.zip via build_assets.js (zip -9,
  //    idempotent car celui-ci lit mergdowntotex/wasm/vlatex.wasm fraîchement
  //    écrit) puis recalcule sa taille compressée.
  execFileSync(process.execPath, [path.join(ROOT, "scripts", "build_assets.js"), "--only", "vlatex"], { stdio: "inherit" });
  const zipBytes = fs.readFileSync(ZIP_FILE);
  src = src.replace(/("vlatex_wasm\.zip"\s*:\s*)[0-9]+/, "$1" + zipBytes.length);

  fs.writeFileSync(MAIN, src);
  console.log("[embed-wasm] ok : " + wasmBytes.length + " o embarqués (zip " + zipBytes.length + " o)");
}

function extractWasmFromZip(zipBuf) {
  // cherche l'entrée correspondant au fichier wasm (via le central directory).
  let off = 0;
  const entries = [];
  while (off + 4 <= zipBuf.length && zipBuf.readUInt32LE(off) === 0x04034b50) {
    const method = zipBuf.readUInt16LE(off + 8);
    const compSize = zipBuf.readUInt32LE(off + 18);
    const uncompSize = zipBuf.readUInt32LE(off + 22);
    const nameLen = zipBuf.readUInt16LE(off + 26);
    const extraLen = zipBuf.readUInt16LE(off + 28);
    const name = zipBuf.toString("utf8", off + 30, off + 30 + nameLen);
    const data = zipBuf.subarray(off + 30 + nameLen + extraLen, off + 30 + nameLen + extraLen + compSize);
    const unpacked = method === 0 ? data : method === 8 ? zlib.inflateRawSync(data) : null;
    if (unpacked !== null) entries.push({ name, data: unpacked });
    off += 30 + nameLen + extraLen + compSize;
  }
  const hit = entries.find((e) => e.name === "vlatex.wasm") || entries.find((e) => e.name === "vlatex_bg.wasm");
  if (!hit) fail("zip sans vlatex.wasm ni vlatex_bg.wasm");
  return hit.data;
}

main();