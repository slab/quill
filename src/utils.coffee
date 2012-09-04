#= underscore
#= tandem/tags

TandemUtils = 
  # All block nodes inside nodes are moved out
  breakBlocks: (root) ->
    this.traversePreorder(root, 0, (node, index) =>
      if node.nodeType == node.ELEMENT_NODE && _.indexOf(Tandem.Tags.BLOCK_TAGS, node.tagName, true) > -1
        toBreak = []
        [left1, left2, didLeftSplit] = this.splitNode(root, index)
        if !didLeftSplit
          [right1, right2, didRightSplit] = this.splitNode(root, node.textContent.length)
          toBreak = toBreak.concat([right1, right2]) if didRightSplit
        else
          toBreak = toBreak.concat([left1, left2])
        toBreak = toBreak.concat([left1, left2]) if didLeftSplit
        _.each(toBreak, (line) =>
          this.breakBlocks(line) if line? && line != root
        )
        return node
      return node
    )

  cleanHtml: (html) ->
    # Remove leading and tailing whitespace
    html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    # Remove whitespace between tags
    html = html.replace(/>\s\s+</gi, '><')
    # Remove id or class classname
    html = html.replace(/\ (class|id)="[a-z0-9\-_]+"/gi, '')

  createContainerForAttribute: (doc, attribute) ->
    switch (attribute)
      when 'bold'       then return doc.createElement('b')
      when 'italic'     then return doc.createElement('i')
      when 'strike'     then return doc.createElement('s')
      when 'underline'  then return doc.createElement('u')
      else                   return doc.createElement('span')

  extractNodes: (editor, startIndex, endIndex) ->
    [startLine, startOffset] = Tandem.Utils.getChildAtOffset(editor.iframeDoc.body, startIndex)
    [endLine, endOffset] = Tandem.Utils.getChildAtOffset(editor.iframeDoc.body, endIndex)
    [leftStart, rightStart] = Tandem.Utils.splitNode(startLine, startOffset, true)
    if startLine == endLine
      endLine = rightStart
      endOffset -= leftStart.textContent.length if leftStart? && startLine != rightStart
    [leftEnd, rightEnd] = Tandem.Utils.splitNode(endLine, endOffset, true)
  
    fragment = editor.iframeDoc.createDocumentFragment()
    while rightStart != rightEnd
      next = rightStart.nextSibling
      fragment.appendChild(rightStart)
      rightStart = next    

    Tandem.Utils.mergeNodes(leftStart, rightEnd) if leftStart? && rightEnd?

    return fragment

  getAttributeForContainer: (container) ->
    switch container.tagName
      when 'B' then return 'bold'
      when 'I' then return 'italic'
      when 'S' then return 'strike'
      when 'U' then return 'underline'
      else          return null

  getChildAtOffset: (node, offset) ->
    child = node.firstChild
    while offset > child.textContent.length
      offset -= child.textContent.length
      offset -= 1 if Tandem.Line.isLineNode(child)
      child = child.nextSibling
    return [child, offset]

  isTextNodeParent: (node) ->
    return node.childNodes.length == 1 && node.firstChild.nodeType == node.TEXT_NODE

  mergeNodes: (node1, node2) ->
    this.moveChildren(node1, node2)
    node2.parentNode.removeChild(node2)
    return node1

  moveChildren: (newParent, oldParent) ->
    _.each(_.clone(oldParent.childNodes), (child) ->
      newParent.appendChild(child)
    )

  removeAttributeFromSubtree: (subtree, attribute) ->
    children = _.clone(subtree.childNodes)
    if Tandem.Utils.getAttributeForContainer(subtree) == attribute
      Tandem.Utils.unwrap(subtree)
    _.each(children, (child) ->
      Tandem.Utils.removeAttributeFromSubtree(child, attribute)
    )

  splitNode: (node, offset, force = false) ->
    if offset > node.textContent.length
      throw new Error('Splitting at offset greater than node length')

    # Check if split necessary
    if !force
      if offset == 0
        return [node.previousSibling, node, false]
      if offset == node.textContent.length
        return [node, node.nextSibling, false]

    left = node
    right = node.cloneNode(false)
    node.parentNode.insertBefore(right, left.nextSibling)

    if TandemUtils.isTextNodeParent(node)
      # Text split
      beforeText = node.textContent.substring(0, offset)
      afterText = node.textContent.substring(offset)
      left.textContent = beforeText
      right.textContent = afterText
      return [left, right, true]
    else
      # Node split
      [child, offset] = TandemUtils.getChildAtOffset(node, offset)
      [childLeft, childRight] = TandemUtils.splitNode(child, offset)
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
    return newNode

  traversePreorder: (root, offset, fn, context = fn, args...) ->
    return unless root?
    cur = root.firstChild
    while cur?
      nextOffset = offset + cur.textContent.length
      oldCur = cur
      cur = fn.apply(context, [cur, offset].concat(args))
      TandemUtils.traversePreorder.apply(TandemUtils.traversePreorder, [cur, offset, fn, context].concat(args))
      if cur? && oldCur == cur
        cur = cur.nextSibling
        offset = nextOffset

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



window.Tandem ||= {}
window.Tandem.Utils = TandemUtils
