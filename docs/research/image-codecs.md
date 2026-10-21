status: decided: jSquash + libheif-js

# image-codecs — library options
researched: 2026-10-22   for: FileSense v1 (browser-local image decode/encode/resize)   status: open

## What we need
Decode JPEG, PNG, WebP and HEIC/HEIF (iPhone); encode JPEG, PNG, WebP with quality control; resize with good resampling; honour EXIF orientation; keep transparency and ICC in mind. All inside the browser, in a Web Worker, no server. The engine must stay portable to native desktop apps; GPL or AGPL licence, so copyleft dependencies are acceptable. `.claude/conventions.md` has no stack decisions yet.

## Already in the repo
Nothing covers this (repo is empty).

## Options
### Browser built-ins: createImageBitmap + OffscreenCanvas
what: platform APIs, zero bytes shipped.
install: none (built in)   source: https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap
maintained: yes — MDN marks createImageBitmap "Baseline Widely available" since Sept 2021 and `convertToBlob` since March 2023   source: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/convertToBlob
adoption: every browser   source: https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap (seen 2026-10-22)
fits: decode, EXIF orientation (`imageOrientation: "from-image"` is the default), resize (`resizeQuality`: pixelated, low, medium, high), JPEG/WebP encode with `quality` 0 to 1, usable in workers. HEIC decode is not covered by the MDN pages.
pros: no dependency; orientation handled; works in workers
cons: encoder is not tunable (no MozJPEG, no PNG optimiser); output bytes differ per browser, which makes tests flaky; `colorSpaceConversion: default` is "implementation-specific", so ICC handling is not guaranteed; an unsupported `type` silently falls back to PNG
sources:
- https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap — docs — 2026-10-22
- https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/convertToBlob — docs — 2026-10-22 (quality applies only to JPEG and WebP; available in Web Workers)

### jSquash (@jsquash/jpeg, png, webp, oxipng, resize, avif)
what: the Squoosh codec WebAssembly bundles as npm packages for browser and Web Worker use.
install: no install command verified (README shows only esm.sh imports, e.g. `import { encode } from "https://esm.sh/@jsquash/webp";`)   source: https://github.com/jamsinclair/jSquash
maintained: yes — last push 2026-01-05   source: https://api.github.com/repos/jamsinclair/jSquash
adoption: @jsquash/jpeg 742,223 npm downloads, 2026-09-19 to 2026-10-18   source: https://api.npmjs.org/downloads/point/last-month/@jsquash/jpeg
licence: repository Apache-2.0 (per-package licences not stated on the README)   source: https://api.github.com/repos/jamsinclair/jSquash
fits: jpeg uses MozJPEG, png the Rust `png` crate, webp libwebp, oxipng optimises PNG, resize uses Rust `resize`, `hqx` and `magic-kernel`. README aim: "Browser" and "Web Worker". No HEIC package. No EXIF orientation or ICC handling mentioned, so orientation must come from elsewhere (createImageBitmap does it).
pros: tuned encoders (MozJPEG, oxipng); identical output in every browser; Web Worker focus
cons: 28 open issues, README lists known problems with Vite, Vue, Nuxt and nested Web Workers; ESM only; no HEIC, no EXIF/ICC handling
sources:
- https://github.com/jamsinclair/jSquash — docs — 2026-10-22
- https://api.github.com/repos/jamsinclair/jSquash — repo — 2026-10-22
- https://api.npmjs.org/downloads/point/last-month/@jsquash/jpeg — independent (registry numbers) — 2026-10-22

### libheif-js (HEIC/HEIF decode)
what: libheif compiled with Emscripten, as an npm module.
install: `npm install libheif-js`   source: https://github.com/catdad-experiments/libheif-js
maintained: yes — last push 2026-10-04   source: https://api.github.com/repos/catdad-experiments/libheif-js
adoption: 10,784,417 npm downloads, 2026-09-19 to 2026-10-18   source: https://api.npmjs.org/downloads/point/last-month/libheif-js
licence: LGPL-3.0 (compatible with GPL/AGPL)   source: https://api.github.com/repos/catdad-experiments/libheif-js
fits: `new libheif.HeifDecoder().decode(bytes)` returns images; `image.display(imageData, cb)` fills RGBA pixels that feed any encoder. `libheif-js/wasm-bundle` embeds the .wasm in JS for browser bundles.
pros: decodes iPhone HEIC to raw pixels; actively maintained; wasm bundle variant
cons: decode only; README is silent on HEVC patent or royalty terms (open question for a public release); callback-style API; the pure-JS default build is the slow one (use the wasm variants)
sources:
- https://github.com/catdad-experiments/libheif-js — docs — 2026-10-22
- https://api.github.com/repos/catdad-experiments/libheif-js — repo — 2026-10-22
- https://api.npmjs.org/downloads/point/last-month/libheif-js — independent — 2026-10-22
- https://www.testmuai.com/learning-hub/heif-browser-support/ — independent (third-party compatibility page: Mozilla's HEIF request lists HEVC patent licensing as a blocker) — 2026-10-22

