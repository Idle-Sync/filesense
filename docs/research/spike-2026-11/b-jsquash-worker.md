# (b) jSquash JPEG encode in a Vite-built Worker

Page `packages/spike/pages/jpeg-worker/`: `main.ts` creates `new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })` and posts the chosen file's bytes; `worker.ts` decodes with `@jsquash/jpeg/decode`, encodes with `@jsquash/jpeg/encode` at quality 75 and posts the sizes and timings back. Spec `packages/spike/tests/jpeg-worker.spec.ts` runs `photo.jpg` and `already_compressed.jpg` through the production build (`vite build` + `vite preview`) and checks that the output is non-empty, starts with `FF D8`, and has the manifest's width and height.

## Versions (macOS arm64, Darwin 25.5.0)

| Tool | Version |
|---|---|
| @jsquash/jpeg | 1.6.0 |
| Vite | 8.3.5 |
| Playwright | 1.64.1 (browser builds as in `a-toolchain.md`) |

## Measurements

Headless Playwright with 5 test workers running in parallel (timings are indicative, not isolated), production build, one fresh worker per run, so the decode time includes compiling the decoder wasm and the encode time includes compiling the encoder wasm.

| browser | file | setting | number | unit |
|---|---|---|---|---|
| n/a | `dist/assets/mozjpeg_dec-*.wasm` | production build | 166470 | bytes |
| n/a | `dist/assets/mozjpeg_enc-*.wasm` | production build | 251524 | bytes |
| n/a | `dist/assets/worker-*.js` | production build, `worker.format: "es"` | 38121 | bytes |
| chromium | photo.jpg (407254 bytes) | quality 75 | 143627 | output bytes |
| chromium | photo.jpg | quality 75 | 218 | ms total |
| chromium | photo.jpg | quality 75 | 32 | ms decode |
| chromium | photo.jpg | quality 75 | 186 | ms encode |
| chromium | already_compressed.jpg (18356 bytes) | quality 75 | 22867 | output bytes |
| chromium | already_compressed.jpg | quality 75 | 72 | ms total |
| chromium | already_compressed.jpg | quality 75 | 16 | ms decode |
| chromium | already_compressed.jpg | quality 75 | 56 | ms encode |
| firefox | photo.jpg (407254 bytes) | quality 75 | 143627 | output bytes |
| firefox | photo.jpg | quality 75 | 219 | ms total |
| firefox | photo.jpg | quality 75 | 31 | ms decode |
| firefox | photo.jpg | quality 75 | 188 | ms encode |
| firefox | already_compressed.jpg (18356 bytes) | quality 75 | 22867 | output bytes |
| firefox | already_compressed.jpg | quality 75 | 49 | ms total |
| firefox | already_compressed.jpg | quality 75 | 9 | ms decode |
| firefox | already_compressed.jpg | quality 75 | 40 | ms encode |
| webkit | photo.jpg (407254 bytes) | quality 75 | 143627 | output bytes |
| webkit | photo.jpg | quality 75 | 244 | ms total |
| webkit | photo.jpg | quality 75 | 35 | ms decode |
| webkit | photo.jpg | quality 75 | 209 | ms encode |
| webkit | already_compressed.jpg (18356 bytes) | quality 75 | 22867 | output bytes |
| webkit | already_compressed.jpg | quality 75 | 51 | ms total |
| webkit | already_compressed.jpg | quality 75 | 11 | ms decode |
| webkit | already_compressed.jpg | quality 75 | 40 | ms encode |

Raw rows: `packages/spike/test-results/jpeg-worker.json` (JSON Lines, not committed).

## Results

- `SPIKE_PORT=4173 pnpm spike:test -- --grep jpeg-worker` passes 9 of 9 (the two jpeg-worker tests and the jpeg-worker smoke test on Chromium, Firefox and WebKit). Without the `--`, `pnpm spike:test --grep jpeg-worker` exits 1 with `ERROR  Unknown options: 'grep'`: pnpm reads the flag itself instead of passing it to Playwright.
- The output bytes are identical in all three browsers: 143627 for `photo.jpg`, 22867 for `already_compressed.jpg`.
- Re-encoding `already_compressed.jpg` at quality 75 makes it larger (18356 to 22867 bytes, +25 %). The product needs a "keep the original when the output is not smaller" rule; that belongs to the engine's target-size work (L2), not to the codec.
- `@jsquash/jpeg` 1.6.0 contains no `new Worker` call: its encoder and decoder are single-threaded emscripten modules that load their `.wasm` through `new URL("mozjpeg_*.wasm", import.meta.url)`. The worker that runs it is the only worker.

## Nested-worker issue with Vite's default `worker.format`

Vite 8.3.5's default is `iife` (`node_modules/vite/dist/node/chunks/node.js`: `format: config.worker?.format || "iife"`).

With the `worker: { format: "es" }` line removed from `packages/spike/vite.config.ts`, `vite build` succeeds with no warning and `pnpm spike:test -- --grep jpeg-worker` passes 9 of 9 with the same output bytes. The issue **did not reproduce** with @jsquash/jpeg 1.6.0. The IIFE worker bundle replaces `import.meta.url` with `self.location.href` and still runs when created with `{ type: "module" }`.

It cannot reproduce with this package: the issue (jSquash issue #19, Vite issue vitejs/vite#13367, closed 2023-10-19) is a production-build failure for a worker that creates another worker, with the error `Unexpected early exit. This happens when Promises returned by plugins cannot resolve. Unfinished hook action(s) on exit:` and an unfinished `vite:worker-import-meta-url` transform. Codecs with an inner worker are the multi-threaded builds: `@jsquash/oxipng` 2.3.0 (latest) still ships `codec/pkg-parallel/.../workerHelpers.worker.js`, and the jSquash README lists `@jsquash/avif` and `@jsquash/jxl` as well. L1 uses `@jsquash/oxipng`, so the risk moves to that package; this spike does not cover it.

## Workaround

- Setting: `worker: { format: "es" }` in `packages/spike/vite.config.ts`, with a one-line comment. It is the format the issue #19 thread needed for its production build, and it matches the `{ type: "module" }` the page passes to `new Worker`. With @jsquash/jpeg alone, `iife` works too.
- For `@jsquash/oxipng`, `@jsquash/avif` and `@jsquash/jxl`, the jSquash README's fix for the nested-worker build failure is the `single-thread-only` builds (npm dist-tag `single-thread-only`; for oxipng `1.0.1-single-thread-only`, older than latest 2.3.0). Whether oxipng 2.3.0's parallel build compiles under Vite 8.3.5 with `worker.format: "es"` is not measured here.

## Human steps

Windows 10 (PowerShell), after the steps in `a-toolchain.md`. Add one Measurements row per value, browser as named by Playwright, setting "quality 75, Windows 10":

1. `$env:SPIKE_PORT=4173; pnpm spike:test -- --grep jpeg-worker`: record pass, or the failing project and the error text, as a Results bullet.
2. Open `packages/spike/test-results/jpeg-worker.json`; for each line add four rows (`outputBytes` as "output bytes", `milliseconds` as "ms total", `decodeMilliseconds` as "ms decode", `encodeMilliseconds` as "ms encode"). The output bytes should equal the macOS rows; a difference goes into Results.

verdict: go
