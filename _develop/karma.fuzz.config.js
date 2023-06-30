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
  });
};
