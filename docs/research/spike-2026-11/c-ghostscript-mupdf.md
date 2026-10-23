# (c) Ghostscript wasm and MuPDF.js

Packages: `@okathira/ghostpdl-wasm` 1.1.0 (Ghostscript `pdfwrite`) and `mupdf` 1.28.1 (page count and text extraction). Page: `packages/spike/pages/pdf/` (`main.ts`, `ghostscript-worker.ts`, `mupdf-worker.ts`). Spec: `packages/spike/tests/pdf.spec.ts`. Corpus: `tests/corpus/text.pdf` (20684 bytes, 3 pages) and `tests/corpus/scanned.pdf` (1518434 bytes, 3 pages).

Run: `SPIKE_PORT=4174 pnpm spike:test -- --grep pdf` on macOS arm64 (Darwin 25.5.0), Playwright 1.64.1 headless Chromium, Firefox and WebKit, served by `vite preview` on localhost. Load average was about 5 during the run: two other spike probes were building and testing on the same CPU at the same time, so every timing below is contended. A later run on an idle machine re-measures them, and its figures replace these where they differ.

## How the numbers are taken

- Load time: `performance.now()` in the page from `new Worker(...)` to the worker's `ready` message. Covers the worker script, the wasm fetch from localhost, compile and module start, in a fresh browser context per run (cold HTTP cache). It does not include download time over a real network; see the bundle and wire sizes for that.
- Run time: `timed()` around `callMain` (Ghostscript) or around open, `countPages` and text extraction of every page (MuPDF), inside the worker. Seconds per page is the Ghostscript run time divided by the manifest page count.
- `wasmMemoryBytes`: `buffer.byteLength` of the Ghostscript wasm instance's memory, read inside the worker after the run. The package exposes only `FS` and `callMain`, so the worker passes Emscripten's `instantiateWasm` hook, instantiates `gs.wasm` itself and keeps the `WebAssembly.Memory` from the instance exports.
- `textCharacters`: non-whitespace characters of `toStructuredText("preserve-whitespace").asText()` summed over all pages.
- Chromium JS heap: `JSHeapUsedSize` from CDP `Performance.getMetrics` on the page after the run. It does not see worker memory; the wasm memory figure covers that.
- Bundle sizes: every `.js` and `.wasm` file of the two packages in `packages/spike/dist/assets` after `vite build`, measured with `fileBytes`, `brotliBytes` and `gzipBytes` from `packages/spike/tests/measure.ts`. Hashes in the file names change on every build.

## Measurements

### Bundle size (packages/spike/dist/assets)

| browser | file | setting | number | unit |
|---|---|---|---|---|
| n/a | `ghostscript-worker-BHuLRWGr.js` | on disk | 38490 | bytes |
| n/a | `ghostscript-worker-BHuLRWGr.js` | brotli (Node zlib default) | 12841 | bytes |
| n/a | `ghostscript-worker-BHuLRWGr.js` | gzip (Node zlib default) | 14148 | bytes |
| n/a | `gs-B5YlcvOb.wasm` | on disk | 15533045 | bytes |
| n/a | `gs-B5YlcvOb.wasm` | brotli (Node zlib default) | 10483192 | bytes |
| n/a | `gs-B5YlcvOb.wasm` | gzip (Node zlib default) | 11083866 | bytes |
| n/a | `mupdf-wasm-Bvf0xebB.wasm` | on disk | 10409826 | bytes |
| n/a | `mupdf-wasm-Bvf0xebB.wasm` | brotli (Node zlib default) | 3622011 | bytes |
| n/a | `mupdf-wasm-Bvf0xebB.wasm` | gzip (Node zlib default) | 4713580 | bytes |
| n/a | `mupdf-worker-UJXkQQm7.js` | on disk | 88296 | bytes |
| n/a | `mupdf-worker-UJXkQQm7.js` | brotli (Node zlib default) | 20194 | bytes |
| n/a | `mupdf-worker-UJXkQQm7.js` | gzip (Node zlib default) | 23253 | bytes |

### Ghostscript: Load time, new Worker to ready

