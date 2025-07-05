import { defineConfig } from 'vite';
import commonConfig from './vite.config.common.js';

export default defineConfig({
  ...commonConfig,
  build: {
    rollupOptions: {
      preserveEntrySignatures: 'exports-only',
      input: {
        quill: './src/quill.ts',
        'quill.core': './src/core.ts',
        'quill.core.css': './src/assets/core.styl',
        'quill.bubble.css': './src/assets/bubble.styl',
        'quill.snow.css': './src/assets/snow.styl',
      },
      output: [
        {
          format: 'esm',
          entryFileNames: '[name].esm.js',
          assetFileNames: '[name][extname]',
        },
      ],
    },
  },
});
