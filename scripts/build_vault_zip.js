#!/usr/bin/env node
/*
 * Builds docs/assets/full_manual_repport_exp.zip from the unzipped example_vault/.
 *
 * The vault is committed UNZIPPED in the repo (example_vault/). This script
 * compresses it into the downloadable zip used by the documentation site.
 *
 * Usage:
 *   node scripts/build_vault_zip.js          # -> docs/assets/full_manual_repport_exp.zip
 *   node scripts/build_vault_zip.js --check  # verify example_vault and zip are in sync
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const VAULT_DIR = path.join(ROOT, "example_vault");
const OUT = path.join(ROOT, "docs", "assets", "full_manual_repport_exp.zip");

// Files ignored by git are excluded from the zip too (settings that must not ship)
const EXCLUDED_BASENAMES = new Set(["data.json"]);

function run(args, opts) {
  return execFileSync(args[0], args.slice(1), { encoding: "utf8", cwd: ROOT, ...opts });
}

function collectFiles(dir, out, relPrefix) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = relPrefix ? `${relPrefix}/${ent.name}` : ent.name;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      collectFiles(abs, out, rel);
    } else if (!EXCLUDED_BASENAMES.has(ent.name)) {
      out.push(rel);
    }
  }
}

function build() {
  if (!fs.existsSync(VAULT_DIR)) {
    console.error(`❌ Dossier vault introuvable : ${VAULT_DIR}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const tmp = path.join(ROOT, ".tmp-vault.zip");
  fs.rmSync(tmp, { force: true });
  run(["zip", "-q", "-r", "-X", tmp, ".", "-x", "*/data.json"], { cwd: VAULT_DIR });
  fs.copyFileSync(tmp, OUT);
  fs.rmSync(tmp, { force: true });

  const files = [];
  collectFiles(VAULT_DIR, files, "");
  console.log(`✅ Zip généré : ${OUT}`);
  console.log(`   ${files.length} fichiers, ${(fs.statSync(OUT).size / 1024 / 1024).toFixed(1)} Mo`);
}

function check() {
  if (!fs.existsSync(OUT)) {
    console.error(`❌ Zip absent : ${OUT}. Lancez d'abord : node scripts/build_vault_zip.js`);
    process.exit(1);
  }
  const listing = run(["unzip", "-l", OUT]);
  const zipped = new Set(
    [...listing.matchAll(/^\s+\d+\s+[0-9-]+\s+[0-9:]+\s+(\S.*)$/gm)]
      .map((m) => m[1].trim())
      .filter((f) => f && !f.endsWith("/"))
  );
  const onDisk = [];
  collectFiles(VAULT_DIR, onDisk, "");
  const diskSet = new Set(onDisk);
  const missingFromZip = onDisk.filter((f) => !zipped.has(f));
  const extraInZip = [...zipped].filter((f) => !diskSet.has(f));
  if (missingFromZip.length || extraInZip.length) {
    console.error("❌ Désynchronisation vault/zip :");
    missingFromZip.forEach((f) => console.error(`   absent du zip: ${f}`));
    extraInZip.forEach((f) => console.error(`   en trop dans le zip: ${f}`));
    process.exit(1);
  }
  console.log("✅ example_vault/ et le zip sont synchronisés.");
}

if (process.argv.includes("--check")) {
  check();
} else {
  build();
}