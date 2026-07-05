// === WASM ENGINE ===
// All memory management functions, raw bindings, and high-level wrappers
// from vlatex_bg.js and vlatex.js merged here

const { Plugin, Notice, PluginSettingTab, Setting, requestUrl } = require("obsidian");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { exec } = require("child_process");

// --- WASM Memory Management (from vlatex_bg.js) ---

let WASM_VECTOR_LEN = 0;

let wasm;

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

// --- Raw WASM Bindings (from vlatex_bg.js) ---

function expand_wikilinks_bg(content, vault_root, md_path) {
    let deferred5_0;
    let deferred5_1;
    try {
        const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(vault_root, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(md_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.expand_wikilinks(ptr0, len0, ptr1, len1, ptr2, len2);
        var ptr4 = ret[0];
        var len4 = ret[1];
        if (ret[3]) {
            ptr4 = 0; len4 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred5_0 = ptr4;
        deferred5_1 = len4;
        return getStringFromWasm0(ptr4, len4);
    } finally {
        wasm.__wbindgen_free(deferred5_0, deferred5_1, 1);
    }
}

function expand_wikilinks_with_index_bg(content, vault_root, md_path, _path_index_json) {
    let deferred6_0;
    let deferred6_1;
    try {
        const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(vault_root, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(md_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(_path_index_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.expand_wikilinks_with_index(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        var ptr5 = ret[0];
        var len5 = ret[1];
        if (ret[3]) {
            ptr5 = 0; len5 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred6_0 = ptr5;
        deferred6_1 = len5;
        return getStringFromWasm0(ptr5, len5);
    } finally {
        wasm.__wbindgen_free(deferred6_0, deferred6_1, 1);
    }
}

function expand_wikilinks_with_vfs_bg(content, vault_root, md_path, vfs_json) {
    let deferred6_0;
    let deferred6_1;
    try {
        const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(vault_root, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(md_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(vfs_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.expand_wikilinks_with_vfs(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        var ptr5 = ret[0];
        var len5 = ret[1];
        if (ret[3]) {
            ptr5 = 0; len5 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred6_0 = ptr5;
        deferred6_1 = len5;
        return getStringFromWasm0(ptr5, len5);
    } finally {
        wasm.__wbindgen_free(deferred6_0, deferred6_1, 1);
    }
}

function extract_bibliography_paths_bg(markdown_content) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(markdown_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.extract_bibliography_paths(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

function extract_citations_bg(latex_body) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(latex_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.extract_citations(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

function generate_full_bibliography_bg(citations_json, bib_paths_json, style) {
    let deferred4_0;
    let deferred4_1;
    try {
        const ptr0 = passStringToWasm0(citations_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(bib_paths_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(style, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.generate_full_bibliography(ptr0, len0, ptr1, len1, ptr2, len2);
        deferred4_0 = ret[0];
        deferred4_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

function generate_tex_footer_bg() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.generate_tex_footer();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

function generate_tex_header_bg(profile_name, markdown_content, title_override, author_override, include_toc, include_lot, include_lof) {
    let deferred5_0;
    let deferred5_1;
    try {
        const ptr0 = passStringToWasm0(profile_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(markdown_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(title_override, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(author_override, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.generate_tex_header(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, include_toc, include_lot, include_lof);
        deferred5_0 = ret[0];
        deferred5_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred5_0, deferred5_1, 1);
    }
}

function init_panic_hook_bg() {
    wasm.init_panic_hook();
}

function markdown_to_latex_bg(content, profile) {
    let deferred4_0;
    let deferred4_1;
    try {
        const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(profile, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.markdown_to_latex(ptr0, len0, ptr1, len1);
        var ptr3 = ret[0];
        var len3 = ret[1];
        if (ret[3]) {
            ptr3 = 0; len3 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred4_0 = ptr3;
        deferred4_1 = len3;
        return getStringFromWasm0(ptr3, len3);
    } finally {
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

function markdown_to_latex_with_vfs_bg(content, profile, vfs_json) {
    let deferred5_0;
    let deferred5_1;
    try {
        const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(profile, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(vfs_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.markdown_to_latex_with_vfs(ptr0, len0, ptr1, len1, ptr2, len2);
        var ptr4 = ret[0];
        var len4 = ret[1];
        if (ret[3]) {
            ptr4 = 0; len4 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred5_0 = ptr4;
        deferred5_1 = len4;
        return getStringFromWasm0(ptr4, len4);
    } finally {
        wasm.__wbindgen_free(deferred5_0, deferred5_1, 1);
    }
}

function prepare_latex_for_docx_bg(tex_content) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(tex_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.prepare_latex_for_docx(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

function __wbindgen_cast_0000000000000001(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
}

function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
}

// --- High-level Wrappers (from vlatex.js) ---

function add_citation_arrows_to_bbl(bbl_content, tex_content) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(bbl_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(tex_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.add_citation_arrows_to_bbl(ptr0, len0, ptr1, len1);
        deferred3_0 = ret[0];
        deferred3_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

function add_citation_navigation(tex_content) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(tex_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.add_citation_navigation(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

function add_docx_header_footer(docx_bytes, header_text, footer_text, enable_header, enable_footer) {
    const ptr0 = passArray8ToWasm0(docx_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(header_text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(footer_text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.add_docx_header_footer(ptr0, len0, ptr1, len1, ptr2, len2, enable_header, enable_footer);
    var v4 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v4;
}

function add_docx_table_colors(docx_bytes, tex_content) {
    const ptr0 = passArray8ToWasm0(docx_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(tex_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.add_docx_table_colors(ptr0, len0, ptr1, len1);
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

function expand_wikilinks(content, vault_root, md_path) {
    return expand_wikilinks_bg(content, vault_root, md_path);
}

function expand_wikilinks_with_index(content, vault_root, md_path, _path_index_json) {
    return expand_wikilinks_with_index_bg(content, vault_root, md_path, _path_index_json);
}

function expand_wikilinks_with_vfs(content, vault_root, md_path, vfs_json) {
    return expand_wikilinks_with_vfs_bg(content, vault_root, md_path, vfs_json);
}

function extract_bibliography_paths(markdown_content) {
    return extract_bibliography_paths_bg(markdown_content);
}

function extract_citations(latex_body) {
    return extract_citations_bg(latex_body);
}

function generate_full_bibliography(citations_json, bib_paths_json, style) {
    return generate_full_bibliography_bg(citations_json, bib_paths_json, style);
}

function generate_tex_footer() {
    return generate_tex_footer_bg();
}

function generate_tex_header(profile_name, markdown_content, title_override, author_override, include_toc, include_lot, include_lof) {
    return generate_tex_header_bg(profile_name, markdown_content, title_override, author_override, include_toc, include_lot, include_lof);
}

function init_panic_hook() {
    init_panic_hook_bg();
}

function markdown_to_latex(content, profile) {
    return markdown_to_latex_bg(content, profile);
}

function markdown_to_latex_with_vfs(content, profile, vfs_json) {
    return markdown_to_latex_with_vfs_bg(content, profile, vfs_json);
}

function modify_docx_arrows(docx_bytes, tex_content) {
    const ptr0 = passArray8ToWasm0(docx_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(tex_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.modify_docx_arrows(ptr0, len0, ptr1, len1);
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

function prepare_latex_for_docx(tex_content) {
    return prepare_latex_for_docx_bg(tex_content);
}

function prepare_latex_for_docx_full(tex_content, keep_nav_arrows, default_table_width) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(tex_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(default_table_width, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.prepare_latex_for_docx_full(ptr0, len0, keep_nav_arrows, ptr1, len1);
        deferred3_0 = ret[0];
        deferred3_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

function prepare_latex_for_docx_with_options(tex_content, keep_nav_arrows) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(tex_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.prepare_latex_for_docx_with_options(ptr0, len0, keep_nav_arrows);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

// --- WASM Imports ---

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./vlatex_bg.js": import0,
    };
}

function __wbg_set_wasm(val) {
    wasm = val;
}

// --- WASM Initialization ---

async function initWasm(wasmPath) {
    if (wasm) return;
    const wasmBytes = require('fs').readFileSync(wasmPath);
    const { instance } = await WebAssembly.instantiate(wasmBytes, __wbg_get_imports());
    __wbg_set_wasm(instance.exports);
    if (wasm.__wbindgen_start) wasm.__wbindgen_start();
}

// === PLUGIN CODE ===

const WEB_IMG_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

function getWebImageExt(url) {
  const low = url.toLowerCase();
  for (const ext of WEB_IMG_EXTS) {
    if (low.includes(ext)) return ext;
  }
  return ".png";
}

async function ensureWebImages(mdContent, cacheDir) {
  const re = /!\[([^\]]*)\]\(\s*(https?:\/\/[^)]+)\s*\)/g;
  let match;
  let result = mdContent;
  const seen = new Set();
  while ((match = re.exec(mdContent)) !== null) {
    const full = match[0];
    const alt = match[1];
    const url = match[2];
    if (seen.has(url)) continue;
    seen.add(url);
    const key = crypto.createHash("sha256").update(url).digest("hex").slice(0, 16);
    const ext = getWebImageExt(url);
    const localName = `web_${key}${ext}`;
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const localPath = path.join(cacheDir, localName);
    if (!fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
      try {
        const resp = await requestUrl({
          url,
          method: "GET",
          contentType: "application/octet-stream",
          responseType: "arraybuffer",
        });
        let buf;
        if (resp.arrayBuffer) {
          buf = Buffer.from(resp.arrayBuffer);
        } else {
          const raw = resp.text || "";
          buf = Buffer.alloc(raw.length);
          for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i) & 0xff;
        }
        fs.writeFileSync(localPath, buf);
        console.log("[mergdown2tex] downloaded web image:", url, "→", localPath);
      } catch (e) {
        console.warn("[mergdown2tex] cannot download", url, e.message);
        continue;
      }
    }
    result = result.replace(full, `![${alt}](${localPath})`);
  }
  return result;
}

const DEFAULT_SETTINGS = {
  bibliographyPath: "",
  documentTitle: "",
  authorName: "",
  pandocPath: "pandoc",
  latexEngine: "pdflatex",
  keepNavArrows: true,
  cslPath: "",
  preamblePath: "",
  defaultTableWidth: "0.95",
  enableDocxNumbering: true,
  headerContent: "",
  footerContent: "",
  enableHeader: false,
  enableFooter: false,
};

class Markdown2TexSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "MergDown2TeX Settings" });

    new Setting(containerEl)
      .setName("Chemin de la bibliographie (.bib)")
      .setDesc(
        "Chemin absolu ou relatif depuis la racine du vault vers votre fichier .bib. Laissé vide pour chercher automatiquement.",
      )
      .addText((text) =>
        text
          .setPlaceholder("ex: References/BIBTEX.bib")
          .setValue(this.plugin.settings.bibliographyPath)
          .onChange(async (value) => {
            this.plugin.settings.bibliographyPath = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Titre du document (Force)")
      .setDesc("Écrase le titre extrait du Markdown.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.documentTitle)
          .onChange(async (value) => {
            this.plugin.settings.documentTitle = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Auteur du document (Force)")
      .setDesc("Écrase l'auteur extrait du Markdown.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.authorName)
          .onChange(async (value) => {
            this.plugin.settings.authorName = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Moteur LaTeX")
      .setDesc(
        "Commande ou chemin (ex: pdflatex, xelatex, lualatex). Défaut: pdflatex",
      )
      .addText((text) =>
        text
          .setValue(this.plugin.settings.latexEngine)
          .onChange(async (value) => {
            this.plugin.settings.latexEngine = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Chemin Pandoc")
      .setDesc("Commande ou chemin pour Pandoc. Défaut: pandoc")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.pandocPath)
          .onChange(async (value) => {
            this.plugin.settings.pandocPath = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Conserver les flèches de navigation")
      .setDesc("Garder les flèches ↑↓→ et les hyperliens de référencement croisé dans le DOCX (pratique pour la navigation interactive).")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.keepNavArrows)
          .onChange(async (value) => {
            this.plugin.settings.keepNavArrows = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Fichier CSL (style de citation)")
      .setDesc("Chemin absolu ou relatif depuis la racine du vault vers votre fichier .csl.")
      .addText((text) =>
        text
          .setPlaceholder("ex: Styles/apa.csl")
          .setValue(this.plugin.settings.cslPath)
          .onChange(async (value) => {
            this.plugin.settings.cslPath = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Préambule LaTeX personnalisé")
      .setDesc("Chemin vers un fichier .tex dont le contenu remplacera le préambule généré automatiquement (entre \\documentclass et \\begin{document}).")
      .addText((text) =>
        text
          .setPlaceholder("ex: includes/mypreamble.tex")
          .setValue(this.plugin.settings.preamblePath)
          .onChange(async (value) => {
            this.plugin.settings.preamblePath = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Largeur par défaut des tableaux")
      .setDesc("Fraction de \\textwidth pour les tableaux sans largeur spécifiée (DOCX + PDF). Défaut: 0.95")
      .addText((text) =>
        text
          .setPlaceholder("0.95")
          .setValue(this.plugin.settings.defaultTableWidth)
          .onChange(async (value) => {
            this.plugin.settings.defaultTableWidth = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Numérotation des sections (DOCX)")
      .setDesc("Activer la numérotation automatique des sections dans le document Word.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableDocxNumbering)
          .onChange(async (value) => {
            this.plugin.settings.enableDocxNumbering = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Activer l'en-tête personnalisé")
      .setDesc("Ajouter un texte en haut de chaque page du DOCX.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableHeader)
          .onChange(async (value) => {
            this.plugin.settings.enableHeader = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Contenu de l'en-tête")
      .setDesc("Texte à afficher en en-tête (LaTeX autorisé).")
      .addText((text) =>
        text
          .setPlaceholder("ex: Rapport — \thetitle")
          .setValue(this.plugin.settings.headerContent)
          .onChange(async (value) => {
            this.plugin.settings.headerContent = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Activer le pied de page personnalisé")
      .setDesc("Ajouter un texte en bas de chaque page du DOCX.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableFooter)
          .onChange(async (value) => {
            this.plugin.settings.enableFooter = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Contenu du pied de page")
      .setDesc("Texte à afficher en pied de page (LaTeX autorisé).")
      .addText((text) =>
        text
          .setPlaceholder("ex: Page \thepage")
          .setValue(this.plugin.settings.footerContent)
          .onChange(async (value) => {
            this.plugin.settings.footerContent = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}

class Markdown2TexPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new Markdown2TexSettingTab(this.app, this));

    try {
      let pluginDir;
      if (this.app.vault.adapter.getBasePath) {
        pluginDir = path.join(
          this.app.vault.adapter.getBasePath(),
          this.manifest.dir,
        );
      } else if (this.app.vault.adapter.getFullPath) {
        pluginDir = this.app.vault.adapter.getFullPath(this.manifest.dir);
      } else {
        pluginDir = path.join(
          process.cwd(),
          this.app.vault.configDir,
          "plugins",
          this.manifest.id,
        );
      }

      const wasmPath = path.join(pluginDir, "vlatex_bg.wasm");
      if (!fs.existsSync(wasmPath)) {
        throw new Error(`vlatex_bg.wasm not found: ${wasmPath}`);
      }

      this.vlatex = {
        add_citation_arrows_to_bbl,
        add_citation_navigation,
        add_docx_header_footer,
        add_docx_table_colors,
        expand_wikilinks,
        expand_wikilinks_with_index,
        expand_wikilinks_with_vfs,
        extract_bibliography_paths,
        extract_citations,
        generate_full_bibliography,
        generate_tex_footer,
        generate_tex_header,
        init_panic_hook,
        markdown_to_latex,
        markdown_to_latex_with_vfs,
        modify_docx_arrows,
        prepare_latex_for_docx,
        prepare_latex_for_docx_full,
        prepare_latex_for_docx_with_options,
      };

      await initWasm(wasmPath);
      new Notice("MergDown2TeX (WASM) chargé avec succès !");
    } catch (e) {
      console.error("[mergdown2tex] FATAL:", e);
      new Notice("Erreur MergDown2TeX : " + e.message);
    }

    this.addCommand({
      id: "mergdown2tex-convert-to-tex",
      name: "MergDown2TeX: Convertir la note active en LaTeX (.tex)",
      callback: async () => {
        await this.convertToTex();
      },
    });

    this.addCommand({
      id: "mergdown2tex-compile-to-pdf",
      name: "MergDown2TeX: Convertir et compiler en PDF",
      callback: async () => {
        await this.compilePdf();
      },
    });

    this.addCommand({
      id: "mergdown2tex-compile-to-docx",
      name: "MergDown2TeX: Convertir et compiler en DOCX (Word)",
      callback: async () => {
        await this.compileDocx();
      },
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async getFilePaths() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      new Notice("Aucun fichier actif.");
      return null;
    }
    if (activeFile.extension !== "md") {
      new Notice("Le fichier actif n'est pas un fichier Markdown.");
      return null;
    }
    const vaultRoot = this.app.vault.adapter.getBasePath();
    const mdPath = path.join(vaultRoot, activeFile.path);
    const parentDir = path.dirname(mdPath);
    const fileStem = activeFile.basename;
    const content = await this.app.vault.read(activeFile);
    console.log("[mergdown2tex] active file:", mdPath);
    return { vaultRoot, mdPath, parentDir, fileStem, content, activeFile };
  }

  processDataviewInline(content, sourceFile) {
    const dvApi = this.app.plugins?.plugins?.dataview?.api;
    return content.replace(/`=([^`]+)`/g, (full, expr) => {
      const trimmed = expr.trim();
      let resolved = "";
      if (dvApi && dvApi.evaluateInline) {
        try {
          resolved = dvApi.evaluateInline(full, sourceFile)?.value?.toString() || "";
        } catch (e) {
          console.log("[mergdown2tex] Dataview evalInline failed:", full, e.message);
        }
      } else if (dvApi && dvApi.tryEvaluate) {
        try {
          resolved = dvApi.tryEvaluate(trimmed, {})?.toString() || "";
        } catch (e) {
          console.log("[mergdown2tex] Dataview tryEvaluate failed:", trimmed, e.message);
        }
      }
      if (!resolved) resolved = full;
      return resolved;
    });
  }

  async processEmbeds(content, sourceFile, vaultRoot, parentDir, depth = 0) {
    if (depth > 10) return { processed: content, vfs: {} };
    const vfs = {};
    let processed = content;

    const mermaidRegex = /```mermaid\s*\n([\s\S]+?)```/g;
    let mermaidMatch;
    let mermaidIndex = 0;
    const cacheDir = path.join(parentDir, "mermaid_diagrams");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const mermaidReplacements = [];
    while ((mermaidMatch = mermaidRegex.exec(content)) !== null) {
      const def = mermaidMatch[1];
      const original = mermaidMatch[0];
      const mmdPath = path.join(
        cacheDir,
        `diagram_${Date.now()}_${mermaidIndex}.mmd`,
      );
      const pngPath = path.join(
        cacheDir,
        `diagram_${Date.now()}_${mermaidIndex}.png`,
      );
      fs.writeFileSync(mmdPath, def);
      mermaidReplacements.push({ original, def, mmdPath, pngPath });
      mermaidIndex++;
    }

    for (let i = 0; i < mermaidReplacements.length; i++) {
      const r = mermaidReplacements[i];
      const original = r.original, def = r.def, mmdPath = r.mmdPath, pngPath = r.pngPath;
      try {
        await new Promise((resolve, reject) => {
          const mmdcCmd = `mmdc -i "${mmdPath}" -o "${pngPath}" -b white`;
          exec(mmdcCmd, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        const captionText = (def.trim().split('\n')[0] || 'Diagramme')
          .replace(/[&%$#_{}~^\\<>|]/g, (c) => '\\' + c)
          .slice(0, 60);
        processed = processed.replace(
          original,
          `\\begin{figure}[H]\n\\centering\n\\includegraphics[width=1.0\\linewidth,height=0.4\\textheight,keepaspectratio]{mermaid_diagrams/${path.basename(pngPath)}}\n\\caption{${captionText}}\n\\end{figure}`,
        );
        fs.unlinkSync(mmdPath);
      } catch (e) {
        console.error("[mergdown2tex] mermaid error:", e);
      }
    }

    const pattern = /!\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]\n]+))?\]\]/g;
    const matches = [];
    let m;
    while ((m = pattern.exec(processed)) !== null) {
      matches.push({ full: m[0], fileRef: m[1] });
    }

    for (const { full, fileRef } of matches) {
      let resolved = this.app.metadataCache.getFirstLinkpathDest(
        fileRef,
        sourceFile.path,
      );
      let absPath = "";
      let extension = "";

      if (!resolved) {
        if (path.isAbsolute(fileRef) && fs.existsSync(fileRef)) {
          absPath = fileRef;
          extension = path.extname(fileRef).slice(1);
        } else {
          console.log("[mergdown2tex] cannot resolve embed:", fileRef);
          continue;
        }
      } else {
        absPath = path.join(vaultRoot, resolved.path);
        extension = resolved.extension;
      }

      if (extension === "md") {
        if (!vfs[absPath] && resolved) {
          const rawContent = await this.app.vault.read(resolved);
          const { processed: pContent } = await this.processEmbeds(
            rawContent,
            resolved,
            vaultRoot,
            parentDir,
            depth + 1,
          );
          vfs[absPath] = pContent;
        }
      } else if (
        ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(extension)
      ) {
        const relPath = path.relative(parentDir, absPath);
        processed = processed.replaceAll(
          full,
          `\\includegraphics[width=0.95\\linewidth]{${relPath}}`,
        );
      }
    }
    return { processed, vfs };
  }

  assembleFullDocument(content, body, includeToc, vaultRoot, parentDir) {
    console.log("[mergdown2tex] assembling full document...");
    let bibPaths = [];
    try {
      const inlineBibPathsJson =
        this.vlatex.extract_bibliography_paths(content);
      bibPaths = JSON.parse(inlineBibPathsJson);
    } catch (e) {
      console.error("[mergdown2tex] bib paths error:", e);
    }

    if (bibPaths.length === 0 && this.settings.bibliographyPath) {
      let configuredPath = this.settings.bibliographyPath;
      if (!path.isAbsolute(configuredPath)) {
        configuredPath = path.join(vaultRoot, configuredPath);
      }
      bibPaths.push(configuredPath);
    }

    let cites = [];
    try {
      const citationsJson = this.vlatex.extract_citations(body);
      cites = JSON.parse(citationsJson);
    } catch (e) {
      console.error("[mergdown2tex] citations error:", e);
    }

    if (bibPaths.length === 0 && cites.length > 0) {
      try {
        const files = fs.readdirSync(parentDir);
        for (const file of files) {
          if (file.endsWith(".bib")) {
            bibPaths.push(path.join(parentDir, file));
          }
        }
      } catch (e) {
        console.error("[mergdown2tex] Error scanning for .bib files:", e);
      }
    }

    let bibSection = "";
    if (cites.length > 0 || bibPaths.length > 0) {
      const bibStyle = cites.length === 0 ? "" : "References";
      const relBibPaths = bibPaths.map((p) => path.relative(parentDir, p));
      bibSection =
        this.vlatex.generate_full_bibliography(
          JSON.stringify(cites),
          JSON.stringify(relBibPaths),
          bibStyle,
        ) + "\n";
    }

    const titleOverride = this.settings.documentTitle || "";
    const authorOverride = this.settings.authorName || "";

    let header = this.vlatex.generate_tex_header(
      "default",
      content,
      titleOverride,
      authorOverride,
      includeToc,
      includeToc,
      includeToc,
    );
    const footer = this.vlatex.generate_tex_footer();

    if (bibPaths.length > 0 && !header.includes("\\addbibresource")) {
      bibPaths.forEach((p) => {
        const rel = path.relative(parentDir, p);
        header = header.replace(
          "\\begin{document}",
          `\\addbibresource{${rel}}\n\\begin{document}`,
        );
      });
    }

    let title = titleOverride;
    if (!title) {
      const titleMatch = /^title:\s*(.*)$/m.exec(content);
      if (titleMatch) title = titleMatch[1].trim();
      else {
        const h1Match = /^#\s+(.*)$/m.exec(content);
        if (h1Match) title = h1Match[1].trim();
      }
    }

    let finalTex = header + "\n" + body + "\n" + bibSection + footer;

    if (this.settings.preamblePath) {
      const preambleAbs = path.isAbsolute(this.settings.preamblePath)
        ? this.settings.preamblePath
        : path.join(vaultRoot, this.settings.preamblePath);
      try {
        const customPreamble = fs.readFileSync(preambleAbs, "utf-8");
        const docClassRe = /^(.*?\\documentclass[^\n]*\n)([\s\S]*?)(\\begin\{document\})/m;
        finalTex = finalTex.replace(docClassRe, "$1" + customPreamble + "\n$3");
        console.log("[mergdown2tex] custom preamble applied from", preambleAbs);
      } catch (e) {
        console.error("[mergdown2tex] cannot read preamble:", e);
      }
    }

    if (title) {
      const sectionRe = new RegExp(`\\\\section\\{${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\s*`);
      const firstSection = finalTex.match(/(?:\n|^)(\\section\{.*?\})/);
      if (firstSection && firstSection[1].includes(title)) {
        finalTex = finalTex.replace(firstSection[1], "");
      }
    }

    return {
      tex: finalTex,
      title: title,
    };
  }

  async convertToTex() {
    if (!this.vlatex) {
      new Notice("vLaTeX WASM non initialisé.");
      return;
    }
    const fp = await this.getFilePaths();
    if (!fp) return;
    const { vaultRoot, mdPath, parentDir, fileStem, content: rawContent, activeFile } = fp;
    let content = this.processDataviewInline(rawContent, activeFile);
    try {
      new Notice("Conversion WASM en cours...");
      console.log("[mergdown2tex] processing embeds + building VFS...");
      let { processed, vfs } = await this.processEmbeds(
        content,
        activeFile,
        vaultRoot,
        parentDir,
      );
      const webCacheDir = path.join(parentDir, "embedded_images");
      processed = await ensureWebImages(processed, webCacheDir);
      const vfsJson = JSON.stringify(vfs);
      console.log("[mergdown2tex] expanding content...");
      const expanded = this.vlatex.expand_wikilinks_with_vfs(
        processed,
        vaultRoot,
        mdPath,
        vfsJson,
      );
      console.log("[mergdown2tex] converting to LaTeX body...");
      const body = this.vlatex.markdown_to_latex_with_vfs(
        expanded,
        "default",
        vfsJson,
      );
      const fullTex = this.assembleFullDocument(
        content,
        body,
        true,
        vaultRoot,
        parentDir,
      );

      const texPath = path.join(parentDir, fileStem + ".tex");
      fs.writeFileSync(texPath, fullTex.tex, "utf-8");
      for (const ext of [".aux", ".bbl", ".bcf", ".out", ".log", ".toc", ".lof", ".lot"]) {
        const p = path.join(parentDir, fileStem + ext);
        try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch {}
      }
      console.log(
        "[mergdown2tex] .tex written to",
        texPath,
        fullTex.tex.length,
        "bytes",
      );
      new Notice(
        "✅ LaTeX généré: " +
          fileStem +
          ".tex (" +
          fullTex.tex.length +
          " bytes)",
      );
    } catch (err) {
      console.error("[mergdown2tex] convert error:", err);
      new Notice("❌ Erreur: " + err.message);
    }
  }

  runPdflatex(texPath, parentDir, fileStem, vaultRoot, callback, fullTexString) {
    let pass = 0;
    const engine = this.settings.latexEngine || "pdflatex";
    const relTexPath = path.relative(vaultRoot, texPath);
    const relParentDir = path.relative(vaultRoot, parentDir);

    const cmd = `podman run --rm -v "${vaultRoot}:/vault" vlatex-env ${engine} -interaction=nonstopmode -shell-escape -output-directory="/vault/${relParentDir}" "/vault/${relTexPath}"`;
    const opts = { cwd: parentDir };
    const runPass = () => {
      pass++;
      console.log(`[mergdown2tex] ${engine} pass ${pass} (podman)`);
      exec(cmd, opts, (err, stdout, stderr) => {
        console.log(`[mergdown2tex] ${engine} pass ${pass} done`);
        if (stdout) console.log(`[mergdown2tex] stdout:`, stdout.slice(-500));
        if (stderr) console.log(`[mergdown2tex] stderr:`, stderr.slice(-500));
        if (err) console.log(`[mergdown2tex] err:`, err.message);
        if (pass < 3) runPass();
        else {
          const runFinalPass = () => {
            exec(cmd, opts, () => {
              const pdfPath = path.join(parentDir, fileStem + ".pdf");
              if (fs.existsSync(pdfPath)) callback(null, pdfPath);
              else callback(new Error("PDF not generated"), pdfPath);
            });
          };
          const postProcessBbl = () => {
            try {
              const bblPath = path.join(parentDir, fileStem + ".bbl");
              if (fs.existsSync(bblPath)) {
                const bblContent = fs.readFileSync(bblPath, "utf-8");
                if (fullTexString && this.vlatex.add_citation_arrows_to_bbl) {
                  const modifiedBbl = this.vlatex.add_citation_arrows_to_bbl(bblContent, fullTexString);
                  fs.writeFileSync(bblPath, modifiedBbl, "utf-8");
                  const arrowCount = (modifiedBbl.match(/hyperlink\{cite-call-/g) || []).length;
                  console.log("[mergdown2tex] per-entry citation arrows injected into .bbl — arrows added:", arrowCount);
                }
              } else {
                console.log("[mergdown2tex] bbl NOT FOUND at", bblPath);
              }
            } catch (bblErr) {
              console.error("[mergdown2tex] bbl arrows error:", bblErr);
            }
            runFinalPass();
          };
          const bcfPath = path.join(parentDir, fileStem + ".bcf");
          const auxPath = path.join(parentDir, fileStem + ".aux");
          if (fs.existsSync(bcfPath)) {
            console.log(`[mergdown2tex] running biber (podman)`);
            const biberCmd = `podman run --rm -v "${vaultRoot}:/vault" --workdir="/vault/${relParentDir}" vlatex-env biber "${fileStem}"`;
            exec(biberCmd, opts, () => { postProcessBbl(); });
          } else if (fs.existsSync(auxPath)) {
            const auxContent = fs.readFileSync(auxPath, "utf-8");
            if (auxContent.includes("\\bibstyle")) {
              console.log(`[mergdown2tex] running bibtex (podman)`);
              const bibtexCmd = `podman run --rm -v "${vaultRoot}:/vault" --workdir="/vault/${relParentDir}" vlatex-env bibtex "${fileStem}"`;
              exec(bibtexCmd, opts, () => { postProcessBbl(); });
            } else {
              runFinalPass();
            }
          } else {
            runFinalPass();
          }
        }
      });
    };
    runPass();
  }

  async compilePdf() {
    if (!this.vlatex) {
      new Notice("vLaTeX WASM non initialisé.");
      return;
    }
    const fp = await this.getFilePaths();
    if (!fp) return;
    const { vaultRoot, mdPath, parentDir, fileStem, content: rawContent, activeFile } = fp;
    let content = this.processDataviewInline(rawContent, activeFile);
    try {
      new Notice(
        `Conversion WASM + compilation PDF (${this.settings.latexEngine || "pdflatex"})...`,
      );
      console.log("[mergdown2tex] processing embeds + building VFS...");
      let { processed, vfs } = await this.processEmbeds(
        content,
        activeFile,
        vaultRoot,
        parentDir,
      );
      const webCacheDir = path.join(parentDir, "embedded_images");
      processed = await ensureWebImages(processed, webCacheDir);
      const vfsJson = JSON.stringify(vfs);
      console.log("[mergdown2tex] expanding content...");
      const expanded = this.vlatex.expand_wikilinks_with_vfs(
        processed,
        vaultRoot,
        mdPath,
        vfsJson,
      );
      console.log("[mergdown2tex] converting to LaTeX body...");
      const body = this.vlatex.markdown_to_latex_with_vfs(
        expanded,
        "default",
        vfsJson,
      );
      const { tex: plainTex } = this.assembleFullDocument(
        content,
        body,
        true,
        vaultRoot,
        parentDir,
      );

      let fullTexString = plainTex;
      try {
        fullTexString = this.vlatex.add_citation_navigation(plainTex);
        console.log("[mergdown2tex] citation navigation arrows added");
      } catch (e) {
        console.log("[mergdown2tex] citation navigation not available (old WASM):", e.message);
      }

      let fancySetup = "";
      if (this.settings.enableHeader || this.settings.enableFooter) {
        fancySetup += "\\usepackage{fancyhdr}\n\\pagestyle{fancy}\n\\fancyhf{}\n\\renewcommand{\\headrule}{{\\color{gray}\\rule{\\headwidth}{\\headrulewidth}}}\n\\renewcommand{\\footrule}{{\\color{gray}\\rule{\\headwidth}{\\headrulewidth}}}\n";
        if (this.settings.enableHeader && this.settings.headerContent) {
          fancySetup += "\\fancyhead[R]{{\\color{gray!60}\\small " + this.settings.headerContent + "}}\n";
        }
        if (this.settings.enableFooter && this.settings.footerContent) {
          let cleanFooter = this.settings.footerContent.replace(/\\(?:thepage|thePage|thePage)\b/g, "").replace(/Page\b/g, "").trim();
          if (cleanFooter) {
            fancySetup += "\\fancyfoot[L]{{\\color{gray!60}\\small " + cleanFooter + "}}\n";
          }
          fancySetup += "\\fancyfoot[R]{\\thepage}\n";
        }
      }
      if (fancySetup) {
        fullTexString = fullTexString.replace("\\begin{document}", fancySetup + "\\begin{document}\n");
      }

      const texPath = path.join(parentDir, fileStem + ".tex");
      fs.writeFileSync(texPath, fullTexString, "utf-8");
      console.log("[mergdown2tex] .tex written:", fullTexString.length, "bytes");
      this.runPdflatex(
        texPath,
        parentDir,
        fileStem,
        vaultRoot,
        (error, pdfPath) => {
          if (error) {
            new Notice("⚠️ PDF avec avertissements (pdflatex)");
          } else {
            new Notice("✅ PDF compilé!");
            exec(`xdg-open "${pdfPath}"`, () => {});
          }
        },
        fullTexString,
      );
    } catch (err) {
      console.error("[mergdown2tex] pdf error:", err);
      new Notice("❌ Erreur: " + err.message);
    }
  }

  async compileDocx() {
    if (!this.vlatex) {
      new Notice("vLaTeX WASM non initialisé.");
      return;
    }
    const fp = await this.getFilePaths();
    if (!fp) return;
    const { vaultRoot, mdPath, parentDir, fileStem, content: rawContent, activeFile } = fp;
    let content = this.processDataviewInline(rawContent, activeFile);
    try {
      new Notice(
        `Conversion WASM + compilation DOCX (${this.settings.pandocPath || "pandoc"})...`,
      );
      console.log("[mergdown2tex] processing embeds + building VFS...");
      let { processed, vfs } = await this.processEmbeds(
        content,
        activeFile,
        vaultRoot,
        parentDir,
      );
      const webCacheDir = path.join(parentDir, "embedded_images");
      processed = await ensureWebImages(processed, webCacheDir);
      const vfsJson = JSON.stringify(vfs);
      console.log("[mergdown2tex] expanding content...");
      const expanded = this.vlatex.expand_wikilinks_with_vfs(
        processed,
        vaultRoot,
        mdPath,
        vfsJson,
      );
      console.log("[mergdown2tex] converting to LaTeX body...");
      const body = this.vlatex.markdown_to_latex_with_vfs(
        expanded,
        "default",
        vfsJson,
      );
      const { tex: fullTex, title: docTitle } = this.assembleFullDocument(
        content,
        body,
        false,
        vaultRoot,
        parentDir,
      );

      console.log("[mergdown2tex] preparing for pandoc...");
      const docxTex = this.vlatex.prepare_latex_for_docx_full(fullTex, this.settings.keepNavArrows, this.settings.defaultTableWidth || "0.95");

      const docxTexPath = path.join(parentDir, fileStem + "_docx.tex");

      const renderLatex = async (latexCode) => {
        return new Promise((resolve, reject) => {
          const tmpDir = parentDir;
          const stem = `_latexblock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
          const texTmp = path.join(tmpDir, stem + ".tex");
          const pdfTmp = path.join(tmpDir, stem + ".pdf");
          const txtTmp = path.join(tmpDir, stem + ".txt");
          const doc = `\\documentclass{article}\\usepackage[utf8]{inputenc}\\usepackage[T1]{fontenc}\\usepackage{amsmath,amssymb,graphicx,hyperref}\\usepackage{lipsum}\\begin{document}\\nohyperpage\\nopagecolor\\pagestyle{empty}${latexCode}\\end{document}`;
          fs.writeFileSync(texTmp, doc, "utf-8");
          const rel = path.relative(vaultRoot, tmpDir);
          const base = path.basename(stem);
          exec(`podman run --rm -v "${vaultRoot}:/vault" vlatex-env pdflatex -interaction=nonstopmode "/vault/${rel}/${stem}.tex"`, (err) => {
            if (err) { resolve(latexCode); cleanup(); return; }
            exec(`podman run --rm -v "${vaultRoot}:/vault" vlatex-env pdftotext "/vault/${rel}/${stem}.pdf" "/vault/${rel}/${stem}.txt"`, (err2) => {
              if (err2) { resolve(latexCode); cleanup(); return; }
              try {
                const txt = fs.readFileSync(txtTmp, "utf-8").trim();
                resolve(txt || latexCode);
              } catch { resolve(latexCode); }
              cleanup();
            });
          });
          const cleanup = () => {
            try { fs.unlinkSync(texTmp); } catch {}
            try { fs.unlinkSync(pdfTmp); } catch {}
            try { fs.unlinkSync(txtTmp); } catch {}
            try { fs.unlinkSync(path.join(tmpDir, stem + ".log")); } catch {}
            try { fs.unlinkSync(path.join(tmpDir, stem + ".aux")); } catch {}
            try { fs.unlinkSync(path.join(tmpDir, stem + ".out")); } catch {}
          };
        });
      };
      let docxTexEval = docxTex;
      const lbRe = /% LATEXBLOCK\n([\s\S]*?)% \/LATEXBLOCK/g;
      let lbMatch;
      while ((lbMatch = lbRe.exec(docxTex)) !== null) {
        const code = lbMatch[1].trim().replace(/#&/g, "&");
        const rendered = await renderLatex(code);
        docxTexEval = docxTexEval.replace(lbMatch[0], rendered);
      }
      docxTexEval = docxTexEval
        .replace(/\\begin\{document\}/g, '')
        .replace(/\\end\{document\}/g, '')
        .replace(/\\documentclass\s*\[[^\]]*\]\s*\{[^}]*\}/g, '')
        .replace(/\\documentclass\s*\{[^}]*\}/g, '')
        .replace(/\\usepackage\s*(?:\[[^\]]*\])?\s*\{[^}]*\}/g, '')
        .replace(/\\RequirePackage\s*(?:\[[^\]]*\])?\s*\{[^}]*\}/g, '')
        .replace(/\\documentstyle\s*(?:\[[^\]]*\])?\s*\{[^}]*\}/g, '')
        .replace(/\\providecommand\{\\defaulttablewidth\}\{[^}]*\}/g, '');
      const docxPreamble = `\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage{hyperref}\n\\usepackage{xcolor}\n\\hypersetup{\n  colorlinks=true,\n  linkcolor=blue,\n  urlcolor=blue,\n  citecolor=blue\n}\n\\begin{document}\n`;
      fs.writeFileSync(docxTexPath, docxPreamble + docxTexEval + "\n\\end{document}\n", "utf-8");

      let bibPaths = [];
      try {
        bibPaths = JSON.parse(this.vlatex.extract_bibliography_paths(content));
      } catch (e) {}
      if (bibPaths.length === 0 && this.settings.bibliographyPath) {
        bibPaths.push(
          path.isAbsolute(this.settings.bibliographyPath)
            ? this.settings.bibliographyPath
            : path.join(vaultRoot, this.settings.bibliographyPath),
        );
      }
      if (bibPaths.length === 0) {
        try {
          const files = fs.readdirSync(parentDir);
          for (const file of files)
            if (file.endsWith(".bib"))
              bibPaths.push(path.join(parentDir, file));
        } catch (e) {}
      }

      const pandocBin = this.settings.pandocPath || "pandoc";
      const docxFileName = fileStem + ".docx";
      const docxTexFileName = fileStem + "_docx.tex";
      const relParentDir = path.relative(vaultRoot, parentDir);

      const numberSectionsFlag = this.settings.enableDocxNumbering ? " --number-sections" : "";
      let pandocArgs = `podman run --rm -v "${vaultRoot}:/vault" vlatex-env ${pandocBin} "/vault/${relParentDir}/${docxTexFileName}" -o "/vault/${relParentDir}/${docxFileName}" --mathml --resource-path="/vault:/vault/${relParentDir}" --embed-resources --standalone --toc --toc-depth=6${numberSectionsFlag}`;

      if (bibPaths.length > 0) {
        const bibPath = bibPaths[0];
        const relBibPath = path.relative(vaultRoot, bibPath);
        pandocArgs += ` --bibliography="/vault/${relBibPath}" --citeproc`;
      }
      if (this.settings.cslPath) {
        const cslAbs = path.isAbsolute(this.settings.cslPath)
          ? this.settings.cslPath
          : path.join(vaultRoot, this.settings.cslPath);
        const relCsl = path.relative(vaultRoot, cslAbs);
        pandocArgs += ` --csl="/vault/${relCsl}"`;
      }

      console.log("[mergdown2tex] docx cmd:", pandocArgs);
      exec(pandocArgs, (error, stdout, stderr) => {
        if (stdout) console.log("[mergdown2tex] pandoc stdout:", stdout);
        if (error) {
          console.log("[mergdown2tex] pandoc error:", error);
          console.log("[mergdown2tex] pandoc stderr:", stderr);
          new Notice("❌ Erreur pandoc: " + error.message);
        } else {
          console.log("[mergdown2tex] DOCX success");
          let docxPath = path.join(parentDir, fileStem + ".docx");
          try {
            let docxBytes = fs.readFileSync(docxPath);
            const arrowBytes = this.vlatex.modify_docx_arrows(docxBytes, docxTex);
            docxBytes = arrowBytes;
            console.log("[mergdown2tex] arrows: ok");
            const hfBytes = this.vlatex.add_docx_header_footer(
              docxBytes,
              this.settings.headerContent || "",
              this.settings.footerContent || "",
              this.settings.enableHeader || false,
              this.settings.enableFooter || false,
            );
            docxBytes = hfBytes;
            console.log("[mergdown2tex] header/footer: ok");
            const tcBytes = this.vlatex.add_docx_table_colors(docxBytes, docxTex);
            docxBytes = tcBytes;
            console.log("[mergdown2tex] table colors: ok");
            fs.writeFileSync(docxPath, docxBytes);
          } catch (postErr) {
            console.error("[mergdown2tex] post-processing error:", postErr);
          }
          new Notice("✅ DOCX compilé!");
          exec(
            `xdg-open "${path.join(parentDir, fileStem + ".docx")}"`,
            () => {},
          );
        }
      });
    } catch (err) {
      console.error("[mergdown2tex] docx error:", err);
      new Notice("❌ Erreur: " + err.message);
    }
  }
}

module.exports = Markdown2TexPlugin;
