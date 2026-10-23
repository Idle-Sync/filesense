import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  // Module workers, as jSquash codecs with an inner worker need (jSquash issue #19); Vite's default "iife" passes only for @jsquash/jpeg, see docs/research/spike-2026-11/b-jsquash-worker.md.
  worker: { format: "es" },
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        "pages/jpeg-worker": resolve(import.meta.dirname, "pages/jpeg-worker/index.html"),
        "pages/pdf": resolve(import.meta.dirname, "pages/pdf/index.html"),
        "pages/save": resolve(import.meta.dirname, "pages/save/index.html"),
      },
    },
  },
  optimizeDeps: {
    exclude: ["@jsquash/jpeg", "@okathira/ghostpdl-wasm", "mupdf"],
  },
});
