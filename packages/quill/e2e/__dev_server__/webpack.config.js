const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ...common } = require('../../webpack.common');
const { merge } = require('webpack-merge');

module.exports = (env) =>
  merge(common, {
    plugins: [
      new HtmlWebpackPlugin({
        publicPath: '/',
        filename: 'index.html',
        template: path.resolve(__dirname, 'index.html'),
        chunks: ['quill.js', 'quill.core', 'quill.snow'],
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
