import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";
import type { Page } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const corpusRoot = resolve(here, "../../../tests/corpus");
const measurementsDir = resolve(here, "../test-results");

export function corpusPath(relativeName: string): string {
  return resolve(corpusRoot, relativeName);
}

export function fileBytes(path: string): number {
  return readFileSync(path).length;
}

export function brotliBytes(path: string): number {
  return brotliCompressSync(readFileSync(path)).length;
}

export function gzipBytes(path: string): number {
  return gzipSync(readFileSync(path)).length;
}

export async function chromiumHeapBytes(page: Page): Promise<number> {
  const browserName = page.context().browser()?.browserType().name() ?? "unknown browser";
  if (browserName !== "chromium") {
    throw new Error(`heap size is not available on ${browserName}`);
  }
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("Performance.enable");
    const { metrics } = await session.send("Performance.getMetrics");
    const heap = metrics.find((metric) => metric.name === "JSHeapUsedSize");
    if (!heap) {
      throw new Error("Performance.getMetrics returned no JSHeapUsedSize");
    }
    return heap.value;
  } finally {
    await session.detach();
  }
}

export async function readResult(page: Page): Promise<Record<string, unknown>> {
  await page.waitForFunction(() => document.querySelector("#result")?.textContent?.trim() !== "");
  const text = (await page.locator("#result").textContent()) ?? "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(`#result is not JSON: ${text}`, { cause: error });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`#result is not a JSON object: ${text}`);
  }
  const result = parsed as Record<string, unknown>;
  if ("error" in result) {
    throw new Error(`page reported an error: ${result.error}`);
  }
  return result;
}

/**
 * Appends `data` as one JSON line to `packages/spike/test-results/<name>.json`.
 * The file is JSON Lines, not one JSON array: read it by splitting on newlines and parsing each line.
 * One small append per row lets parallel Playwright workers write the same file without losing rows.
 */
export function writeMeasurement(name: string, data: unknown): void {
  mkdirSync(measurementsDir, { recursive: true });
  appendFileSync(resolve(measurementsDir, `${name}.json`), JSON.stringify(data) + "\n");
}
