status: decided: hand-written (showSaveFilePicker with anchor fallback, OPFS temp)

# file-saving-and-naming — library options
researched: 2026-10-22   for: FileSense v1 (collision-safe output naming and downloading in the browser)   status: open

## What we need
Give the user the output under the brief's naming rules (`photo_heic_to_jpg_200kb_comp.jpg`; `_2`, `_3` on collision; never overwrite; original untouched). A browser page cannot see the user's folders unless the user grants access.

## Already in the repo
Nothing covers this.

## Options
### File System Access API: showSaveFilePicker
what: save dialog that returns a writable file handle.
install: none (built in)   source: https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker
maintained: MDN marks it "Limited availability", not Baseline   source: https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker
adoption: 30.22% global usage for the File System Access API; Chrome and Edge 105+, Opera 91+; Firefox, Safari, iOS Safari and Chrome for Android not supported   source: https://caniuse.com/native-filesystem-api (seen 2026-10-22; covers the API as a whole, not this method alone)
fits: options `suggestedName`, `types`, `startIn`; HTTPS and a user gesture required (`SecurityError` otherwise); `AbortError` when the user cancels. The OS dialog asks before overwriting. It is defined on `Window`, so it is not callable from a worker (MDN does not say so explicitly).
pros: user picks the folder; large outputs stream through `createWritable()`
cons: desktop Chromium only; one click per file; cannot pre-check a name without a directory handle
sources:
- https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker — docs — 2026-10-22
- https://caniuse.com/native-filesystem-api — independent — 2026-10-22

### Anchor download (`<a download>` with a blob URL)
what: classic download link.
install: none (built in)
fits: the browser chooses the folder and renames on collision itself, which does not match the `_2` rule and is not observable by the page. No source fetched in this run for this option.
pros: works in Firefox and Safari; no permission prompt
cons: no control of folder or collision names; memory-bound for large blobs
sources: none fetched.

### Origin Private File System (OPFS) for the temporary file
what: sandboxed per-origin file system, invisible to the user.
install: none (built in)   source: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
maintained: "Baseline Widely available" since March 2023; secure contexts only; available in Web Workers   source: same URL
fits: `createSyncAccessHandle()` in workers for fast writes; suits the brief's "write to a temporary file, validate it, then move it into place" and large PDFs that do not fit in memory. Quota-limited; clearing site data deletes it. Per-browser versions not read (the compatibility table did not load).
pros: fast, no prompts, worker-friendly
cons: not user-visible, so the final step still needs a picker or a download
sources:
- https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system — docs — 2026-10-22

## Naming and collisions
- Names within one session (batch, repeated runs) can be made unique in app code against a set of names already produced.
- Names already on the user's disk are checkable only with a directory handle (Chromium); with anchor download the browser renames.
- Not verified in this run: `showDirectoryPicker` support and its probe pattern.

## Hand-written alternative
Name builder (suffix order, extension, `_2`/`_3` against a set of used names): about 40 to 70 lines with tests. Save with picker first and anchor fallback: about 40 to 60 lines. Upkeep is low; the engine owns the naming function so desktop apps reuse it, and only the write step differs per platform.
