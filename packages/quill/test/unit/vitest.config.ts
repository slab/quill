import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

const sauceLabsBaseUrl = new URL(
  'https://ondemand.us-west-1.saucelabs.com/wd/hub',
);

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js'],
  },
  server: {
    // https://docs.saucelabs.com/secure-connections/sauce-connect/advanced/specifications/#supported-browsers-and-ports
    port: 3000,
  },
  test: {
    watch: !process.env.CI,
    include: [resolve(__dirname, '**/*.spec.ts')],
    setupFiles: [
      resolve(__dirname, '__helpers__/expect.ts'),
      resolve(__dirname, '__helpers__/cleanup.ts'),
    ],
    browser: {
      enabled: true,
      providerOptions:
        process.env.PROVIDER === 'Sauce Labs'
          ? {
              protocol: sauceLabsBaseUrl.protocol.replace(/:/g, ''),
              hostname: sauceLabsBaseUrl.host,
              path: sauceLabsBaseUrl.pathname,
              port: 443,
              capabilities: {
                'sauce:options': {
                  tunnelName: process.env.SAUCE_TUNNEL_NAME,
                  extendedDebugging: true,
                  username: process.env.SAUCE_USERNAME,
                  accessKey: process.env.SAUCE_ACCESS_KEY,
                },
              },
            }
          : {},
      provider:
        process.env.PROVIDER === 'Sauce Labs'
          ? 'webdriverio'
          : process.env.PROVIDER ?? 'playwright',
      name: process.env.BROWSER || 'chromium',
      slowHijackESM: false,
    },
  },
});
