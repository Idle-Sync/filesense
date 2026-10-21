# Market research — native open-source right-click tool that makes images and PDFs meet form-upload size limits (Windows, macOS, Linux)
researched: 2026-10-22   verdict: crowded   sources: 58

## The space
- Category: online image/PDF compressors plus desktop "optimizers". The traffic sits with the online sites: ilovepdf.com is ranked #113 globally (up from #127 three months earlier), #66 in India, with 280.2M visits in the last three months and visits up 7.57% month on month (Similarweb estimates, Sept 2026). https://www.similarweb.com/website/ilovepdf.com/
- Broader PDF editor software is estimated at $3.1B to $4.8B in 2025 with a roughly 10-11% CAGR in most reports (one outlier forecasts 18%). Definitions vary, none isolates compression, and the reports are sold by market-research firms. https://marketintelo.com/report/pdf-editor-software-market ; https://www.gii.co.jp/report/ires1714673-pdf-editor-software-market-by-operation.html ; https://www.pdfreaderpro.com/blog/pdf-market-growth-statistics
- The form-upload job has its own sub-niche. Portals set hard caps and the rules are usually written as "reduce it in MS Paint": ICAI refuses files over 50 KB and its guide suggests MS Paint resize by percentage; MSPC specifies signature 10-20 KB and thumb impression 20-50 KB; MSTC suggests crop and resize in MS Paint or Picture Manager. https://advit.icaiexam.icai.org/index.php?p=imgsize ; https://online.mspcindia.org/Downloads/MSPC_Guidefor%20Photoandsign.pdf ; https://mstcindia.co.in/MSTC_Careers/ImageDocUploadingSteps.aspx
- Visa portals add format rules on top of size: New Zealand Immigration asks for photos between 500 KB and 3 MB and rejects photos on brightness and framing; a Vietnam e-visa guide lists wrong file types (PNG, PDF, HEIC) as a common rejection (commercial page). https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/tools-and-information/acceptable-photos/uploading-visa-photo-error-messages ; https://www.zurichkotak.com/knowledge-center/travel-insurance/vietnam-visa-photo-size
- A wave of small "compress to exact KB" tools is appearing, which shows the need but also how little barrier there is: PhotoFit (browser-based, free, no signup, one upvote on Product Hunt) says "every compressor just hands you a quality slider to guess with". https://www.producthunt.com/p/photofit/photofit
- No search-trend data (Google Trends) could be retrieved. Direction is read from the Similarweb movement and report CAGRs only.

