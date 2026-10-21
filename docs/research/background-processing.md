status: decided: hand-written plain Worker + postMessage

# background-processing — library options
researched: 2026-10-22   for: FileSense v1 (heavy work off the main thread, progress, cancellation)   status: open

## What we need
Run decode, resize, encode and PDF work in Web Workers so the interface stays responsive; send progress back; let the user cancel; leave the original file bytes unchanged.

## Already in the repo
Nothing covers this.

## Options
### Comlink
what: RPC wrapper over `postMessage` so worker functions are awaited like local calls.
install: `npm install --save comlink`   source: https://github.com/GoogleChromeLabs/comlink
maintained: unverified (GitHub API returned 403)
adoption: not verified
licence: Apache-2.0   source: https://github.com/GoogleChromeLabs/comlink
fits: `Comlink.proxy(fn)` passes callbacks (a progress callback is an inference; the README does not describe progress); `Comlink.transfer(value, transferables)` moves `ArrayBuffer`s without copying. The README does not mention cancellation or `AbortSignal`.
pros: about 1.1 kB brotli; transfer support
cons: no built-in cancel; hides message flow when debugging
sources:
- https://github.com/GoogleChromeLabs/comlink — docs — 2026-10-22

### Plain Worker + postMessage
what: the platform API.
install: none (built in)
fits: the worker receives `{bytes (transferred), options}` and posts `progress` and `done` messages. Cancel is `worker.terminate()` (hard stop; the wasm instance is lost, so start a fresh worker) or a flag checked between encode steps. `OffscreenCanvas.convertToBlob` works in workers (https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/convertToBlob).
pros: no dependency; cancellation under our control
cons: hand-written message protocol
sources:
- https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/convertToBlob — docs — 2026-10-22

### browser-image-compression (built-in worker, progress, signal)
See target-size-compression.md: `useWebWorker`, `onProgress`, `signal`.

## Hand-written alternative
A typed message protocol with progress and cancel (terminate and respawn): about 80 to 150 lines plus tests; Comlink replaces about 30 of them. Upkeep is low. The brief's stable engine API argues for a small documented message contract that a native UI can mirror.
