import path from 'path';
import { BannerPlugin, DefinePlugin } from 'webpack';
import type { Configuration } from 'webpack';
import common from './webpack.common';
import { merge } from 'webpack-merge';
import 'webpack-dev-server';
import { readFileSync } from 'fs';
import { join } from 'path';

const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

const bannerPack = new BannerPlugin({
  banner: [
    `Quill Editor v${pkg.version}`,
    pkg.homepage,
    `Copyright (c) 2017-${new Date().getFullYear()}, Slab`,
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
