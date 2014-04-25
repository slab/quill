Quill = require('../src/quill')

Quill.Document   = require('../src/document')
Quill.DOM        = require('../src/dom')
Quill.Editor     = require('../src/editor')
Quill.Format     = require('../src/format')
Quill.Leaf       = require('../src/leaf')
Quill.Line       = require('../src/line')
Quill.Normalizer = require('../src/normalizer')
Quill.Renderer   = require('../src/renderer')
Quill.Selection  = require('../src/selection')
Quill.Utils      = require('../src/utils')

Quill.Lib =
  EventEmitter2 : require('eventemitter2').EventEmitter2
  Range         : require('../src/lib/range')
  LinkedList    : require('../src/lib/linked-list')

Quill.Module =
  Authorship    : require('../src/modules/authorship')
  Keyboard      : require('../src/modules/keyboard')
  LinkTooltip   : require('../src/modules/link-tooltip')
  MultiCursor   : require('../src/modules/multi-cursor')
  PasteManager  : require('../src/modules/paste-manager')
  Toolbar       : require('../src/modules/toolbar')
  UndoManager   : require('../src/modules/undo-manager')

Quill.Theme =
  Default       : require('../src/themes/default')
  Snow          : require('../src/themes/snow')


Quill.DEFAULTS.pollInterval = 10000000


module.exports = Quill