| browser | file | setting | number | unit |
|---|---|---|---|---|
| chromium | text.pdf | /screen | 64 | milliseconds |
| chromium | text.pdf | /ebook | 131 | milliseconds |
| chromium | text.pdf | /printer | 67 | milliseconds |
| chromium | scanned.pdf | /screen | 146 | milliseconds |
| chromium | scanned.pdf | /ebook | 53 | milliseconds |
| chromium | scanned.pdf | /printer | 50 | milliseconds |
| firefox | text.pdf | /screen | 136 | milliseconds |
| firefox | text.pdf | /ebook | 166 | milliseconds |
| firefox | text.pdf | /printer | 73 | milliseconds |
| firefox | scanned.pdf | /screen | 92 | milliseconds |
| firefox | scanned.pdf | /ebook | 98 | milliseconds |
| firefox | scanned.pdf | /printer | 94 | milliseconds |
| webkit | text.pdf | /screen | 154 | milliseconds |
| webkit | text.pdf | /ebook | 57 | milliseconds |
| webkit | text.pdf | /printer | 94 | milliseconds |
| webkit | scanned.pdf | /screen | 63 | milliseconds |
| webkit | scanned.pdf | /ebook | 77 | milliseconds |
| webkit | scanned.pdf | /printer | 45 | milliseconds |

### Ghostscript: Seconds per page, pdfwrite run divided by manifest pages

| browser | file | setting | number | unit |
|---|---|---|---|---|
| chromium | text.pdf | /screen | 0.035 | seconds |
| chromium | text.pdf | /ebook | 0.049 | seconds |
| chromium | text.pdf | /printer | 0.045 | seconds |
| chromium | scanned.pdf | /screen | 0.063 | seconds |
| chromium | scanned.pdf | /ebook | 0.038 | seconds |
| chromium | scanned.pdf | /printer | 0.034 | seconds |
| firefox | text.pdf | /screen | 0.051 | seconds |
| firefox | text.pdf | /ebook | 0.055 | seconds |
| firefox | text.pdf | /printer | 0.024 | seconds |
| firefox | scanned.pdf | /screen | 0.054 | seconds |
| firefox | scanned.pdf | /ebook | 0.031 | seconds |
| firefox | scanned.pdf | /printer | 0.033 | seconds |
| webkit | text.pdf | /screen | 0.058 | seconds |
| webkit | text.pdf | /ebook | 0.036 | seconds |
| webkit | text.pdf | /printer | 0.036 | seconds |
| webkit | scanned.pdf | /screen | 0.063 | seconds |
| webkit | scanned.pdf | /ebook | 0.037 | seconds |
| webkit | scanned.pdf | /printer | 0.034 | seconds |

### Ghostscript: Output size

| browser | file | setting | number | unit |
|---|---|---|---|---|
| chromium | text.pdf | /screen | 19807 | bytes |
| chromium | text.pdf | /ebook | 19788 | bytes |
| chromium | text.pdf | /printer | 22424 | bytes |
| chromium | scanned.pdf | /screen | 372416 | bytes |
| chromium | scanned.pdf | /ebook | 1519829 | bytes |
| chromium | scanned.pdf | /printer | 1522439 | bytes |
| firefox | text.pdf | /screen | 19807 | bytes |
| firefox | text.pdf | /ebook | 19788 | bytes |
| firefox | text.pdf | /printer | 22425 | bytes |
| firefox | scanned.pdf | /screen | 372415 | bytes |
| firefox | scanned.pdf | /ebook | 1519828 | bytes |
| firefox | scanned.pdf | /printer | 1522438 | bytes |
| webkit | text.pdf | /screen | 19807 | bytes |
| webkit | text.pdf | /ebook | 19788 | bytes |
| webkit | text.pdf | /printer | 22418 | bytes |
| webkit | scanned.pdf | /screen | 372416 | bytes |
| webkit | scanned.pdf | /ebook | 1519829 | bytes |
| webkit | scanned.pdf | /printer | 1522438 | bytes |

### Ghostscript: Ghostscript wasm linear memory after the run

