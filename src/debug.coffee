window.Tandem ||= {}

window.Tandem.Debug = 
  getEditor: (editor) ->
    editor ||= Tandem.Editor.editors[0]
    return if _.isNumber(editor) then Tandem.Editor.editors[editor] else editor

  getHtml: (editor) ->
    doc = this.getDocument(editor)
    return doc.root

  getDocument: (editor) -> 
    editor = this.getEditor(editor)
    return editor.doc

  checkDocumentConsistency: (doc, output = false) ->
    nodesByLine = _.map(doc.root.childNodes, (lineNode) ->
      nodes = lineNode.querySelectorAll('*')
      return _.filter(nodes, (node) ->
        return node.nodeType == node.ELEMENT_NODE && !node.classList.contains(Tandem.Constants.SPECIAL_CLASSES.EXTERNAL) && (node.nodeName == 'BR' || !node.firstChild? || node.firstChild.nodeType == node.TEXT_NODE)
      )
    )
    lines = doc.lines.toArray()

    isConsistent = ->
      # doc.lines and doc.lineMap should match
      if lines.length != _.values(doc.lineMap).length
        console.error "doc.lines and doc.lineMap differ in length", lines.length, _.values(doc.lineMap).length
        return false
      return false if _.any(lines, (line) =>
        if !line? || doc.lineMap[line.id] != line
          if line?
            console.error line, "does not match", doc.lineMap[line.id]
          else
            console.error "null line"
          return true
        return false
      )
      # All leaves should still be in the DOM
      orphanedLeaf = orphanedLine = null
      if _.any(lines, (line) ->
        return _.any(line.leaves.toArray(), (leaf) ->
          if leaf.node.parentNode == null
            orphanedLeaf = leaf
            orphanedLine = line
            return true
          return false
        )
      )
        console.error 'Missing from DOM', orphanedLine, orphanedLeaf
        return false

      # All line lengths should be correct
      if _.any(lines, (line) ->
        lineLength = _.reduce(line.leaves.toArray(), (count, leaf) ->
          return leaf.length + count
        , 0)
        if lineLength != line.length
          console.error 'incorrect line length', lineLength, line.length
          return true
        return false
      )
        return false

      # All lists should have li tag
      if _.any(lines, (line) ->
        if (line.node.tagName == 'OL' || line.node.tagName == 'UL') && line.node.firstChild.tagName != 'LI'
          console.error 'inconsistent bullet/list', line
          return true
        return false
      )
        return false

      # Document length should be correct
      docLength = _.reduce(lines, (count, line) ->
        return line.length + count
      , lines.length)
      if docLength != doc.length
        console.error "incorrect document length", docLength, doc.length
        return false

      unless doc.trailingNewline
        console.error "trailingNewline is false"
        return false

      # doc.lines should match nodesByLine
      if lines.length != nodesByLine.length
        console.error "doc.lines and nodesByLine differ in length", lines, nodesByLine
        return false
      return false if _.any(lines, (line, index) =>
        calculatedLength = _.reduce(line.node.childNodes, ((length, node) -> Tandem.Utils.getNodeLength(node) + length), 0)
        if line.length != calculatedLength
          console.error line, line.length, calculatedLength, 'differ in length'
          return true
        leaves = line.leaves.toArray()
        leafNodes = _.map(leaves, (leaf) -> return leaf.node)
        if !_.isEqual(leafNodes, nodesByLine[index])
          console.error line, leafNodes, 'nodes differ from', nodesByLine[index]
          return true
        leaves = _.map(leaves, (leaf) -> 
          return _.pick(leaf, 'attributes', 'length', 'line', 'node', 'text')
        )
        line.rebuild()
        rebuiltLeaves = _.map(line.leaves.toArray(), (leaf) -> 
          return _.pick(leaf, 'attributes', 'length', 'line', 'node', 'text')
        )
        if !_.isEqual(leaves, rebuiltLeaves)
          console.error leaves, 'leaves differ from', rebuiltLeaves
          return true
        return false
      )
      return true

    if isConsistent()
      return true
    else
      if output
        console.error doc.root
        console.error nodesByLine 
        console.error lines
        console.error doc.lineMap
      return false

  Test:
    getRandomLength: ->
      rand = Math.random()
      if rand < 0.1
        return 1
      else if rand < 0.6
        return Math.floor(Math.random() * 3)
      else if rand < 0.8
        return Math.floor(Math.random() * 5)
      else if rand < 0.9
        return Math.floor(Math.random() * 10)
      else
        return Math.floor(Math.random() * 50)

    getRandomOperation: (editor, alphabet, attributes) ->
      attributeKeys = _.keys(attributes)
      rand = Math.random()
      if rand < 0.2
        index = 0
      else if rand < 0.4
        index = editor.doc.length
      else
        index = Math.floor(Math.random() * editor.doc.length)
      length = Tandem.Debug.Test.getRandomLength() + 1
      rand = Math.random()
      if rand < 0.5
        return {op: 'insertAt', args: [index, Tandem.Debug.Test.getRandomString(alphabet, length)]}
      length = Math.min(length, editor.doc.length - index)
      return null if length <= 0
      if rand < 0.75
        return {op: 'deleteAt', args: [index, length]}
      else
        attr = attributeKeys[Math.floor(Math.random() * attributeKeys.length)]
        value = attributes[attr][Math.floor(Math.random() * attributes[attr].length)]
        if attr == 'link' && value == true
          value = 'http://www.google.com'
        return {op: 'applyAttribute', args: [index, length, attr, value]}

    getRandomString: (alphabet, length) ->
      return _.map([0..(length - 1)], ->
        return alphabet[Math.floor(Math.random()*alphabet.length)]
      ).join('')



