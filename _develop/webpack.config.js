var path = require('path');
var pkg = require('../package.json');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var bannerPack = new webpack.BannerPlugin(
  'Quill Editor v' + pkg.version + '\n' +
  'https://quilljs.com/\n' +
  'Copyright (c) 2014, Jason Chen\n' +
  'Copyright (c) 2013, salesforce.com'
, { entryOnly: true });
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


module.exports = {
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
    libraryTarget: 'umd',
    path: 'dist/'
  },
  resolve: {
    alias: {
      'parchment': path.resolve(__dirname, '../node_modules/parchment/src/parchment')
    },
    extensions: ['', '.js', '.styl', '.ts']
  },
  module: {
    preLoaders: [{
      loader: 'eslint',
      test: /\.js$/,
      include: source
    }],
    loaders: [{
      loader: 'ts',
      test: /\.ts$/
    }, {
      loader: ExtractTextPlugin.extract('style', 'css!stylus'),
      test: /\.styl$/,
      include: [
        path.resolve(__dirname, '../assets')
      ]
    }, {
      loader: 'html',
      test: /\.svg$/,
      include: [
        path.resolve(__dirname, '../assets/icons')
      ],
      query: {
        minimize: true
      }
    }, {
      loader: 'babel',
      test: /\.js$/,
      include: source,
      query: {
        presets: ['es2015']
      }
    }],
    noParse: [
      /\/node_modules\/clone\/clone\.js$/,
      /\/node_modules\/eventemitter3\/index\.js$/,
      /\/node_modules\/extend\/index\.js$/
    ]
  },
  ts: {
    configFileName: 'tsconfig.json',
    compilerOptions: {
      declaration: false,
      target: 'es5',
      module: 'commonjs'
    },
    silent: true
  },
  plugins: [
    bannerPack,
    constantPack,
    new ExtractTextPlugin('[name].css', { allChunks: true })
  ],
  devServer: {
    hot: false,
    port: process.env.npm_package_config_ports_webpack,
    stats: {
      assets: false,
      chunks: false,
      errorDetails: true,
      errors: true,
      hash: false,
      timings: false,
      version: false,
      warnings: true
    }
  }
};

if (process.argv.indexOf('--coverage') !== -1) {
  module.exports.module.loaders[3].query = {
    plugins: ['istanbul', 'transform-es2015-modules-commonjs']
  };
}

if (process.argv.indexOf('--dev') !== -1) {
  module.exports.module.loaders[3].query = {
    plugins: ['transform-es2015-modules-commonjs']
  };
}

if (process.argv.indexOf('--minimize') !== -1) {
  module.exports.entry = {
    'quill.min.js': './quill.js'
  };
  module.exports.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
  module.exports.devtool = 'source-map';
}
