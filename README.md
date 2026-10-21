# FileSense

A browser app that compresses, converts and resizes images and PDFs to meet form-upload limits, with every file processed locally in the browser. Nothing is uploaded and no account is needed.

For anyone who has to get a photo, signature or scanned document under a portal's size limit.

See `prd.md`.

## Working on this repo

Development runs through Claude Code with the idleflow plugin. On a fresh machine (Windows or macOS):

1. Clone: `git clone https://github.com/Idle-Sync/filesense.git`
2. Install Claude Code, then the plugin: `claude plugin install idleflow --marketplace Idle-Sync/idleflow` (older Claude Code: `claude plugin marketplace add Idle-Sync/idleflow` then `claude plugin install idleflow@idlesync`). Optional: `claude plugin install rust-analyzer-lsp@claude-plugins-official`.
3. Toolchain: Node 22 and pnpm 10; Rust via rustup with `rustup target add wasm32-unknown-unknown` and `cargo install wasm-pack`; `gh` logged in to GitHub; the Vercel CLI (`npm i -g vercel`) logged in.
4. Open Claude Code in the repo. Every session starts by reading `CLAUDE.md`, `progress.md` and the newest `docs/sessions/` note.
5. Next piece of work: `/idleflow:feature "Milestone 0: Risk spike"` (milestones are in `prd.md`).

Licence: AGPL-3.0-or-later (the `LICENSE` file lands with milestone 0).
