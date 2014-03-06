_ = require('underscore')

ScribeDOM =
  ELEMENT_NODE: 1
  NOBREAK_SPACE:  "&nbsp;"
  TEXT_NODE: 3
  ZERO_WIDTH_NOBREAK_SPACE:  "\uFEFF"

  addClass: (node, cssClass) ->
    return if ScribeDOM.hasClass(node, cssClass)
    if node.classList?
      node.classList.add(cssClass)
    else if node.className?
      node.className += ' ' + cssClass

  addEventListener: (node, eventName, listener) ->
    names = eventName.split(' ')
    if names.length > 1
      return _.each(names, (name) ->
        ScribeDOM.addEventListener(node, name, listener)
      )
    callback = (event) ->
      event ?= ScribeDOM.getWindow(node).event
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
    else
      throw new Error("No add event support")

  getChildIndex: (node) ->
    index = 0
    while node.previousSibling?
      node = previousSibling
      index += 1
    return index

  getClasses: (node) ->
    if node.classList
      return _.clone(node.classList)
    else if node.className?
      return node.className.split(' ')

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

  getText: (node) ->
    switch node.nodeType
      when ScribeDOM.ELEMENT_NODE
        return if node.tagName == "BR" then "" else node.textContent or node.innerText or ""
      when ScribeDOM.TEXT_NODE then return node.data or ""
      else return ""

  getWindow: (node) ->
    return node.ownerDocument.defaultView or node.ownerDocument.parentWindow

  hasClass: (node, cssClass) ->
    if node.classList?
      return node.classList.contains(cssClass)
    else if node.className?
      return _.indexOf(ScribeDOM.getClasses(node), cssClass) > -1
    return false

  mergeNodes: (node1, node2) ->
    return node2 if !node1?
    return node1 if !node2?
    this.moveChildren(node1, node2)
    node2.parentNode.removeChild(node2)
    if (node1.tagName == 'OL' || node1.tagName == 'UL') && node1.childNodes.length == 2
      ScribeDOM.mergeNodes(node1.firstChild, node1.lastChild)
    return node1

  moveChildren: (newParent, oldParent) ->
    _.each(_.clone(oldParent.childNodes), (child) ->
      newParent.appendChild(child)
    )

  normalize: (node) ->
    # Credit: Tim Down - http://stackoverflow.com/questions/2023255/node-normalize-crashes-in-ie6
    child = node.firstChild
    while (child)
      if (child.nodeType == 3)
        while ((nextChild = child.nextSibling) && nextChild.nodeType == 3)
          child.appendData(nextChild.data)
          node.removeChild(nextChild)
      child = child.nextSibling

  removeAttributes: (node, exception = []) ->
    exception = [exception] if _.isString(exception)
    _.each(_.clone(node.attributes), (attrNode, value) ->
      node.removeAttribute(attrNode.name) unless _.indexOf(exception, attrNode.name) > -1
    )

  removeClass: (node, cssClass) ->
    return unless ScribeDOM.hasClass(node, cssClass)
    if node.classList?
      return node.classList.remove(cssClass)
    else if node.className?
      classArray = ScribeDOM.getClasses(node)
      classArray.splice(_.indexOf(classArray, cssClass), 1)
      node.className = classArray.join(' ')

  removeNode: (node) ->
    node.parentNode?.removeChild(node)

  resetSelect: (select) ->
    option = ScribeDOM.getDefaultOption(select)
    if option?
      option.selected = true
      ScribeDOM.triggerEvent(select, 'change')
    else
      select.selectedIndex = null

  setText: (node, text) ->
    switch node.nodeType
      when ScribeDOM.ELEMENT_NODE
        if node.textContent?
          node.textContent = text
        else
          node.innerText = text
      when ScribeDOM.TEXT_NODE then node.data = text
      else return # Noop

  switchTag: (node, newTag) ->
    return if node.tagName == newTag
    newNode = node.ownerDocument.createElement(newTag)
    this.moveChildren(newNode, node)
    node.parentNode.replaceChild(newNode, node)
    newNode.className = node.className if node.className
    newNode.id = node.id if node.id
    return newNode

  toggleClass: (node, className, state) ->
    state = !ScribeDOM.hasClass(node, className) unless state?
    if state
      ScribeDOM.addClass(node, className)
    else
      ScribeDOM.removeClass(node, className)

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
    _.each(_.clone(node.childNodes), (child) ->
      node.parentNode.insertBefore(child, next)
    )
    node.parentNode.removeChild(node)
    return ret

  wrap: (wrapper, node) ->
    node.parentNode.insertBefore(wrapper, node)
    wrapper.appendChild(node)
    return wrapper


module.exports = ScribeDOM
