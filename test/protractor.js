exports.config = {
  seleniumPort: 4444,
  chromeDriver: '../node_modules/protractor/selenium/chromedriver',
  chromeOnly: false,
  seleniumArgs: [],

  sauceUser: null,
  sauceKey: null,

  seleniumAddress: null,
  allScriptsTimeout: 11000,

  specs: [
    '../dist/test/e2e/*.js'
  ],
  exclude: [],

  capabilities: {
    'browserName': 'chrome'
  },
  multiCapabilities: [],

  baseUrl: 'http://localhost:9000',
  rootElement: 'body',

  onPrepare: function() {
    var ptor = protractor.getInstance();
    ptor.ignoreSynchronization = true;
  },

  framework: 'jasmine',

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  },

  onCleanUp: function() {}
};
