function requiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`page is missing ${selector}`);
  }
  return element;
}

const fileInput = requiredElement<HTMLInputElement>("#file");
const runButton = requiredElement<HTMLButtonElement>("#run");
const resultOutput = requiredElement<HTMLPreElement>("#result");

function showResult(result: unknown): void {
  resultOutput.textContent = JSON.stringify(result);
}

async function runInWorker(): Promise<void> {
  const file = fileInput.files?.[0];
  if (!file) {
    showResult({ error: "choose a JPEG file first" });
    return;
  }
  const bytes = await file.arrayBuffer();
  const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (event) => {
    showResult(event.data);
    worker.terminate();
  };
  worker.onerror = (event) => {
    // A worker script that fails to load fires an error event with an empty message.
    const reason = event.message || "worker script failed to load";
    showResult({ error: reason });
    worker.terminate();
  };
  worker.onmessageerror = () => {
    showResult({ error: "worker reply could not be deserialized" });
    worker.terminate();
  };
  worker.postMessage({ bytes }, [bytes]);
}

runButton.addEventListener("click", () => {
  resultOutput.textContent = "";
  runInWorker().catch((error) => showResult({ error: `run failed: ${String(error)}` }));
});
