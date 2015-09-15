var CHROME_VERSION = '45';
var FIREFOX_VERSION = '40';
var SAFARI_VERSION = '8.1';
var IOS_VERSION = ' 9.0';       // Workaround for optimist converting to float
var ANDROID_VERSION = ' 5.1';

var browsers = {
  'mac-chrome'  : ['Mac 10.11', 'chrome', CHROME_VERSION],
  'mac-firefox' : ['Mac 10.11', 'firefox', FIREFOX_VERSION],
  'mac-safari'  : ['Mac 10.11', 'safari', SAFARI_VERSION],

  'windows-chrome'  : ['Windows 10', 'chrome', CHROME_VERSION],
  'windows-firefox' : ['Windows 10', 'firefox', FIREFOX_VERSION],
  'windows-ms-edge' : ['Windows 10', 'microsoftedge', '20.10240'],
  'windows-ie-11'   : ['Windows 8.1', 'internet explorer', '11'],
  // 'windows-ie-10'   : ['Windows 8', 'internet explorer', '10'],

  'linux-chrome'    : ['Linux', 'chrome', CHROME_VERSION],
  'linux-firefox'   : ['Linux', 'firefox', FIREFOX_VERSION],

  'iphone'  : ['Mac 10.10', 'iphone', IOS_VERSION],
  'ipad'    : ['Mac 10.10', 'ipad', IOS_VERSION],
  'android' : ['Linux', 'android', ANDROID_VERSION]
};

module.exports = browsers;
