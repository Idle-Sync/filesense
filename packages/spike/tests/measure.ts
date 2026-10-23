import { readFileSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
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
  const browser = page.context().browser();
  const browserName = browser?.browserType().name();
  if (browserName !== "chromium") {
    throw new Error(`heap size is not available on ${browserName}`);
  }
  const session = await page.context().newCDPSession(page);
  await session.send("Performance.enable");
  const { metrics } = await session.send("Performance.getMetrics");
  const heap = metrics.find((metric) => metric.name === "JSHeapUsedSize");
  if (!heap) {
    throw new Error("Performance.getMetrics returned no JSHeapUsedSize");
  }
  return heap.value;
}

export async function readResult(page: Page): Promise<Record<string, unknown>> {
  const result = page.locator("#result");
  await page.waitForFunction(() => document.querySelector("#result")?.textContent?.trim() !== "");
  const parsed = JSON.parse((await result.textContent()) ?? "");
  if ("error" in parsed) {
    throw new Error(`page reported an error: ${parsed.error}`);
  }
  return parsed;
}

// Appends so repeated runs and several projects keep every measurement.
export function writeMeasurement(name: string, data: unknown): void {
  mkdirSync(measurementsDir, { recursive: true });
  const path = resolve(measurementsDir, `${name}.json`);
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : [];
  existing.push(data);
  writeFileSync(path, JSON.stringify(existing, null, 2));
}