| browser | file | setting | number | unit |
|---|---|---|---|---|
| chromium | text.pdf | /screen | 30867456 | bytes |
| chromium | text.pdf | /ebook | 30867456 | bytes |
| chromium | text.pdf | /printer | 30867456 | bytes |
| chromium | scanned.pdf | /screen | 30867456 | bytes |
| chromium | scanned.pdf | /ebook | 30867456 | bytes |
| chromium | scanned.pdf | /printer | 30867456 | bytes |
| firefox | text.pdf | /screen | 30867456 | bytes |
| firefox | text.pdf | /ebook | 30867456 | bytes |
| firefox | text.pdf | /printer | 30867456 | bytes |
| firefox | scanned.pdf | /screen | 30867456 | bytes |
| firefox | scanned.pdf | /ebook | 30867456 | bytes |
| firefox | scanned.pdf | /printer | 30867456 | bytes |
| webkit | text.pdf | /screen | 30867456 | bytes |
| webkit | text.pdf | /ebook | 30867456 | bytes |
| webkit | text.pdf | /printer | 30867456 | bytes |
| webkit | scanned.pdf | /screen | 30867456 | bytes |
| webkit | scanned.pdf | /ebook | 30867456 | bytes |
| webkit | scanned.pdf | /printer | 30867456 | bytes |

### Ghostscript: Chromium JS heap after the run (page heap only; worker memory is not included)

| browser | file | setting | number | unit |
|---|---|---|---|---|
| chromium | text.pdf | /screen | 3024156 | bytes |
| chromium | text.pdf | /ebook | 3024504 | bytes |
| chromium | text.pdf | /printer | 3024764 | bytes |
| chromium | scanned.pdf | /screen | 3024420 | bytes |
| chromium | scanned.pdf | /ebook | 3024620 | bytes |
| chromium | scanned.pdf | /printer | 3024940 | bytes |

### MuPDF probe

| browser | file | setting | number | unit |
|---|---|---|---|---|
| chromium | text.pdf | load, new Worker to ready | 63 | milliseconds |
| chromium | text.pdf | open, count pages, extract text | 23 | milliseconds |
| chromium | text.pdf | pageCount | 3 | pages |
| chromium | text.pdf | textCharacters | 5715 | characters |
| chromium | text.pdf | Chromium JS heap after the run | 2910472 | bytes |
| chromium | scanned.pdf | load, new Worker to ready | 89 | milliseconds |
| chromium | scanned.pdf | open, count pages, extract text | 7 | milliseconds |
| chromium | scanned.pdf | pageCount | 3 | pages |
| chromium | scanned.pdf | textCharacters | 0 | characters |
| chromium | scanned.pdf | Chromium JS heap after the run | 2910440 | bytes |
| firefox | text.pdf | load, new Worker to ready | 70 | milliseconds |
| firefox | text.pdf | open, count pages, extract text | 10 | milliseconds |
| firefox | text.pdf | pageCount | 3 | pages |
| firefox | text.pdf | textCharacters | 5715 | characters |
| firefox | scanned.pdf | load, new Worker to ready | 82 | milliseconds |
| firefox | scanned.pdf | open, count pages, extract text | 1 | milliseconds |
| firefox | scanned.pdf | pageCount | 3 | pages |
| firefox | scanned.pdf | textCharacters | 0 | characters |
| webkit | text.pdf | load, new Worker to ready | 91 | milliseconds |
| webkit | text.pdf | open, count pages, extract text | 21 | milliseconds |
| webkit | text.pdf | pageCount | 3 | pages |
| webkit | text.pdf | textCharacters | 5715 | characters |
| webkit | scanned.pdf | load, new Worker to ready | 118 | milliseconds |
| webkit | scanned.pdf | open, count pages, extract text | 4 | milliseconds |
| webkit | scanned.pdf | pageCount | 3 | pages |
| webkit | scanned.pdf | textCharacters | 0 | characters |

### Readability of the Ghostscript output

The 18 outputs are in `packages/spike/test-results/pdf/<file>-<setting>-<browser>.pdf` (setting without the leading `/`). For each file and setting the three browsers' outputs differ by at most 7 bytes (creation dates and document IDs), so one verdict per row covers all three.

| file | setting | readable |
|---|---|---|
| text.pdf | /screen | pending |
| text.pdf | /ebook | pending |
| text.pdf | /printer | pending |
| scanned.pdf | /screen | pending |
| scanned.pdf | /ebook | pending |
| scanned.pdf | /printer | pending |

