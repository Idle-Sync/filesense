import * as mupdf from "mupdf";
import { timed } from "../../src/timed";

type RunRequest = { input: ArrayBuffer };

postMessage({ type: "ready" });

// Whitespace is left out of the count: an image-only page can still yield line breaks from MuPDF's text extraction.
function countTextCharacters(document: mupdf.Document): number {
  let characters = 0;
  for (let index = 0; index < document.countPages(); index++) {
    const page = document.loadPage(index);
    const text = page.toStructuredText("preserve-whitespace").asText();
    characters += text.replace(/\s/g, "").length;
    page.destroy();
  }
  return characters;
}

function probe({ input }: RunRequest) {
  const document = mupdf.Document.openDocument(input, "application/pdf");
  try {
    return { pageCount: document.countPages(), textCharacters: countTextCharacters(document) };
  } finally {
    document.destroy();
  }
}

onmessage = async (event: MessageEvent<RunRequest>) => {
  try {
    const run = await timed("probe", () => probe(event.data));
    postMessage({ type: "done", milliseconds: run.milliseconds, ...run.value });
  } catch (error) {
    postMessage({ type: "failed", message: error instanceof Error ? error.message : String(error) });
  }
};
