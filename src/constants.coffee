#= require underscore

# Arrays must be alphabetized, so we can use binary search

TandemConstants =
  ALIGN_ATTRIBUTES: [
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

  DEFAULT_LEAF_ATTRIBUTES:
    'font-background' : 'white'
    'font-color'      : 'black'
    'font-family'     : 'san-serif'
    'font-size'       : 'normal'

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

  IGNORE_CLASSES: [
    'tab'
  ]

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

  INDENT_ATTRIBUTES:
    'bullet'  : [0..8]
    'indent'  : [0..8]
    'list'    : [0..8]

  LIST_TAGS: [
    'OL'
    'UL'
  ]

  MAX_INDENT: 9
  MIN_INDENT: 1     # Smallest besides not having an indent at all
  

TandemConstants.LINE_ATTRIBUTES = [].concat(_.keys(TandemConstants.INDENT_ATTRIBUTES), TandemConstants.ALIGN_ATTRIBUTES).sort()

TandemConstants.SPAN_ATTRIBUTES =
  'font-background' : TandemConstants.FONT_BACKGROUNDS
  'font-color'      : TandemConstants.FONT_COLORS
  'font-family'     : TandemConstants.FONT_FAMILIES
  'font-size'       : TandemConstants.FONT_SIZES

# Array of possbile values mostly for consistency with SPAN_ATTRIBUTES, not actually used in codebase
TandemConstants.TAG_ATTRIBUTES =
  'bold'      : [true, false]
  'italic'    : [true, false]
  'link'      : [true, false]     # Link value could actually also be any string representing the href
  'strike'    : [true, false]
  'underline' : [true, false]



window.Tandem ||= {}
window.Tandem.Constants = TandemConstants

