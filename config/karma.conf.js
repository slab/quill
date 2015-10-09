var _ = require('lodash');
var browsers = require('./browsers');
var sauce = require('./sauce');

module.exports = function(config) {
  config.set({
    basePath: '../',
    urlRoot: '/karma/',

    frameworks: ['jasmine'],
    reporters: ['progress'],
    preprocessors: {
      'src/**/*.js': ['babel'],
      'test/**/*.js': ['babel'],
      '**/*.html': ['html2js']
    },
    colors: true,
    autoWatch: false,
    singleRun: true,

    sauceLabs: {
      testName: 'quill-unit',
      options: {
        'public': 'public',
        'record-screenshots': false
      },
      build: sauce.build,
      username: sauce.username,
      accessKey: sauce.accessKey,
      tunnelIdentifier: sauce.tunnel
    },
    customLaunchers: _.reduce(browsers, function(memo, browser, name) {
      memo[name] = {
        base: 'SauceLabs',
        platform: browser[0],
        browserName: browser[1],
        version: browser[2]
      };
      return memo;
    }, {})
  });
  if (process.env.TRAVIS) {
    config.transports = ['polling'];
  }
};
