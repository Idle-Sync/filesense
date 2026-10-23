# (a) Toolchain and hello-world engine

## Versions (macOS arm64, Darwin 25.5.0)

| Tool | Version |
|---|---|
| rustup | 1.29.1 |
| rustc | 1.99.0 (b940084d7 2026-09-28) |
| cargo | 1.99.0 |
| wasm-pack | 0.15.0 |
| node | v24.21.0 |
| pnpm | 9.12.3 |
| Playwright | 1.64.1 |
| Chromium (Playwright headless shell) | 156.0.8078.4 |
| Firefox (Playwright) | build 1555 |
| WebKit (Playwright) | 27.2, build 2370 |
| Google Chrome (installed app) | 149.0.7827.201 |

## Measurements

| browser | file | setting | number | unit |
|---|---|---|---|---|
| n/a | `cargo install wasm-pack` wall time | macOS arm64, warm cargo registry cache | 46 | seconds |
| n/a | `crates/engine/pkg/engine_bg.wasm` (hello world, release build) | macOS arm64 | 13720 | bytes |

## Results

- `pnpm build:engine` builds `crates/engine/pkg/engine_bg.wasm`.
- `pnpm test:engine` passes: the native `#[test]` through `cargo test`, the `#[wasm_bindgen_test]` through `wasm-pack test --node`.
- `wasm-pack test --headless --chrome crates/engine` exits 0 but runs no wasm test. Output: "This test suite is only configured to run in node.js, but we're only running browser tests so skipping." Running in a browser needs `wasm_bindgen_test_configure!(run_in_browser);` in the crate, which would stop `--node` from running the test. Node is the engine test target; the browser path is covered by the Playwright spike pages.
- `pnpm spike:build` emits `packages/spike/dist/pages/{jpeg-worker,pdf,save}/index.html`.
- `pnpm spike:test` passes 9 of 9 (3 stub pages on Chromium, Firefox, WebKit).
- `writeMeasurement(name, data)` appends one JSON object per line to `packages/spike/test-results/<name>.json` (JSON Lines: split on newlines, parse each line). Playwright writes its own artifacts to `packages/spike/playwright-artifacts/`, which it empties on every run; `test-results/` is left alone, so measurements from earlier runs stay.
- Playwright's `webServer` readiness check needs a 2xx page, so it polls `/pages/pdf/index.html`: the preview server answers 404 at `/`.

## Human steps

Windows 10 (PowerShell). Add a "Windows 10" column to the Versions table for the version lines, and one Measurements row per wall time or size with browser "n/a", file naming what was measured, setting "Windows 10":

1. `winget install Rustlang.Rustup`, then in a new shell: `rustup default stable` and `rustup target add wasm32-unknown-unknown`.
2. `Measure-Command { cargo install wasm-pack }`: record `TotalSeconds`. Needs the MSVC build tools (`winget install Microsoft.VisualStudio.2022.BuildTools`, workload "Desktop development with C++") if the linker is missing.
3. `rustc --version; cargo --version; wasm-pack --version; node -v; pnpm -v`.
4. `pnpm install; pnpm build:engine; pnpm test:engine`: record pass or the exact error as a Results bullet.
5. `pnpm --filter spike exec playwright install chromium firefox webkit; pnpm spike:test`: record pass or the failures per project as a Results bullet.

verdict: go
