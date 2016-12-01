var _ = require('lodash');
var os = require('os');

var options = {
  username: process.env.SAUCE_USER || 'quill',
  accessKey: process.env.SAUCE_KEY || 'adc0c0cf-221b-46f1-81b9-a4429b722c2e'
};

if (process.env.TRAVIS) {
  module.exports = {
    build: process.env.TRAVIS_BUILD_ID,
    tunnel: process.env.TRAVIS_JOB_NUMBER
  };
} else {
  var id = _.random(16*16*16*16).toString(16);
  module.exports = {
    build: os.hostname() + '-' + id,
    tunnel: os.hostname() + '-tunnel-' + id
  };
}
