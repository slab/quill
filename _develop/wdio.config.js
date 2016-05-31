exports.config = {
  specs: [
    './test/functional/epic.js'
  ],
  exclude: [],

  maxInstances: 10,
  capabilities: [{
    maxInstances: 5,
    browserName: 'chrome'
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

    }
  }
}
