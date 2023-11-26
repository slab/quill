import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import common from '../../../webpack.common';
import { merge } from 'webpack-merge';
import type { Configuration } from 'webpack';

export default (env: Record<string, unknown>) =>
  merge<Configuration>(common, {
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
      port: env.port as string,
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
