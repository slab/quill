const desktop = {
  'mac-chrome-latest': ['macOS 12', 'chrome', 'latest'],
  'mac-firefox-latest': ['macOS 12', 'firefox', 'latest'],
  'mac-safari-latest': ['macOS 12', 'safari', '16'],
  'mac-chrome-previous': ['macOS 11', 'chrome', 'latest-1'],
  'mac-firefox-previous': ['macOS 11', 'firefox', 'latest-1'],
  'mac-safari-previous': ['macOS 11', 'safari', '14'],

  'windows-chrome-latest': ['Windows 11', 'chrome', 'latest'],
  'windows-firefox-latest': ['Windows 11', 'firefox', 'latest'],
  'windows-edge-latest': ['Windows 11', 'microsoftedge', 'latest'],
  'windows-chrome-previous': ['Windows 10', 'chrome', 'latest-1'],
  'windows-firefox-previous': ['Windows 10', 'firefox', 'latest-1'],
  'windows-edge-previous': ['Windows 10', 'microsoftedge', 'latest-1'],
};

const mobile = {
  'ios-latest': ['iPhone 11 Simulator', 'iOS', '15.5', 'Safari'],
  'ios-previous': ['iPhone X Simulator', 'iOS', '14.5', 'Safari'],

  'android-latest': ['Android GoogleAPI Emulator', 'Android', '13.0', 'Chrome'],
  'android-previous': [
    'Android GoogleAPI Emulator',
    'Android',
    '12.0',
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
    appiumVersion: '1.22.3',
    deviceName: mobile[key][0],
    deviceOrientation: 'portrait',
    platformVersion: mobile[key][2],
    platformName: mobile[key][1],
  };
});
