const suggestedName = "spike_output.txt";
// Not yet in TypeScript's DOM types.
declare global {
  interface Window {
    showSaveFilePicker(options: { suggestedName: string }): Promise<{
      createWritable(): Promise<{ write(data: Blob): Promise<void>; close(): Promise<void> }>;
    }>;
  }
}

const result = document.querySelector<HTMLPreElement>("#result")!;

async function saveWithPicker(blob: Blob): Promise<void> {
  const handle = await window.showSaveFilePicker({ suggestedName });
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

function saveWithAnchor(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = suggestedName;
  anchor.click();
  URL.revokeObjectURL(url);
}

document.querySelector("#run")!.addEventListener("click", async () => {
  const started = performance.now();
  const blob = new Blob(["spike save test\n"], { type: "text/plain" });
  const method = "showSaveFilePicker" in window ? "picker" : "anchor";
  try {
    if (method === "picker") {
      await saveWithPicker(blob);
    } else {
      saveWithAnchor(blob);
    }
    result.textContent = JSON.stringify({ method, suggestedName, milliseconds: performance.now() - started });
  } catch (error) {
    result.textContent = JSON.stringify({ error: String(error) });
  }
});

export {};
