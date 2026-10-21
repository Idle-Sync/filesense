status: decided: hand-written CSP connect-src + Playwright no-request test

# zero-upload-guarantee — library options
researched: 2026-10-22   for: FileSense v1 (prove no network request carries file bytes)   status: open

## What we need
A policy the browser enforces, plus an automated test that fails if any request leaves the page carrying file bytes. Static hosting on Vercel; no backend.

## Already in the repo
Nothing covers this.

## Options
### Content-Security-Policy connect-src
what: response header that blocks script-initiated network connections.
install: none (header; Vercel header configuration not verified in this run)
maintained: "Baseline Widely available" since November 2016, CSP Level 3   source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/connect-src
fits: `connect-src 'none'` blocks `fetch()`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `Navigator.sendBeacon()` and `<a ping>`. Other directives govern images (`img-src`), prefetch and form submissions (`form-action`); `default-src` is the fallback; navigation is not covered by the page. A policy would pair `connect-src` with `default-src 'none'` and explicit `script-src`, `style-src`, `img-src`, `worker-src`, `form-action 'none'` (design inference). If the app must `fetch` its own .wasm after load, `connect-src 'self'` is needed, which still allows a same-origin POST, so the test below remains necessary. MDN notes `'self'` does not match WebSocket schemes in all browsers.
pros: enforced by the browser; inspectable in devtools
cons: does not cover navigation, images or forms unless those directives are set; `'self'` permits same-origin POST
sources:
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/connect-src — docs — 2026-10-22

### Playwright request observation test
what: end-to-end test that processes a known file and fails on any request after load that has a body or targets another origin.
install: no install command verified   source: https://playwright.dev/docs/network
maintained: not verified
fits: `page.on('request')` and `page.on('response')` observe traffic; `page.route()` with `route.abort()` blocks selectively; `browserContext.route()` covers popups and opened links. Service workers can hide requests from `route()`; set `serviceWorkers: 'block'`. The network page does not document `request.postDataBuffer`, Web Worker requests or context-level request events (see the API reference for `BrowserContext` and `Request`).
pros: runs in CI against the built static site; asserts on observed bytes, not policy text
cons: worker and service-worker traffic need extra care; other browser engines not researched
sources:
- https://playwright.dev/docs/network — docs — 2026-10-22

### Test design (no library)
Process a file containing a unique marker (random 32 bytes in a JPEG comment or PDF metadata); record every request URL and body during the run; assert no request after load and that the marker never appears in any request. Also assert the served `Content-Security-Policy` header string in a unit test.

## Hand-written alternative
The header is one line in hosting config; the test is about 30 to 60 lines. Upkeep is low, but the test must run on every change for the claim to stay true; the header and the test are the evidence the README can link.
