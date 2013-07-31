# Expose scribe internals to unit test

ScribeDebug         = require('./debug')
ScribeDOM           = require('./dom')
ScribeDocument      = require('./document')
ScribeEditor        = require('./editor')
ScribeFormatManager = require('./format-manager')
ScribeFormat        = require('./format')
ScribeKeyboard      = require('./keyboard')
ScribeLeafIterator  = require('./leaf-iterator')
ScribeLeaf          = require('./leaf')
ScribeLine          = require('./line')
ScribeNormalizer    = require('./normalizer')
ScribePasteManager  = require('./paste-manager')
ScribePosition      = require('./position')
ScribeRange         = require('./range')
ScribeRenderer      = require('./renderer')
ScribeSelection     = require('./selection')
ScribeUndoManager   = require('./undo-manager')
ScribeUtils         = require('./utils')

ScribeAttribution   = require('./modules/attribution')
ScribeLinkTooltip   = require('./modules/link-tooltip')
ScribeMultiCursor   = require('./modules/multi-cursor')
ScribeToolbar       = require('./modules/toolbar')


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
