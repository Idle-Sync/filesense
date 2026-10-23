# FileSense — product requirements

Written by the idleflow planner on the first greenfield run, from the issue and the
human's answers. Humans own this file afterwards: edit it freely. The planner reads it at
the start of every run and treats it as the source of truth for scope.

Source documents: `docs/brief/FileSense_Native_UI_Design_PRD_v2.txt` (the brief; sections
cited as "brief §N"), `docs/market-research.md` (cited as "research, <section>"),
`.claude/conventions.md` (stack decisions P1 to P6, library decisions L1 to L6),
`docs/research/*.md` (library and stack evidence).

## Why this exists

People who must upload a photo, a signature or a PDF to an exam, visa, job or government
portal hit a hard byte cap ("under 50 KB", "between 500 KB and 3 MB") and a format rule.
Today they guess with a quality slider on an online compressor, upload a personal document
to a third party, and learn whether the target was met only when the portal rejects the
file (research, "The space" and "What users complain about"). FileSense makes the file meet
the stated limit on the user's own machine and says plainly whether it did: the result
screen and the output filename report "target met" only when the actual bytes are at or
below the target, the original is never touched, and nothing leaves the browser. v1 is a
static browser app running a Rust engine compiled to WebAssembly; the same engine later
powers native desktop apps with a file-manager right-click entry (brief §2, §3).

## Users

- Form fillers (exam, visa, job and government portals) — turn one image or PDF into a file
  that meets a named size, format and dimension rule, and know before uploading whether it
  does.
- People handling ID, passport and signature scans — do the above without sending the
  document to a server (research, "The gap", wedge b).
- The author — use it daily instead of online compressor sites; this is the success signal.
- Desktop users (later milestones) — the same job from the file manager's right-click menu
  on Windows, macOS and Linux (brief §3, §5).

## Must do (v1)

Every item below ships in the first public release (milestone 4). "Corpus" means the test
file set assembled in milestone 0: photos, screenshots, transparent PNGs, HEIC from an
iPhone, text PDFs, scanned PDFs, already-compressed files (brief §7, compression quality).

- Local-only processing with a browser-enforced zero-upload guarantee — done when: the
  production site serves a `Content-Security-Policy` header with `default-src 'none'`,
  `connect-src 'self'` (or `'none'` if the engine needs no fetch after load) and
  `form-action 'none'`; a Playwright test processes a corpus file carrying a random 32-byte
  marker and asserts that no request after page load has a body, targets another origin,
  or contains the marker (L6; `docs/research/zero-upload-guarantee.md`).
- No account, no login, no server, no telemetry — done when: the deployed site is static
  files only (`vercel.json` has no functions), the Playwright zero-upload test passes, and
  the README states it.
- Rust engine in WebAssembly, running in a Web Worker — done when: the engine crate's test
  suite passes under both `cargo test` and `wasm-pack test`; the CI workflow builds
  `wasm32-unknown-unknown` on every push; a 20 MB JPEG run keeps the page responsive
  (Playwright can focus and activate the Cancel button during the run); cancel stops the
  run within one second and produces no output file (L5).
- Open one image (JPEG, PNG, WebP, HEIC) or one PDF by file picker or drag-and-drop and see
  its current properties — done when: the file summary shows format, dimensions and byte
  size for images, page count and byte size for PDFs, and the values match what Playwright
  reads from the corpus file (brief §4A step 1).
- Three distinct image compression modes: target size, reduce by percentage, quality — done
  when: the mode control is mutually exclusive, changing it changes the visible controls and
  helper text, and one engine unit test per mode checks the produced size or quality
  (brief §4B).
- Target-size search with a verified met-or-not-met result — done when: for every corpus
  image whose target is reachable above the quality floor, the output is at or below the
  target in bytes; for every unreachable case the result says "not met" and lists the
  alternatives (allow resize, lower floor, change format); the engine test uses a fake
  encoder with a known size-per-quality curve, and a Playwright test checks the result text
  against the actual output blob size (L2; `docs/research/target-size-compression.md`).
- Honest filenames — done when: engine unit tests cover the brief's table (`photo_png_to_jpg.jpg`,
  `photo_heic_to_jpg.jpg`, `image_200kb_comp.jpg` only when met, `image_comp.jpg` when not,
  `signature_600x600.jpg` matching actual dimensions, compound order
  `photo_heic_to_jpg_200kb_comp.jpg`, collision `_2`, `_3` against names already produced in
  the session) and the Playwright test asserts the previewed name equals the name handed to
  the save step (brief §5).
