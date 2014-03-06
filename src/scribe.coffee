pkg                 = require('../package.json')
ScribeEditor        = require('./editor')
ScribeDefaultTheme  = require('./themes/default')
ScribeSnowTheme     = require('./themes/snow')

module.exports =
  version : pkg.version
  Editor  : ScribeEditor
  Themes  :
    Default : ScribeDefaultTheme
    Snow    : ScribeSnowTheme