### heic2any
what: HEIC/HEIF to PNG/GIF/JPEG converter in the browser using web workers.
install: no install command verified   source: https://github.com/alexcorvi/heic2any
maintained: no — last push 2024-04-11, older than 12 months   source: https://api.github.com/repos/alexcorvi/heic2any
adoption: 5,378,164 npm downloads, 2026-09-19 to 2026-10-18   source: https://api.npmjs.org/downloads/point/last-month/heic2any
licence: MIT   source: https://api.github.com/repos/alexcorvi/heic2any
fits: converts straight to JPEG/PNG; does not give raw pixels to our own encoder and does not copy metadata (README: viewing purpose).
pros: one call; MIT
cons: not maintained in 12 months; no metadata copy; no control over the encoder
sources:
- https://api.github.com/repos/alexcorvi/heic2any — repo — 2026-10-22
- https://api.npmjs.org/downloads/point/last-month/heic2any — independent — 2026-10-22

### wasm-vips
what: libvips (full image pipeline) compiled to WebAssembly for browser and Node.
install: `npm install wasm-vips`   source: https://github.com/kleisauke/wasm-vips
maintained: yes — last push 2026-10-20   source: https://api.github.com/repos/kleisauke/wasm-vips
adoption: 387,894 npm downloads, 2026-09-19 to 2026-10-18   source: https://api.npmjs.org/downloads/point/last-month/wasm-vips
licence: repository MIT   source: https://api.github.com/repos/kleisauke/wasm-vips
fits: the fetched README did not list formats, resize, ICC, EXIF autorotate or HEIC, so those are unverified here. It requires `SharedArrayBuffer`: the site must send `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin` on the document and the vips script; it needs WebAssembly SIMD and Exception Handling (Chrome 95, Firefox 100, Safari 16.4).
pros: broadest feature set in one package (per its description as libvips); actively maintained
cons: needs cross-origin isolation headers on the host (Vercel header configuration not verified in this run); README says "still under early development"; HEIC support and bundle size unverified
sources:
- https://github.com/kleisauke/wasm-vips — docs — 2026-10-22
- https://api.github.com/repos/kleisauke/wasm-vips — repo — 2026-10-22
- https://api.npmjs.org/downloads/point/last-month/wasm-vips — independent — 2026-10-22

### Rust crates compiled to wasm (image, zune-jpeg, jpeg-encoder, mozjpeg-sys)
what: the same codecs if the engine is Rust, so one code base builds to wasm and native.
install: no install command verified (Cargo dependencies)   source: https://raw.githubusercontent.com/etemesi254/zune-image/dev/README.md
maintained: not checked (GitHub API returned 403)
adoption: not verified
fits: zune-image README lists JS/TS use through zune-wasm; zune-jpeg decodes only, JPEG encoding comes from the external `jpeg-encoder` crate; no PNG encoder in its encoder table; licence and wasm32 support for zune-jpeg not stated on the page. `image` and `mozjpeg-sys` were not researched (budget).
pros: one engine code base for browser and desktop
cons: no HEIC; encoder-size parity with MozJPEG not verified; incomplete research
sources:
- https://raw.githubusercontent.com/etemesi254/zune-image/dev/README.md — repo — 2026-10-22

## Hand-written alternative
Codecs for JPEG/WebP/HEIC are not hand-writable; only glue is: worker messages, orientation fix, resize call, encode call, HEIC to pixels. Canvas-only: about 60 to 100 lines, low upkeep, but output differs per browser and PNG cannot be optimised. jSquash + libheif-js: about 150 to 250 lines of glue; upkeep is bumping wasm packages and bundler workarounds.
