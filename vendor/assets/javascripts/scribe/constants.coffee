# Arrays must be alphabetized, so we can use binary search

ScribeConstants =
  ALIGN_FORMATS: [
    'center'
    'justify'
    'left'
    'right'
  ]

  BLOCK_TAGS: [
    'ADDRESS'
    'BLOCKQUOTE'
    'DD'
    'DIV'
    'DL'
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6'
    'LI'
    'OL'
    'P'
    'PRE'
    'TABLE'
    'TBODY'
    'TD'
    'TFOOT'
    'TH'
    'THEAD'
    'TR'
    'UL'
  ]

  BREAK_TAGS: [
    'BR'
    'HR'
  ]

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
    'H1'        : {rename: 'span'}
    'H2'        : {rename: 'span'}
    'H3'        : {rename: 'span'}
    'H4'        : {rename: 'span'}
    'H5'        : {rename: 'span'}
    'H6'        : {rename: 'span'}
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
    ATOMIC: 'atom'
    EXTERNAL: 'ext'
  

ScribeConstants.LINE_FORMATS = _.extend({}, ScribeConstants.INDENT_FORMATS, ScribeConstants.ALIGN_FORMATS)

ScribeConstants.SPAN_FORMATS =
  'background' : ScribeConstants.FONT_BACKGROUNDS
  'color'      : ScribeConstants.FONT_COLORS
  'family'     : ScribeConstants.FONT_FAMILIES
  'size'       : ScribeConstants.FONT_SIZES

# Array of possbile values mostly for consistency with SPAN_FORMATS, not actually used in codebase
ScribeConstants.TAG_FORMATS =
  'bold'      : [true, false]
  'italic'    : [true, false]
  'link'      : [true, false]     # Link value could actually also be any string representing the href
  'strike'    : [true, false]
  'underline' : [true, false]

ScribeConstants.LEAF_FORMATS = _.extend({}, ScribeConstants.SPAN_FORMATS, ScribeConstants.TAG_FORMATS)


window.Scribe or= {}
window.Scribe.Constants = ScribeConstants
