#!/usr/bin/env node
/*
 * Transpile main.js (source, ES2022) -> 100 % ES2017 / Chrome-55+ (WebView anciens,
 * Android 8, iOS anciens, vieux navigateurs) et écrit les 4 copies synchronisées.
 *
 * Pourquoi : le fichier contient le glue WASM généré (wasm-bindgen) qui utilise
 * `#champs privés` (ES2022), `??=`, `||=`, `&&=` (ES2021), `?.`/`??` (ES2020) et des
 * littéraux BigInt `0n` (ES2020). Un WebView qui ne peut PAS ANALYSER ces syntaxes
 * refuse de charger/activer le plugin (Obsidian désactive le plugin) — c'était le
 * cas des appareils Android 8 avec WebView < Chrome 94.
 *
 * Ce script :
 *   1. convertit les littéraux BigInt `123n` -> `BigInt(123)` (ES2016),
 *   2. remplace `globalThis` -> `_GLB_` (alias sûr, sans apparaître dans la définition),
 *   3. garde le seul BigInt exécuté au chargement du module derrière un typeof,
 *   4. ajoute des polyfills (replaceAll, Object.fromEntries) avant le transpile,
 *   5. fait transpiler esbuild vers ES2017 (il abaisse `#`, `??`, `?.`, `??=`, ...).
 *
 * Idempotent : relancer sur un fichier déjà transpilé ne change rien.
 *
 * Usage :  node scripts/transpile.js        (réécrit main.js + 3 copies vault)
 */
const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "main.js");
const COPIES = [
  "main.js",
  "mergdowntotex/main.js",
  "example_vault/.obsidian/plugins/mergdowntotex/main.js",
];

const POLYFILLS = `// polyfills compat vieux WebView (ajout ligne unique = idempotent)
if (typeof String !== "undefined" && String.prototype && !String.prototype.replaceAll) {
  Object.defineProperty(String.prototype, "replaceAll", {
    configurable: true,
    value: function (search, replacement) {
      if (search instanceof RegExp)
        return this.replace(new RegExp(search.source, "g"), replacement);
      var s = String(search);
      return this.split(s).join(replacement);
    },
  });
}
if (typeof Object !== "undefined" && !Object.fromEntries) {
  Object.fromEntries = function (entries) {
    var out = {};
    for (var i = 0; i < entries.length; i++) out[entries[i][0]] = entries[i][1];
    return out;
  };
}
var _GLB_ = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
`;

function prePass(src) {
  let s = src;
  // 1) littéraux BigInt ES2020 -> BigInt(n) ES2016 (constantes entières du glue WASM)
  s = s.replace(/\b([0-9]+)n\b/g, "BigInt($1)");
  // 2) seul BigInt TOP-LEVEL (inode typst) : ne doit jamais bloquer l'activation
  s = s.replace(
    /gd\.next_ino=BigInt\(1\):/,
    'gd.next_ino=typeof BigInt !== "undefined" ? BigInt(1) : 1:',
  );
  // 3) globalThis -> _GLB_ (typeof globalThis est sûr sur vieux moteurs, mais on
  //    veut un résultat IDENTIQUE en relançant → donc plus aucun globalThis, même
  //    dans la définition de l'alias).
  s = s.replace(/globalThis/g, "_GLB_");
  return s;
}

function main() {
  const src = fs.readFileSync(SRC, "utf8");
  const body = prePass(src);
  // Relance idempotente : si le bloc polyfill est déjà présent (fichier déjà
  // transpilé), ne re-préfixons pas. Le marqueur est du CODE et non un
  // commentaire car esbuild supprime les commentaires.
  const already = body.indexOf('!String.prototype.replaceAll') !== -1;
  const input = already ? body : POLYFILLS + "\n" + body;

  const transform = (contents) =>
    esbuild.buildSync({
      stdin: { contents, sourcefile: "main.js", resolveDir: ROOT },
      write: false,
      bundle: false,
      format: "cjs",
      target: ["es2017"],
      minify: false,
      charset: "utf8",
      logLevel: "error",
    }).outputFiles[0].text;

  // esbuild a un fixed-point après 2 passes (annotations __PURE__, renommages
  // de classes, hoisting de champs) : on applique les 2 ici pour rendre le
  // résultat stable en UNE seule invocation.
  let out = transform(input);
  out = transform(out);

  const before = Buffer.byteLength(src);
  const after = Buffer.byteLength(out);
  for (const rel of COPIES) fs.writeFileSync(path.join(ROOT, rel), out);

  console.log(
    "transpilé ES2022 -> ES2017 : " + src.split("\n").length + " lignes -> " +
      out.split("\n").length + " lignes, " + before + " -> " + after + " octets",
  );
  console.log("copies écrites : " + COPIES.join(", "));
}

main();