_ = require('lodash')

lastKeyEvent = null    # Workaround for fact we can't dispatch keyboard event via javascript


class Wrapper
  constructor: (@node) ->

  addClass: (cssClass) ->
    return if this.hasClass(cssClass)
    if @node.classList?
      @node.classList.add(cssClass)
    else if @node.className?
      @node.className = (@node.className + ' ' + cssClass).trim()
    return this

  addEventListener: (eventName, listener) ->
    @node.addEventListener(eventName, (event) ->
      arg = if lastKeyEvent and (eventName == 'keydown' or eventName == 'keyup') then lastKeyEvent else event
      propogate = listener(arg)
      unless propogate
        event.preventDefault()
        event.stopPropagation()
      return propogate
    )
    return this

  addStyles: (styles) ->
    styles = _.defaults(styles, this.getStyles())
    this.setStyles(styles)
    return this

  clearAttributes: (exception = []) ->
    exception = [exception] if _.isString(exception)
    _.each(this.attributes(), (value, name) =>
      @node.removeAttribute(name) unless _.indexOf(exception, name) > -1
    )
    return this

  get: ->
    return @node

  attributes: (attributes) ->
    if attributes
      # add attributes
      _.each(attributes, (value, name) =>
        @node.setAttribute(name, value)
      )
      return this
    else
      # get attributes
      return {} unless @node.attributes?
      attributes = {}
      for value,i in @node.attributes
        attr = @node.attributes[i]
        attributes[attr.name] = attr.value
      return attributes

  getChildAtOffset: (offset) ->
    child = @node.firstChild
    length = dom(child).getNodeLength()
    while child?
      break if offset < length
      offset -= length
      child = child.nextSibling
      length = dom(child).getNodeLength()
    unless child?
      child = @node.lastChild
      offset = dom(child).getNodeLength()
    return [child, offset]

  getChildNodes: ->
    return _.map(@node.childNodes)

  getChildren: ->
    return _.map(@node.children)

  getDescendants: ->
    return _.map(@node.getElementsByTagName('*'))

  getClasses: ->
    return @node.className.split(/\s+/)

  getDefaultOption: ->
    return @node.querySelector('option[selected]')

  getNextLineNode: (root) ->
    nextNode = @node.nextSibling
    if !nextNode? and @node.parentNode != root
      nextNode = @node.parentNode.nextSibling
    if nextNode? and dom.LIST_TAGS[nextNode.tagName]?
      nextNode = nextNode.firstChild
    return nextNode

  getNodeLength: ->
    return 0 unless @node?
    length = this.getText().length
    if this.isElement()
      length += @node.querySelectorAll(_.keys(dom.EMBED_TAGS).join(',')).length
    return length

  getSelectValue: ->
    return if @node.selectedIndex > -1 then @node.options[@node.selectedIndex].value else ''

  getStyles: ->
    styleString = @node.getAttribute('style') or ''
    obj = _.reduce(styleString.split(';'), (styles, str) ->
      [name, value] = str.split(':')
      if name and value
        name = name.trim()
        value = value.trim()
        styles[name.toLowerCase()] = value
      return styles
    , {})
    return obj

  getText: ->
    switch @node.nodeType
      when dom.ELEMENT_NODE
        return "" if @node.tagName == dom.DEFAULT_BREAK_TAG
        return dom.EMBED_TEXT if dom.EMBED_TAGS[@node.tagName]?
        return @node.textContent if @node.textContent?
        return ""
      when dom.TEXT_NODE then return @node.data or ""
      else return ""

  getTextNodes: ->
    walker = @node.ownerDocument.createTreeWalker(@node, NodeFilter.SHOW_TEXT, null, false)
    textNodes = []
    while textNode = walker.nextNode()
      textNodes.push(textNode)
    return textNodes

  getWindow: ->
    return @node.ownerDocument.defaultView or @node.ownerDocument.parentWindow

  hasClass: (cssClass) ->
    if @node.classList?
      return @node.classList.contains(cssClass)
    else if @node.className?
      return _.indexOf(this.getClasses(), cssClass) > -1
    return false

  isElement: ->
    return @node?.nodeType == dom.ELEMENT_NODE

  isTextNode: ->
    return @node?.nodeType == dom.TEXT_NODE

  mergeNodes: (node) ->
    $node = dom(node)
    if this.isElement()
      $node.moveChildren(@node)
      this.normalize()
    else
      this.setText(this.getText() + $node.getText())
    $node.removeNode()
    return this

  moveChildren: (newParent) ->
    _.each(this.getChildNodes(), (child) ->
      newParent.appendChild(child)
    )
    return this

  # IE normalize is broken
  normalize: ->
    curNode = @node.firstChild
    while curNode?
      nextNode = curNode.nextSibling
      $node = dom(curNode)
      if dom(nextNode).isTextNode()
        if $node.getText().length == 0
          $node.removeNode()
        else if $node.isTextNode()
          followingNode = nextNode.nextSibling
          $node.mergeNodes(nextNode)
          nextNode = followingNode
      curNode = nextNode
    return this

  removeClass: (cssClass) ->
    return unless this.hasClass(cssClass)
    if @node.classList?
      return @node.classList.remove(cssClass)
    else if @node.className?
      classArray = this.getClasses()
      classArray.splice(_.indexOf(classArray, cssClass), 1)
      @node.className = classArray.join(' ')
    return this

  removeNode: ->
    @node.parentNode?.removeChild(@node)
    @node = null
    return null

  replaceNode: (newNode) ->
    @node.parentNode.replaceChild(newNode, @node)
    @node = newNode
    return newNode

  resetSelect: (trigger = true) ->
    option = this.getDefaultOption()
    if option?
      option.selected = true
    else
      @node.selectedIndex = 0
    this.triggerEvent('change') if trigger
    return this

  selectOption: (option, trigger = true) ->
    value = if _.isElement(option) then option.value else option
    if value
      @node.value = value
    else
      @node.selectedIndex = -1  # PhantomJS
    this.triggerEvent('change') if trigger
    return this

  setStyles: (styles) ->
    styleString = _.map(styles, (style, name) ->
      return "#{name}: #{style}"
    ).join('; ') + ';'
    @node.setAttribute('style', styleString)
    return this

  setText: (text) ->
    switch @node.nodeType
      when dom.ELEMENT_NODE
        @node.textContent = text
      when dom.TEXT_NODE then @node.data = text
      else return # Noop
    return this

  # @node is node after split point, root is parent of eldest node we want split (root will not be split)
  splitAncestors: (root, force = false) ->
    return this if @node == root or @node.parentNode == root
    if @node.previousSibling? or force
      parentNode = @node.parentNode
      parentClone = parentNode.cloneNode(false)
      parentNode.parentNode.insertBefore(parentClone, parentNode.nextSibling)
      refNode = @node
      while refNode?
        nextNode = refNode.nextSibling
        parentClone.appendChild(refNode)
        refNode = nextNode
      return dom(parentClone).splitAncestors(root)
    else
      return dom(@node.parentNode).splitAncestors(root)

  splitNode: (offset, force = false) ->
    # Check if split necessary
    nodeLength = this.getNodeLength()
    offset = Math.max(0, offset)
    offset = Math.min(offset, nodeLength)
    return [@node.previousSibling, @node, false] unless force or offset != 0
    return [@node, @node.nextSibling, false] unless force or offset != nodeLength
    if @node.nodeType == dom.TEXT_NODE
      after = @node.splitText(offset)
      return [@node, after, true]
    else
      left = @node
      right = @node.cloneNode(false)
      @node.parentNode.insertBefore(right, left.nextSibling)
      [child, offset] = this.getChildAtOffset(offset)
      [childLeft, childRight] = dom(child).splitNode(offset)
      while childRight != null
        nextRight = childRight.nextSibling
        right.appendChild(childRight)
        childRight = nextRight
      return [left, right, true]

  switchTag: (newTag) ->
    newTag = newTag.toUpperCase()
    return this if @node.tagName == newTag
    newNode = @node.ownerDocument.createElement(newTag)
    attributes = this.attributes()
    this.moveChildren(newNode) unless dom.VOID_TAGS[newTag]?
    this.replaceNode(newNode)
    return this.attributes(attributes).get()

  toggleClass: (className, state) ->
    state = !this.hasClass(className) unless state?
    if state
      this.addClass(className)
    else
      this.removeClass(className)

  triggerEvent: (eventName, options = {}) =>
    if _.indexOf(['keypress', 'keydown', 'keyup'], eventName) < 0
      event = @node.ownerDocument.createEvent('Event')
      event.initEvent(eventName, options.bubbles, options.cancelable)
    else
      event = @node.ownerDocument.createEvent('KeyboardEvent')
      lastKeyEvent = _.clone(options)
      if _.isNumber(options.key)
        lastKeyEvent.which = options.key
      else if _.isString(options.key)
        lastKeyEvent.which = options.key.toUpperCase().charCodeAt(0)
      else
        lastKeyEvent.which = 0
      if dom.isIE(10)
        modifiers = []
        modifiers.push('Alt') if options.altKey
        modifiers.push('Control') if options.ctrlKey
        modifiers.push('Meta') if options.metaKey
        modifiers.push('Shift') if options.shiftKey
        event.initKeyboardEvent(eventName, options.bubbles, options.cancelable, @node.ownerDocument.defaultView.window, 0, 0, modifiers.join(' '), null, null)
      else
        # FF uses initKeyEvent, Webkit uses initKeyboardEvent
        initFn = if _.isFunction(event.initKeyboardEvent) then 'initKeyboardEvent' else 'initKeyEvent'
        event[initFn](eventName, options.bubbles, options.cancelable, @node.ownerDocument.defaultView.window, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 0, 0)
    @node.dispatchEvent(event)
    lastKeyEvent = null

  unwrap: ->
    ret = @node.firstChild
    next = @node.nextSibling
    _.each(this.getChildNodes(), (child) =>
      @node.parentNode.insertBefore(child, next)
    )
    this.removeNode()
    return ret

  wrap: (wrapper) ->
    @node.parentNode.insertBefore(wrapper, @node) if @node.parentNode?
    parent = wrapper
    while parent.firstChild?
      parent = wrapper.firstChild
    parent.appendChild(@node)
    return this


dom = (node) ->
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

  convertFontSize: (size) ->
    if _.isString(size) and size.indexOf('px') > -1
      sources = _.keys(dom.FONT_SIZES)
      targets = _.values(dom.FONT_SIZES)
    else
      targets = _.keys(dom.FONT_SIZES)
      sources = _.values(dom.FONT_SIZES)
    for i,s of sources
      return targets[i] if parseInt(size) <= parseInt(s)
    return _.last(targets)

  isIE: (maxVersion) ->
    version = document.documentMode
    return version and maxVersion >= version

  isIOS: ->
    return /iPhone|iPad/i.test(navigator.userAgent)
)


module.exports = dom
