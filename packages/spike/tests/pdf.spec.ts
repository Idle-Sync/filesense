import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, type Page, test } from "@playwright/test";
import {
  brotliBytes,
  chromiumHeapBytes,
  corpusPath,
  fileBytes,
  gzipBytes,
  readResult,
  writeMeasurement,
} from "./measure";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(here, "../test-results/pdf");
const distAssetsDir = resolve(here, "../dist/assets");

const files = ["text.pdf", "scanned.pdf"];
const settings = ["/screen", "/ebook", "/printer"];

// Vite keeps the source file name in front of the hash: gs.wasm, mupdf-wasm.wasm and the two worker chunks.
const pdfAssetPrefixes = ["gs-", "ghostscript-worker-", "mupdf-"];

type ManifestEntry = { path: string; pages?: number };

function manifestPages(name: string): number {
  const manifest = JSON.parse(readFileSync(corpusPath("manifest.json"), "utf8")) as ManifestEntry[];
  const entry = manifest.find((candidate) => candidate.path === name);
  if (entry?.pages === undefined) {
    throw new Error(`manifest.json has no page count for ${name}`);
  }
  return entry.pages;
}

async function heapBytesOrNull(page: Page, browserName: string): Promise<number | null> {
  if (browserName !== "chromium") {
    return null;
  }
  return chromiumHeapBytes(page);
}

function isPdfPackageAsset(name: string): boolean {
  if (!name.endsWith(".wasm") && !name.endsWith(".js")) {
    return false;
  }
  return pdfAssetPrefixes.some((prefix) => name.startsWith(prefix));
}

async function runPdfPage(page: Page, file: string, tool: string, setting?: string) {
  await page.goto("/pages/pdf/index.html");
  await page.setInputFiles("#file", corpusPath(file));
  await page.selectOption("#tool", tool);
  if (setting !== undefined) {
    await page.selectOption("#setting", setting);
  }
  await page.click("#run");
  return readResult(page);
}

test.describe("pdf", () => {
  for (const file of files) {
    for (const setting of settings) {
      test(`ghostscript ${file} ${setting}`, async ({ page, browserName }) => {
        const result = await runPdfPage(page, file, "ghostscript", setting);

        expect(result.outputBytes).toBeGreaterThan(0);
        expect(result.wasmMemoryBytes).toBeGreaterThan(0);
        expect(result.loadMilliseconds).toBeGreaterThan(0);
        expect(result.milliseconds).toBeGreaterThan(0);

        mkdirSync(outputDir, { recursive: true });
        const outputPath = resolve(outputDir, `${file}-${setting.slice(1)}-${browserName}.pdf`);
        const [download] = await Promise.all([page.waitForEvent("download"), page.click("#download")]);
        await download.saveAs(outputPath);
        const output = readFileSync(outputPath);
        expect(output.subarray(0, 4).toString("latin1")).toBe("%PDF");
        expect(output.length).toBe(result.outputBytes);

        const pages = manifestPages(file);
        writeMeasurement("pdf-ghostscript", {
          browser: browserName,
          file,
          setting,
          pages,
          inputBytes: fileBytes(corpusPath(file)),
          loadMilliseconds: result.loadMilliseconds,
          milliseconds: result.milliseconds,
          secondsPerPage: (result.milliseconds as number) / 1000 / pages,
          outputBytes: result.outputBytes,
          wasmMemoryBytes: result.wasmMemoryBytes,
          chromiumHeapBytes: await heapBytesOrNull(page, browserName),
        });
      });
    }

    test(`mupdf ${file}`, async ({ page, browserName }) => {
      const result = await runPdfPage(page, file, "mupdf");

      expect(result.pageCount).toBe(manifestPages(file));
      // text.pdf is generated with real text on every page; scanned.pdf holds only images, so it must read as empty.
      if (file === "text.pdf") {
        expect(result.textCharacters).toBeGreaterThan(200);
      } else {
        expect(result.textCharacters).toBe(0);
      }

      writeMeasurement("pdf-mupdf", {
        browser: browserName,
        file,
        loadMilliseconds: result.loadMilliseconds,
        milliseconds: result.milliseconds,
        pageCount: result.pageCount,
        textCharacters: result.textCharacters,
        chromiumHeapBytes: await heapBytesOrNull(page, browserName),
      });
    });
  }

  test("pdf package bundle sizes in dist", async ({ browserName }) => {
    test.skip(browserName !== "chromium", "sizes on disk do not depend on the browser");

    const shipped = readdirSync(distAssetsDir).filter(isPdfPackageAsset);
    expect(shipped.some((name) => name.startsWith("gs-") && name.endsWith(".wasm"))).toBe(true);
    expect(shipped.some((name) => name.startsWith("mupdf-wasm-") && name.endsWith(".wasm"))).toBe(true);

    for (const name of shipped) {
      const path = resolve(distAssetsDir, name);
      writeMeasurement("pdf-bundle", {
        file: name,
        bytes: fileBytes(path),
        brotliBytes: brotliBytes(path),
        gzipBytes: gzipBytes(path),
      });
    }
  });
});
