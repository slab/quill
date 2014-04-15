_     = require('lodash')
_.str = require('underscore.string')


DOM =
  ELEMENT_NODE: 1
  NOBREAK_SPACE:  "&nbsp;"
  TEXT_NODE: 3
  ZERO_WIDTH_NOBREAK_SPACE:  "\uFEFF"

  DEFAULT_BLOCK_TAG: 'DIV'
  DEFAULT_BREAK_TAG: 'BR'
  DEFAULT_INLNE_TAG: 'SPAN'

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
      node.className += ' ' + cssClass

  addEventListener: (node, eventName, listener) ->
    callback = (event) ->
      event ?= DOM.getWindow(node).event
      event.target ?= event.srcElement
      event.which ?= event.keyCode
      bubbles = listener.call(null, event)
      if bubbles == false
        if event.preventDefault?
          event.preventDefault()
        else
          event.returnValue = false
        if event.stopPropagation?
          event.stopPropagation()
        else
          event.cancelBubble = true
      return bubbles
    if node.addEventListener?
      node.addEventListener(eventName, callback)
    else if node.attachEvent?
      node.attachEvent("on#{eventName}", callback)

  clearAttributes: (node, exception = []) ->
    exception = [exception] if _.isString(exception)
    _.each(DOM.getAttributes(node), (value, name) ->
      node.removeAttribute(name) unless _.indexOf(exception, name) > -1
    )

  getAttributes: (node) ->
    return {} unless node.attributes?
    attributes = {}
    for value,i in node.attributes
      attr = node.attributes[i]
      attributes[attr.name] = attr.value
    return attributes

  getChildNodes: (parent) ->
    return _.map(parent.childNodes)

  getDescendants: (parent) ->
    return _.map(parent.getElementsByTagName('*'))

  getClasses: (node) ->
    return node.className.split(/\s+/)

  getDefaultOption: (select) ->
    option = select.querySelector('option[selected]')
    if option?
      return option
    else
      # IE8
      for o,i in select.options
        if o.defaultSelected
          return o
    return null

  getStyles: (node) ->
    styleString = node.getAttribute('style') or ''
    obj = _.reduce(styleString.split(';'), (styles, str) ->
      [name, value] = str.split(':')
      if name and value
        name = _.str.trim(name)
        value = _.str.trim(value)
        styles[name.toLowerCase()] = value
      return styles
    , {})
    return obj

  getText: (node) ->
    switch node.nodeType
      when DOM.ELEMENT_NODE
        return "" if node.tagName == DOM.DEFAULT_BREAK_TAG
        return node.textContent or node.innerText or ""
      when DOM.TEXT_NODE then return node.data or ""
      else return ""

  getTextNodes: (parent) ->
    walker = parent.ownerDocument.createTreeWalker(parent, NodeFilter.SHOW_TEXT)
    results = []
    while (walker.nextNode())
      results.push(walker.currentNode)
    return results

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

  moveChildren: (newParent, oldParent) ->
    _.each(DOM.getChildNodes(oldParent), (child) ->
      newParent.appendChild(child)
    )

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

  resetSelect: (select) ->
    option = DOM.getDefaultOption(select)
    if option?
      option.selected = true
      DOM.triggerEvent(select, 'change')
    else
      select.selectedIndex = null

  setStyles: (node, styles) ->
    styleString = _.map(styles, (style, name) ->
      return "#{name}: #{style}"
    ).join('; ') + ';'
    node.setAttribute('style', styleString)

  setText: (node, text) ->
    switch node.nodeType
      when DOM.ELEMENT_NODE
        if node.textContent?
          node.textContent = text
        else
          node.innerText = text
      when DOM.TEXT_NODE then node.data = text
      else return # Noop

  switchTag: (node, newTag) ->
    return if node.tagName == newTag.toUpperCase()
    newNode = node.ownerDocument.createElement(newTag)
    attributes = DOM.getAttributes(node)
    this.moveChildren(newNode, node)
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

  triggerEvent: (elem, eventName, bubble, cancels) ->
    if elem.ownerDocument.createEvent
      evt = elem.ownerDocument.createEvent("HTMLEvents")
      evt.initEvent(eventName, bubble, cancels)
      elem.dispatchEvent(evt)
    else
      elem.fireEvent("on#{eventName}", cancels)

  unwrap: (node) ->
    ret = node.firstChild
    next = node.nextSibling
    _.each(DOM.getChildNodes(node), (child) ->
      node.parentNode.insertBefore(child, next)
    )
    node.parentNode.removeChild(node)
    return ret

  wrap: (wrapper, node) ->
    node.parentNode.insertBefore(wrapper, node)
    wrapper.appendChild(node)
    return wrapper


module.exports = DOM
