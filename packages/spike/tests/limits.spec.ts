import { existsSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";
import { corpusPath, fileBytes, readResult, writeMeasurement } from "./measure";

// The product promises a result within a minute; a step past that is the limit for this browser.
const limitMilliseconds = 60_000;

// Ascending size, so the first step over the limit makes every later step pointless.
const images = ["stress/photo_12mp.jpg", "stress/photo_24mp.jpg", "stress/photo_48mp.jpg"];
const scans = ["stress/scanned_10p.pdf", "stress/scanned_30p.pdf", "stress/scanned_100p.pdf"];
const textPdfs = ["stress/text_100p.pdf"];
const pdfSetting = "/ebook";

type Ladder = { page: string; setting: string; run: (page: Page, file: string) => Promise<void> };

function requireStressFile(file: string): string {
  const path = corpusPath(file);
  if (!existsSync(path)) {
    throw new Error(`${file} is missing: run pnpm corpus:generate --stress first`);
  }
  return path;
}

async function runJpegWorker(page: Page, file: string): Promise<void> {
  await page.goto("/pages/jpeg-worker/index.html");
  await page.setInputFiles("#file", corpusPath(file));
  await page.click("#run");
}

async function runGhostscript(page: Page, file: string): Promise<void> {
  await page.goto("/pages/pdf/index.html");
  await page.setInputFiles("#file", corpusPath(file));
  await page.selectOption("#tool", "ghostscript");
  await page.selectOption("#setting", pdfSetting);
  await page.click("#run");
}

async function measureLadder(page: Page, browserName: string, files: string[], ladder: Ladder) {
  let limitReachedAt: string | undefined;
  for (const file of files) {
    const inputBytes = fileBytes(requireStressFile(file));
    const row = { browser: browserName, page: ladder.page, file, setting: ladder.setting, inputBytes };
    if (limitReachedAt !== undefined) {
      writeMeasurement("limits", { ...row, skipped: `${limitReachedAt} took over 60 s` });
      continue;
    }
    await test.step(file, async () => {
      await ladder.run(page, file);
      // readResult waits as long as the test allows; a run past the limit is still recorded with its time.
      const result = await readResult(page);
      expect(result.milliseconds).toBeGreaterThan(0);
      expect(result.wasmMemoryBytes).toBeGreaterThan(0);
      const milliseconds = result.milliseconds as number;
      writeMeasurement("limits", {
        ...row,
        seconds: milliseconds / 1000,
        outputBytes: result.outputBytes,
        wasmMemoryBytes: result.wasmMemoryBytes,
        overLimit: milliseconds > limitMilliseconds,
      });
      if (milliseconds > limitMilliseconds) {
        limitReachedAt = file;
      }
    });
  }
}

test.describe("limits", () => {
  test("limits jpeg-worker on 12, 24 and 48 megapixel photos", async ({ page, browserName }) => {
    test.setTimeout(images.length * 3 * limitMilliseconds);
    await measureLadder(page, browserName, images, { page: "jpeg-worker", setting: "quality 75", run: runJpegWorker });
  });

  test("limits ghostscript /ebook on 10, 30 and 100 page scans", async ({ page, browserName }) => {
    test.setTimeout(scans.length * 3 * limitMilliseconds);
    await measureLadder(page, browserName, scans, { page: "pdf", setting: pdfSetting, run: runGhostscript });
  });

  // A text PDF is a separate ladder: a slow 100 page scan says nothing about a 100 kB text file.
  test("limits ghostscript /ebook on a 100 page text PDF", async ({ page, browserName }) => {
    test.setTimeout(textPdfs.length * 3 * limitMilliseconds);
    await measureLadder(page, browserName, textPdfs, { page: "pdf", setting: pdfSetting, run: runGhostscript });
  });
});