## Competitors and alternatives
| name | what | for whom | price / licence | since | size signal | last update | source |
|---|---|---|---|---|---|---|---|
| iLovePDF | Online PDF suite incl. compress; mobile app | General public | Free; Premium 242 INR/mo billed annually or 500 INR/mo monthly (India page); App Store Premium $5.49/mo or $44.99. Free caps: Compress PDF 200 MB, most tools 15-100 MB | not found | Capterra ~4.7/5 from ~1,750 reviews; Similarweb rank #113 | live service | https://www.ilovepdf.com/pricing ; https://apple.co/3IIVbpM ; https://capterra.ie/software/173963/ilovepdf ; https://www.similarweb.com/website/ilovepdf.com/ |
| Smallpdf | Online PDF suite | General public, SMB | Free with daily task limits; Pro about $9/mo annual, $15/mo monthly (third-party listings; official page not retrievable); 7-day trial | not found | Trustpilot 4.8/5 from 5,315 reviews | live service (reviews Oct 2026) | https://ca.trustpilot.com/review/smallpdf.com ; https://capterra.com/p/172606/Smallpdf/pricing/ ; https://toolradar.com/tools/smallpdf/pricing |
| TinyPNG / Tinify | Online image compressor (PNG, JPG, WebP) plus API | Web developers, designers | Web: free, about 20 images and 5 MB each per batch (third-party; official page does not list it); paid Web Pro 75 MB / Ultra 150 MB per image (third-party). API: 500 free/mo, then $0.009 per compression | not found | not found | live service | https://tinypng.com/pricing/api ; https://freetier.co/directory/products/tinypng |
| Compress2Go | Online file/video/PDF compressor | General public | Free; Premium from about $6.42/mo (third-party) | not found | Trustpilot 4.5/5 from 70 reviews; G2 about 4.8/5 from 5-6 reviews | live service (reviews Jun-Aug 2025) | https://nl-be.trustpilot.com/review/compress2go.com?page=2 ; https://zoftwarehub.com/ar-ae/products/compress2go/pricing ; https://www.g2.com/products/compress2go/reviews_and_filters |
| Adobe Acrobat online compress | Online PDF compress | General public | Free: files up to 500 MB, one compress per 24 h when signed in (newer FAQ; older FAQ says 1 per 30 days) | not applicable | not found | live FAQ | https://helpx.adobe.com/document-cloud/faq/free-online-pdf.html |
| Caesium Image Compressor | Desktop image compressor; max-output-size mode since 2.5.0; no PDF, no context menu found | Individuals, photographers | GPL-3.0, free | not found | 6.4k GitHub stars, 371 forks, 529 commits | v2.8.5, 17 May (year not shown on page; releases about every 2 months) | https://github.com/Lymphatus/caesium-image-compressor ; https://github.com/Lymphatus/caesium-image-compressor/releases ; https://mac.softpedia.com/progChangelog/Caesium-Changelog-143210.html ; https://github.com/menzil/libcaesium |
| ImageOptim | macOS drag-and-drop optimizer, lossless by default, Finder Services entry | Mac users, developers | GPL v2+, free | not found | not found | v1.9.3 (requires macOS 11+) | https://imageoptim.com/ |
| FileOptimizer | Windows lossless optimizer for many formats incl. PDF | Windows power users | AGPL (per AUR package; unconfirmed by author); SourceForge-hosted | not found | not found | 17.10 (AUR, updated 2026-06-01) | https://aur.archlinux.org/packages/fileoptimizer-bin ; https://wingetgui.com/apps/Nikkho-FileOptimizer |
| File Converter (Tichau) | Windows right-click converter/compressor | Windows users | open source | 2014 | not found | reportedly not integrated with the Windows 11 modern menu; maintenance unconfirmed | https://tichau.itch.io/file-converter ; https://getquicker.net/QA/Question/11883 |
| PowerToys Image Resizer | Windows right-click image resize to preset/custom dimensions | Windows users | free, Microsoft | not found | not found | maintained (Microsoft) | https://microsoft.github.io/PowerToys/modules/imageresizer/ ; https://www.zdnet.com.au/article/how-to-shrink-your-images-with-the-powertoys-image-resizer/ |
| IrfanView | Windows viewer/converter with a "set file size" JPEG option and batch plugin | Windows users | freeware | not found | not found | not found (forum evidence from 2011 and later) | https://www.pentaxforums.com/forums/32-digital-processing-software-printing/225610-best-resize-250kb.html ; https://ubuntuforums.org/archive/index.php/t-1720675.html |
| macOS Preview "Reduce File Size" | Built-in PDF compression filter | Mac users | bundled | not applicable | bundled | Apple warns output may be lower quality | https://support.apple.com/guide/preview/prvw1509 |
| Ghostscript GUIs (GhostPDF, SlimPDF, GTK front ends) | Local PDF compression over Ghostscript | Privacy-minded users | GhostPDF: macOS only, SwiftUI, AGPLv3 (AlternativeTo page also says "Proprietary and Freemium"); SlimPDF: local Flask app | not found | GhostPDF: 2 AlternativeTo likes | GhostPDF AlternativeTo page updated 2026-08-20 | https://alternativeto.net/software/ghostpdf/about ; https://dev.to/rajinh24/slimpdf-a-lightweight-and-privacy-friendly-pdf-compressor-hnn |
| PDFsam | Desktop PDF merge/split/rotate/extract; Basic is AGPL v3; compression is in Visual / Enhanced (sources conflict on what Basic includes) | Desktop PDF users | Basic free; Enhanced yearly subscription only, Windows only, prices not on the FAQ (third-party lists $59-79/yr) | not found | not found | not found | https://pdfsam.org/faq/ ; https://updf.com/knowledge/pdfsam-review/ |
| Browser-local tools (Squoosh, PhotoFit, Bento PDF) | In-browser compression, files stay on device | Developers, form fillers | Squoosh Apache-2.0; PhotoFit free | Squoosh 2018 | Squoosh about 25.4k stars (mid-June 2026) | Squoosh last push 2026-06-10; its CLI was removed by Google | https://www.star-history.com/googlechromelabs/squoosh ; https://gittrend.io/repo/GoogleChromeLabs/squoosh ; https://www.bentopdf.com/compress-pdf-to-200kb |
| Do nothing / MS Paint and manual retries | Resize by percentage, re-save, check size, repeat | Anyone facing a portal limit | free | n/a | the method portals themselves recommend (ICAI, MSTC) | n/a | https://advit.icaiexam.icai.org/index.php?p=imgsize ; https://mstcindia.co.in/MSTC_Careers/ImageDocUploadingSteps.aspx |

