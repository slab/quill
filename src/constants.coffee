# Arrays must be alphabetized, so we can use binary search

TandemConstants =
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

  # Missing rule implied removal
  LINE_RULES: {
    'A'         : {rename: 'span'}
    'B'         : {}
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
    'S'         : {}
    'SMALL'     : {rename: 'span'}
    'SPAN'      : {}
    'STRIKE'    : {rename: 's'}
    'STRONG'    : {rename: 'b'}
    'U'         : {}
  }

  FONT_BACKGROUNDS: [
    'bg-black'
    'bg-blue'
    'bg-green'
    'bg-orange'
    'bg-purple'
    'bg-red'
    'bg-white'
    'bg-yellow'
  ]

  FONT_COLORS: [
    'color-black'
    'color-blue'
    'color-green'
    'color-orange'
    'color-red'
    'color-white'
    'color-yellow'
  ]

  FONT_FAMILIES: [
    'font-monospace'
    'font-serif'
  ]

  FONT_SIZES: [
    'font-huge'
    'font-large'
    'font-small'
  ]

  SPAN_ATTRIBUTES: [
    'font-background'
    'font-color'
    'font-family'
    'font-size'
  ]



window.Tandem ||= {}
window.Tandem.Constants = TandemConstants

