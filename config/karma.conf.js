var _ = require('lodash');
var browsers = require('./browsers');
var sauce = require('./sauce');

module.exports = function(config) {
  config.set({
    basePath: '../',
    urlRoot: '/karma/',

    frameworks: ['jasmine'],
    reporters: ['progress'],
    colors: true,
    autoWatch: false,
    singleRun: true,

    coverageReporter: {
      dir: '.build/coverage',
      reporters: [
        { type: 'text' },
        { type: 'html' }
      ]
    },
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
