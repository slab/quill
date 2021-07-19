const desktop = {
  'mac-chrome-latest': ['macOS 10.15', 'chrome', '80.0'],
  'mac-firefox-latest': ['macOS 10.15', 'firefox', '74.0'],
  'mac-safari-latest': ['macOS 10.15', 'safari', '13.1'],
  'mac-chrome-previous': ['macOS 10.14', 'chrome', '79.0'],
  'mac-firefox-previous': ['macOS 10.14', 'firefox', '73.0'],
  'mac-safari-previous': ['macOS 10.14', 'safari', '12.0'],

  'windows-chrome-latest': ['Windows 10', 'chrome', '80.0'],
  'windows-firefox-latest': ['Windows 10', 'firefox', '74.0'],
  'windows-edge-latest': ['Windows 10', 'microsoftedge', '80.0'],
  'windows-chrome-previous': ['Windows 8.1', 'chrome', '79.0'],
  'windows-firefox-previous': ['Windows 8.1', 'firefox', '74.0'],
  'windows-edge-previous': ['Windows 10', 'microsoftedge', '79.0'],
};

const mobile = {
  'ios-latest': ['iPhone 11 Simulator', 'iOS', '13.2', 'Safari'],
  'ios-previous': ['iPhone X Simulator', 'iOS', '12.4', 'Safari'],

  'android-latest': ['Android GoogleAPI Emulator', 'Android', '10.0', 'Chrome'],
  'android-previous': [
    'Android GoogleAPI Emulator',
    'Android',
    '9.0',
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
    appiumVersion: '1.16.0',
    deviceName: mobile[key][0],
    deviceOrientation: 'portrait',
    platformVersion: mobile[key][2],
    platformName: mobile[key][1],
  };
});
