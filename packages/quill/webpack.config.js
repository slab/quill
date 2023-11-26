const path = require('path');
const webpack = require('webpack');
const pkg = require('../../package.json');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

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

const baseConfig = merge(common, {
  plugins: [bannerPack, constantPack],
  devServer: {
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
    hot: false,
    port: process.env.npm_package_config_ports_webpack,
    allowedHosts: 'all',
    devMiddleware: {
      stats: 'minimal',
    },
  },
});

module.exports = (env) => {
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
