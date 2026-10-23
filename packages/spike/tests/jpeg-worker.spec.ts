import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { corpusPath, readResult, writeMeasurement } from "./measure";

type ManifestEntry = { path: string; width?: number; height?: number };

const manifest: ManifestEntry[] = JSON.parse(readFileSync(corpusPath("manifest.json"), "utf8"));

function manifestEntry(name: string): ManifestEntry {
  const entry = manifest.find((candidate) => candidate.path === name);
  if (!entry) {
    throw new Error(`${name} is not in tests/corpus/manifest.json`);
  }
  return entry;
}

for (const name of ["photo.jpg", "already_compressed.jpg"]) {
  test(`jpeg-worker re-encodes ${name} at quality 75 in a worker`, async ({ page, browserName }) => {
    const expected = manifestEntry(name);
    await page.goto("/pages/jpeg-worker/index.html");
    await page.setInputFiles("#file", corpusPath(name));
    await page.click("#run");
    const result = await readResult(page);

    expect(result.outputBytes).toBeGreaterThan(0);
    expect(result.headerHex).toBe("ffd8");
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    writeMeasurement("jpeg-worker", { browser: browserName, file: name, setting: "quality 75", ...result });
  });
}
