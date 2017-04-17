var _ = require('lodash');
var os = require('os');

var options = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY
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
