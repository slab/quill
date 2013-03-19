ScribeDOM = 
  canEdit: (node) ->
    ancestor = Scribe.Utils.findAncestor(node, (node) =>
      this.isExternal(node)
    )
    return !ancestor?

  filterUneditable: (nodeList) ->
    return _.filter(nodeList, (node) =>
      return this.canEdit(node)
    )

  isExternal: (node) ->
    return node?.classList?.contains(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)

  isTextNodeParent: (node) ->
    childNodes = Scribe.DOM.filterUneditable(node.childNodes)
    return childNodes.length == 1 && childNodes[0].nodeType == node.TEXT_NODE

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

  splitAfter: (node, root) ->
    return false if node == root or node.parentNode == root
    parentNode = node.parentNode
    parentClone = parentNode.cloneNode(false)
    parentNode.parentNode.insertBefore(parentClone, parentNode.nextSibling)
    while node.nextSibling?
      parentClone.appendChild(node.nextSibling)
    Scribe.DOM.splitAfter(parentNode, root)

  splitNode: (node, offset, force = false) ->
    if offset > Scribe.Utils.getNodeLength(node)
      throw new Error('Splitting at offset greater than node length')
    if node.nodeType == node.TEXT_NODE
      node = this.wrap(node.ownerDocument.createElement('span'), node)
    # Check if split necessary
    if !force
      if offset == 0
        return [node.previousSibling, node, false]
      if offset == Scribe.Utils.getNodeLength(node)
        return [node, node.nextSibling, false]
    left = node
    right = node.cloneNode(false)
    node.parentNode.insertBefore(right, left.nextSibling)
    if Scribe.DOM.isTextNodeParent(node)
      # Text split
      beforeText = node.textContent.substring(0, offset)
      afterText = node.textContent.substring(offset)
      left.textContent = beforeText
      right.textContent = afterText
      return [left, right, true]
    else
      # Node split
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
      if Scribe.DOM.canEdit(cur)
        nextOffset = offset + Scribe.Utils.getNodeLength(cur)
        curHtml = cur.innerHTML
        cur = fn.apply(context, [cur, offset].concat(args))
        Scribe.DOM.traversePreorder.apply(null, [cur, offset, fn, context].concat(args))
        if cur? && cur.innerHTML == curHtml
          cur = cur.nextSibling
          offset = nextOffset
      else
        cur = cur.nextSibling

  traverseSiblings: (startNode, endNode, fn) ->
    while startNode?
      nextSibling = startNode.nextSibling
      fn(startNode)
      break if startNode == endNode
      startNode = nextSibling

  unwrap: (node) ->
    next = node.firstChild
    _.each(_.clone(node.childNodes), (child) ->
      node.parentNode.insertBefore(child, node)
    )
    node.parentNode.removeChild(node)
    return next

  wrap: (wrapper, node) ->
    node.parentNode.insertBefore(wrapper, node)
    wrapper.appendChild(node)
    return wrapper


window.Scribe ||= {}
window.Scribe.DOM = ScribeDOM
