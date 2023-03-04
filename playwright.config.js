const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',

    /* Run tests in files in parallel */
    fullyParallel: true,

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    outputDir: 'screenshots/',

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'yarn build --serve',
        port: 8080,
    },
});
