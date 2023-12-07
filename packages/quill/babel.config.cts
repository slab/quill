import { version } from './package.json';

export default {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [['transform-define', { QUILL_VERSION: version }]],
};
