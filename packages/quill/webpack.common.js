const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const source = [
  'quill.ts',
  'core.ts',
  'blots',
  'core',
  'formats',
  'modules',
  'test',
  'themes',
  'ui',
].map((file) => {
  return path.resolve(__dirname, file);
});

const jsRules = {
  test: /\.(j|t)s$/,
  include: source,
  use: ['babel-loader'],
};

const svgRules = {
  test: /\.svg$/,
  include: [path.resolve(__dirname, 'assets/icons')],
  use: [
    {
      loader: 'html-loader',
      options: {
        minimize: true,
      },
    },
  ],
};

const stylRules = {
  test: /\.styl$/,
  include: [path.resolve(__dirname, './assets')],
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
};

module.exports = {
  mode: 'development',
  entry: {
    'quill.js': ['./quill.ts'],
    'quill.core.js': ['./core.ts'],
    'quill.core': './assets/core.styl',
    'quill.bubble': './assets/bubble.styl',
    'quill.snow': './assets/snow.styl',
  },
  output: {
    filename: '[name]',
    library: 'Quill',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist/'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.styl', '.ts'],
  },
  module: {
    rules: [jsRules, stylRules, svgRules],
    noParse: [
      /\/node_modules\/clone\/clone\.js$/,
      /\/node_modules\/eventemitter3\/index\.js$/,
      /\/node_modules\/extend\/index\.js$/,
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
