var _ = require('lodash');
var browsers = require('../browsers');
var remoteReporters = ['dots'];

if (process.env.TRAVIS_BRANCH === 'master') {
  remoteReporters.push('saucelabs');
}

var remoteKarma = _.reduce(browsers, function(memo, config, browser) {
  memo[browser] = {
    browsers: [browser],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 4,
    browserNoActivityTimeout: 60000,
    reporters: remoteReporters
  };
  return memo;
}, {});

module.exports = function(grunt) {
  return grunt.config('karma', _.extend(remoteKarma, {
    options: {
      configFile: 'config/karma.js',
      files: [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/lodash/index.js',

        'test/helpers/inject.js',
        'test/helpers/matchers.js',

        grunt.config('baseUrl') + 'quill.base.css',
        grunt.config('baseUrl') + 'test/quill.js'
      ],
      port: grunt.config('karmaPort')
    },
    coverage: {
      browserNoActivityTimeout: 30000,
      browsers: ['Chrome'],
      reporters: ['coverage']
    },
    local: {
      browsers: ['Chrome', 'Firefox', 'Safari']
    },
    server: {
      autoWatch: true,
      browsers: [],
      urlRoot: '/karma/',
      singleRun: false
    },
    test: {
      browsers: ['Chrome']
    }
  }));
};
