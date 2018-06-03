const desktop = {
  'mac-chrome-latest': ['OS X 10.13', 'chrome', '67.0'],
  'mac-firefox-latest': ['OS X 10.13', 'firefox', '60.0'],
  'mac-safari-latest': ['OS X 10.13', 'safari', '11.1'],
  'mac-chrome-previous': ['OS X 10.12', 'chrome', '66.0'],
  'mac-firefox-previous': ['OS X 10.12', 'firefox', '59.0'],
  'mac-safari-previous': ['OS X 10.12', 'safari', '10.1'],

  'windows-chrome-latest': ['Windows 10', 'chrome', '67.0'],
  'windows-firefox-latest': ['Windows 10', 'firefox', '60.0'],
  'windows-edge-latest': ['Windows 10', 'microsoftedge', '16.16299'],
  'windows-chrome-previous': ['Windows 8.1', 'chrome', '66.0'],
  'windows-firefox-previous': ['Windows 8.1', 'firefox', '59.0'],
  'windows-edge-previous': ['Windows 10', 'microsoftedge', '15.15063'],
};

const mobile = {
  'ios-latest': ['iPhone X Simulator', 'iOS', '11.3', 'Safari'],
  'ios-previous': ['iPhone 7 Plus Simulator', 'iOS', '10.3', 'Safari'],

  'android-latest': ['Android GoogleAPI Emulator', 'Android', '7.1', 'Chrome'],
  'android-previous': [
    'Android GoogleAPI Emulator',
    'Android',
    '6.0',
    'Chrome',
  ],
};

Object.keys(desktop).forEach(key => {
  module.exports[key] = {
    base: 'SauceLabs',
    browserName: desktop[key][1],
    version: desktop[key][2],
    platform: desktop[key][0],
  };
});

Object.keys(mobile).forEach(key => {
  module.exports[key] = {
    base: 'SauceLabs',
    browserName: mobile[key][3],
    appiumVersion: '1.8.1',
    deviceName: mobile[key][0],
    deviceOrientation: 'portrait',
    platformVersion: mobile[key][2],
    platformName: mobile[key][1],
  };
});
