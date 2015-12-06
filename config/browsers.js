var CHROME_VERSION = '46';
var FIREFOX_VERSION = '41';
var SAFARI_VERSION = '9';
var IOS_VERSION = '9.1';      // Add space prefix when decimal is 0
var ANDROID_VERSION = '5.1';  // Workaround for optimist converting to float

var browsers = {
  'mac-chrome'  : ['Mac 10.11', 'chrome', CHROME_VERSION],
  'mac-firefox' : ['Mac 10.11', 'firefox', FIREFOX_VERSION],
  'mac-safari'  : ['Mac 10.11', 'safari', SAFARI_VERSION],

  'windows-chrome'  : ['Windows 10', 'chrome', CHROME_VERSION],
  'windows-firefox' : ['Windows 10', 'firefox', FIREFOX_VERSION],
  'windows-ms-edge' : ['Windows 10', 'microsoftedge', '20.10240'],
  'windows-ie-11'   : ['Windows 8.1', 'internet explorer', '11'],

  'linux-chrome'    : ['Linux', 'chrome', CHROME_VERSION],
  'linux-firefox'   : ['Linux', 'firefox', FIREFOX_VERSION],

  'iphone'  : ['Mac 10.10', 'iphone', IOS_VERSION],
  'ipad'    : ['Mac 10.10', 'ipad', IOS_VERSION],
  'android' : ['Linux', 'android', ANDROID_VERSION]
};

module.exports = browsers;
