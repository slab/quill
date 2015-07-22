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

  child: (offset) ->
    child = @node.firstChild
    length = dom(child).length()
    while child?
      break if offset < length
      offset -= length
      child = child.nextSibling
      length = dom(child).length()
    unless child?
      child = @node.lastChild
      offset = dom(child).length()
    return [child, offset]

  childNodes: ->
    return _.map(@node.childNodes)

  classes: ->
    return @node.className.split(/\s+/)

  data: (key, value) ->
    if value?
      @node['ql-data'] = {} unless @node['ql-data']?
      @node['ql-data'][key] = value
      return this
    else
      return @node['ql-data']?[key]

  descendants: ->
    return _.map(@node.getElementsByTagName('*'))

  get: ->
    return @node

  hasClass: (cssClass) ->
    if @node.classList?
      return @node.classList.contains(cssClass)
    else if @node.className?
      return this.classes().indexOf(cssClass) > -1
    return false

  isAncestor: (ancestor, inclusive = false) ->
    return inclusive if ancestor == @node
    node = @node
    while node
      return true if node == ancestor
      node = node.parentNode
    return false

  isElement: ->
    return @node?.nodeType == dom.ELEMENT_NODE

  isTextNode: ->
    return @node?.nodeType == dom.TEXT_NODE

  isolate: (root) ->
    dom(@node.nextSibling).splitBefore(root) if @node.nextSibling?
    this.splitBefore(root)
    return this

  length: ->
    return 0 unless @node?
    length = this.text().length
    if this.isElement()
      length += @node.querySelectorAll(Object.keys(dom.EMBED_TAGS).join(',')).length
    return length

  merge: (node) ->
    $node = dom(node)
    if this.isElement()
      $node.moveChildren(@node)
      this.normalize()
    else
      this.text(this.text() + $node.text())
    $node.remove()
    return this

  moveChildren: (newParent) ->
    _.each(this.childNodes(), (child) ->
      newParent.appendChild(child)
    )
    return this

  nextLineNode: (root) ->
    nextNode = @node.nextSibling
    if !nextNode? and @node.parentNode != root
      nextNode = @node.parentNode.nextSibling
    if nextNode? and dom.LIST_TAGS[nextNode.tagName]?
      nextNode = nextNode.firstChild
    return nextNode

  # IE normalize is broken
  normalize: ->
    curNode = @node.firstChild
    while curNode?
      nextNode = curNode.nextSibling
      $node = dom(curNode)
      if nextNode? and dom(nextNode).isTextNode()
        if $node.text().length == 0
          $node.remove()
        else if $node.isTextNode()
          followingNode = nextNode.nextSibling
          $node.merge(nextNode)
          nextNode = followingNode
      curNode = nextNode
    return this

  on: (eventName, listener) ->
    @node.addEventListener(eventName, (event) =>
      arg = if lastKeyEvent and (eventName == 'keydown' or eventName == 'keyup') then lastKeyEvent else event
      propagate = listener.call(@node, arg) # Native addEventListener binds this to event target
      unless propagate
        event.preventDefault()
        event.stopPropagation()
      return propagate
    )
    return this

  remove: ->
    @node.parentNode?.removeChild(@node)
    @node = null
    return null

  removeClass: (cssClass) ->
    return unless this.hasClass(cssClass)
    if @node.classList?
      @node.classList.remove(cssClass)
    else if @node.className?
      classArray = this.classes()
      classArray.splice(classArray.indexOf(cssClass), 1)
      @node.className = classArray.join(' ')
    @node.removeAttribute('class') unless @node.getAttribute('class')
    return this

  replace: (newNode) ->
    @node.parentNode.replaceChild(newNode, @node)
    @node = newNode
    return this

  splitBefore: (root, force = false) ->
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
      return dom(parentClone).splitBefore(root)
    else
      return dom(@node.parentNode).splitBefore(root)

  split: (offset, force = false) ->
    # Check if split necessary
    nodeLength = this.length()
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
      [child, offset] = this.child(offset)
      [childLeft, childRight] = dom(child).split(offset)
      while childRight != null
        nextRight = childRight.nextSibling
        right.appendChild(childRight)
        childRight = nextRight
      return [left, right, true]

  styles: (styles, overwrite = false) ->
    if styles
      styles = _.defaults(styles, this.styles()) if !overwrite
      styleString = _.map(styles, (style, name) ->
        return "#{name}: #{style}"
      ).join('; ') + ';'
      @node.setAttribute('style', styleString)
      return this
    else
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

  switchTag: (newTag) ->
    newTag = newTag.toUpperCase()
    return this if @node.tagName == newTag
    newNode = document.createElement(newTag)
    attributes = this.attributes()
    this.moveChildren(newNode) unless dom.VOID_TAGS[newTag]?
    this.replace(newNode)
    @node = newNode
    return this.attributes(attributes)

  text: (text) ->
    if text?
      switch @node.nodeType
        when dom.ELEMENT_NODE
          @node.textContent = text
        when dom.TEXT_NODE
          @node.data = text
      return this
    else
      switch @node.nodeType
        when dom.ELEMENT_NODE
          return "" if @node.tagName == dom.DEFAULT_BREAK_TAG
          return dom.EMBED_TEXT if dom.EMBED_TAGS[@node.tagName]?
          return @node.textContent if @node.textContent?
          return ""
        when dom.TEXT_NODE then return @node.data or ""
        else return ""

  textNodes: ->
    walker = document.createTreeWalker(@node, NodeFilter.SHOW_TEXT, null, false)
    textNodes = []
    while textNode = walker.nextNode()
      textNodes.push(textNode)
    return textNodes

  toggleClass: (className, state) ->
    state = !this.hasClass(className) unless state?
    if state
      this.addClass(className)
    else
      this.removeClass(className)
    return this

  trigger: (eventName, options = {}) =>
    if ['keypress', 'keydown', 'keyup'].indexOf(eventName) < 0
      event = document.createEvent('Event')
      event.initEvent(eventName, options.bubbles, options.cancelable)
    else
      event = document.createEvent('KeyboardEvent')
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
        event.initKeyboardEvent(eventName, options.bubbles, options.cancelable, window, 0, 0, modifiers.join(' '), null, null)
      else
        # FF uses initKeyEvent, Webkit uses initKeyboardEvent
        initFn = if _.isFunction(event.initKeyboardEvent) then 'initKeyboardEvent' else 'initKeyEvent'
        event[initFn](eventName, options.bubbles, options.cancelable, window, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 0, 0)
    @node.dispatchEvent(event)
    lastKeyEvent = null
    return this

  unwrap: ->
    ret = @node.firstChild
    next = @node.nextSibling
    _.each(this.childNodes(), (child) =>
      @node.parentNode.insertBefore(child, next)
    )
    this.remove()
    return ret

  wrap: (wrapper) ->
    @node.parentNode.insertBefore(wrapper, @node) if @node.parentNode?
    parent = wrapper
    while parent.firstChild?
      parent = wrapper.firstChild
    parent.appendChild(@node)
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

  convertFontSize: (size) ->
    if _.isString(size) and size.indexOf('px') > -1
      sources = Object.keys(dom.FONT_SIZES)
      targets = _.values(dom.FONT_SIZES)
    else
      targets = Object.keys(dom.FONT_SIZES)
      sources = _.values(dom.FONT_SIZES)
    for i,s of sources
      return targets[i] if parseInt(size) <= parseInt(s)
    return _.last(targets)

  isIE: (maxVersion) ->
    version = document.documentMode
    return version and maxVersion >= version

  isIOS: ->
    return /iPhone|iPad/i.test(navigator.userAgent)

  isMac: ->
    return /Mac/i.test(navigator.platform)
)


module.exports = dom
