pkg                 = require('./package.json')
ScribeEditor        = require('./src/editor')
ScribeDefaultTheme  = require('./src/themes/default')
ScribeSnowTheme     = require('./src/themes/snow')

window.Scribe =
  version : pkg.version
  Editor  : ScribeEditor
  Themes  :
    Default : ScribeDefaultTheme
    Snow    : ScribeSnowTheme
