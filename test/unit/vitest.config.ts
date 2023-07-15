import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js'],
  },
  test: {
    include: ['test/unit/**/*.spec.ts'],
    setupFiles: [
      'test/unit/__helpers__/expect.ts',
      'test/unit/__helpers__/cleanup.ts',
    ],
    retry: 3,
    browser: {
      enabled: true,
      provider: 'playwright',
      name: process.env.BROWSER || 'chromium',
      slowHijackESM: false,
    },
  },
});
