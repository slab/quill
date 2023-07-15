const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('../package.json');

const bannerPack = new webpack.BannerPlugin({
  banner: [
    `Quill Editor v${pkg.version}`,
    'https://quilljs.com/',
    'Copyright (c) 2014, Jason Chen',
    'Copyright (c) 2013, salesforce.com',
  ].join('\n'),
  entryOnly: true,
});
const constantPack = new webpack.DefinePlugin({
  QUILL_VERSION: JSON.stringify(pkg.version),
});

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
].map(file => {
  return path.resolve(__dirname, '..', file);
});

const jsRules = {
  test: /\.(j|t)s$/,
  include: source,
  use: ['babel-loader'],
};

const svgRules = {
  test: /\.svg$/,
  include: [path.resolve(__dirname, '../assets/icons')],
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
  include: [path.resolve(__dirname, '../assets')],
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
};

const baseConfig = {
  mode: 'development',
  context: path.resolve(__dirname, '..'),
  entry: {
    'quill.js': ['./quill.ts'],
    'quill.core.js': ['./core.ts'],
    'quill.core': './assets/core.styl',
    'quill.bubble': './assets/bubble.styl',
    'quill.snow': './assets/snow.styl',
    'unit.js': './test/unit.js',
  },
  output: {
    filename: '[name]',
    library: 'Quill',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist/'),
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
    bannerPack,
    constantPack,
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../dist'),
    },
    hot: false,
    port: process.env.npm_package_config_ports_webpack,
    allowedHosts: 'all',
    devMiddleware: {
      stats: 'minimal',
    },
  },
};

module.exports = env => {
  if (env?.minimize) {
    const { devServer, ...prodConfig } = baseConfig;
    return {
      ...prodConfig,
      mode: 'production',
      entry: { 'quill.min.js': './quill.ts' },
      devtool: 'source-map',
    };
  }
  if (env?.coverage) {
    baseConfig.module.rules[0].use[0].options.plugins = ['istanbul'];
    return baseConfig;
  }
  return baseConfig;
};
