import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js'],
  },
  test: {
    include: ['test/fuzz/**/*.spec.ts'],
    environment: 'jsdom',
  },
});
