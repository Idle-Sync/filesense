import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";
import { readResult, writeMeasurement } from "./measure";

test("save: picker is available only in chromium, others download spike_output.txt twice", async ({ page, browserName }) => {
  await page.goto("/pages/save/index.html");
  const hasPicker = await page.evaluate(() => "showSaveFilePicker" in window);

  if (browserName === "chromium") {
    // Playwright cannot drive the native picker, so the click path is a human step.
    expect(hasPicker).toBe(true);
    writeMeasurement("save", { browser: browserName, hasPicker, method: "picker" });
    return;
  }

  expect(hasPicker).toBe(false);
  for (let attempt = 1; attempt <= 2; attempt++) {
    await page.evaluate(() => {
      document.querySelector("#result")!.textContent = "";
    });
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#run").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("spike_output.txt");
    const result = await readResult(page);
    expect(result.method).toBe("anchor");
    expect(result.suggestedName).toBe("spike_output.txt");
    writeMeasurement("save", { browser: browserName, hasPicker, attempt, method: result.method });
  }
});

test("vercel.json sets the build output and the strict CSP", () => {
  const config = JSON.parse(readFileSync(resolve(import.meta.dirname, "../../../vercel.json"), "utf8"));
  expect(typeof config.buildCommand).toBe("string");
  expect(config.outputDirectory).toBe("packages/spike/dist");
  expect(config.framework).toBeNull();
  expect(config).not.toHaveProperty("functions");

  const headerEntries = config.headers.flatMap((block: { headers: { key: string; value: string }[] }) => block.headers);
  const csp = headerEntries.find((entry: { key: string }) => entry.key === "Content-Security-Policy");
  expect(csp.value.startsWith("default-src 'none'")).toBe(true);
  for (const directive of ["connect-src 'self'", "form-action 'none'", "script-src 'self' 'wasm-unsafe-eval'", "worker-src 'self'"]) {
    expect(csp.value).toContain(directive);
  }
});
