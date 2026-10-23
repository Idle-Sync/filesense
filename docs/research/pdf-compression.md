status: decided: Ghostscript wasm (@okathira/ghostpdl-wasm) for compression; MuPDF.js (mupdf) for page count and scanned vs text detection

# pdf-compression — library options
researched: 2026-10-22   for: FileSense v1 (browser-local PDF compression, page count, scanned vs text)   status: open

## What we need
Reduce PDF size in the browser: downsample and re-encode embedded images, keep text and vectors, report page count and resulting size, tell scanned PDFs (image-only pages) from text PDFs. No server. GPL/AGPL licence, so AGPL libraries are acceptable. Brief section 4C.

## Already in the repo
Nothing covers this.

## Options
### Ghostscript compiled to wasm
what: the Ghostscript `pdfwrite` device in the browser; `-dPDFSETTINGS` presets downsample and re-encode images and keep text and vectors.
install: `npm install @okathira/ghostpdl-wasm`   source: https://cdn.jsdelivr.net/npm/@okathira/ghostpdl-wasm@1.1.0/README.md
maintained: partly — @okathira/ghostpdl-wasm 1.1.0 published 2025-11-02 (about 11.5 months before research date); @jspawn/ghostscript-wasm 0.0.2 published 2022-08-25, not maintained   source: https://registry.npmjs.org/@okathira/ghostpdl-wasm ; https://registry.npmjs.org/@jspawn/ghostscript-wasm
adoption: @jspawn/ghostscript-wasm 25,116 npm downloads, 2026-09-19 to 2026-10-18; no figure found for @okathira/ghostpdl-wasm   source: https://api.npmjs.org/downloads/point/last-month/@jspawn/ghostscript-wasm
licence: AGPL-3.0-or-later (wrapper and GhostPDL)   source: https://registry.npmjs.org/@okathira/ghostpdl-wasm
fits: README example runs `Module.callMain(["-sDEVICE=pdfwrite","-dPDFSETTINGS=/ebook","-dNOPAUSE","-dBATCH","-sOutputFile=example_output.pdf","example.pdf"])` after writing the input into the virtual filesystem. It is the only option here that recompresses images inside a PDF with ready-made controls. Worker use and wasm size are not stated. Market research reports `/screen` gives unreadable scans and `/ebook` is readable but larger (https://scruss.com/blog/tag/ghostscript/, undated).
pros: ready-made image downsampling and recompression; AGPL fits the project licence; text and vectors kept
cons: `pdfwrite` rewrites the whole file, so output can differ beyond images; wasm size and memory on large PDFs unverified; the maintained wrapper is one package at 1.1.0; page count and scanned/text detection need another library
sources:
- https://cdn.jsdelivr.net/npm/@okathira/ghostpdl-wasm@1.1.0/README.md — docs — 2026-10-22
- https://registry.npmjs.org/@okathira/ghostpdl-wasm — repo/registry — 2026-10-22
- https://api.npmjs.org/downloads/point/last-month/@jspawn/ghostscript-wasm — independent — 2026-10-22

### MuPDF.js (mupdf)
what: MuPDF WebAssembly bindings for Node, Bun and browsers.
install: `npm install mupdf`   source: https://cdn.jsdelivr.net/npm/mupdf/README.md
maintained: yes — last push 2026-07-01; npm version 1.28.1   source: https://api.github.com/repos/ArtifexSoftware/mupdf.js ; https://registry.npmjs.org/mupdf/latest
adoption: 2,036,989 npm downloads, 2026-09-19 to 2026-10-18   source: https://api.npmjs.org/downloads/point/last-month/mupdf
licence: AGPL-3.0-or-later or commercial (Artifex)   source: https://registry.npmjs.org/mupdf/latest
fits: `Document.openDocument(...)` then `countPages()` gives page count; `PDFDocument.subsetFonts()` exists; `saveToBuffer(options: any)` has untyped options; `Pixmap.asJPEG(quality)` exists. The published type file has no `rewriteImages` and no image DPI or quality options on `PDFDocument` (https://cdn.jsdelivr.net/npm/mupdf/dist/mupdf.d.ts, checked 2026-10-22, version not recorded). The C library has `pdf_rewrite_images` with DPI thresholds and recompression methods (https://mupdf.readthedocs.io/en/latest/_static/generated/c/html/image-rewriter_8h_source.html) but the JS binding does not expose it in that file. So browser image recompression with MuPDF.js means walking PDF objects by hand, or building the C call into our own wasm. A bug report says `pdf_rewrite_images` produced incomplete PNG images in 1.26.1 (https://bugs.ghostscript.com/show_bug.cgi?id=708567).
pros: page count, rendering and text extraction (for scanned vs text) in one library; actively maintained; 14.3 MB unpacked (npm `dist.unpackedSize`)
cons: no exposed image-rewrite call in the JS typings; README says nothing about worker use; AGPL (acceptable here)
sources:
- https://cdn.jsdelivr.net/npm/mupdf/README.md — docs — 2026-10-22
- https://api.github.com/repos/ArtifexSoftware/mupdf.js — repo — 2026-10-22
- https://api.npmjs.org/downloads/point/last-month/mupdf — independent — 2026-10-22
- https://cdn.jsdelivr.net/npm/mupdf/dist/mupdf.d.ts — docs — 2026-10-22

### pdf-lib
what: create and modify PDFs in any JavaScript environment.
install: no install command verified   source: https://github.com/Hopding/pdf-lib
maintained: no — last push 2024-07-17, older than 12 months; 318 open issues   source: https://api.github.com/repos/Hopding/pdf-lib
adoption: 68,724,203 npm downloads, 2026-09-19 to 2026-10-18   source: https://api.npmjs.org/downloads/point/last-month/pdf-lib
licence: MIT   source: https://api.github.com/repos/Hopding/pdf-lib
fits: page count and page operations (phase 2 merge/split/rotate); embeds new JPEG/PNG. No image downsampling documented in the sources read; recompressing existing images would need low-level object access plus our own decoders for Flate predictors, JBIG2, CCITT, JPX, colour spaces and soft masks (inference, not read on a fetched page).
pros: very high adoption; MIT; fits later page tools
cons: unmaintained for over 12 months; cannot recompress images by itself; no rendering
sources:
- https://api.github.com/repos/Hopding/pdf-lib — repo — 2026-10-22
- https://api.npmjs.org/downloads/point/last-month/pdf-lib — independent — 2026-10-22

### PDFium wasm (@hyzyla/pdfium)
what: TypeScript wrapper around PDFium for browser and Node.
install: no install command verified   source: https://github.com/hyzyla/pdfium
maintained: yes — last push 2026-10-10; 0 open issues   source: https://api.github.com/repos/hyzyla/pdfium
adoption: 2,010,851 npm downloads, 2026-09-19 to 2026-10-18   source: https://api.npmjs.org/downloads/point/last-month/@hyzyla/pdfium
licence: MIT (wrapper)   source: https://api.github.com/repos/hyzyla/pdfium
fits: renders pages to bitmaps; no image-recompression API found. Rasterising every page to JPEG would shrink the file but destroy selectable text and vectors, contradicting brief 4C.
pros: maintained; page count and text-layer presence for scanned detection
cons: not a compressor
sources:
- https://api.github.com/repos/hyzyla/pdfium — repo — 2026-10-22
- https://api.npmjs.org/downloads/point/last-month/@hyzyla/pdfium — independent — 2026-10-22

### pdf.js
what: Mozilla's PDF renderer.
install: no install command verified   source: https://github.com/mozilla/pdf.js
maintained: not verified (GitHub API returned 403)
adoption: not verified
fits: render and text extraction only; it does not write PDFs. Usable for the scanned-vs-text check and page thumbnails.
pros: reference renderer
cons: cannot compress
sources:
- https://github.com/mozilla/pdf.js — repo — 2026-10-22 (page not fetched successfully)

### qpdf wasm (@jspawn/qpdf-wasm, @neslinesli93/qpdf-wasm, qpdf-wasm-esm-embedded)
what: qpdf CLI compiled to wasm.
install: no install command verified   source: https://cdn.jsdelivr.net/npm/qpdf-wasm-esm-embedded@1.1.1/README.md
maintained: not verified
adoption: not verified
fits: structural optimisation without image downsampling (the `qpdf-compress` README describes its lossy image mode as a native Node addon, not a browser build: https://cdn.jsdelivr.net/npm/qpdf-compress@0.6.3/README.md).
pros: lossless, safe for text
cons: cannot hit aggressive targets because images are untouched
sources:
- https://cdn.jsdelivr.net/npm/qpdf-wasm-esm-embedded@1.1.1/README.md — docs — 2026-10-22
- https://cdn.jsdelivr.net/npm/qpdf-compress@0.6.3/README.md — docs — 2026-10-22

## Which can recompress images inside a PDF in the browser
- Ghostscript wasm: yes, directly, through `pdfwrite` and `-dPDFSETTINGS`.
- MuPDF.js: no documented JS call; possible by hand with `Pixmap.asJPEG`, or by compiling MuPDF's `pdf_rewrite_images` into our own wasm.
- pdf-lib: only by hand with our own decoders.
- PDFium wasm, pdf.js: no (render only; PDFium would force rasterising).
- qpdf wasm: no (lossless structure only).

## Hand-written alternative
Image recompression on MuPDF.js or pdf-lib: walk the object table, find image XObjects, decode (Flate with predictors, DCT, JPX, JBIG2, CCITT), handle colour spaces, ICC, SMask, inline images and Indexed palettes, resample, re-encode with jSquash, patch `/Filter`, `/Width`, `/Height`, `/ColorSpace`, save. Estimate 600 to 1,500 lines with a long tail of malformed-PDF bugs; upkeep is continuous. Scanned-vs-text detection (text items present, or one image covering the page) is about 40 to 80 lines on pdf.js or MuPDF.js.