- Exact output filename preview before running — done when: the preview updates on every
  control change and never shows a target-size suffix before a run has met the target
  (brief §4A step 4, §4B output preview).
- Output format conversion JPEG, PNG, WebP out — done when: every corpus input converts to
  each output format; a transparent PNG to JPEG shows the transparency-loss warning before
  running; an animated input shows the animation-loss warning (brief §4B output format).
- Resize only when allowed, off by default — done when: the resize control is off unless the
  chosen preset permits it; the result summary's dimensions equal the decoded output's
  dimensions in a Playwright test (brief §4B resize).
- Quality floor with plain labels Balanced, Higher quality, Smaller file — done when: each
  label maps to a documented quality range in the engine; the search never goes below the
  floor; the manual quality matrix (milestone 4) records a before/after review of every
  corpus file per label (brief §4B quality floor).
- Named presets plus Custom — done when: at least five presets ship (photo under 200 KB
  JPEG, photo under 50 KB JPEG, signature under 20 KB JPEG, PDF under 1 MB, PDF under
  200 KB), each states its constraints and carries the line "does not guarantee acceptance by
  any site", and Custom exposes format, maximum size with unit, dimensions and the floor
  (brief §4A step 2).
- PDF compression with Balanced, Smaller file and Preserve readability — done when: the
  three choices map to documented Ghostscript `pdfwrite` settings; text PDFs in the corpus
  keep their text (an automated check extracts text from input and output with Ghostscript's
  `txtwrite` device and asserts the output text is non-empty and contains the input's first
  200 characters); target size and reduce-by-percentage are separate settings; the result
  reports page count and actual size; an unreachable target says so and offers alternatives
  (L3, brief §4C).
- Scanned-PDF readability warning — done when: a PDF whose pages have no extractable text is
  flagged as scanned before running, the Smaller file choice shows the warning about small
  text and signatures, and the scanned corpus files trigger it while the text corpus files do
  not (brief §4C; research, "What users complain about", Ghostscript `/screen`).
- Save without ever touching the source — done when: on Chromium the save step uses
  `showSaveFilePicker` with the previewed name suggested and the OS dialog's own overwrite
  prompt; on Firefox and Safari it uses an anchor download with the previewed name; Playwright
  hashes the input file on disk before and after success, failure and cancellation and the
  hash is unchanged in every case (L4; brief §5 hard acceptance rule).
- Result summary — done when: it shows actual size, dimensions or page count, target met or
  not met in words (not colour alone), and a save action; no generic "Success" toast exists
  (brief §4A step 5, §6).
- Accessibility by construction — done when: `@axe-core/playwright` reports zero serious or
  critical violations on every screen; a Playwright keyboard-only test completes the full
  workflow with Tab, Shift+Tab, Enter, Escape and arrow keys with focus visible at each
  step; progress and the result are announced through a live region; `prefers-reduced-motion`
  disables animation; the core task works at a 320 CSS px wide viewport without horizontal
  scrolling; text contrast is at least 4.5:1; an NVDA walkthrough on the development machine
  is recorded in the release checklist (brief §2, §7 keyboard and accessibility gates).
- Explicit browser support matrix — done when: CI runs the Playwright suite in Chromium,
  Firefox and WebKit on every push, the README lists the matrix in the Constraints wording
  below with exact version numbers measured at the release tag, and a notice appears on
  unsupported browsers (brief §3 "support matrix must be explicit").
- Visible limitations — done when: the app has a Limitations section listing at least:
  browser matrix, folder choice only on Chromium, collision names checked only within the
  session on Firefox and Safari, HEIC input only (no HEIC output), EXIF and ICC metadata not
  preserved, PDF rewritten by Ghostscript so non-image content may change, the tested maximum
  input sizes from milestone 0 (brief §7 "list of known limitations").
- Continuous integration and free hosting — done when: GitHub Actions runs `cargo fmt
  --check`, `cargo clippy -- -D warnings`, `cargo test`, `wasm-pack test`, `cargo deny
  check`, Biome, `tsc --strict`, Vitest and Playwright on every push; the production site is
  reachable at a public URL on Vercel Hobby; `.wasm` files are served with
  `Content-Type: application/wasm` (P4, P5, P6).
- Licence and attribution — done when: `LICENSE` is AGPL-3.0-or-later, `cargo deny check
  licenses` passes, and a third-party notices file lists every shipped wasm package with its
  licence (Ghostscript AGPL, libheif LGPL, jSquash Apache-2.0).

## Nice to have (later)

- Basic batch (several files, sequential, per-file status, originals untouched) — waits
  because every file costs one save dialog on Chromium or one download elsewhere, and the
  single-file flow must be right first; the engine already names collision-safely within a
  session, so the UI work is additive (brief §7 batch gate; target v1.1).
