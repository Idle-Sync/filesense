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
  - `docs/sessions/` — end-of-session notes `s_NNNN.md`; `TEMPLATE.md` is the shape
- `.claude/` — conventions, lessons and idleflow run state (`.claude/runs/` is gitignored)

No application code yet. Milestone 0 in `prd.md` is the first feature run.

## Run it
- Install: `pnpm install` (plus the Rust toolchain and `wasm-pack`, see `CLAUDE.md`)
- Test: `pnpm test`
- Start: `pnpm dev`
- These scripts land with milestone 1; until then they do not run.
