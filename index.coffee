ScribeDOM           = require('./src/dom')
ScribeEditor        = require('./src/editor')
ScribeAttribution   = require('./src/modules/attribution')
ScribeLinkTooltip   = require('./src/modules/link-tooltip')
ScribeMultiCursor   = require('./src/modules/multi-cursor')
ScribeToolbar       = require('./src/modules/toolbar')
ScribeDefaultTheme  = require('./src/themes/default')

window.Scribe =
  version : '0.9.2'
  DOM     : ScribeDOM
  Editor  : ScribeEditor
  Modules :
    Attribution : ScribeAttribution
    LinkTooltip : ScribeLinkTooltip
    MultiCursor : ScribeMultiCursor
    Toolbar     : ScribeToolbar
  Themes  :
    Default     : ScribeDefaultTheme
