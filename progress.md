# Progress

Newest first. One entry per idleflow run, written by the retro agent after the merge.
Humans may add entries by hand for work done outside idleflow. Keep each entry short: what
landed, what it unblocks, what is still open. This file is the answer to "where are we?".

<!-- progress start -->

## 2026-10-22 — project initialised (run 20261022-012608-init)

- Brainstorm done: v1 is a static browser app, every file processed locally through a Rust-to-WebAssembly engine, no upload, no account, no backend; native desktop apps on the same engine follow. First public release targeted for 2027-01-28.
- Market research verdict: crowded. Wedge: a verified "target met or not met" result with honest filenames, local-only processing, a readability warning for scanned PDFs. Top complaints about competitors: free-tier caps, uploading personal documents, no exact target-size guarantee.
- 6 stack decisions (Rust + wasm-pack engine; Vite + TypeScript + Preact; pnpm workspace; Rust and TypeScript quality tooling; GitHub Actions + Vercel Hobby static with CSP headers).
- 6 library decisions (jSquash + libheif-js; Ghostscript wasm for PDF; target-size search, file saving, worker protocol and zero-upload proof hand-written).
- 3 tooling items (rust-analyzer-lsp plugin; accessibility pass workflow; Vercel static deploy workflow).
- PRD approved: 19 must-do items, 9 milestones.
- Repo: github.com/Idle-Sync/filesense, public, AGPL-3.0-or-later.
- Next: milestone 0 from `prd.md`, the risk spike (`/idleflow:feature "Milestone 0: Risk spike"`).

