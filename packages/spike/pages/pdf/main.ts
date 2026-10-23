type DoneMessage = { type: "done"; output?: Uint8Array<ArrayBuffer>; [measurement: string]: unknown };
type WorkerMessage = { type: "ready" } | { type: "failed"; message: string } | DoneMessage;

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`pdf page has no ${selector}`);
  }
  return element;
}

const fileInput = requireElement<HTMLInputElement>("#file");
const toolSelect = requireElement<HTMLSelectElement>("#tool");
const settingSelect = requireElement<HTMLSelectElement>("#setting");
const runButton = requireElement<HTMLButtonElement>("#run");
const downloadLink = requireElement<HTMLAnchorElement>("#download");
const resultBox = requireElement<HTMLPreElement>("#result");

function showResult(value: object): void {
  resultBox.textContent = JSON.stringify(value);
}

// Vite only bundles a worker when `new Worker(new URL(...))` is written out literally, so each tool gets its own line.
function startWorker(tool: string): Worker {
  if (tool === "ghostscript") {
    return new Worker(new URL("./ghostscript-worker.ts", import.meta.url), { type: "module" });
  }
  if (tool === "mupdf") {
    return new Worker(new URL("./mupdf-worker.ts", import.meta.url), { type: "module" });
  }
  throw new Error(`unknown tool ${tool}`);
}

function nextMessage(worker: Worker): Promise<WorkerMessage> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.type === "failed") {
        reject(new Error(message.message));
        return;
      }
      resolve(message);
    };
    worker.onerror = (event) => {
      reject(new Error(`worker error: ${event.message || "the worker script failed to load"}`));
    };
  });
}

function offerDownload(output: Uint8Array<ArrayBuffer>, inputName: string): void {
  const blob = new Blob([output], { type: "application/pdf" });
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = inputName.replace(/\.pdf$/i, "") + "-compressed.pdf";
  downloadLink.hidden = false;
}

async function run(): Promise<void> {
  resultBox.textContent = "";
  downloadLink.hidden = true;
  const file = fileInput.files?.[0];
  if (!file) {
    throw new Error("choose a PDF file first");
  }
  const input = await file.arrayBuffer();
  const tool = toolSelect.value;

  // Load time runs from `new Worker` to the ready message: worker script, wasm fetch and compile, module start.
  const loadStart = performance.now();
  const worker = startWorker(tool);
  try {
    const ready = await nextMessage(worker);
    if (ready.type !== "ready") {
      throw new Error(`expected a ready message from the worker, got ${ready.type}`);
    }
    const loadMilliseconds = performance.now() - loadStart;

    const finished = nextMessage(worker);
    worker.postMessage({ input, setting: settingSelect.value }, [input]);
    const done = await finished;
    if (done.type !== "done") {
      throw new Error(`expected a done message from the worker, got ${done.type}`);
    }
    const { type, output, ...measurements } = done;
    if (output) {
      offerDownload(output, file.name);
    }
    showResult({ tool, loadMilliseconds, ...measurements });
  } finally {
    worker.terminate();
  }
}

runButton.addEventListener("click", () => {
  run().catch((error: unknown) => {
    showResult({ error: error instanceof Error ? error.message : String(error) });
  });
});
