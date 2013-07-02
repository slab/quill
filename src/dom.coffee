Scribe = require('./scribe')


Scribe.DOM = 
  NOBREAK_SPACE:  "\uFEFF"

  addClass: (node, cssClass) ->
    return if Scribe.DOM.hasClass(node, cssClass)
    if node.classList?
      node.classList.add(cssClass)
    else if node.className?
      node.className += ' ' + cssClass

  getClasses: (node) ->
    if node.classList
      return _.clone(node.classList)
    else if node.className?
      return node.className.split(' ')

  hasClass: (node, cssClass) ->
    if node.classList?
      return node.classList.contains(cssClass)
    else if node.className?
      return _.indexOf(Scribe.DOM.getClasses(node), cssClass) > -1
    return false

  removeClass: (node, cssClass) ->
    return unless Scribe.DOM.hasClass(node, cssClass)
    if node.classList?
      return node.classList.remove(cssClass)
    else if node.className?
      classArray = Scribe.DOM.getClasses(node)
      classArray.splice(_.indexOf(classArray, cssClass), 1)
      node.className = classArray.join(' ')

  findDeepestNode: (node, offset) ->
    if node.firstChild?
      for child in _.clone(node.childNodes)
        length = Scribe.Utils.getNodeLength(child)
        if offset < length
          return Scribe.DOM.findDeepestNode(child, offset)
        else
          offset -= length
      return Scribe.DOM.findDeepestNode(child, offset + length)
    else
      return [node, offset]

  mergeNodes: (node1, node2) ->
    return node2 if !node1?
    return node1 if !node2?
    this.moveChildren(node1, node2)
    node2.parentNode.removeChild(node2)
    if (node1.tagName == 'OL' || node1.tagName == 'UL') && node1.childNodes.length == 2
      Scribe.DOM.mergeNodes(node1.firstChild, node1.lastChild)
    return node1

  moveChildren: (newParent, oldParent) ->
    _.each(_.clone(oldParent.childNodes), (child) ->
      newParent.appendChild(child)
    )

  removeAttributes: (node, exception = null) ->
    _.each(_.clone(node.attributes), (attrNode, value) ->
      node.removeAttribute(attrNode.name) unless exception == attrNode.name
    )

  splitAfter: (node, root) ->
    return false if node == root or node.parentNode == root
    parentNode = node.parentNode
    parentClone = parentNode.cloneNode(false)
    parentNode.parentNode.insertBefore(parentClone, parentNode.nextSibling)
    while node.nextSibling?
      parentClone.appendChild(node.nextSibling)
    Scribe.DOM.splitAfter(parentNode, root)

  splitNode: (node, offset, force = false) ->
    # Check if split necessary
    nodeLength = Scribe.Utils.getNodeLength(node)
    offset = Math.max(0, offset)
    offset = Math.min(offset, nodeLength)
    return [node.previousSibling, node, false] unless force or offset != 0
    return [node, node.nextSibling, false] unless force or offset != nodeLength
    if node.nodeType == node.TEXT_NODE
      after = node.splitText(offset)
      return [node, after, true]
    else
      left = node
      right = node.cloneNode(false)
      node.parentNode.insertBefore(right, left.nextSibling)
      [child, offset] = Scribe.Utils.getChildAtOffset(node, offset)
      [childLeft, childRight] = Scribe.DOM.splitNode(child, offset)
      while childRight != null
        nextRight = childRight.nextSibling
        right.appendChild(childRight)
        childRight = nextRight
      return [left, right, true]

  switchTag: (node, newTag) ->
    return if node.tagName == newTag
    newNode = node.ownerDocument.createElement(newTag)
    this.moveChildren(newNode, node)
    node.parentNode.replaceChild(newNode, node)
    newNode.className = node.className if node.className
    newNode.id = node.id if node.id
    return newNode

  traversePostorder: (root, fn, context = fn) ->
    return unless root?
    cur = root.firstChild
    while cur?
      Scribe.DOM.traversePostorder.call(context, cur, fn)
      cur = fn.call(context, cur)
      cur = cur.nextSibling if cur?

  traversePreorder: (root, offset, fn, context = fn, args...) ->
    return unless root?
    cur = root.firstChild
    while cur?
      nextOffset = offset + Scribe.Utils.getNodeLength(cur)
      curHtml = cur.innerHTML
      cur = fn.call(context, cur, offset, args...)
      Scribe.DOM.traversePreorder.call(null, cur, offset, fn, context, args...)
      if cur? && cur.innerHTML == curHtml
        cur = cur.nextSibling
        offset = nextOffset

  traverseSiblings: (curNode, endNode, fn) ->
    while curNode?
      nextSibling = curNode.nextSibling
      fn(curNode)
      break if curNode == endNode
      curNode = nextSibling

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


module.exports = Scribe
