import { resolve } from 'path';
import type { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const tsRules = {
  test: /\.ts$/,
  include: [resolve(__dirname, 'src')],
  use: ['babel-loader'],
};

const svgRules = {
  test: /\.svg$/,
  include: [resolve(__dirname, 'src/assets/icons')],
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
  include: [resolve(__dirname, 'src/assets')],
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
};

export default {
  entry: {
    quill: './src/quill.ts',
    'quill.core': './src/core.ts',
    'quill.core.css': './src/assets/core.styl',
    'quill.bubble.css': './src/assets/bubble.styl',
    'quill.snow.css': './src/assets/snow.styl',
  },
  output: {
    filename: '[name].js',
    library: {
      name: 'Quill',
      type: 'umd',
      export: 'default',
    },
    path: resolve(__dirname, 'dist/dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.styl', '.ts'],
  },
  module: {
    rules: [tsRules, stylRules, svgRules],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]',
    }),
  ],
} satisfies Configuration;
