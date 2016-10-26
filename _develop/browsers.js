var desktop = {
  'mac-chrome-latest'       : ['Mac 10.11', 'chrome', '53.0'],
  'mac-firefox-latest'      : ['Mac 10.11', 'firefox', '47.0'],
  'mac-safari-latest'       : ['Mac 10.11', 'safari', '9.0'],
  'mac-chrome-previous'     : ['Mac 10.10', 'chrome', '52.0'],
  'mac-firefox-previous'    : ['Mac 10.10', 'firefox', '46.0'],
  'mac-safari-previous'     : ['Mac 10.10', 'safari', '8.0'],

  'windows-chrome-latest'   : ['Windows 10', 'chrome', '53.0'],
  'windows-firefox-latest'  : ['Windows 10', 'firefox', '47.0'],
  'windows-edge-latest'     : ['Windows 10', 'microsoftedge', '13.10586'],
  'windows-ie-latest'       : ['Windows 8.1', 'internet explorer', '11.0'],
  'windows-chrome-previous' : ['Windows 8.1', 'chrome', '52.0'],
  'windows-firefox-previous': ['Windows 8.1', 'firefox', '46.0'],

  'linux-chrome-latest'     : ['Linux', 'chrome', '48.0'],
  'linux-firefox-latest'    : ['Linux', 'firefox', '45.0'],
  'linux-chrome-previous'   : ['Linux', 'chrome', '47.0'],
  'linux-firefox-previous'  : ['Linux', 'firefox', '44.0']
};

var mobile = {
  'ios-latest'        : ['iPhone 6 Plus', 'iOS', '9.3', 'Safari'],
  'ios-previous'      : ['iPhone 6 Plus', 'iOS', '9.2', 'Safari'],

  'android-latest'    : ['Android Emulator', 'Android', '5.1', 'Browser'],
  'android-previous'  : ['Android Emulator', 'Android', '5.0', 'Browser']
};

Object.keys(desktop).forEach(function(key) {
  module.exports[key] = {
    base: 'SauceLabs',
    browserName: desktop[key][1],
    version: desktop[key][2],
    platform: desktop[key][0]
  };
});

Object.keys(mobile).forEach(function(key) {
  module.exports[key] = {
    base: 'SauceLabs',
    browserName: mobile[key][3],
    appiumVersion: '1.5.3',
    deviceName: mobile[key][0],
    deviceOrientation: 'portrait',
    platformVersion: mobile[key][2],
    platformName: mobile[key][1]
  };
});
