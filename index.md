# Index

A map of this repository for a reader who has never opened it: what each top-level
directory and important file is for, in one line each. Rewritten by the idleflow retro agent
after every run so it never goes stale. Paths, not prose. Under 80 lines.

## Start here
- `prd.md` — what this project is and is not: must-do list, milestones, two-year shape
- `progress.md` — what has landed and what is next
- `README.md` — one-paragraph description and how to set up a machine to work on this repo
- `CLAUDE.md` — working rules for every Claude Code session here
- `.claude/conventions.md` — code style, readability mode, stack and library decisions, tooling

## Layout
- `docs/` — research and notes, committed
  - `docs/brief/` — the original product brief (PDF and text extract), the design authority for the desktop milestones
  - `docs/market-research.md` — competitors, complaints, the wedge, verdict
  - `docs/research/` — one file per capability or topic with sources; the `status:` line says what was decided
  - `docs/research/spike-2026-11.md` — risk spike go/no-go per risk, measurements and pending human steps
  - `docs/research/spike-measurement.md` — how the spike measured size, load time and memory
  - `docs/sessions/` — end-of-session notes `s_NNNN.md`; `TEMPLATE.md` is the shape
- `crates/engine/` — Rust engine crate; currently a hello-world with native and wasm tests
- `Cargo.toml`, `Cargo.lock`, `rust-toolchain.toml` — Cargo workspace root and the pinned Rust toolchain
- `packages/spike/` — throwaway Vite package with Playwright specs for the risk spike
- `tests/corpus/` — synthetic test files with `manifest.json`; `generator/` regenerates the committed corpus and writes the stress files, which are not committed; `verify.mjs` checks the manifest
- `tools/preview-check.mjs` — checks a deployed URL for `.wasm` content type and CSP headers
- `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` — root scripts and the pnpm workspace
- `vercel.json` — build settings and the CSP header for the static deploy; `.vercelignore` — files the deploy leaves out
- `LICENSE` — AGPL-3.0-or-later
- `.claude/` — conventions, lessons and idleflow run state (`.claude/runs/` is gitignored)

No product code yet: the engine is a hello-world and `packages/spike/` is the risk-spike harness.

## Run it
- Install: `pnpm install`, plus the Rust toolchain from `rust-toolchain.toml` and `wasm-pack`
- Engine: `pnpm build:engine`, then `pnpm test:engine`
- Corpus: `pnpm corpus:verify`; `pnpm corpus:generate --stress` writes the stress files and needs the generator's Python venv on `PATH`
- Spike: `pnpm --filter spike exec playwright install chromium firefox webkit`, then `pnpm spike:test`
- Deploy check: `pnpm preview:check <url>`
- `pnpm test` and `pnpm dev` do not exist yet; they land with milestone 1.
