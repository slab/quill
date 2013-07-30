Scribe = require('./scribe')


Scribe.Utils =
  findAncestor: (node, checkFn) ->
    while node? && !checkFn(node)
      node = node.parentNode
    return node

  findDeepestNode: (node, offset) ->
    if node.firstChild?
      for child in _.clone(node.childNodes)
        length = Scribe.Utils.getNodeLength(child)
        if offset < length
          return Scribe.Utils.findDeepestNode(child, offset)
        else
          offset -= length
      return Scribe.Utils.findDeepestNode(child, offset + length)
    else
      return [node, offset]
        
  getChildAtOffset: (node, offset) ->
    child = node.firstChild
    length = Scribe.Utils.getNodeLength(child)
    while child?
      break if offset < length
      offset -= length
      child = child.nextSibling
      length = Scribe.Utils.getNodeLength(child)
    unless child?
      child = node.lastChild
      offset = Scribe.Utils.getNodeLength(child)
    return [child, offset]

  getNodeLength: (node) ->
    return 0 unless node?
    if node.nodeType == Scribe.DOM.ELEMENT_NODE
      return _.reduce(node.childNodes, (length, child) ->
        return length + Scribe.Utils.getNodeLength(child)
      , (if Scribe.Line.isLineNode(node) then 1 else 0))
    else if node.nodeType == Scribe.DOM.TEXT_NODE
      return Scribe.DOM.getText(node).length
    else
      return 0

  removeFormatFromSubtree: (subtree, format) ->
    if format.matchContainer(subtree)
      subtree = Scribe.DOM.unwrap(subtree)
    _.each(subtree.childNodes, (child) ->
      Scribe.Utils.removeFormatFromSubtree(child, format)
    )
    return subtree

  # Firefox needs splitBefore, not splitAfter like it used to be, see doc/selection
  splitBefore: (node, root) ->
    return false if node == root or node.parentNode == root
    parentNode = node.parentNode
    parentClone = parentNode.cloneNode(false)
    parentNode.parentNode.insertBefore(parentClone, parentNode)
    while node.previousSibling?
      parentClone.insertBefore(node.previousSibling, parentClone.firstChild)
    Scribe.Utils.splitBefore(parentNode, root)

  splitNode: (node, offset, force = false) ->
    # Check if split necessary
    nodeLength = Scribe.Utils.getNodeLength(node)
    offset = Math.max(0, offset)
    offset = Math.min(offset, nodeLength)
    return [node.previousSibling, node, false] unless force or offset != 0
    return [node, node.nextSibling, false] unless force or offset != nodeLength
    if node.nodeType == Scribe.DOM.TEXT_NODE
      after = node.splitText(offset)
      return [node, after, true]
    else
      left = node
      right = node.cloneNode(false)
      node.parentNode.insertBefore(right, left.nextSibling)
      [child, offset] = Scribe.Utils.getChildAtOffset(node, offset)
      [childLeft, childRight] = Scribe.Utils.splitNode(child, offset)
      while childRight != null
        nextRight = childRight.nextSibling
        right.appendChild(childRight)
        childRight = nextRight
      return [left, right, true]

  traversePostorder: (root, fn, context = fn) ->
    return unless root?
    cur = root.firstChild
    while cur?
      Scribe.Utils.traversePostorder.call(context, cur, fn)
      cur = fn.call(context, cur)
      cur = cur.nextSibling if cur?

  traversePreorder: (root, offset, fn, context = fn, args...) ->
    return unless root?
    cur = root.firstChild
    while cur?
      nextOffset = offset + Scribe.Utils.getNodeLength(cur)
      curHtml = cur.innerHTML
      cur = fn.call(context, cur, offset, args...)
      Scribe.Utils.traversePreorder.call(null, cur, offset, fn, context, args...)
      if cur? && cur.innerHTML == curHtml
        cur = cur.nextSibling
        offset = nextOffset

  traverseSiblings: (curNode, endNode, fn) ->
    while curNode?
      nextSibling = curNode.nextSibling
      fn(curNode)
      break if curNode == endNode
      curNode = nextSibling


module.exports = Scribe
