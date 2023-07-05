const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

module.exports = config => {
  config.set({
    basePath: '../',
    urlRoot: '/karma/',
    files: [{ pattern: 'dist/fuzz.js', nocache: true }],
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['jsdom'],
    singleRun: true,
    browserNoActivityTimeout: 120000,
    browserDisconnectTimeout: 120000,
    browserDisconnectTolerance: 3,
    browserSocketTimeout: 120000,
    captureTimeout: 120000,
  });
};
