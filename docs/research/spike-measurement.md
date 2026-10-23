# spike-measurement — wire size, load time and memory

researched: 2026-10-23   for: Milestone 0: Risk spike   status: decided: hand-written harness

## What we need
Measure for the Ghostscript wasm bundle (c) and the largest files (f): size on disk, size over the wire, load time, peak memory, seconds per page, on Chromium, Firefox and WebKit where the browser allows. Constraints: Playwright is the accepted browser tool (P5); no new dependency without a decision.

## Already in the repo
Nothing yet (no `package.json`). Playwright 1.64.1 is available through npx on the development machine and is the accepted end-to-end tool (P5); Node 24 stdlib provides `node:zlib`.

## Options
### Node stdlib `node:zlib` brotli/gzip plus `curl` against the preview deploy
Wire size is read by `tools/preview-check.mjs` with `node:https` (`node:http` for `http:` URLs), not `curl`, so the same script runs on the Windows machine.
what: compress the built `.wasm` with `brotliCompressSync` / `gzipSync` for an estimate, and read `content-length` and `content-encoding` from the Vercel preview with `curl -sI -H 'accept-encoding: br'` for the real wire size.
install: none (Node stdlib)   source: https://nodejs.org/api/zlib.html
maintained: yes — ships with Node   source: https://nodejs.org/api/zlib.html
adoption: standard library
fits: covers "on disk" and "over the wire"; the wire figure depends on the host's own compression, which only the deploy in (e) shows.
pros: no dependency; real figure from the deployed header
cons: preview figure needs the (e) deploy first; local brotli level may differ from Vercel's
sources:
- https://nodejs.org/api/zlib.html — docs — 2026-10-23 (not fetched in this run; named from knowledge, verify before citing)

### Playwright `page.evaluate` timing plus CDP `Performance.getMetrics` (Chromium only)
what: `performance.now()` around the load and compress calls in any browser; a CDP session for JS heap on Chromium.
install: no install command verified   source: https://playwright.dev/docs/api/class-cdpsession
maintained: yes — 1.64.1 runs via npx on this machine   source: local `npx playwright --version`, 2026-10-22
adoption: accepted stack decision P5
fits: wall-clock load time and seconds per page work in all three engines. Memory through CDP works on Chromium only: "CDP sessions are only supported on Chromium-based browsers."
pros: already accepted; same harness as the later end-to-end tests
cons: no heap figure on Firefox or WebKit; WebAssembly linear memory is not in the JS heap, so read `WebAssembly.Memory.buffer.byteLength` from the module too (inference)
sources:
- https://playwright.dev/docs/api/class-browsercontext — docs — 2026-10-23
- https://playwright.dev/docs/api/class-cdpsession — docs — 2026-10-23

### `performance.measureUserAgentSpecificMemory()`
what: browser API returning total page memory with a breakdown.
install: none (web platform)   source: https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory
maintained: not Baseline; MDN marks it experimental, "limited availability"   source: same
adoption: Chromium only: web.dev says "supported only in Chromium-based browsers, starting in Chrome 89" (page last updated 2020-04-13)   source: https://web.dev/articles/monitor-total-page-memory-usage
fits: needs a secure and cross-origin-isolated document (COOP `same-origin` and COEP headers), so the spike page must send them; the CSP and headers in (e) then differ from the production set.
pros: includes workers and wasm memory in the total on Chromium; no extra tooling
cons: Chromium only; needs COOP/COEP on the test page; values are "not comparable across browsers"
sources:
- https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory — docs — 2026-10-23
- https://web.dev/articles/monitor-total-page-memory-usage — independent (Google engineering blog) — 2026-10-23

## Hand-written alternative
The options above are small glue, not libraries: roughly 40 to 80 lines of harness. Memory on Firefox and WebKit has no scripted figure from any option; the substitute is the OS process monitor read by hand (`ps`/Activity Monitor), recorded as a manual measurement.
