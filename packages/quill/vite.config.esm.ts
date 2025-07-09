import { defineConfig } from 'vite';
import commonConfig from './vite.config.common.js';
import { resolve } from 'path';
import EsmInputBuilder from './scripts/esmInputBuilder.js';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __dirname = import.meta.dirname || new URL('.', import.meta.url).pathname;
const srcPath = (p: string) => resolve(__dirname, `src/${p}`);

const defaultInput = {
  quill: srcPath('quill.ts'),
  'quill.core': srcPath('core.ts'),
  'quill.core.css': srcPath('assets/core.styl'),
  'quill.bubble.css': srcPath('assets/bubble.styl'),
  'quill.snow.css': srcPath('assets/snow.styl'),
};

export default defineConfig({
  ...commonConfig,
  plugins: [
    ...commonConfig.plugins,
    viteStaticCopy({
      targets: [
        {
          src: srcPath('assets'),
          dest: '',
        },
      ],
    }),
  ],
  build: {
    assetsDir: 'vendor',
    rollupOptions: {
      preserveEntrySignatures: 'exports-only',
      input: new EsmInputBuilder(defaultInput)
        .scanDirectory(resolve(__dirname, 'src'), {
          skip: ['assets/**', 'helpers/**', '*.d.ts'],
          skipInDest: true,
        })
        .build(),
      output: [
        {
          format: 'esm',
          entryFileNames: '[name].js',
          assetFileNames: '[name][extname]',
        },
      ],
    },
  },
});
