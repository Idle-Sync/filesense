import { defineConfig } from "@playwright/test";

const port = Number(process.env.SPIKE_PORT ?? 4173);
const externalBaseUrl = process.env.SPIKE_BASE_URL;
const baseURL = externalBaseUrl ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests",
  timeout: 180_000,
  use: { baseURL },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: `vite build && vite preview --port ${port} --strictPort`,
        url: `${baseURL}/pages/pdf/index.html`,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
