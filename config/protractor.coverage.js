var _ = require('lodash');
var istanbul = require('istanbul');
var config = require('./protractor.js').config;

config.onPrepare = _.wrap(config.onPrepare, function(onPrepare) {
  onPrepare();
  protractor.collector = new istanbul.Collector();
});

config.onComplete = function() {
  var reporter = new istanbul.Reporter(null, '.coverage/protractor');
  reporter.add('json');
  reporter.write(protractor.collector, false, function() {});
};

exports.config = config;
