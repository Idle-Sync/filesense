import decode from "@jsquash/jpeg/decode";
import encode from "@jsquash/jpeg/encode";
import { timed } from "../../src/timed";

const quality = 75;

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
  };
}

self.onmessage = async (event: MessageEvent<{ bytes: ArrayBuffer }>) => {
  try {
    postMessage(await reencode(event.data.bytes));
  } catch (error) {
    postMessage({ error: `decode or encode failed: ${String(error)}` });
  }
};
