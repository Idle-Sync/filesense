# Progress

Newest first. One entry per idleflow run, written by the retro agent after the merge.
Humans may add entries by hand for work done outside idleflow. Keep each entry short: what
landed, what it unblocks, what is still open. This file is the answer to "where are we?".

<!-- progress start -->

## 2026-10-23 — risk spike, milestone 0 (run 20261023-135238-milestone-0-risk-spike)

- Risk spike landed: Cargo workspace with `crates/engine/` (hello-world engine, 13720-byte wasm, native and wasm tests), throwaway `packages/spike/` with Playwright specs on Chromium, Firefox and WebKit, synthetic corpus under `tests/corpus/`, `vercel.json` with `tools/preview-check.mjs`, go/no-go in `docs/research/spike-2026-11.md`.
- Go on the toolchain (a), the jSquash JPEG worker (b) and the size limits (f): a 48 MP JPEG in at most 7.89 s and a 100-page 50 MB scan in at most 1.43 s, in every browser, on this Mac. No no-go.
- Pending human: readability of six Ghostscript outputs and Firefox/Safari memory (c); the save dialog and collision names (d); the Vercel preview deploy and header check (e); Windows 10 runs for (a), (b) and (f). Steps are in the spike doc.
- Unblocks milestone 1, the vertical slice: the `es` worker format, the anchor-download save path and the CSP headers in `vercel.json` are tested inputs for it.
- Next: milestone 1, vertical slice (ends 2026-11-26). Open defect: the limits spec fails on a fresh checkout until `pnpm corpus:generate --stress` runs.

## 2026-10-22 — project initialised (run 20261022-012608-init)

- Brainstorm done: v1 is a static browser app, every file processed locally through a Rust-to-WebAssembly engine, no upload, no account, no backend; native desktop apps on the same engine follow. First public release targeted for 2027-01-28.
- Market research verdict: crowded. Wedge: a verified "target met or not met" result with honest filenames, local-only processing, a readability warning for scanned PDFs. Top complaints about competitors: free-tier caps, uploading personal documents, no exact target-size guarantee.
- 6 stack decisions (Rust + wasm-pack engine; Vite + TypeScript + Preact; pnpm workspace; Rust and TypeScript quality tooling; GitHub Actions + Vercel Hobby static with CSP headers).
- 6 library decisions (jSquash + libheif-js; Ghostscript wasm for PDF; target-size search, file saving, worker protocol and zero-upload proof hand-written).
- 3 tooling items (rust-analyzer-lsp plugin; accessibility pass workflow; Vercel static deploy workflow).
- PRD approved: 19 must-do items, 9 milestones.
- Repo: github.com/Idle-Sync/filesense, public, AGPL-3.0-or-later.

