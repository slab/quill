const _ = require('lodash');
const os = require('os');

if (process.env.CI) {
  module.exports = {
    build: process.env.GITHUB_RUN_ID,
    tunnel: process.env.GITHUB_RUN_NUMBER,
  };
} else {
  const id = _.random(16 * 16 * 16 * 16).toString(16);
  module.exports = {
    build: `${os.hostname()}-${id}`,
    tunnel: `${os.hostname()}-tunnel-${id}`,
  };
}
