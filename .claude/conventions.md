# Conventions for this repo

Read by the planner, every implementer and the conformance reviewer at the start of every
idleflow run. Commit this file. Edit it by hand whenever a decision changes, or run
`/idleflow:style` to re-answer the readability question.

## Code style (always on, every mode)

- **Simplest thing that is correct and robust.** No abstraction, option, or layer that the
  acceptance criteria do not need today. Three similar lines beat a helper used once.
- **Plain names, no jargon.** A reader who knows the language but not the codebase should
  understand a function from its name and its first five lines. `customers_without_orders`
  not `cust_filt`; `retry_after_seconds` not `rsec`. No abbreviations the codebase does not
  already use everywhere.
- **One idea per function.** If a docstring needs "and", split it.
- **Early return over nesting.** Handle the error or edge case first, then the main path flat.
- **Comments say why, not what.** Code that needs a "what" comment gets rewritten instead.
- **Boring over clever.** Standard library before a dependency; a loop before metaprogramming;
  a plain dict before a class, until there is behaviour to attach.
- **Handle failures where they happen.** No bare `except`/`catch`, no swallowed errors, no
  silent fallbacks. If something can be missing, say what happens then.
- **Match the repo.** When this file and the surrounding code disagree, the surrounding code
  wins inside an existing module; this file wins for new modules.

## Writing docs, commits and comments (always on)

- **No meta commentary.** Nothing in this repo narrates how it came to be: no "the user
  asked", "as requested", "per our discussion", "I'll now", "after review". State the fact,
  the decision, or the reason. Applies to every `.md`, commit message, pull request, issue,
  session note, research file and code comment. The conformance reviewer rejects on it.
- **Docs describe the code as it is.** A change that makes a sentence wrong fixes the
  sentence in the same commit. Plans live in `prd.md` and `progress.md` "Next", nowhere else.
- **Attribution and releases** follow the `co_author_claude:` and `releases:` lines in `CLAUDE.md`.

## Readability mode

mode: balanced

Set to one of these by `/idleflow:feature` on the first run (it asks), or by `/idleflow:style`.

| mode | what the implementer does | best for |
|---|---|---|
| `explicit` | Loops, named intermediate values, one step per line. No comprehensions, chained calls, ternaries or one-liners that do two things. | Teams with mixed experience, teaching codebases, anything a non-programmer reviews. |
| `idiomatic` | The language's native idioms wherever they fit: comprehensions, built-ins, chaining, pattern matching. | Experienced teams who read the language fluently and want less code. |
| `balanced` | An idiom only when it reads as one plain sentence (single clause, no nesting, fits on one line); otherwise explicit. | Most projects. The default when nobody is there to answer. |

Whatever the mode: a construct that takes two readings to understand is wrong in every mode.

## Project docs

docs: yes

`yes` means the repo keeps `prd.md`, `progress.md`, `index.md` and a `CLAUDE.md` block at its
root plus a `docs/` folder (`docs/research/` for library and stack research, `docs/sessions/`
for end-of-session notes), the doc-keeper grounds every doc against the code at the start of
each run, and the retro updates them after every run. Set to `yes` automatically for greenfield
runs or when those files already exist. `no` leaves them out.

docs_in_git: yes

`yes` commits `docs/` so everyone shares the research and session notes. `no` adds `docs/` to
`.gitignore` so they stay local to this machine. Asked once, the first time docs are turned on.

## Ignore rules

ignore_in: gitignore

Where idleflow writes its own ignore rules (`.claude/runs/`, a local `docs/`). `exclude` uses
`.git/info/exclude`: local to this clone, so nothing about idleflow appears in a committed file.
`gitignore` uses `.gitignore`: shared with every clone and visible to everyone who reads the repo.
A stack's own entries (`node_modules/`, `.venv/`, `dist/`, `.env`) always go in `.gitignore`,
because every clone needs them.

## Pushback

Agents question a decision when the evidence says it is wrong: the conflict in one sentence,
the evidence with its path or URL, a better option with its cost. Once, then the human's call
stands and the reason is recorded. No pushback without evidence; no agreement without checking.

## Tooling

Skills, plugins and workflows accepted from the tooling advisor, one line each, with the job
they cover. Full detail in `docs/research/tooling.md`. Missing skills are requested with
`/idleflow:skills-feedback`, idleflow problems reported with `/idleflow:plugin-feedback`.

<!-- tooling start -->
- rust-analyzer-lsp (plugin): compile diagnostics and symbol navigation for the Rust engine across wasm and native targets
- Accessibility pass (workflow): every UI feature walked keyboard-only in a real browser through the playwright plugin or Chrome tools before it is called done; screen-reader checks by hand
- Vercel static deploy (workflow): preview and production deploys of the static build through the vercel plugin and the Vercel CLI
- declined: codebase-deep-audit (Idle-Sync skill); clangd-lsp (plugin, engine is Rust)

