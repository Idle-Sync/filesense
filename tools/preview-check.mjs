// Usage: node tools/preview-check.mjs <base-url> [--skip-csp]
import { readFileSync, readdirSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDirectory = join(root, "packages/spike/dist");

const args = process.argv.slice(2);
const skipCsp = args.includes("--skip-csp");
const baseUrl = args.find((arg) => !arg.startsWith("--"));
if (!baseUrl) {
  console.error("usage: node tools/preview-check.mjs <base-url> [--skip-csp]");
  process.exit(1);
}

function listFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(path));
    } else {
      files.push(path);
    }
  }
  return files;
}

function fetchHeaders(url) {
  const client = url.startsWith("https:") ? https : http;
  return new Promise((resolve, reject) => {
    const request = client.get(url, { headers: { "accept-encoding": "br, gzip" } }, (response) => {
      response.resume();
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers }));
    });
    request.on("error", reject);
  });
}

const expectedCsp = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"))
  .headers.flatMap((block) => block.headers)
  .find((header) => header.key === "Content-Security-Policy").value;

const assetPaths = listFiles(distDirectory)
  .filter((path) => path.endsWith(".wasm") || path.endsWith(".js"))
  .map((path) => "/" + relative(distDirectory, path).split(sep).join("/"));

let failures = 0;
function fail(message) {
  console.error(`FAIL ${message}`);
  failures += 1;
}

for (const path of ["/", ...assetPaths]) {
  const url = new URL(path, baseUrl).href;
  let response;
  try {
    response = await fetchHeaders(url);
  } catch (error) {
    fail(`${path}: request failed: ${error.message}`);
    continue;
  }
  const { status, headers } = response;
  console.log(`${path} status=${status} content-length=${headers["content-length"] ?? "none"} content-encoding=${headers["content-encoding"] ?? "none"}`);
  // "/" may be a 404 on the local preview; its CSP is still checked on Vercel.
  if (path !== "/" && status !== 200) {
    fail(`${path}: status ${status}`);
  }
  if (path.endsWith(".wasm") && headers["content-type"] !== "application/wasm") {
    fail(`${path}: content-type is ${headers["content-type"]}, expected application/wasm`);
  }
  if (!skipCsp && headers["content-security-policy"] !== expectedCsp) {
    fail(`${path}: content-security-policy is ${headers["content-security-policy"]}`);
  }
}

process.exit(failures === 0 ? 0 : 1);
