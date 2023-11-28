import path from 'path';
import { BannerPlugin, DefinePlugin } from 'webpack';
import type { Configuration } from 'webpack';
import pkg from './package.json';
import common from './webpack.common';
import { merge } from 'webpack-merge';
import 'webpack-dev-server';

const bannerPack = new BannerPlugin({
  banner: [
    `Quill Editor v${pkg.version}`,
    'https://quilljs.com/',
    'Copyright (c) 2014, Jason Chen',
    'Copyright (c) 2013, salesforce.com',
  ].join('\n'),
  entryOnly: true,
});
const constantPack = new DefinePlugin({
  QUILL_VERSION: JSON.stringify(pkg.version),
});

export default (env: Record<string, unknown>) =>
  merge<Configuration>(common, {
    mode: env.production ? 'production' : 'development',
    devtool: 'source-map',
    plugins: [bannerPack, constantPack],
    devServer: {
      static: {
        directory: path.resolve(__dirname, './dist'),
      },
      hot: false,
      allowedHosts: 'all',
      devMiddleware: {
        stats: 'minimal',
      },
    },
    stats: 'minimal',
  });
