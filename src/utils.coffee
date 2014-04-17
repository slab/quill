_   = require('lodash')
DOM = require('./dom')


ieVersion = do ->
  matchVersion = navigator.userAgent.match(/MSIE [0-9\.]+/)
  return if matchVersion? then parseInt(matchVersion[0].slice("MSIE".length)) else null


Utils =
  findAncestor: (node, checkFn) ->
    while node? && !checkFn(node)
      node = node.parentNode
    return node

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
    if node.nodeType == DOM.ELEMENT_NODE
      return _.reduce(DOM.getChildNodes(node), (length, child) ->
        return length + Utils.getNodeLength(child)
      , if Utils.isLineNode(node) then 1 else 0)
    else if node.nodeType == DOM.TEXT_NODE
      return DOM.getText(node).length
    else
      return 0

  isEmptyDoc: (root) ->
    firstLine = root.firstChild
    return true if firstLine == null
    return true if firstLine.firstChild == null
    return true if firstLine.firstChild == firstLine.lastChild and firstLine.firstChild.tagName == 'BR'
    return false

  # We'll take a leap of faith that IE11 is good enough...
  isIE: (maxVersion = 10) ->
    return ieVersion? and maxVersion >= ieVersion

  isLineNode: (node) ->
    return node?.parentNode? and DOM.hasClass(node.parentNode, 'editor-container') and DOM.BLOCK_TAGS[node.tagName]?

  # refNode is node after split point, root is parent of eldest node we want split (root will not be split)
  splitAncestors: (refNode, root) ->
    return refNode if refNode == root or refNode.parentNode == root
    parentNode = refNode.parentNode
    parentClone = parentNode.cloneNode(false)
    parentNode.parentNode.insertBefore(parentClone, parentNode)
    while refNode.previousSibling?
      parentClone.insertBefore(refNode.previousSibling, parentClone.firstChild)
    return Utils.splitAncestors(parentNode, root)

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
