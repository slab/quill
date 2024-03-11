/*eslint-env node*/

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('../../../webpack.common.cjs');
const { merge } = require('webpack-merge');
require('webpack-dev-server');

module.exports = (env) =>
  merge(common, {
    plugins: [
      new HtmlWebpackPlugin({
        publicPath: '/',
        filename: 'index.html',
        template: path.resolve(__dirname, 'index.html'),
        chunks: ['quill'],
        inject: 'head',
        scriptLoading: 'blocking',
      }),
    ],
    devServer: {
      port: env.port,
      server: 'https',
      hot: false,
      liveReload: false,
      compress: true,
      client: {
        overlay: false,
      },
      webSocketServer: false,
    },
  });