## What users complain about
- "unexpected charges or billing problems" after trial sign-up; one 1-star: "Repeated and duplicate subscription charges taken once again this month" — Smallpdf — https://ca.trustpilot.com/review/smallpdf.com (Oct 2026)
- "the free version restricts me to one PDF merge, for at least 10 hours" — Smallpdf — https://ca.trustpilot.com/review/smallpdf.com (Sept 2026)
- Free version limits the number of tasks per day; "only process a couple of files before hitting the daily limit" — Smallpdf — https://capterra.com/p/172606/Smallpdf/reviews/ (via search summary; one cited review from 2023)
- "the limitations in the free version, such as fewer tasks and ads, can be frustrating" — iLovePDF — https://capterra.ie/software/173963/ilovepdf (undated)
- A subscription pop-up that kept reappearing after being closed — iLovePDF App Store reviewer — https://apple.co/3IIVbpM (undated)
- "what usage do they do with our data?" — iLovePDF — https://capterra.co.uk/reviews/173963/ilovepdf (undated); files still leave the device for server-side processing — https://www.swifdoo.com/blog/is-ilovepdf-safe (vendor of a competing product, 2026)
- "No instructions that 'heavy' files require the pro version." — Compress2Go — https://nl-be.trustpilot.com/review/compress2go.com?page=2 (26 Jun 2025)
- "They made the video 19 mb." (uploaded 11 MB; output larger than input) — Compress2Go — https://nl-be.trustpilot.com/review/compress2go.com?page=2 (8 Aug 2025)
- Support replies slow or absent; multiple confusing download buttons — Compress2Go — https://zoftwarehub.com/products/compress2go/reviews (undated, via search summary)
- Stock /screen preset on scanned PDFs gives "unreadable quality at 1.6MB"; /ebook is readable but larger — Ghostscript users — https://scruss.com/blog/tag/ghostscript/ ; https://bugs.ghostscript.com/show_bug.cgi?id=707831 (dates not retrieved)
- Preview's built-in filter "reduces image quality quite aggressively"; Apple warns the PDF "may be of lower quality than the original" — macOS Preview — https://smallpdf.com/blog/reduce-pdf-file-size-mac-preview (competitor blog) ; https://support.apple.com/guide/preview/prvw1509
- The result lands "around" the target, "plus or minus something like 10% to 20%" — IrfanView batch plugin — https://ubuntuforums.org/archive/index.php/t-1720675.html (2011, old)
- Quality slider means trial and error to hit a KB cap: "every compressor just hands you a quality slider to guess with" — maker of PhotoFit (positioning, not a user review) — https://www.producthunt.com/p/photofit/photofit
- Photos "a few KB over the limit" are rejected; renamed files that are not true JPEGs fail validation — portal guides — https://www.producthunt.com/p/photofit/photofit ; https://www.pythonware.com/guides-image-size-for-exam-forms (commercial guide)
- "for everything in Windows 10 that was 2 clicks, everything in Windows 11 is now 3" — Windows 11 right-click menu — https://learn.microsoft.com/en-us/answers/questions/735253/windows-11-how-to-remove-show-more-options (2022); Microsoft is reworking the menu in 26H2 and insiders object that user-added registry entries move under "Show more options" — https://aphnetworks.com/news/32106-windows-11s-decluttered-right-click-menu-draws-criticism-one-big-flaw
- File Converter (Tichau) reportedly lacks Windows 11 modern-menu integration — https://getquicker.net/QA/Question/11883 (forum post, not verified)

