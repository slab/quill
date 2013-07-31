ScribeEditor      = require('./editor')
ScribeAttribution = require('./modules/attribution')
ScribeLinkTooltip = require('./modules/link-tooltip')
ScribeMultiCursor = require('./modules/multi-cursor')
ScribeToolbar     = require('./modules/toolbar')


window.Scribe =
  Attribution : ScribeAttribution
  Editor      : ScribeEditor
  MultiCursor : ScribeMultiCursor
  Toolbar     : ScribeToolbar
