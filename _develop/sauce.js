const _ = require('lodash');
const os = require('os');

if (process.env.TRAVIS) {
  module.exports = {
    build: process.env.TRAVIS_BUILD_ID,
    tunnel: process.env.TRAVIS_JOB_NUMBER,
  };
} else {
  const id = _.random(16 * 16 * 16 * 16).toString(16);
  module.exports = {
    build: `${os.hostname()}-${id}`,
    tunnel: `${os.hostname()}-tunnel-${id}`,
  };
}