Shared by most: (1) free tiers capped by tasks, size or time, with the cap poorly explained; (2) subscription and billing friction; (3) privacy of uploading personal documents to a third party; (4) no guarantee of hitting an exact size, only a quality or percentage control; (5) aggressive compression that damages readability, with no warning. Limits to this reading: the review sets are small, Trustpilot pages were partial, and no Reddit or Hacker News threads could be retrieved, so the voice of portal users is mostly inferred from portal guides and tool-vendor pages.

## What users praise (table stakes)
- Ease of use and speed: "a few seconds later my file is 95% smaller" — iLovePDF — https://www.capterra.com/reviews/173963/ilovepdf (Capterra ease of use 4.8/5; quote via search summary, undated); https://capterra.ie/software/173963/ilovepdf
- A useful free tier for basic tasks, support that handles refunds — Smallpdf — https://www.getapp.com/collaboration-software/a/smallpdf/ ; https://ca.trustpilot.com/review/smallpdf.com
- Reliable PDF compression with no install — Compress2Go — https://www.g2.com/products/compress2go/reviews_and_filters
- Lossless "exactly preserves image quality" by default, drag and drop, Finder Services entry — ImageOptim (vendor claim, positioning only) — https://imageoptim.com/
- Right-click multi-select resize with no editor open — PowerToys Image Resizer — https://www.zdnet.com.au/article/how-to-shrink-your-images-with-the-powertoys-image-resizer/
- Local-only processing as a selling point — SlimPDF, GhostPDF, SafePDF, Bento PDF (self-promotion) — https://dev.to/rajinh24/slimpdf-a-lightweight-and-privacy-friendly-pdf-compressor-hnn ; https://alternativeto.net/software/ghostpdf/about

Table stakes: a result in seconds, no signup, a visible before and after size, and no obvious loss of readability.

## The gap
- No source found shows one free, local tool that combines: right-click launch, a target size in KB with a result that is reported as met or not met, image and PDF in one flow, named portal presets, and macOS, Windows and Linux support. Caesium has a max-output-size mode but no PDF and no context-menu entry was found; ImageOptim is Mac-only and lossless-first; PowerToys resizes dimensions and no target-size control was found; File Converter is Windows-only and reportedly not on the Windows 11 modern menu; Ghostscript front ends are PDF-only and mostly single-platform. https://github.com/Lymphatus/caesium-image-compressor ; https://imageoptim.com/ ; https://microsoft.github.io/PowerToys/modules/imageresizer/ ; https://getquicker.net/QA/Question/11883
- Candidate wedges from the complaints: (a) "met or not met" target-size result with honest filenames, against the slider-and-guess pattern and the plus-or-minus 10-20% result; (b) local processing for ID and passport scans, against the upload privacy concern; (c) readability warning for scanned PDFs, against unreadable low-DPI output; (d) no caps, accounts or billing, against free-tier limits and trial charges.
- Browser-local tools (PhotoFit, Bento PDF, Squoosh) already cover wedge (b) without an install, so the right-click entry, PDF handling and presets must carry the case for installing a desktop app.

