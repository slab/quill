_     = require('lodash')

lastKeyEvent = null    # Workaround for fact we can't dispatch keyboard event via javascript

DOM =
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

  addClass: (node, cssClass) ->
    return if DOM.hasClass(node, cssClass)
    if node.classList?
      node.classList.add(cssClass)
    else if node.className?
      node.className = (node.className + ' ' + cssClass).trim()

  addEventListener: (node, eventName, listener) ->
    node.addEventListener(eventName, (event) ->
      arg = if lastKeyEvent and (eventName == 'keydown' or eventName == 'keyup') then lastKeyEvent else event
      propogate = listener(arg)
      unless propogate
        event.preventDefault()
        event.stopPropagation()
      return propogate
    )

  addStyles: (node, styles) ->
    styles = _.defaults(styles, DOM.getStyles(node))
    DOM.setStyles(node, styles)

  clearAttributes: (node, exception = []) ->
    exception = [exception] if _.isString(exception)
    _.each(DOM.getAttributes(node), (value, name) ->
      node.removeAttribute(name) unless _.indexOf(exception, name) > -1
    )

  convertFontSize: (size) ->
    if _.isString(size) and size.indexOf('px') > -1
      sources = _.keys(DOM.FONT_SIZES)
      targets = _.values(DOM.FONT_SIZES)
    else
      targets = _.keys(DOM.FONT_SIZES)
      sources = _.values(DOM.FONT_SIZES)
    for i,s of sources
      return targets[i] if parseInt(size) <= parseInt(s)
    return _.last(targets)

  getAttributes: (node) ->
    return {} unless node.attributes?
    attributes = {}
    for value,i in node.attributes
      attr = node.attributes[i]
      attributes[attr.name] = attr.value
    return attributes

  getChildAtOffset: (node, offset) ->
    child = node.firstChild
    length = DOM.getNodeLength(child)
    while child?
      break if offset < length
      offset -= length
      child = child.nextSibling
      length = DOM.getNodeLength(child)
    unless child?
      child = node.lastChild
      offset = DOM.getNodeLength(child)
    return [child, offset]

  getChildNodes: (parent) ->
    return _.map(parent.childNodes)

  getChildren: (parent) ->
    return _.map(parent.children)

  getDescendants: (parent) ->
    return _.map(parent.getElementsByTagName('*'))

  getClasses: (node) ->
    return node.className.split(/\s+/)

  getDefaultOption: (select) ->
    return select.querySelector('option[selected]')

  getNextLineNode: (curNode, root) ->
    nextNode = curNode.nextSibling
    if !nextNode? and curNode.parentNode != root
      nextNode = curNode.parentNode.nextSibling
    if nextNode? and DOM.LIST_TAGS[nextNode.tagName]?
      nextNode = nextNode.firstChild
    return nextNode

  getNodeLength: (node) ->
    return 0 unless node?
    length = DOM.getText(node).length
    if DOM.isElement(node)
      length += node.querySelectorAll(_.keys(DOM.EMBED_TAGS).join(',')).length
    return length

  getSelectValue: (select) ->
    return if select.selectedIndex > -1 then select.options[select.selectedIndex].value else ''

  getStyles: (node) ->
    styleString = node.getAttribute('style') or ''
    obj = _.reduce(styleString.split(';'), (styles, str) ->
      [name, value] = str.split(':')
      if name and value
        name = name.trim()
        value = value.trim()
        styles[name.toLowerCase()] = value
      return styles
    , {})
    return obj

  getText: (node) ->
    switch node.nodeType
      when DOM.ELEMENT_NODE
        return "" if node.tagName == DOM.DEFAULT_BREAK_TAG
        return DOM.EMBED_TEXT if DOM.EMBED_TAGS[node.tagName]?
        return node.textContent if node.textContent?
        return ""
      when DOM.TEXT_NODE then return node.data or ""
      else return ""

  getTextNodes: (root) ->
    walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false)
    nodes = []
    while node = walker.nextNode()
      nodes.push(node)
    return nodes

  getWindow: (node) ->
    return node.ownerDocument.defaultView or node.ownerDocument.parentWindow

  hasClass: (node, cssClass) ->
    if node.classList?
      return node.classList.contains(cssClass)
    else if node.className?
      return _.indexOf(DOM.getClasses(node), cssClass) > -1
    return false

  isElement: (node) ->
    return node?.nodeType == DOM.ELEMENT_NODE

  isTextNode: (node) ->
    return node?.nodeType == DOM.TEXT_NODE

  mergeNodes: (newNode, oldNode) ->
    if DOM.isElement(newNode)
      DOM.moveChildren(newNode, oldNode)
      DOM.normalize(newNode)
    else
      text = DOM.getText(newNode) + DOM.getText(oldNode)
      DOM.setText(newNode, text)
    DOM.removeNode(oldNode)

  moveChildren: (newParent, oldParent) ->
    _.each(DOM.getChildNodes(oldParent), (child) ->
      newParent.appendChild(child)
    )

  # IE normalize is broken
  normalize: (node) ->
    curNode = node.firstChild
    while curNode?
      nextNode = curNode.nextSibling
      if DOM.isTextNode(curNode)
        if DOM.getText(curNode).length == 0
          DOM.removeNode(curNode)
        else if DOM.isTextNode(nextNode)
          nextNode = nextNode.nextSibling
          newText = DOM.getText(curNode) + DOM.getText(curNode.nextSibling)
          DOM.setText(curNode, newText)
          DOM.removeNode(curNode.nextSibling)
      curNode = nextNode

  isIE: (maxVersion) ->
    version = document.documentMode
    return version and maxVersion >= version

  isIOS: ->
    return /iPhone|iPad/i.test(navigator.userAgent)

  removeClass: (node, cssClass) ->
    return unless DOM.hasClass(node, cssClass)
    if node.classList?
      return node.classList.remove(cssClass)
    else if node.className?
      classArray = DOM.getClasses(node)
      classArray.splice(_.indexOf(classArray, cssClass), 1)
      node.className = classArray.join(' ')

  removeNode: (node) ->
    node.parentNode?.removeChild(node)

  replaceNode: (newNode, oldNode) ->
    oldNode.parentNode.replaceChild(newNode, oldNode)
    return newNode

  resetSelect: (select, trigger = true) ->
    option = DOM.getDefaultOption(select)
    if option?
      option.selected = true
    else
      select.selectedIndex = 0
    DOM.triggerEvent(select, 'change') if trigger

  selectOption: (select, option, trigger = true) ->
    value = if _.isElement(option) then option.value else option
    if value
      select.value = value
    else
      select.selectedIndex = -1  # PhantomJS
    DOM.triggerEvent(select, 'change') if trigger

  setAttributes: (node, attributes) ->
    _.each(attributes, (value, name) ->
      node.setAttribute(name, value)
    )

  setStyles: (node, styles) ->
    styleString = _.map(styles, (style, name) ->
      return "#{name}: #{style}"
    ).join('; ') + ';'
    node.setAttribute('style', styleString)

  setText: (node, text) ->
    switch node.nodeType
      when DOM.ELEMENT_NODE
        node.textContent = text
      when DOM.TEXT_NODE then node.data = text
      else return # Noop

  # refNode is node after split point, root is parent of eldest node we want split (root will not be split)
  splitAncestors: (refNode, root, force = false) ->
    return refNode if refNode == root or refNode.parentNode == root
    if refNode.previousSibling? or force
      parentNode = refNode.parentNode
      parentClone = parentNode.cloneNode(false)
      parentNode.parentNode.insertBefore(parentClone, parentNode.nextSibling)
      while refNode?
        nextNode = refNode.nextSibling
        parentClone.appendChild(refNode)
        refNode = nextNode
      return DOM.splitAncestors(parentClone, root)
    else
      return DOM.splitAncestors(refNode.parentNode, root)

  splitNode: (node, offset, force = false) ->
    # Check if split necessary
    nodeLength = DOM.getNodeLength(node)
    offset = Math.max(0, offset)
    offset = Math.min(offset, nodeLength)
    return [node.previousSibling, node, false] unless force or offset != 0
    return [node, node.nextSibling, false] unless force or offset != nodeLength
    if node.nodeType == DOM.TEXT_NODE
      after = node.splitText(offset)
      return [node, after, true]
    else
      left = node
      right = node.cloneNode(false)
      node.parentNode.insertBefore(right, left.nextSibling)
      [child, offset] = DOM.getChildAtOffset(node, offset)
      [childLeft, childRight] = DOM.splitNode(child, offset)
      while childRight != null
        nextRight = childRight.nextSibling
        right.appendChild(childRight)
        childRight = nextRight
      return [left, right, true]

  switchTag: (node, newTag) ->
    newTag = newTag.toUpperCase()
    return node if node.tagName == newTag
    newNode = node.ownerDocument.createElement(newTag)
    attributes = DOM.getAttributes(node)
    this.moveChildren(newNode, node) unless DOM.VOID_TAGS[newTag]?
    node.parentNode.replaceChild(newNode, node)
    _.each(attributes, (value, name) ->
      newNode.setAttribute(name, value)
    )
    return newNode

  toggleClass: (node, className, state) ->
    state = !DOM.hasClass(node, className) unless state?
    if state
      DOM.addClass(node, className)
    else
      DOM.removeClass(node, className)

  triggerEvent: (elem, eventName, options = {}) ->
    if _.indexOf(['keypress', 'keydown', 'keyup'], eventName) < 0
      event = elem.ownerDocument.createEvent('Event')
      event.initEvent(eventName, options.bubbles, options.cancelable)
    else
      event = elem.ownerDocument.createEvent('KeyboardEvent')
      lastKeyEvent = _.clone(options)
      if _.isNumber(options.key)
        lastKeyEvent.which = options.key
      else if _.isString(options.key)
        lastKeyEvent.which = options.key.toUpperCase().charCodeAt(0)
      else
        lastKeyEvent.which = 0
      if DOM.isIE(10)
        modifiers = []
        modifiers.push('Alt') if options.altKey
        modifiers.push('Control') if options.ctrlKey
        modifiers.push('Meta') if options.metaKey
        modifiers.push('Shift') if options.shiftKey
        event.initKeyboardEvent(eventName, options.bubbles, options.cancelable, elem.ownerDocument.defaultView.window, 0, 0, modifiers.join(' '), null, null)
      else
        # FF uses initKeyEvent, Webkit uses initKeyboardEvent
        initFn = if _.isFunction(event.initKeyboardEvent) then 'initKeyboardEvent' else 'initKeyEvent'
        event[initFn](eventName, options.bubbles, options.cancelable, elem.ownerDocument.defaultView.window, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 0, 0)
    elem.dispatchEvent(event)
    lastKeyEvent = null

  unwrap: (node) ->
    ret = node.firstChild
    next = node.nextSibling
    _.each(DOM.getChildNodes(node), (child) ->
      node.parentNode.insertBefore(child, next)
    )
    DOM.removeNode(node)
    return ret

  wrap: (wrapper, node) ->
    node.parentNode.insertBefore(wrapper, node) if node.parentNode?
    parent = wrapper
    while parent.firstChild?
      parent = wrapper.firstChild
    parent.appendChild(node)
    return parent


module.exports = DOM
