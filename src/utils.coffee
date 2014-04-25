_   = require('lodash')
DOM = require('./dom')


Utils =
  findDeepestNode: (node, offset) ->
    while node.firstChild?
      [node, offset] = Utils.getChildAtOffset(node, offset)
    return [node, offset]

  getChildAtOffset: (node, offset) ->
    child = node.firstChild
    length = Utils.getNodeLength(child)
    while child?
      break if offset < length
      offset -= length
      child = child.nextSibling
      length = Utils.getNodeLength(child)
    unless child?
      child = node.lastChild
      offset = Utils.getNodeLength(child)
    return [child, offset]

  getNodeLength: (node) ->
    return 0 unless node?
    length = DOM.getText(node).length
    if DOM.isElement(node)
      length += node.querySelectorAll(_.keys(DOM.EMBED_TAGS).join(',')).length
    return length

  isIE: (maxVersion) ->
    version = document.documentMode
    return version and maxVersion >= version

  # refNode is node after split point, root is parent of eldest node we want split (root will not be split)
  splitAncestors: (refNode, root) ->
    return refNode if refNode == root or refNode.parentNode == root
    parentNode = refNode.parentNode
    parentClone = parentNode.cloneNode(false)
    parentNode.parentNode.insertBefore(parentClone, parentNode.nextSibling)
    while refNode?
      nextNode = refNode.nextSibling
      parentClone.appendChild(refNode)
      refNode = nextNode
    return Utils.splitAncestors(parentClone, root)

  splitNode: (node, offset, force = false) ->
    # Check if split necessary
    nodeLength = Utils.getNodeLength(node)
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
      [child, offset] = Utils.getChildAtOffset(node, offset)
      [childLeft, childRight] = Utils.splitNode(child, offset)
      while childRight != null
        nextRight = childRight.nextSibling
        right.appendChild(childRight)
        childRight = nextRight
      return [left, right, true]


module.exports = Utils
