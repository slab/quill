const browsers = require('./browsers');
const sauce = require('./sauce');

module.exports = config => {
  config.set({
    basePath: '../',
    urlRoot: '/karma/',
    port: process.env.npm_package_config_ports_karma,

    files: [
      {
        pattern:
          'http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js',
        served: true,
      },
      { pattern: 'dist/quill.snow.css', nocache: true },
      { pattern: 'dist/unit.js', nocache: true },
      { pattern: 'dist/*.map', included: false, served: true, nocache: true },
      { pattern: 'assets/favicon.png', included: false, served: true },
    ],
    proxies: {
      '/assets/': '/karma/base/assets/',
    },

    frameworks: ['jasmine'],
    reporters: ['progress'],
    colors: true,
    autoWatch: false,
    singleRun: true,
    browsers: ['Chrome'],

    client: {
      useIframe: false,
    },

    coverageReporter: {
      dir: '.coverage',
      reporters: [{ type: 'text' }, { type: 'html' }],
    },
    sauceLabs: {
      testName: 'quill-unit',
      options: {
        public: 'public',
        'record-screenshots': false,
      },
      build: sauce.build,
      // There is no way to securely allow community PRs to be built and tested
      // by Travis and SauceLabs. Please do not abuse.
      username: 'quill',
      accessKey: 'ced60aed-80ad-436b-9ba8-690ed1205180',
      tunnelIdentifier: sauce.tunnel,
    },
    customLaunchers: browsers,
  });

  /* eslint-disable no-param-reassign */
  if (process.env.TRAVIS) {
    config.transports = ['polling'];
    config.browsers = [process.env.BROWSER];
    config.browserDisconnectTimeout = 10000;
    config.browserDisconnectTolerance = 3;
    config.browserNoActivityTimeout = 60000;
    config.captureTimeout = 120000;
    // MS Edge does not work in an iframe
    if (
      process.env.BROWSER.indexOf('ios') > -1 ||
      process.env.BROWSER.indexOf('android') > -1 ||
      process.env.BROWSER.indexOf('firefox') > -1
    ) {
      config.client.useIframe = true;
    }
  }
};
