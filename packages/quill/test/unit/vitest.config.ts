import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js'],
  },
  test: {
    include: ['test/unit/**/*.spec.ts'],
    typecheck: {
      enabled: true,
      include: ['test/unit/**/*.test-d.ts'],
    },
    setupFiles: [
      resolve(__dirname, '__helpers__/expect.ts'),
      resolve(__dirname, '__helpers__/cleanup.ts'),
    ],
    browser: {
      enabled: true,
      provider: 'playwright',
      name: process.env.BROWSER || 'chromium',
    },
  },
});
