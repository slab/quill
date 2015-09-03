_ = require('lodash')

lastKeyEvent = null    # Workaround for fact we can't dispatch keyboard event via javascript


class Wrapper
  constructor: (@node) ->

  attributes: (attributes) ->
    if attributes
      _.each(attributes, (value, name) =>
        @node.setAttribute(name, value)
      )
      return this
    else
      return {} unless @node.attributes?
      attributes = {}
      for value,i in @node.attributes
        attr = @node.attributes[i]
        attributes[attr.name] = attr.value
      return attributes

  isElement: ->
    return @node?.nodeType == dom.ELEMENT_NODE

  isTextNode: ->
    return @node?.nodeType == dom.TEXT_NODE

  textNodes: ->
    walker = document.createTreeWalker(@node, NodeFilter.SHOW_TEXT, null, false)
    textNodes = []
    while textNode = walker.nextNode()
      textNodes.push(textNode)
    return textNodes

  trigger: (eventName, options = {}) =>
    if ['keypress', 'keydown', 'keyup'].indexOf(eventName) < 0
      event = document.createEvent('Event')
      event.initEvent(eventName, options.bubbles, options.cancelable)
    else
      event = document.createEvent('KeyboardEvent')
      lastKeyEvent = _.clone(options)
      if typeof options.key == 'number'
        lastKeyEvent.which = options.key
      else if typeof options.key == 'string'
        lastKeyEvent.which = options.key.toUpperCase().charCodeAt(0)
      else
        lastKeyEvent.which = 0
      if dom.isIE(10)
        modifiers = []
        modifiers.push('Alt') if options.altKey
        modifiers.push('Control') if options.ctrlKey
        modifiers.push('Meta') if options.metaKey
        modifiers.push('Shift') if options.shiftKey
        event.initKeyboardEvent(eventName, options.bubbles, options.cancelable, window, 0, 0, modifiers.join(' '), null, null)
      else
        # FF uses initKeyEvent, Webkit uses initKeyboardEvent

        initFn = if typeof event.initKeyboardEvent == 'function' then 'initKeyboardEvent' else 'initKeyEvent'
        event[initFn](eventName, options.bubbles, options.cancelable, window, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 0, 0)
    @node.dispatchEvent(event)
    lastKeyEvent = null
    return this


class SelectWrapper extends Wrapper
  default: ->
    return @node.querySelector('option[selected]')

  option: (option, trigger = true) ->
    value = if _.isElement(option) then option.value else option
    if value
      value = value.replace(/[^\w]+/g, '')
      for child,i in @node.children
        if child.value.replace(/[^\w]+/g, '') == value
          @node.selectedIndex = i
          break
    else
      @node.selectedIndex = -1  # PhantomJS
    this.trigger('change') if trigger
    return this

  reset: (trigger = true) ->
    option = this.default()
    if option?
      option.selected = true
    else
      @node.selectedIndex = 0
    this.trigger('change') if trigger
    return this

  value: ->
    return if @node.selectedIndex > -1 then @node.options[@node.selectedIndex].value else ''


dom = (node) ->
  if node?.tagName == 'SELECT'
    return new SelectWrapper(node)
  else
    return new Wrapper(node)


dom = _.extend(dom,
  ELEMENT_NODE: 1
  NOBREAK_SPACE:  "&nbsp;"
  TEXT_NODE: 3
  ZERO_WIDTH_NOBREAK_SPACE:  "\uFEFF"

  DEFAULT_BLOCK_TAG: 'DIV'
  DEFAULT_BREAK_TAG: 'BR'
  DEFAULT_INLINE_TAG: 'SPAN'
  EMBED_TEXT: '!' # No reason we picked ! besides it being one character (so delta cannot split it up)

  FONT_SIZES:
    '10px': 1
    '13px': 2
    '16px': 3
    '18px': 4
    '24px': 5
    '32px': 6
    '48px': 7

  KEYS:
    BACKSPACE : 8
    TAB       : 9
    ENTER     : 13
    ESCAPE    : 27
    LEFT      : 37
    UP        : 38
    RIGHT     : 39
    DOWN      : 40
    DELETE    : 46

  BLOCK_TAGS: {
    'ADDRESS'
    'ARTICLE'
    'ASIDE'
    'AUDIO'
    'BLOCKQUOTE'
    'CANVAS'
    'DD'
    'DIV'
    'DL'
    'FIGCAPTION'
    'FIGURE'
    'FOOTER'
    'FORM'
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6'
    'HEADER'
    'HGROUP'
    'LI'
    'OL'
    'OUTPUT'
    'P'
    'PRE'
    'SECTION'
    'TABLE'
    'TBODY'
    'TD'
    'TFOOT'
    'TH'
    'THEAD'
    'TR'
    'UL'
    'VIDEO'
  }

  EMBED_TAGS: {
    'IMG'
  }

  LINE_TAGS: {
    'DIV'
    'LI'
  }

  LIST_TAGS: {
    'OL'
    'UL'
  }

  VOID_TAGS: {
    'AREA'
    'BASE'
    'BR'
    'COL'
    'COMMAND'
    'EMBED'
    'HR'
    'IMG'
    'INPUT'
    'KEYGEN'
    'LINK'
    'META'
    'PARAM'
    'SOURCE'
    'TRACK'
    'WBR'
  }

  isIE: (maxVersion) ->
    version = document.documentMode
    return version and maxVersion >= version

  isIOS: ->
    return /iPhone|iPad/i.test(navigator.userAgent)

  isMac: ->
    return /Mac/i.test(navigator.platform)
)


module.exports = dom