## Stack decisions

Accepted proposals from the stack advisor and libraries chosen from the library scout's
research, one line each. The planner treats these as constraints; implementers may not
introduce a tool or a hand-written replacement that contradicts them. Declined items are
listed too so they are not proposed again.

<!-- stack decisions start -->
- [P1] Engine language: Rust compiled to WebAssembly with wasm-bindgen and wasm-pack; the engine owns the task model, validation, output naming, target-size search, progress, cancellation and results, and exposes a C ABI for the later desktop apps (csbindgen for C#, UniFFI for Swift). Codecs sit behind one engine interface; in v1 the browser supplies them from prebuilt wasm packages.  (why: one engine tested natively and in wasm keeps the two-year engine-API invariant; evidence: https://crates.io/api/v1/crates/wasm-bindgen)
- [P2] Frontend: Vite + TypeScript + Preact, static output, vite-plugin-wasm for the engine package.  (why: static output suits Vercel with no server and keeps the UI small for the accessibility work; evidence: https://github.com/vitejs/vite)
- [P3] Layout and command runner: pnpm workspace (`packages/web`, wasm package linked `workspace:*`) beside a Cargo workspace; root package.json scripts are the command runner; no just, no cargo xtask.  (why: nothing to install, works on Windows, CI and Vercel alike; evidence: https://pnpm.io/workspaces)
- [P4] Rust quality tooling: `cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test`, `wasm-pack test` with wasm-bindgen-test, `cargo deny check` for the GPL/AGPL dependency policy; hooks via pre-commit.  (why: the same engine tests run natively and in wasm; evidence: https://github.com/EmbarkStudios/cargo-deny)
- [P5] TypeScript quality tooling: Biome (format + lint), `tsc --strict`, Vitest, Playwright with @axe-core/playwright for end-to-end, accessibility and the zero-upload network check; pre-commit hooks shared with Rust.  (why: covers the brief's accessibility gate and the no-upload proof in CI; evidence: https://biomejs.dev/guides/getting-started/)
- [P6] CI and hosting: GitHub Actions on every change (wasm32 build, Rust and TypeScript gates, Playwright); Vercel Hobby static hosting with a `vercel.json` headers block carrying a strict CSP whose connect-src is limited to the site. Vercel Hobby is non-commercial only and cannot connect to a GitHub-organisation repo; the repo is github.com/Idle-Sync/filesense (public), so deploys run through the Vercel CLI with a token from a CI job or a developer machine, not the Git integration.  (why: free within the stated budget and the wasm build check runs on every change; evidence: https://vercel.com/docs/limits)
- [L1] image codecs: jSquash (@jsquash/jpeg, png, webp, oxipng, resize) + libheif-js for HEIC input, in the web layer behind the engine's codec interface (tunable MozJPEG/oxipng output, identical bytes in every browser; research: docs/research/image-codecs.md)
- [L2] target-size search: hand-written in the Rust engine (bisection on quality with optional dimension step-down and a typed target-met result; stays in the portable engine; research: docs/research/target-size-compression.md)
- [L3] PDF compression: Ghostscript wasm via @okathira/ghostpdl-wasm, AGPL (the only browser option that downsamples embedded images while keeping text and vectors; research: docs/research/pdf-compression.md)
- [L4] file saving and naming: hand-written (showSaveFilePicker on Chromium with anchor-download fallback, OPFS for the temporary file, `_2`/`_3` naming checked against session names; no library covers it; research: docs/research/file-saving-and-naming.md)
- [L5] background processing: hand-written plain Worker + postMessage protocol with cancellation via an engine flag or terminate() (no dependency; research: docs/research/background-processing.md)
- [L6] zero-upload guarantee: hand-written CSP connect-src header in vercel.json plus a Playwright no-request assertion on the built site (no library covers it; research: docs/research/zero-upload-guarantee.md)
- [L7] PDF page count and scanned vs text detection: MuPDF.js (mupdf, AGPL, 14.3 MB; page count and text extraction from one library; loaded only when a PDF is opened; its size and load time are measured in the risk spike; research: docs/research/pdf-compression.md)
- [L8] spike measurement harness: hand-written (Node zlib + curl on the preview for wire size, Playwright timing for load, CDP heap on Chromium, OS monitor reading by hand on Firefox and WebKit; no new dependency; research: docs/research/spike-measurement.md)
- [L9] synthetic corpus PDFs: fpdf2 in a Python venv used only by the corpus generator, never shipped (LGPL, maintained; research: docs/research/corpus-pdf-generation.md)
