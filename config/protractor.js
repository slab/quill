require('coffee-script');

exports.config = {
  chromeOnly: false,
  allScriptsTimeout: 11000,

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:9000',

  onPrepare: function() {
    browser.ignoreSynchronization = true;
  },

  framework: 'jasmine',

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  }
};
