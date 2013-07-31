_ = require('underscore')


ScribeDOM = 
  ELEMENT_NODE: 1
  NOBREAK_SPACE:  "&nbps;"
  TEXT_NODE: 3
  ZERO_WIDTH_NOBREAK_SPACE:  "\uFEFF"

  addClass: (node, cssClass) ->
    return if ScribeDOM.hasClass(node, cssClass)
    if node.classList?
      node.classList.add(cssClass)
    else if node.className?
      node.className += ' ' + cssClass

  addEventListener: (node, eventName, listener) ->
    if node.addEventListener?
      return node.addEventListener(eventName, listener)
    else if node.attachEvent?
      if _.indexOf(['change', 'click', 'focus', 'keydown', 'keyup', 'mousedown', 'mouseup', 'paste'], eventName) > -1
        return node.attachEvent("on#{eventName}", listener)
    throw new Error("Cannot attach to unsupported event #{eventName}")

  getClasses: (node) ->
    if node.classList
      return _.clone(node.classList)
    else if node.className?
      return node.className.split(' ')

  getText: (node) ->
    switch node.nodeType
      when ScribeDOM.ELEMENT_NODE
        return if node.tagName == "BR" then "" else node.textContent or node.innerText or ""
      when ScribeDOM.TEXT_NODE then return node.data or ""
      else return ""

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
    option = select.querySelector('option[selected]')
    if option?
      option.selected = true
    else
      # IE8
      for o,i in select.options
        if o.defaultSelected
          return select.selectedIndex = i

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

  toggleClass: (node, className) ->
    if ScribeDOM.hasClass(node, className)
      ScribeDOM.removeClass(node, className)
    else
      ScribeDOM.addClass(node, className)

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
