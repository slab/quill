#= underscore
#= tandem/constants

TandemUtils = 
  # All block nodes inside nodes are moved out
  breakBlocks: (root) ->
    lineNodes = []
    this.traversePreorder(root, 0, (node, index) =>
      if node.nodeType == node.ELEMENT_NODE
        toBreak = []
        if _.indexOf(Tandem.Constants.BLOCK_TAGS, node.tagName, true) > -1
          [left1, left2, didLeftSplit] = this.splitNode(root, index)
          if !didLeftSplit
            [right1, right2, didRightSplit] = this.splitNode(root, node.textContent.length)
            toBreak = toBreak.concat([right1, right2]) if didRightSplit
          else
            toBreak = toBreak.concat([left1, left2])
          toBreak = toBreak.concat([left1, left2]) if didLeftSplit
        else if _.indexOf(Tandem.Constants.BREAK_TAGS, node.tagName, true) > -1
          [left, right, didSplit] = this.splitNode(root, index)
          if didSplit?
            next = node.nextSibling
            node.parentNode.removeChild(node)
            toBreak = [left, right]
            node = next
        _.each(toBreak, (line) =>
          if line? && line != root
            newLineNodes = this.breakBlocks(line)
            lineNodes.push(line)
            lineNodes = _.uniq(lineNodes.concat(newLineNodes))
        )
      return node
    )
    return lineNodes

  cleanHtml: (html, keepIdClass = false) ->
    # Remove leading and tailing whitespace
    html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    # Remove whitespace between tags
    html = html.replace(/>\s\s+</gi, '><')
    # Remove id or class classname
    html = html.replace(/\ (class|id)="[a-z0-9\-_]+"/gi, '') unless keepIdClass == true
    return html

  createContainerForAttribute: (doc, attribute, value) ->
    switch (attribute)
      when 'bold'       then return doc.createElement('b')
      when 'italic'     then return doc.createElement('i')
      when 'strike'     then return doc.createElement('s')
      when 'underline'  then return doc.createElement('u')
      else                   
        span = doc.createElement('span')
        if attribute == 'font-family' || attribute == 'font-size'
          span.classList.add("font-#{value}")
        else if attribute == 'font-color'
          span.classList.add("color-#{value}")
        else if attribute == 'font-background'
          span.classList.add("bg-#{value}")  
        return span

  extractNodes: (startLineNode, startOffset, endLineNode, endOffset) ->
    [leftStart, rightStart] = Tandem.Utils.splitNode(startLineNode, startOffset, true)
    if startLineNode == endLineNode
      endLineNode = rightStart
      endOffset -= leftStart.textContent.length if leftStart? && startLineNode != rightStart
    [leftEnd, rightEnd] = Tandem.Utils.splitNode(endLineNode, endOffset, true)
  
    fragment = startLineNode.ownerDocument.createDocumentFragment()
    while rightStart != rightEnd
      next = rightStart.nextSibling
      fragment.appendChild(rightStart)
      rightStart = next
    Tandem.Utils.mergeNodes(leftStart, rightEnd)

    return fragment

  getAttributeForContainer: (container) ->
    switch container.tagName
      when 'B' then return { 'bold'     : true }
      when 'I' then return { 'italic'   : true }
      when 'S' then return { 'strike'   : true }
      when 'U' then return { 'underline': true }
      when 'SPAN'
        attributes = {}
        _.each(container.classList, (cssClass) ->
          if _.indexOf(Tandem.Constants.FONT_BACKGROUNDS, cssClass, true) > -1
            attributes['font-background'] = cssClass
          if _.indexOf(Tandem.Constants.FONT_COLORS, cssClass, true) > -1
            attributes['font-color'] = cssClass
          if _.indexOf(Tandem.Constants.FONT_FAMILIES, cssClass, true) > -1
            attributes['font-family'] = cssClass
          if _.indexOf(Tandem.Constants.FONT_SIZES, cssClass, true) > -1
            attributes['font-size'] = cssClass
        )
        return attributes
      else
        return {}
        

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
    return node2 if !node1?
    return node1 if !node2?
    this.moveChildren(node1, node2)
    node2.parentNode.removeChild(node2)
    return node1

  moveChildren: (newParent, oldParent) ->
    _.each(_.clone(oldParent.childNodes), (child) ->
      newParent.appendChild(child)
    )

  removeAttributeFromSubtree: (subtree, attribute) ->
    children = _.clone(subtree.childNodes)
    attributes = Tandem.Utils.getAttributeForContainer(subtree)
    if attributes[attribute]?
      if _.indexOf(Tandem.Constants.SPAN_ATTRIBUTES, attribute) > -1
        subtree.classList.remove(attribute)
      else
        Tandem.Utils.unwrap(subtree)
    _.each(children, (child) ->
      Tandem.Utils.removeAttributeFromSubtree(child, attribute)
    )

  splitNode: (node, offset, force = false) ->
    if offset > node.textContent.length
      throw new Error('Splitting at offset greater than node length')

    if node.nodeType == node.TEXT_NODE
      node = this.wrap(node.ownerDocument.createElement('span'), node)

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
      curHtml = cur.innerHTML
      cur = fn.apply(context, [cur, offset].concat(args))
      TandemUtils.traversePreorder.apply(TandemUtils.traversePreorder, [cur, offset, fn, context].concat(args))
      if cur? && cur.innerHTML == curHtml
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
    return wrapper



window.Tandem ||= {}
window.Tandem.Utils = TandemUtils