## Risks
- Free alternatives are good enough for some users: Caesium (6.4k stars) for images, browser-local tools for form photos, MS Paint and Preview for one-offs. https://github.com/Lymphatus/caesium-image-compressor ; https://advit.icaiexam.icai.org/index.php?p=imgsize
- Windows 11 context-menu entries need package identity (IExplorerCommand plus a sparse package) to appear on the modern menu, and Microsoft is changing the menu in 26H2; unsigned or unpackaged entries land under "Show more options". https://blogs.windows.com/windowsdeveloper/2021/07/19/extending-the-context-menu-and-share-dialog-in-windows-11/ ; https://aphnetworks.com/news/32106-windows-11s-decluttered-right-click-menu-draws-criticism-one-big-flaw
- Strict PDF byte-size targets are hard to meet without damaging scans; Ghostscript presets trade readability against size. https://scruss.com/blog/tag/ghostscript/ ; https://bugs.ghostscript.com/show_bug.cgi?id=707831
- Portal rules change and are inconsistent (the same Vietnam e-visa source notes older, smaller caps), so presets can go stale; the brief already says presets do not guarantee compliance. https://www.zurichkotak.com/knowledge-center/travel-insurance/vietnam-visa-photo-size
- Reach: the audience (form fillers) searches the web for "compress to 200KB" and lands on online tools; the page results are dominated by online vendors, with no sign of a desktop tool. https://pdf.it.com/compress-pdf-to-200kb ; https://pdf.wondershare.com/online-pdf/compress-pdf-to-200kb.html
- Large incumbents already offer free web compression (Adobe 500 MB, one per 24 h signed in), but not local or unlimited. https://helpx.adobe.com/document-cloud/faq/free-online-pdf.html
- Open-source GUI maintenance: File Converter reportedly stalled; Google removed Squoosh's CLI. https://getquicker.net/QA/Question/11883 ; https://awesome.ecosyste.ms/projects/github.com%2Ffrostoven%2FSquoosh-with-CLI
- Licence: AGPL PDF back ends (MuPDF, Ghostscript) fit a copyleft app; PDFsam Basic and GhostPDF show that route is used. https://pdfsam.org/faq/ ; https://alternativeto.net/software/ghostpdf/about

