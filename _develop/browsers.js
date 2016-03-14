var _ = require('lodash');


var desktop = {
  'chrome': {
    '48.0': ['Mac 10.11', 'Windows 10', 'Linux'],
    '47.0': ['Mac 10.10', 'Windows 8.1', 'Linux']
  },
  'firefox': {
    '44.0': ['Mac 10.11', 'Windows 10', 'Linux'],
    '43.0': ['Mac 10.10', 'Windows 8.1', 'Linux']
  },
  'safari': {
    '9.0': ['Mac 10.11'],
    '8.0': ['Mac 10.10']
  },
  'internet explorer': {
    '11.0': ['Windows 8.1']
  },
  'microsoftedge': {
    '20.10240': ['Windows 10']
  }
};

var mobile = {
  'iOS': {
    '9.2': ['iPhone 6 Plus', 'Safari'],
    '9.1': ['iPhone 6 Plus', 'Safari']
  },
  'Android': {
    '5.1': ['Android Emulator', 'Browser'],
    '5.0': ['Android Emulator', 'Browser']
  }
};

var desktopCapabilities = _.forEach(desktop, function(config, browser) {
  _.forEach(_.keys(config), function(version, i) {
    var descriptor = i === 0 ? 'latest' : 'previous';
    _.forEach(config[version], function(platform) {
      var key = _.kebabCase([platform.split(' ')[0], browser, descriptor].join('-').toLowerCase());
      module.exports[key] = {
        base: 'SauceLabs',
        browserName: browser,
        version: version,
        platform: platform
      }
    });
  });
});

var mobileCapabilities = _.forEach(mobile, function(config, platform) {
  _.forEach(Object.keys(config), function(version, i) {
    var device = config[version][0], browser = config[version][1];
    var descriptor = i === 0 ? 'latest' : 'previous';
    var key = _.kebabCase([platform, descriptor].join('-').toLowerCase());
    module.exports[key] = {
      base: 'SauceLabs',
      browserName: browser,
      appiumVersion: '1.5.0',
      deviceName: device,
      deviceOrientation: 'portrait',
      platformVersion: version,
      platformName: platform
    };
  });
});
