status: decided: hand-written in the Rust engine

# target-size-compression — library options
researched: 2026-10-22   for: FileSense v1 (hit a maximum byte size by searching quality and dimensions)   status: open

## What we need
Given a maximum byte size, find the highest quality (and, only when the preset allows, the smallest downscale) whose encoded output is at or below the target; report met or not met. Runs in a worker and can be cancelled. Brief section 4B: "Maximum, not promise. Use iterative compression; resizing only when allowed." The `_200kb` name suffix is allowed only if the result is at or below the target (brief section 5).

## Already in the repo
Nothing covers this.

## Options
### browser-image-compression
what: client-side compressor with a `maxSizeMB` target, `maxWidthOrHeight`, worker use, progress and abort.
install: `npm install browser-image-compression --save`   source: https://github.com/Donaldcwl/browser-image-compression
maintained: unclear — the README page shows an empty Releases section and the GitHub API returned 403, so last push is unverified   source: https://github.com/Donaldcwl/browser-image-compression
adoption: 5,997,843 npm downloads, 2026-09-19 to 2026-10-18   source: https://api.npmjs.org/downloads/point/last-month/browser-image-compression
licence: MIT   source: https://github.com/Donaldcwl/browser-image-compression
fits: options `maxSizeMB`, `maxIteration` (default 10), `initialQuality` (default 1), `alwaysKeepResolution` ("only reduce quality"), `useWebWorker` (default true), `onProgress` (0 to 100), `signal` (AbortSignal). Handles jpeg, png, webp, bmp; HEIC not mentioned. The README does not describe the search method, the unit is MB not bytes, and no typed "target met" result is documented. It encodes through the canvas, so it cannot use MozJPEG or oxipng.
pros: closest existing match; has abort and progress; MIT
cons: tied to canvas encoders; search behaviour undocumented, so exact outcomes are hard to test; overlaps the codec choice in image-codecs.md
sources:
- https://github.com/Donaldcwl/browser-image-compression — docs — 2026-10-22
- https://api.npmjs.org/downloads/point/last-month/browser-image-compression — independent — 2026-10-22

### No other library found
No package that searches quality over jSquash/MozJPEG encoders to a byte target turned up in this run; not exhaustively verified.

## Hand-written alternative
Bisection on quality (about 7 to 8 encodes cover 1 to 100), then an optional dimension step-down while above the target, returning `{bytes, quality, width, height, targetMet}`. About 80 to 120 lines on top of any encoder, tested with a fake encoder whose size is a known function of quality. Upkeep is low, and the code lives in the engine so it ports to desktop. The suffix rule needs `targetMet`, which a hand-written result type gives directly.
