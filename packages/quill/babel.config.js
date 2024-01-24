const pkg = require('./package.json');

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    ['transform-define', { QUILL_VERSION: pkg.version }],
    './scripts/babel-svg-inline-import',
  ],
};
