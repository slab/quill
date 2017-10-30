var path = require('path');
var pkg = require('../package.json');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var bannerPack = new webpack.BannerPlugin({
  banner:
    'Quill Editor v' + pkg.version + '\n' +
    'https://quilljs.com/\n' +
    'Copyright (c) 2014, Jason Chen\n' +
    'Copyright (c) 2013, salesforce.com',
  entryOnly: true
});
var constantPack = new webpack.DefinePlugin({
  QUILL_VERSION: JSON.stringify(pkg.version)
});

var source = [
  'quill.js',
  'core.js',
  'blots',
  'core',
  'formats',
  'modules',
  'test',
  'themes',
  'ui'
].map(function(file) {
  return path.resolve(__dirname, '..', file);
});


module.exports = function(env) {
  let config = {
    context: path.resolve(__dirname, '..'),
    entry: {
      'quill.js': ['./quill.js'],
      'quill.core.js': ['./core.js'],
      'quill.core': './assets/core.styl',
      'quill.bubble': './assets/bubble.styl',
      'quill.snow': './assets/snow.styl',
      'unit.js': './test/unit.js'
    },
    output: {
      filename: '[name]',
      library: 'Quill',
      libraryExport: 'default',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, '../dist/')
    },
    resolve: {
      alias: {
        'parchment': path.resolve(__dirname, '../node_modules/parchment/src/parchment')
      },
      extensions: ['.js', '.styl', '.ts']
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: ['eslint-loader'],
        include: source,
        enforce: 'pre'
      }, {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: false,
              target: 'es5',
              module: 'commonjs'
            },
            transpileOnly: true
          }
        }]
      }, {
        test: /\.styl$/,
        include: [
          path.resolve(__dirname, '../assets')
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'stylus-loader'
          ]
        })
      }, {
        test: /\.svg$/,
        include: [
          path.resolve(__dirname, '../assets/icons')
        ],
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      }, {
        test: /\.js$/,
        include: source,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }]
      }],
      noParse: [
        /\/node_modules\/clone\/clone\.js$/,
        /\/node_modules\/eventemitter3\/index\.js$/,
        /\/node_modules\/extend\/index\.js$/
      ]
    },
    plugins: [
      bannerPack,
      constantPack,
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      })
    ],
    devServer: {
      contentBase: path.resolve(__dirname, '../dist'),
      hot: false,
      port: process.env.npm_package_config_ports_webpack,
      stats: 'minimal',
      disableHostCheck: true
    }
  };

  if (env && env.dev) {
    config.module.rules = config.module.rules.slice(1);   // Remove linter
    config.module.rules[3].use[0].options = {
      plugins: ['transform-es2015-modules-commonjs']
    };
  }

  if (env && env.minimize) {
    config.entry = {
      'quill.min.js': './quill.js'
    };
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      })
    );
    config.devtool = 'source-map';
  }

  if (env && env.coverage) {
    config.module.rules[4].use[0].options = {
      plugins: ['istanbul', 'transform-es2015-modules-commonjs']
    };
  }

  return config;
};