## Verdict
crowded. The category is large and growing on the online side (ilovepdf.com rank #113 and rising), but every competitor shares the same unresolved complaints: caps, billing, uploads of personal documents, and no target-size guarantee. The desktop side is fragmented, with no cross-platform tool found that does right-click, target size and PDF together. The PRD should commit to a sharp wedge: a verified "target met or not met" result with honest filenames, local-only processing, and a readability warning for scanned PDFs. It should also treat Windows 11 modern-menu integration as a risk to test in the spike, not an assumption. Market size is not the constraint for an author-use success signal; reach to portal users is.

## Sources
- https://www.similarweb.com/website/ilovepdf.com/ — report (traffic estimates) — Sept 2026
- https://marketintelo.com/report/pdf-editor-software-market — report — 2025/2026
- https://www.gii.co.jp/report/ires1714673-pdf-editor-software-market-by-operation.html — report — 2025
- https://www.pdfreaderpro.com/blog/pdf-market-growth-statistics — report summary — 21 Jul 2025
- https://advit.icaiexam.icai.org/index.php?p=imgsize — portal guide — undated
- https://online.mspcindia.org/Downloads/MSPC_Guidefor%20Photoandsign.pdf — portal guide — undated
- https://mstcindia.co.in/MSTC_Careers/ImageDocUploadingSteps.aspx — portal guide — undated
- https://www.pythonware.com/guides-image-size-for-exam-forms — commercial guide — undated
- https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/tools-and-information/acceptable-photos/uploading-visa-photo-error-messages — government docs — undated
- https://www.zurichkotak.com/knowledge-center/travel-insurance/vietnam-visa-photo-size — commercial guide — undated
- https://www.producthunt.com/p/photofit/photofit — product launch page — undated
- https://www.ilovepdf.com/pricing — vendor pricing page (positioning and price only) — Oct 2026
- https://apple.co/3IIVbpM — app store listing and reviews — undated
- https://capterra.ie/software/173963/ilovepdf — review site — undated
- https://www.capterra.co.uk/reviews/173963/ilovepdf — review site — undated
- https://www.swifdoo.com/blog/is-ilovepdf-safe — competitor blog — 2026
- https://ca.trustpilot.com/review/smallpdf.com — review site — Sept-Oct 2026
- https://capterra.com/p/172606/Smallpdf/pricing/ — review site pricing — 2026
- https://capterra.com/p/172606/Smallpdf/reviews/ — review site — 2023-2026
- https://toolradar.com/tools/smallpdf/pricing — third-party pricing — 2026
- https://www.getapp.com/collaboration-software/a/smallpdf/ — review site — 2026
- https://tinypng.com/pricing/api — vendor pricing — Oct 2026
- https://freetier.co/directory/products/tinypng — third-party listing — undated
- https://nl-be.trustpilot.com/review/compress2go.com?page=2 — review site — Jun-Aug 2025
- https://zoftwarehub.com/ar-ae/products/compress2go/pricing — third-party pricing — undated
- https://zoftwarehub.com/products/compress2go/reviews — review aggregator — undated
- https://www.g2.com/products/compress2go/reviews_and_filters — review site — undated
- https://helpx.adobe.com/document-cloud/faq/free-online-pdf.html — vendor docs — undated
- https://github.com/Lymphatus/caesium-image-compressor — repo — Oct 2026
- https://github.com/Lymphatus/caesium-image-compressor/releases — repo — Oct 2026
- https://mac.softpedia.com/progChangelog/Caesium-Changelog-143210.html — changelog — older
- https://github.com/menzil/libcaesium — repo — undated
- https://imageoptim.com/ — vendor page (positioning only) — Oct 2026
- https://aur.archlinux.org/packages/fileoptimizer-bin — package listing — 2026-06-01
- https://wingetgui.com/apps/Nikkho-FileOptimizer — package listing — undated
- https://tichau.itch.io/file-converter — vendor page — undated
- https://getquicker.net/QA/Question/11883 — forum — undated
- https://microsoft.github.io/PowerToys/modules/imageresizer/ — docs — undated
- https://www.zdnet.com.au/article/how-to-shrink-your-images-with-the-powertoys-image-resizer/ — news — older
- https://www.pentaxforums.com/forums/32-digital-processing-software-printing/225610-best-resize-250kb.html — forum — older
- https://ubuntuforums.org/archive/index.php/t-1720675.html — forum — 2011 (old)
- https://support.apple.com/guide/preview/prvw1509 — docs — undated
- https://smallpdf.com/blog/reduce-pdf-file-size-mac-preview — competitor blog — undated
- https://alternativeto.net/software/ghostpdf/about — directory — Aug 2026
- https://dev.to/rajinh24/slimpdf-a-lightweight-and-privacy-friendly-pdf-compressor-hnn — blog — undated
- https://pdfsam.org/faq/ — vendor docs — Oct 2026
- https://updf.com/knowledge/pdfsam-review/ — competitor review — undated
- https://www.star-history.com/googlechromelabs/squoosh — repo stats — mid-June 2026
- https://gittrend.io/repo/GoogleChromeLabs/squoosh — repo stats — June 2026
- https://awesome.ecosyste.ms/projects/github.com%2Ffrostoven%2FSquoosh-with-CLI — repo — undated
- https://www.bentopdf.com/compress-pdf-to-200kb — vendor page (positioning only) — undated
- https://pdf.it.com/compress-pdf-to-200kb — vendor page — undated
- https://pdf.wondershare.com/online-pdf/compress-pdf-to-200kb.html — vendor page — undated
- https://scruss.com/blog/tag/ghostscript/ — blog — older
- https://bugs.ghostscript.com/show_bug.cgi?id=707831 — bug tracker — undated
- https://blogs.windows.com/windowsdeveloper/2021/07/19/extending-the-context-menu-and-share-dialog-in-windows-11/ — docs — 2021 (old)
- https://learn.microsoft.com/en-us/answers/questions/735253/windows-11-how-to-remove-show-more-options — forum — 2022 (old)
- https://aphnetworks.com/news/32106-windows-11s-decluttered-right-click-menu-draws-criticism-one-big-flaw — news — 2026
