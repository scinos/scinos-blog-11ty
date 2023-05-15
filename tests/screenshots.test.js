const { test, expect } = require('@playwright/test');

const SERVER = 'http://localhost:8080';

const paths = {
    home: '/',
    '2021-07-01-docker-on-macos-wthout-docker-desktop':
        '/posts/2021-07-01-docker-on-macos-wthout-docker-desktop/',
};

const runTests = ({ pathPrefix }) => {
    for (const [name, path] of Object.entries(paths)) {
        test(`${name}`, async ({ page }) => {
            await page.goto(`${SERVER}${path}`);
            await expect(page).toHaveScreenshot([pathPrefix, `${name}.png`]);
        });
    }
};

test.describe('Full desktop', () => {
    test.use({ viewport: { width: 1800, height: 3000 } });
    runTests({ pathPrefix: 'full-desktop' });
});

test.describe('Full mobile', () => {
    test.use({ viewport: { width: 768, height: 3000 } });
    runTests({ pathPrefix: 'full-mobile' });
});

test.describe('Desktop', () => {
    test.use({ viewport: { width: 1800, height: 1200 } });
    runTests({ pathPrefix: 'desktop' });
});

test.describe('Mobile', () => {
    test.use({ viewport: { width: 768, height: 1024 } });
    runTests({ pathPrefix: 'mobile' });
});
