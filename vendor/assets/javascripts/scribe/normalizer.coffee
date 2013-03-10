# If nothing add break
# Make sure tag is valid, if not convert or delete
# If text node, make sure parent is valid list of tags (b, span, i, s, u), if not wrap in span

# Merge adjacent
# Remove redundant

# Each node remove extraneous classes, attributes


ScribeNormalizer =
  applyRules: (root) ->
    Scribe.Utils.traversePreorder(root, 0, (node, index) =>
      if node.nodeType == node.ELEMENT_NODE
        rules = Scribe.Constants.LINE_RULES[node.tagName]
        if rules?
          _.each(rules, (data, rule) ->
            switch rule
              when 'rename' then node = Scribe.Utils.switchTag(node, data)
              else return
          )
        else
          node = Scribe.Utils.unwrap(node)
      return node
    )

  breakBlocks: (root) ->
    if root.childNodes.length == 0
      div = root.ownerDocument.createElement('div')
      return root.appendChild(div)
    Scribe.Utils.groupBlocks(root)
    _.each(_.clone(root.childNodes), (child) =>
      if child.nodeType != child.ELEMENT_NODE
        Scribe.Utils.removeNode(child)
      else
        this.wrapText(child)
        this.normalizeLine(child)
    )

  normalizeLine: (lineNode) ->
    return if lineNode.childNodes.length == 1 && lineNode.firstChild.tagName == 'BR'
    this.applyRules(lineNode)
    this.removeNoBreak(lineNode)
    this.removeRedundant(lineNode)
    # TODO need wrapText before and after for these cases:
    # Before: <b>Test<span>What</span></b> -> <b><span>Test</span><span>What</span></b>
    # After: <b>Bold</b><b><i>Test</i></b> -> <b>Bold<i>Test</i></b>
    this.mergeAdjacent(lineNode)
    this.wrapText(lineNode)
    if 0 == _.reduce(lineNode.childNodes, ((count, node) -> return count + (if node.classList.contains(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL) then 0 else 1)), 0)
      if lineNode.tagName == 'OL' || lineNode.tagName == 'UL'
        lineNode.appendChild(lineNode.ownerDocument.createElement('li'))
        lineNode = lineNode.firstChild
      lineNode.appendChild(lineNode.ownerDocument.createElement('br'))

  mergeAdjacent: (root) ->
    Scribe.Utils.traversePreorder(root, 0, (node) ->
      if node.nodeType == node.ELEMENT_NODE and !Scribe.Line.isLineNode(node) and Scribe.Utils.canModify(node)
        next = node.nextSibling
        if next?.tagName == node.tagName and node.tagName != 'LI'and Scribe.Utils.canModify(node) and Scribe.Utils.canModify(next)
          [nodeFormat, nodeValue] = Scribe.Utils.getFormatForContainer(node)
          [nextFormat, nextValue] = Scribe.Utils.getFormatForContainer(next)
          if nodeFormat == nextFormat && nodeValue == nextValue
            node = Scribe.Utils.mergeNodes(node, next)
      return node
    )

  removeNoBreak: (root) ->
    Scribe.Utils.traversePreorder(root, 0, (node) =>
      if node.nodeType == node.TEXT_NODE
        node.textContent = node.textContent.split(Scribe.Constants.NOBREAK_SPACE).join('')
      return node
    )

  removeRedundant: (root) ->
    scribeKey = _.uniqueId('_scribeFormats')
    root[scribeKey] = {}
    isRedudant = (node) ->
      if node.nodeType == node.ELEMENT_NODE && Scribe.Utils.canModify(node)
        if Scribe.Utils.getNodeLength(node) == 0
          return true
        [formatName, formatValue] = Scribe.Utils.getFormatForContainer(node)
        if formatName?
          return node.parentNode[scribeKey][formatName]?     # Parent format value will overwrite child's so no need to check formatValue
        else if node.tagName == 'SPAN'
          # Check if children need us
          if node.childNodes.length == 0 || !_.any(node.childNodes, (child) -> child.nodeType != child.ELEMENT_NODE)
            return true
          # Check if parent needs us
          if node.previousSibling == null && node.nextSibling == null && !Scribe.Line.isLineNode(node.parentNode) && node.parentNode.tagName != 'LI'
            return true
      return false
    Scribe.Utils.traversePreorder(root, 0, (node) =>
      if isRedudant(node)
        node = Scribe.Utils.unwrap(node)
      if node?
        node[scribeKey] = _.clone(node.parentNode[scribeKey])
        [formatName, formatValue] = Scribe.Utils.getFormatForContainer(node)
        node[scribeKey][formatName] = formatValue if formatName?
      return node
    )
    delete root[scribeKey]
    Scribe.Utils.traversePreorder(root, 0, (node) ->
      delete node[scribeKey]
      return node
    )
    
  wrapText: (root) ->
    Scribe.Utils.traversePreorder(root, 0, (node) =>
      node.normalize()
      if node.nodeType == node.TEXT_NODE && (node.nextSibling? || node.previousSibling? || node.parentNode == root || node.parentNode.tagName == 'LI')
        span = node.ownerDocument.createElement('span')
        Scribe.Utils.wrap(span, node)
        node = span
      return node
    )

  normalizeLineNode: (lineNode) ->
    # Removes extraneous classes, makes sure id is correct format, remove extraneous 

  normalizeTag: (node) ->
    # 

window.Scribe ||= {}
window.Scribe.Normalizer = ScribeNormalizer

