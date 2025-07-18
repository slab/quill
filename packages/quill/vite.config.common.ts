import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

const __dirname = import.meta.dirname || new URL('.', import.meta.url).pathname;

export default defineConfig({
  plugins: [
    svgLoader({
      defaultImport: 'raw',
    }),
    dts({
      include: ['src'],
      exclude: ['src/helpers'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.styl'],
  },
});
