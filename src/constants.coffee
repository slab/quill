Scribe = require('./scribe')
# Arrays must be alphabetized, so we can use binary search

Scribe.Constants =
  DEFAULT_LEAF_FORMATS:
    'background' : 'white'
    'color'      : 'black'
    'family'     : 'san-serif'
    'size'       : 'normal'

  FONT_BACKGROUNDS: [
    'black'
    'blue'
    'green'
    'orange'
    'purple'
    'red'
    'white'
    'yellow'
  ]

  FONT_COLORS: [
    'black'
    'blue'
    'green'
    'orange'
    'red'
    'white'
    'yellow'
  ]

  FONT_FAMILIES: [
    'monospace'
    'serif'
  ]

  FONT_SIZES: [
    'huge'
    'large'
    'small'
  ]

  INDENT_FORMATS:
    'bullet'  : [0..8]
    'indent'  : [0..8]
    'list'    : [0..8]

  # Missing rule implies removal
  LINE_RULES: {
    'A'         : {}
    'B'         : {}
    'BR'        : {}
    'BIG'       : {rename: 'span'}
    'CENTER'    : {rename: 'span'}
    'DEL'       : {rename: 's'}
    'EM'        : {rename: 'i'}
    'H1'        : {rename: 'div'}
    'H2'        : {rename: 'div'}
    'H3'        : {rename: 'div'}
    'H4'        : {rename: 'div'}
    'H5'        : {rename: 'div'}
    'H6'        : {rename: 'div'}
    'I'         : {}
    'INS'       : {rename: 'span'}
    'LI'        : {}
    'OL'        : {}
    'S'         : {}
    'SMALL'     : {rename: 'span'}
    'SPAN'      : {}
    'STRIKE'    : {rename: 's'}
    'STRONG'    : {rename: 'b'}
    'U'         : {}
    'UL'        : {}
  }

  LIST_TAGS: [
    'OL'
    'UL'
  ]

  MAX_INDENT: 9
  MIN_INDENT: 1     # Smallest besides not having an indent at all

  NOBREAK_SPACE: "\uFEFF"

  SPECIAL_CLASSES:
    EXTERNAL: 'ext'
  

Scribe.Constants.SPAN_FORMATS =
  'background' : Scribe.Constants.FONT_BACKGROUNDS
  'color'      : Scribe.Constants.FONT_COLORS
  'family'     : Scribe.Constants.FONT_FAMILIES
  'size'       : Scribe.Constants.FONT_SIZES

# Array of possbile values mostly for consistency with SPAN_FORMATS, not actually used in codebase
Scribe.Constants.TAG_FORMATS =
  'bold'      : [true, false]
  'italic'    : [true, false]
  'link'      : [true, false]     # Link value could actually also be any string representing the href
  'strike'    : [true, false]
  'underline' : [true, false]

Scribe.Constants.LEAF_FORMATS = _.extend({}, Scribe.Constants.SPAN_FORMATS, Scribe.Constants.TAG_FORMATS)


module.exports = Scribe
