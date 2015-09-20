var _ = require('lodash');
var browsers = require('../browsers');
var sauce = require('../sauce');

module.exports = function(grunt) {
  var remoteProtractor = _.reduce(browsers, function(memo, config, browser) {
    return _.reduce(['e2e', 'wd'], function(memo, test) {
      var options;
      options = {
        args: {
          baseUrl: grunt.config('baseUrl'),
          capabilities: {
            name: "quill-" + test,
            platform: config[0],
            browserName: config[1],
            version: config[2],
            build: sauce.build,
            'tunnel-identifier': sauce.tunnel
          },
          sauceUser: sauce.username,
          sauceKey: sauce.accessKey,
          specs: ['test/wd/*.js']
        },
        jasmineNodeOpts: {
          isVerbose: false
        }
      };
      if (test === 'wd') {
        options.args.exclude = ['test/wd/e2e.js'];
      }
      memo[test + "-" + browser] = {
        options: options
      };
      return memo;
    }, memo);
  }, {});

  grunt.config('protractor', _.extend(remoteProtractor, {
    options: {
      configFile: 'config/protractor.js'
    },
    coverage: {
      options: {
        configFile: 'config/protractor.coverage.js',
        args: {
          baseUrl: grunt.config('baseUrl'),
          specs: ['test/wd/e2e.js']
        }
      }
    },
    e2e: {
      options: {
        args: {
          baseUrl: grunt.config('baseUrl'),
          specs: ['test/wd/e2e.js']
        }
      }
    }
  }));

  grunt.config('sauce_connect', {
    quill: {
      options: {
        username: sauce.username,
        accessKey: sauce.accessKey,
        tunnelIdentifier: sauce.tunnel
      }
    }
  });

  grunt.registerMultiTask('webdriver-manager', 'Protractor webdriver manager', function() {
    grunt.util.spawn({
      cmd: './node_modules/protractor/bin/webdriver-manager',
      args: [this.target],
      opts: {
        stdio: 'inherit'
      }
    }, this.async());
  });

  grunt.config('webdriver-manager', {
    start: {},
    status: {},
    update: {}
  });
};
