exports.config = {
  specs: [
    './test/functional/epic.js'
  ],
  exclude: [],

  maxInstances: 10,
  capabilities: [{
    browserName: 'chrome'
  // }, {
  //   browserName: 'firefox'
  }],

  sync: true,
  logLevel: 'error',
  coloredLogs: true,

  baseUrl: 'http://localhost:' + process.env.npm_package_config_ports_proxy,

  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 10000,
    expectationResultHandler: function(passed, assertion) {
      if (!passed) {
        this.saveScreenshot('./wd-' + this.desiredCapabilities.browserName + '-error.png');
        process.exit(1);
      }
    }
  }
}
