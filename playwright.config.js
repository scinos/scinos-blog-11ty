const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',

    /* Run tests in files in parallel */
    fullyParallel: true,
    workers: process.env.CI ? 1 : undefined,

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    outputDir: 'screenshots/',

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'yarn build --serve',
        port: 8080,
    },
});
