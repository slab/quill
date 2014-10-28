global._ = require('lodash')

Quill = require('../src/quill')

Quill.Delta = require('rich-text').Delta

Quill.Document   = require('../src/core/document')
Quill.Editor     = require('../src/core/editor')
Quill.Format     = require('../src/core/format')
Quill.Leaf       = require('../src/core/leaf')
Quill.Line       = require('../src/core/line')
Quill.Selection  = require('../src/core/selection')

Quill.Lib =
  EventEmitter2 : require('eventemitter2').EventEmitter2
  ColorPicker   : require('../src/lib/color-picker')
  DOM           : require('../src/lib/dom')
  LinkedList    : require('../src/lib/linked-list')
  Normalizer    : require('../src/lib/normalizer')
  Picker        : require('../src/lib/picker')
  Range         : require('../src/lib/range')

Quill.Module =
  Authorship    : require('../src/modules/authorship')
  Keyboard      : require('../src/modules/keyboard')
  ImageTooltip  : require('../src/modules/image-tooltip')
  LinkTooltip   : require('../src/modules/link-tooltip')
  MultiCursor   : require('../src/modules/multi-cursor')
  PasteManager  : require('../src/modules/paste-manager')
  Toolbar       : require('../src/modules/toolbar')
  Tooltip       : require('../src/modules/tooltip')
  UndoManager   : require('../src/modules/undo-manager')

Quill.Theme =
  Base          : require('../src/themes/base')
  Snow          : require('../src/themes/snow')


Quill.DEFAULTS.pollInterval = 10000000


module.exports = Quill
