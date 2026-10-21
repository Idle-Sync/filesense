inventory: 22 plugins installed, 1 Idle-Sync skills installed of 2 in the catalogue
install_method_idlesync: `npx skills add Idle-Sync/skills/<skill-name> --global`   source: https://github.com/Idle-Sync/skills (README, "Install")

Catalogue: context-check (installed), codebase-deep-audit (missing).

## Already have
- playwright@claude-plugins-official, Chrome browser tools — browser testing of the static app, keyboard-only walkthroughs
- vercel@claude-plugins-official (vercel:deploy, vercel:env, vercel:vercel-cli) — static frontend deploys on the free tier
- frontend-design@claude-plugins-official — UI design with contrast and layout decisions
- superpowers@claude-plugins-official — planning, debugging and review discipline
- typescript-lsp@claude-plugins-official — symbol navigation and diagnostics in the TypeScript frontend
- context7@claude-plugins-official — current docs for wasm-bindgen, wasm-pack, Vite and browser APIs
- github@claude-plugins-official — pull requests, issues, tagged releases on the public repo
- code-review, code-simplifier, security-guidance (claude-plugins-official), built-in /security-review — review passes before each release
- claude-md-management@claude-plugins-official — keeping CLAUDE.md in step with the code
- serena@claude-plugins-official — symbol navigation once the engine and frontend grow
- context-check (Idle-Sync skill) — real context-window usage

## Proposals
### T1. codebase-deep-audit   kind: idlesync-skill
job: pre-release audit of the whole repo; the project-type-aware categories include accessibility for a frontend, which is a hard requirement; also security and dependency hygiene of the wasm and npm dependencies.
why_this_one: only Idle-Sync skill in the catalogue that covers whole-repo audits; passed over /security-review, which covers security only.
install: `npx skills add Idle-Sync/skills/codebase-deep-audit --global`
cost: one full-repo read per run, so a large token spend; run before each tagged release only; no extra permissions.
con: scores a static audit of source, so it does not replace a screen-reader pass or a keyboard-only run in a real browser.
default: accept

### T2. rust-analyzer-lsp   kind: plugin
job: code intelligence for a Rust engine core (diagnostics, go-to-definition) across the wasm and native targets.
why_this_one: matches the Rust option in the brainstorm; passed over serena, which does not replace a language server for compile diagnostics.
install: `claude plugin install rust-analyzer-lsp@claude-plugins-official`   (the language server itself: `rustup component add rust-analyzer`, from the plugin README)
cost: no per-use tokens beyond diagnostics output; needs the rust-analyzer binary on PATH.
con: useless if the stack advisor picks C++; the engine language is not decided yet.
default: decline until Rust is chosen in Stack decisions

### T3. clangd-lsp   kind: plugin
job: code intelligence for a C++ engine core.
why_this_one: the alternative branch of the engine decision; passed over rust-analyzer-lsp only if C++ is chosen.
install: `claude plugin install clangd-lsp@claude-plugins-official`
cost: needs clangd on PATH and a compile_commands.json from the wasm and native builds.
con: useless if the engine is Rust; accept at most one of T2 and T3.
default: decline until C++ is chosen in Stack decisions

### T4. Accessibility pass with playwright plus codebase-deep-audit   kind: workflow
job: every UI feature is checked keyboard-only in a real browser (tab order, focus visibility, no traps) through the installed playwright plugin or Chrome tools, and the repo is audited with T1 before each tag.
why_this_one: no accessibility-specific plugin exists in claude-plugins-official or the Idle-Sync catalogue; the installed browser tools already drive the keyboard.
install: already installed (playwright, Chrome tools); T1 for the audit.
cost: one browser session per UI feature; setup is a local dev server.
con: automated keyboard checks do not replace screen-reader testing with NVDA, VoiceOver or Orca by hand.
default: accept

### T5. Vercel static deploy via vercel:deploy and vercel:vercel-cli   kind: workflow
job: preview and production deploys of the static build output from `main` and tagged releases.
why_this_one: the vercel plugin is installed; passed over a GitHub Actions deploy job because the free tier needs no extra secrets in CI with Vercel's Git integration.
install: already installed; the Vercel CLI binary is not installed, and its install command is documented by the vercel:vercel-cli skill.
cost: one deploy per release; needs a Vercel login on this machine.
con: the Vercel CLI is a global npm dependency that is not yet on this machine.
default: accept

## Skills that do not exist yet
- Accessibility audit of a running web page — drives a page keyboard-only, checks focus order, landmarks, names and contrast, and writes a pass/fail list — request with: /idleflow:skills-feedback "Accessibility audit skill: keyboard-only walkthrough, focus order, landmarks, accessible names and contrast checks on a running web page, with a pass/fail report"
- WebAssembly build and size check — builds the engine to wasm, runs it in a headless browser, reports bundle size and a smoke test — request with: /idleflow:skills-feedback "Wasm build skill: build the engine to WebAssembly, run a headless-browser smoke test, report .wasm size against a budget"
- Release tagging for an open-source repo — bumps version, writes release notes from commits, tags and creates the GitHub release — request with: /idleflow:skills-feedback "Release skill: bump version, generate release notes from commits, create the tag and the GitHub release"
