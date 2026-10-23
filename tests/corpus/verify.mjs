import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const corpusDir = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(corpusDir, "manifest.json"), "utf8"));

const problems = [];
for (const entry of manifest) {
  if (!entry.committed) continue;
  let data;
  try {
    data = readFileSync(join(corpusDir, entry.path));
  } catch (error) {
    problems.push(`${entry.path}: cannot read (${error.code})`);
    continue;
  }
  const sha256 = createHash("sha256").update(data).digest("hex");
  if (data.length !== entry.bytes) {
    problems.push(`${entry.path}: ${data.length} bytes, manifest says ${entry.bytes}`);
  }
  if (sha256 !== entry.sha256) {
    problems.push(`${entry.path}: sha256 differs from manifest`);
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("corpus ok");