## Results

- Both packages load and run inside a module Worker (`new Worker(new URL(...), { type: "module" })`) in Chromium, Firefox and WebKit. No main-thread fallback was needed.
- No change to `packages/spike/vite.config.ts` was needed. Vite emits `gs-*.wasm` and `mupdf-wasm-*.wasm` as assets and inlines each package's JS into its worker chunk. The build warns that `module` and `node:fs` are externalized for browser compatibility; both imports sit behind Node-only checks in the packages and never run in a browser.
- Every Ghostscript run exits 0 and writes a PDF starting with `%PDF`; the saved file length equals the reported `outputBytes`.
- `/screen` shrinks `scanned.pdf` from 1518434 to 372416 bytes (25 %). `/ebook` (1519829) and `/printer` (1522439) make it slightly larger than the input. `text.pdf` goes from 20684 to 19807 (`/screen`), 19788 (`/ebook`) and 22424 (`/printer`) bytes. Milestone 3 has to compare the output with the input and keep the smaller.
- Ghostscript's wasm memory is 30867456 bytes before and after every run on this corpus: the module's initial memory, which these inputs never grow. Memory on large PDFs is not measured here.
- MuPDF reports 3 pages for both files in all three browsers, 5715 text characters for `text.pdf` and 0 for `scanned.pdf`, so the scanned-or-text decision can rest on `textCharacters == 0`.
- First PDF opened costs about 14.1 MB brotli (10483192 Ghostscript wasm + 3622011 MuPDF wasm + 33035 of worker JS) if both packages load. Brotli shrinks the Ghostscript wasm only to 67 % of its size, the MuPDF wasm to 35 %.
- Milestone 3 constraints: the Ghostscript package does not expose its heap, so memory reporting needs the `instantiateWasm` hook as in `ghostscript-worker.ts`; each run uses a fresh worker, and a second `callMain` on the same module instance is not tested.
- `pnpm spike:test --grep pdf` fails with `Unknown option: 'grep'`: `pnpm --filter spike test` hands the flag to pnpm's built-in `test` command. `pnpm spike:test -- --grep pdf` passes the flag through to Playwright.

## Blockers

None.

## Human steps

1. Readability. Run `SPIKE_PORT=4174 pnpm spike:test -- --grep pdf`, then open each of the 18 files in `packages/spike/test-results/pdf/` in Preview. For each file and setting, write `readable` or `not readable` in the "readable" column of the Readability table; scanned pages count as readable when the body text can be read at 100 % zoom. If the three browsers' outputs disagree, write the verdict per browser in that cell.
2. Firefox memory. Firefox is not installed on this Mac: install it with `brew install --cask firefox` (or from https://www.mozilla.org/firefox/). Run `pnpm spike:build`, then `pnpm spike:preview`, open http://localhost:4173/pages/pdf/index.html in Firefox, open Activity Monitor on the Memory tab and sort by Memory. Choose `tests/corpus/scanned.pdf`, Tool "Ghostscript", setting `/ebook`, click Run, and note the highest Memory value of the Firefox content process for localhost while the run lasts. Add a row to the Measurements section: `| firefox | scanned.pdf | /ebook | <value> | MB, Activity Monitor peak |`. Repeat with Tool "MuPDF" and add `| firefox | scanned.pdf | MuPDF probe | <value> | MB, Activity Monitor peak |`.
3. Safari memory. Same as step 2 in Safari, reading the Safari web content process that serves localhost. Add the rows with browser `safari`.
4. Wire size. After the Vercel preview deploy, run `pnpm preview:check <preview-url>` and record the transferred bytes it reports for `gs-*.wasm`, `mupdf-wasm-*.wasm`, `ghostscript-worker-*.js` and `mupdf-worker-*.js`, one row each: `| n/a | <asset name> | wire, Vercel preview | <bytes> | bytes |`.

Both packages run in a module Worker in all three browsers and pass the output and probe checks; whether the 6 file and setting outputs are readable, and the Firefox and Safari memory readings, need a person.

verdict: pending-human
