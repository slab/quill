var CHROME_VERSION = '38';
var FIREFOX_VERSION = '33';
var SAFARI_VERSION = '7';
var IOS_VERSION = ' 8.0';       // Workaround for optimist converting to float
var ANDROID_VERSION = ' 4.4';

var browsers = {
  'mac-chrome'  : ['Mac 10.9', 'chrome', CHROME_VERSION],
  'mac-firefox' : ['Mac 10.9', 'firefox', FIREFOX_VERSION],
  'mac-safari'  : ['Mac 10.9', 'safari', SAFARI_VERSION],

  'windows-chrome'  : ['Windows 8.1', 'chrome', CHROME_VERSION],
  'windows-firefox' : ['Windows 8.1', 'firefox', FIREFOX_VERSION],
  'windows-ie-11'   : ['Windows 8.1', 'internet explorer', '11'],

  'windows-ie-10'   : ['Windows 7', 'internet explorer', '10'],
  'windows-ie-9'    : ['Windows 7', 'internet explorer', '9'],

  'linux-chrome'    : ['Linux', 'chrome', CHROME_VERSION],
  'linux-firefox'   : ['Linux', 'firefox', FIREFOX_VERSION],

  'iphone'  : ['Mac 10.9', 'iphone', IOS_VERSION],
  'ipad'    : ['Mac 10.9', 'ipad', IOS_VERSION],
  'android' : ['Linux', 'android', ANDROID_VERSION]
};

module.exports = browsers;
