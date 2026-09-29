const { defineConfig, devices } = require("@playwright/test");

const useSystemChrome = !process.env.CI;

module.exports = defineConfig({
  testDir: "tests",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    // Locally reuse the installed Chrome; CI installs Playwright's Chromium.
    channel: useSystemChrome ? "chrome" : undefined,
  },
  webServer: {
    command: "node tests/static-server.js 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
