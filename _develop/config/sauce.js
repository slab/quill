var _ = require('lodash');
var os = require('os');

var options = {
  username: process.env.SAUCE_USER || 'quill',
  accessKey: process.env.SAUCE_KEY || 'adc0c0cf-221b-46f1-81b9-a4429b722c2e'
};

if (process.env.TRAVIS) {
  options.build = process.env.TRAVIS_BUILD_ID;
  options.tunnel = process.env.TRAVIS_JOB_NUMBER;
} else {
  var id = _.random(16*16*16*16).toString(16);
  options.build = os.hostname() + '-' + id;
  options.tunnel = os.hostname() + '-tunnel-' + id;
}

module.exports = options;
