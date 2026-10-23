/// <reference types="vite/client" />
import createGhostscript from "@okathira/ghostpdl-wasm";
import ghostscriptWasmUrl from "@okathira/ghostpdl-wasm/gs.wasm?url";
import { timed } from "../../src/timed";

type RunRequest = { input: ArrayBuffer; setting: string };

const errorLines: string[] = [];
let wasmMemory: WebAssembly.Memory | undefined;

function findMemory(exports: WebAssembly.Exports): WebAssembly.Memory {
  for (const value of Object.values(exports)) {
    if (value instanceof WebAssembly.Memory) {
      return value;
    }
  }
  throw new Error("the Ghostscript wasm instance exports no memory");
}

// The package exposes only FS and callMain, not its heap, so the worker instantiates the wasm itself to keep the memory.
const ghostscript = await createGhostscript({
  instantiateWasm(imports: WebAssembly.Imports, onInstantiated: (instance: WebAssembly.Instance) => void) {
    WebAssembly.instantiateStreaming(fetch(ghostscriptWasmUrl), imports)
      .then(({ instance }) => {
        wasmMemory = findMemory(instance.exports);
        onInstantiated(instance);
      })
      .catch((error: unknown) => {
        postMessage({ type: "failed", message: `Ghostscript wasm failed to load: ${String(error)}` });
      });
    return {};
  },
  print: () => {},
  printErr: (line: string) => {
    errorLines.push(line);
  },
});
postMessage({ type: "ready" });

async function compress({ input, setting }: RunRequest) {
  ghostscript.FS.writeFile("input.pdf", new Uint8Array(input));
  const run = await timed("pdfwrite", () =>
    ghostscript.callMain([
      "-sDEVICE=pdfwrite",
      `-dPDFSETTINGS=${setting}`,
      "-dNOPAUSE",
      "-dBATCH",
      "-dQUIET",
      "-sOutputFile=output.pdf",
      "input.pdf",
    ]),
  );
  if (run.value !== 0) {
    throw new Error(`Ghostscript exited with ${run.value}: ${errorLines.slice(-5).join(" | ")}`);
  }
  if (!wasmMemory) {
    throw new Error("Ghostscript ran without the worker seeing its wasm memory");
  }
  const output = ghostscript.FS.readFile("output.pdf");
  return {
    type: "done",
    setting,
    milliseconds: run.milliseconds,
    outputBytes: output.length,
    wasmMemoryBytes: wasmMemory.buffer.byteLength,
    output,
  };
}

onmessage = async (event: MessageEvent<RunRequest>) => {
  try {
    postMessage(await compress(event.data));
  } catch (error) {
    postMessage({ type: "failed", message: error instanceof Error ? error.message : String(error) });
  }
};
