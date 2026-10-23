/// <reference types="vite/client" />
import decode, { init as initDecoder } from "@jsquash/jpeg/decode";
import encode, { init as initEncoder } from "@jsquash/jpeg/encode";
import decoderWasmUrl from "@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm?url";
import encoderWasmUrl from "@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm?url";
import { timed } from "../../src/timed";

const quality = 75;

const memories: { decoder?: WebAssembly.Memory; encoder?: WebAssembly.Memory } = {};

function findMemory(exports: WebAssembly.Exports): WebAssembly.Memory {
  for (const value of Object.values(exports)) {
    if (value instanceof WebAssembly.Memory) {
      return value;
    }
  }
  throw new Error("the MozJPEG wasm instance exports no memory");
}

// jSquash keeps its Emscripten modules private, so the worker instantiates each wasm itself to keep its memory.
function keepMemoryAs(name: "decoder" | "encoder", wasmUrl: string) {
  return {
    instantiateWasm(imports: WebAssembly.Imports, onInstantiated: (instance: WebAssembly.Instance) => void) {
      WebAssembly.instantiateStreaming(fetch(wasmUrl), imports)
        .then(({ instance }) => {
          memories[name] = findMemory(instance.exports);
          onInstantiated(instance);
        })
        .catch((error: unknown) => {
          postMessage({ error: `MozJPEG ${name} wasm failed to load: ${String(error)}` });
        });
      return {};
    },
  };
}

initDecoder(keepMemoryAs("decoder", decoderWasmUrl));
initEncoder(keepMemoryAs("encoder", encoderWasmUrl));

function wasmMemoryBytes() {
  if (!memories.decoder || !memories.encoder) {
    throw new Error("MozJPEG ran without the worker seeing its wasm memory");
  }
  const decodeWasmMemoryBytes = memories.decoder.buffer.byteLength;
  const encodeWasmMemoryBytes = memories.encoder.buffer.byteLength;
  return { wasmMemoryBytes: decodeWasmMemoryBytes + encodeWasmMemoryBytes, decodeWasmMemoryBytes, encodeWasmMemoryBytes };
}

function firstTwoBytesAsHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer, 0, 2);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function reencode(bytes: ArrayBuffer) {
  const total = await timed("decode and encode", async () => {
    const decoded = await timed("decode", () => decode(bytes));
    const encoded = await timed("encode", () => encode(decoded.value, { quality }));
    return { decoded, encoded };
  });
  const { decoded, encoded } = total.value;
  return {
    outputBytes: encoded.value.byteLength,
    headerHex: firstTwoBytesAsHex(encoded.value),
    width: decoded.value.width,
    height: decoded.value.height,
    milliseconds: total.milliseconds,
    decodeMilliseconds: decoded.milliseconds,
    encodeMilliseconds: encoded.milliseconds,
    ...wasmMemoryBytes(),
  };
}

self.onmessage = async (event: MessageEvent<{ bytes: ArrayBuffer }>) => {
  try {
    postMessage(await reencode(event.data.bytes));
  } catch (error) {
    postMessage({ error: `decode or encode failed: ${String(error)}` });
  }
};
