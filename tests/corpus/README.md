# Test corpus

Synthetic files for compression tests, described by `manifest.json` (path, kind, generator, bytes, sha256, size, committed).

## Verify

`node tests/corpus/verify.mjs` recomputes bytes and sha256 of every `committed: true` entry and exits 1 on a mismatch or a missing file.

## Regenerate

```
cd tests/corpus/generator
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python generate.py            # committed files and manifest
.venv/bin/python generate.py --stress   # also writes stress/, never committed
```

Output is deterministic (fixed random seed, fixed PDF creation date), so regenerating leaves `manifest.json` unchanged. `photo.heic` is made with macOS `sips`, so regeneration needs a Mac. `text.pdf` embeds `/System/Library/Fonts/Supplemental/Arial.ttf`.

## Size ceiling

Each committed file is under 2 MB and the committed total is under 8 MB. No Git LFS. Larger files belong in `stress/`, which git ignores.
