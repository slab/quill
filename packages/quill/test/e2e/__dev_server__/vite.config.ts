import { defineConfig } from 'vite';
import { resolve } from 'path';
import htmlResolveAlias from 'vite-plugin-html-resolve-alias/dist/index.js';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    svgLoader({
      defaultImport: 'raw',
    }),
    // @ts-expect-error https://github.com/xieyhn/vite-plugin-html-resolve-alias/pull/11
    htmlResolveAlias(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../../../src'),
      '/src': resolve(__dirname, '../../../src'),
    },
    extensions: ['.js', '.ts', '.styl'],
  },
  server: {
    hmr: false,
  },
});
