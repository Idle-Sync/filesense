# corpus-pdf-generation — synthetic text and scanned PDFs for tests/corpus

researched: 2026-10-23   for: Milestone 0: Risk spike   status: decided: fpdf2

## What we need
A text PDF and a scanned (image-only) PDF with no personal or copyrighted content, committed to a public AGPL repo, produced reproducibly. No Ghostscript, qpdf or ImageMagick is installed on the development machine; `sips` and Python 3.14 are.

## Already in the repo
Nothing. `pdf-lib` is listed in docs/research/pdf-compression.md (MIT, last push 2024-07-17, unmaintained); it can embed JPEG/PNG and draw text, so it could build both files from Node without a Python dependency.

## Options
### fpdf2 (Python)
what: PDF generation library; text, images, pages.
install: no install command verified   source: https://pypi.org/project/fpdf2/
maintained: yes — last push 2026-10-22; 46 open issues; release 2.8.9 uploaded 2026-09-29   source: https://api.github.com/repos/py-pdf/fpdf2 ; https://pypi.org/pypi/fpdf2/json
adoption: 16,633,261 PyPI downloads last month   source: https://pypistats.org/api/packages/fpdf2/recent (2026-10-23)
licence: LGPL-3.0 (GitHub); the PyPI licence field is empty
fits: text PDF with embedded fonts, scanned PDF by placing a page-sized JPEG per page. Not installed locally.
pros: small; maintained
cons: needs `pip install`; LGPL, used only as a build-time tool so it is not shipped
sources:
- https://api.github.com/repos/py-pdf/fpdf2 — repo — 2026-10-23
- https://pypi.org/pypi/fpdf2/json — registry — 2026-10-23
- https://pypistats.org/api/packages/fpdf2/recent — independent — 2026-10-23

### ReportLab (Python)
what: PDF toolkit.
install: no install command verified   source: https://pypi.org/project/reportlab/
maintained: yes — release 5.1.0 uploaded 2026-10-22   source: https://pypi.org/pypi/reportlab/json
adoption: 66,000,604 PyPI downloads last month   source: https://pypistats.org/api/packages/reportlab/recent (2026-10-23)
licence: BSD (PyPI)
fits: same jobs as fpdf2. Not installed locally.
pros: BSD; very high adoption
cons: larger API; needs `pip install`
sources:
- https://pypi.org/pypi/reportlab/json — registry — 2026-10-23
- https://pypistats.org/api/packages/reportlab/recent — independent — 2026-10-23

### pdf-lib (Node)
see docs/research/pdf-compression.md (unmaintained since 2024-07-17; MIT; 68,724,203 downloads last month).

## Hand-written alternative
A minimal PDF is a text file with an object table; a one-page text PDF is about 30 lines, and a scanned PDF is about 40 more to embed a JPEG as an image XObject with correct xref offsets. Upkeep is nil because the output is committed and the generator runs rarely.
