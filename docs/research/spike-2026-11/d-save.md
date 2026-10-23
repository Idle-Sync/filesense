# D: Save behaviour

Question: does saving a result work with a native dialog where the browser has one, and with a predictable download name where it does not?

Page: `packages/spike/pages/save/`. `#run` writes a small text blob named `spike_output.txt` through `showSaveFilePicker` when `"showSaveFilePicker" in window`, otherwise through an anchor with `download`. `#result` reports `{ method, suggestedName, milliseconds }`.

## Automated results

`pnpm spike:test` (spec `packages/spike/tests/save.spec.ts`), run on macOS:

| browser | check | result |
|---|---|---|
| chromium | `"showSaveFilePicker" in window` | true |
| firefox | `"showSaveFilePicker" in window` | false |
| webkit | `"showSaveFilePicker" in window` | false |
| firefox | `#run` twice emits `download` with `suggestedFilename()` | `spike_output.txt` both times |
| webkit | `#run` twice emits `download` with `suggestedFilename()` | `spike_output.txt` both times |

Playwright cannot drive the native picker and saves downloads to unique temp paths, so the picker click on Chromium and on-disk renaming are not automated.

## Human steps

Record each outcome in a Results row (browser, step, observed).

1. Chrome: `pnpm spike:build && pnpm spike:preview`, open `http://localhost:4173/pages/save/index.html`, click Run. Record whether the native save dialog opens and whether its file name field is `spike_output.txt`.
2. Chrome: save into a folder, click Run again, choose the same name in the same folder. Record what the OS dialog does (replace prompt, auto-rename, or silent overwrite).
3. Firefox: same page, click Run twice. Record the file names in the Downloads folder (for example `spike_output.txt` and `spike_output(1).txt`) and whether Firefox asks where to save.
4. Safari: same as step 3. Record the second file's name.

## Results

Pending the human steps above.

verdict: pending-human