- Folder choice with on-disk collision checking (`showDirectoryPicker`) — waits because it is
  Chromium-only and unverified (`docs/research/file-saving-and-naming.md`, "Naming and
  collisions").
- Side-by-side before/after preview of the output image — waits because the result summary
  already gives size, dimensions and target status; a preview helps judge the quality floor
  but is not needed to meet a portal rule.
- AVIF and JPEG XL output — waits because no portal in the research accepts them.
- Install as a progressive web app with offline use — waits because the zero-upload claim and
  the CSP must settle first; service workers complicate the no-request test.
- Desktop apps with right-click entry (milestones 5 to 7 below) — wait because four UIs in
  three months is not feasible and the browser version needs no signing, installer or
  per-OS QA (brainstorm, "Adjusted after research").

## Will not do

- Cloud or server-side processing — the local-only guarantee is the product.
- Accounts, login, payments, email, analytics, external APIs — nothing to run them and the
  CSP forbids the connections.
- Mobile browsers (iOS Safari, Chrome for Android) in v1 — `showSaveFilePicker` is absent,
  memory for Ghostscript is unverified, and the development machine cannot test them; the
  app shows a notice instead of pretending.
- Keeping EXIF and ICC metadata through conversion — jSquash does not handle them; EXIF
  orientation is applied to the pixels on decode, the rest is dropped and documented as a
  limitation (and as a privacy benefit for form uploads).
- HEIC or animated output — decode-only library for HEIC; animation is dropped with a
  warning.
- Brief phase 2 (PDF merge, split, rotate, extract; image crop, rotate, flip; batch queue;
  history), phase 3 (OCR, searchable PDFs, auto-rotate, blank-page detection) and phase 4
  (Office conversions, watermarks, repair) — out of the three-month window; the engine API
  below keeps them open.
- Universal Linux file-manager support — the brief forbids the claim; GNOME/Nautilus and
  KDE/Dolphin only, others documented as best-effort with Open With and CLI fallback.
- Tauri, Electron or any web view as a desktop shell — vetoed in the brainstorm; desktop
  milestones use native toolkits over the engine's C ABI.
- A hand-written PDF image recompressor on MuPDF.js or pdf-lib — 600 to 1,500 lines with a
  long tail of malformed-PDF bugs (`docs/research/pdf-compression.md`).
- A command runner (just, cargo xtask), a dev container, a plugin system or a configuration
  layer — root `package.json` scripts suffice (P3; stack research "Considered, not
  proposed").

## Constraints

- Stack: Rust engine compiled to WebAssembly with wasm-bindgen and wasm-pack, exposing a C
  ABI for desktop (P1); Vite + TypeScript + Preact static frontend with vite-plugin-wasm
  (P2); pnpm workspace (`packages/web`, wasm package linked `workspace:*`) beside a Cargo
  workspace, root `package.json` scripts as the command runner (P3); Rust gates `cargo fmt
  --check`, `cargo clippy -- -D warnings`, `cargo test`, `wasm-pack test`, `cargo deny check`
  (P4); TypeScript gates Biome, `tsc --strict`, Vitest, Playwright with @axe-core/playwright
  (P5); GitHub Actions CI and Vercel Hobby hosting with a `vercel.json` CSP headers block
  (P6). Libraries: jSquash + libheif-js for image codecs in the web layer (L1); target-size
  search hand-written in the engine (L2); Ghostscript wasm `@okathira/ghostpdl-wasm` for PDF
  (L3); hand-written save and naming (L4); plain Worker + postMessage (L5); hand-written CSP
  and Playwright no-request test (L6).
- Style: readability mode `balanced`; plain names, early returns, no silent fallbacks
  (`.claude/conventions.md`, "Code style").
- Licence: AGPL-3.0-or-later for the whole repository. Ghostscript is AGPL and a copyleft
  app uses it without a commercial licence (`docs/research/pdf-compression.md`); because
  processing is client-side the network clause only covers the served frontend source, which
  is public (brainstorm, "Licence note").
- Hosting: Vercel Hobby, static files only. Hobby is non-commercial personal use and cannot
  connect to a GitHub-organisation repository, so the repository lives under a personal
  account and the site carries no adverts, payments or paid work (P6; stack research
  "vercel-static-deploy").
- Budget: no money. No paid certificates, no paid hosting, no commercial licences.
- Deadline: first public release by 2027-01-28 (late January 2027).
- Development environment: Windows 10 Home 19045, Node 22.13.1, pnpm 10.28.0; no Rust
  toolchain installed yet (needs rustup plus Visual Studio C++ build tools). A Windows 11 VM
  is needed for the Windows desktop milestone; Linux via WSL2 or a VM; an office Mac for
  macOS checks.
- Browser support matrix (v1). Tier 1, full behaviour including the save dialog: Chrome and
  Edge, current stable and the previous stable at the release date, on Windows 10 22H2,
  Windows 11 and macOS. Tier 2, anchor-download save (browser picks the folder and its own
  collision name): Firefox current stable on Windows and Linux (Ubuntu 24.04); Safari current
  stable on macOS, checked by hand on the office Mac before each release, with WebKit in CI.
  Not supported: mobile browsers, any browser without WebAssembly or Web Workers. Exact
  version numbers are written in the README at every release tag; the claim is never "works
  in all browsers".
- Hard product rules from the brief, non-negotiable: never modify, delete or overwrite a
  source; always a separate output; collision-safe `_2`, `_3` naming; exact filename preview;
  target-size suffix only when the output is at or below target; target size, percentage
  and quality are distinct modes; a readability floor with alternatives when a target cannot
  be met above it; processing local; limitations visible to users (brief §9).
- Data: files stay in browser memory and the Origin Private File System for the temporary
  output; nothing is persisted beyond the session except user preferences in `localStorage`
  (last preset), which contain no file data.

## Milestones

0. Risk spike — ends 2026-11-05. Exit: `docs/research/spike-2026-11.md` records a
   go/no-go with measurements for each risk: (a) Rust toolchain and wasm-pack installed and a
   hello-world engine built to wasm32, measured on the development Mac, with the Windows 10
   install left as a pending human check in the spike doc; (b) jSquash JPEG encode runs
   inside a Vite-built Web Worker on Chromium, Firefox and WebKit, with the nested-worker
   issue avoided or worked around and the workaround named; (c) Ghostscript wasm bundle size
   on disk and over the wire, load time, memory and seconds per page for one text PDF and one
   scanned PDF at the three settings, with a visual readability verdict per setting; (d)
   `showSaveFilePicker` behaviour on Chromium and the anchor fallback on Firefox and WebKit,
   including what each browser does on a name collision; (e) a Vercel preview deploy serves
   `.wasm` with `application/wasm` and the CSP headers from `vercel.json`; (f) the largest
   image and PDF processed within 60 seconds on the development Mac, measured now, which become
   the documented limits; the Windows 10 run is a pending human check in the spike doc. The corpus is assembled under `tests/corpus/` with a manifest. A no-go
   on (b) or (c) stops the run and goes to the human.
1. Vertical slice — ends 2026-11-26. One workflow end to end in the browser: open a JPEG,
   choose a target size, see the exact filename preview, run in a worker through the Rust
   engine, see actual size and met or not met, save. Exit: the engine crate passes the same
   tests under `cargo test` and `wasm-pack test`; the CSP headers and the Playwright
   zero-upload test are in place and green; the source-unchanged test passes for success,
   failure and cancel; CI runs every gate; a Vercel preview URL serves the slice.
2. Make Form-Ready for images, complete — ends 2026-12-17. Exit: PNG, WebP and HEIC input;
   JPEG, PNG and WebP output with the transparency and animation warnings; the three modes;
   resize when allowed; the quality floor labels; the five presets plus Custom; the full
   naming table and session collision test; accessibility gates (axe, keyboard-only test,
   live region, reduced motion, 320 px reflow) green; Playwright suite green on Chromium,
   Firefox and WebKit.
3. PDF compression — ends 2027-01-07. Exit: Ghostscript in a worker with the three
   readability choices, target size and percentage; page count and scanned detection with
   the warning; the text-preserved check; unreachable-target messaging; the corpus PDFs pass
   the compression quality gate; documented size limit enforced with a plain message.
4. Public release v1.0 — ends 2027-01-28. Exit: README with the support matrix (exact
   versions), limitations, licence and the zero-upload evidence; Limitations section in the
   app; manual quality matrix and NVDA walkthrough recorded in `docs/release/v1.0.md`;
   third-party notices; tagged release on GitHub; production deploy on Vercel; the author
   has used it for their own uploads for at least one week.
5. Desktop: Windows — after v1.0. Spike first: an `IExplorerCommand` entry with a sparse
   package on a Windows 11 VM appears on the modern context menu, or the fallback is
   documented (research, "Risks"; brief §3 Windows). Then WinUI 3 over the engine's C ABI
   through csbindgen (P1), native codec implementations of the engine's codec interface,
   "Make Form-Ready…" and "Compress…" menu entries, Open With and drag-and-drop. Validation
   per brief §3: keyboard navigation, 100 to 200 percent scaling, long and Unicode paths,
   multi-select, install and uninstall cleanup with a context-menu enable/disable option,
   standard-user permissions, light/dark/high-contrast themes, Narrator or NVDA. Unsigned
   builds show the SmartScreen warning until SignPath Foundation signing is granted.
6. Desktop: Linux — after milestone 5. GTK or Qt (decided then) over the C ABI; Nautilus
   and Dolphin service-menu entries; CLI and Open With fallback; tested on GNOME and KDE
   separately on Ubuntu 24.04 under WSL2 or a VM, Wayland included; Flathub packaging;
   other file managers documented as best-effort (brief §3 Linux).
7. Desktop: macOS — after milestone 6. SwiftUI over UniFFI bindings (P1); Finder Quick
   Action; Open With and drag-and-drop; built in GitHub Actions, tested by hand on the office
   Mac: VoiceOver, Dark Mode, permission prompts, Finder multi-selection, Apple Silicon and
   Intel if both are available; Homebrew cask, unsigned, with documented "Open Anyway" steps;
   notarization waits for budget (brief §3 macOS).
8. Brief phases 2 to 4 — after the desktop apps, each as its own run against this file.

## Two-year shape

The engine API is the invariant. Everything else (the Preact UI, the worker protocol, the
desktop toolkits, the codec packages) is replaceable, and the engine must not know which one
is attached.

- The engine's task model must not be rewritten: an operation type (image compress, image
  convert, PDF compress; later variants for page tools, OCR, Office conversion), a `validate`
  call that returns typed errors, a `run` call that takes bytes plus a progress callback and
  a cancel flag and returns bytes plus a typed result (`target_met`, actual size, dimensions
  or page count, quality used), and an `output_name` call that applies the naming table and
  the session collision set. Rule: the UI never computes a filename, never decides whether a
  target was met, never chooses a quality; every such answer comes from the engine, so
  browser and desktop cannot drift.
- The engine never touches a filesystem or a network: it receives bytes and returns bytes
  and a name. Rule: file reading, the temporary file, the save step and the collision check
  on disk live in the platform adapter (web layer now, Windows/Linux/macOS adapters later),
  so the source-immutability guarantee holds by construction in every host.
- Codecs sit behind one engine interface (image decode, image encode, image resize, PDF
  rewrite, PDF text probe), supplied by the host: prebuilt wasm packages in the browser,
  native libraries on the desktop. Rule: no codec-package type crosses into the engine;
  adding or swapping a codec is a host change only.
- The worker message protocol mirrors the engine API one to one. Rule: each message maps to
  exactly one engine call so that a desktop adapter can mirror it with no translation layer.
- The C ABI (`extern "C"`) is generated from the same engine crate and tested natively on
  every push. Rule: the wasm32 and native builds run the same test suite in CI, so neither
  target can silently diverge.
- Growth that must stay open: brief phase 2 page tools are new operation variants; batch is
  a list of tasks with per-task results and one shared collision set; OCR is a new host
  interface slot (text recognizer) next to the codecs; Office conversion is another codec
  slot. Rule: new capabilities are new variants and new host slots, never new entry points
  into the engine.
- Presets are data, not code: a list of named constraint sets the engine validates. Rule:
  portals change their rules, so presets live in one data file the UI reads and a desktop
  settings screen can later edit.

## Open questions

- HEVC patent exposure of shipping libheif (HEIC decode) in a public, non-commercial app is
  not answered by any README read (`docs/research/image-codecs.md`, libheif-js). Default
  planned: ship HEIC input under LGPL libheif-js and name it in the notices file; if the
  human prefers, HEIC moves to "Will not do" and the HEIC naming example becomes a test
  only — the author.
- Order of the desktop milestones: Windows then Linux then macOS (planned, because Windows
  and Linux are testable on the development machine and macOS needs the office Mac), or
  macOS earlier because its Finder Quick Action is the least risky integration — the author.
- Preset list: the five generic presets above, or portal-named presets (ICAI, MSPC, visa)
  whose rules go stale and need maintenance (research, "Risks") — the author.
- Product name and public URL on Vercel, and confirmation that the GitHub repository sits
  under a personal account (Vercel Hobby cannot connect to an organisation repository) —
  the author.
- The CSP will need `connect-src 'self'` if the wasm or Ghostscript bundle is fetched after
  load, which still permits a same-origin POST; the Playwright no-request test covers it, but
  the human should know the header alone is not the whole proof
  (`docs/research/zero-upload-guarantee.md`) — the author, for the README wording.
