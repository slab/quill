ScribeEditor      = require('./src/editor')
ScribeAttribution = require('./src/modules/attribution')
ScribeLinkTooltip = require('./src/modules/link-tooltip')
ScribeMultiCursor = require('./src/modules/multi-cursor')
ScribeToolbar     = require('./src/modules/toolbar')

window.Scribe =
  version     : '0.9.0'
  Attribution : ScribeAttribution
  Editor      : ScribeEditor
  LinkTooltip : ScribeLinkTooltip
  MultiCursor : ScribeMultiCursor
  Toolbar     : ScribeToolbar
