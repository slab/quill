ScribeEditor      = require('./editor')
ScribeAttribution = require('./modules/attribution')
ScribeCursor      = require('./modules/cursor')
ScribeLinkTooltip = require('./modules/link-tooltip')
ScribeToolbar     = require('./modules/toolbar')


window.Scribe =
  Attribution : ScribeAttribution
  Cursor      : ScribeCursor
  Editor      : ScribeEditor
  Toolbar     : ScribeToolbar
