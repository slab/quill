# Expose scribe internals to unit test

ScribeDebug         = require('../../src/debug')
ScribeDOM           = require('../../src/dom')
ScribeDocument      = require('../../src/document')
ScribeEditor        = require('../../src/editor')
ScribeFormatManager = require('../../src/format-manager')
ScribeFormat        = require('../../src/format')
ScribeKeyboard      = require('../../src/keyboard')
ScribeLeafIterator  = require('../../src/leaf-iterator')
ScribeLeaf          = require('../../src/leaf')
ScribeLine          = require('../../src/line')
ScribeNormalizer    = require('../../src/normalizer')
ScribePasteManager  = require('../../src/paste-manager')
ScribePosition      = require('../../src/position')
ScribeRange         = require('../../src/range')
ScribeRenderer      = require('../../src/renderer')
ScribeSelection     = require('../../src/selection')
ScribeUndoManager   = require('../../src/undo-manager')
ScribeUtils         = require('../../src/utils')
ScribeAttribution   = require('../../src/modules/attribution')
ScribeLinkTooltip   = require('../../src/modules/link-tooltip')
ScribeMultiCursor   = require('../../src/modules/multi-cursor')
ScribeToolbar       = require('../../src/modules/toolbar')


window.Scribe =
  Debug         : ScribeDebug
  DOM           : ScribeDOM
  Document      : ScribeDocument
  Editor        : ScribeEditor
  FormatManager : ScribeFormatManager
  Format        : ScribeFormat
  Keyboard      : ScribeKeyboard
  LeafIterator  : ScribeLeafIterator
  Leaf          : ScribeLeaf
  Line          : ScribeLine
  Normalizer    : ScribeNormalizer
  PasteManager  : ScribePasteManager
  Position      : ScribePosition
  Range         : ScribeRange
  Renderer      : ScribeRenderer
  Selection     : ScribeSelection
  UndoManager   : ScribeUndoManager
  Utils         : ScribeUtils

  Attribution   : ScribeAttribution
  MultiCursor   : ScribeMultiCursor
  LinkTooltip   : ScribeLinkTooltip
  Toolbar       : ScribeToolbar
