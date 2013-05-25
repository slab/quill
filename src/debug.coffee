Scribe = require('./scribe')


Scribe.Debug =
  getEditor: (editor) ->
    editor ||= Scribe.Editor.editors[0]
    return if _.isNumber(editor) then Scribe.Editor.editors[editor] else editor

  getHtml: (editor) ->
    doc = this.getDocument(editor)
    return doc.root

  getDocument: (editor) ->
    editor = this.getEditor(editor)
    return editor.doc

  checkDocumentConsistency: (doc, output = false) ->
    isConsistent = ->
      nodesByLine = _.map(_.clone(doc.root.childNodes), (lineNode) ->
        nodes = lineNode.querySelectorAll('*')
        return _.filter(nodes, (node) ->
          return node.nodeType == node.ELEMENT_NODE && !node.classList.contains(Scribe.DOM.EXTERNAL_CLASS) && (node.nodeName == 'BR' || !node.firstChild? || node.firstChild.nodeType == node.TEXT_NODE)
        )
      )
      lines = doc.lines.toArray()

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
      # Line nodes and line's nodes should match
      if _.any(doc.root.childNodes, (lineNode, index) ->
        if lines[index].node != lineNode
          console.error "Line and nodes do not match", lines[index].node, lineNode
          return true
        return false
      )
        return false
      # All lines should still be in the DOM
      if _.any(lines, (line) ->
        if line.node.parentNode == null
          console.error 'Missing line from DOM', line
          return true
        return false
      )
        return false

      # All line lengths should be correct
      if _.any(lines, (line) ->
        lineLength = _.reduce(line.leaves.toArray(), (count, leaf) ->
          return leaf.length + count
        , 0)
        lineLength += 1 if line.trailingNewline
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

      # doc.lines should match nodesByLine
      if lines.length != nodesByLine.length
        console.error "doc.lines and nodesByLine differ in length", lines, nodesByLine
        return false
      return false if _.any(lines, (line, index) =>
        calculatedLength = _.reduce(line.node.childNodes, ((length, node) -> Scribe.Utils.getNodeLength(node) + length), 0)
        calculatedLength += 1 if line.trailingNewline
        if line.length != calculatedLength
          console.error line, line.length, calculatedLength, 'differ in length'
          return true
        leaves = line.leaves.toArray()
        leafNodes = _.map(leaves, (leaf) -> return leaf.node)
        if !_.isEqual(leafNodes, nodesByLine[index])
          console.error line, leafNodes, 'nodes differ from', nodesByLine[index]
          return true
        leaves = _.map(leaves, (leaf) -> 
          return _.pick(leaf, 'formats', 'length', 'line', 'node', 'text')
        )
        line.rebuild()
        rebuiltLeaves = _.map(line.leaves.toArray(), (leaf) -> 
          return _.pick(leaf, 'formats', 'length', 'line', 'node', 'text')
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
        return _.random(0, 2)
      else if rand < 0.8
        return _.random(3, 4)
      else if rand < 0.9
        return _.random(5, 9)
      else
        return _.random(10, 50)

    getRandomOperation: (editor, alphabet, formats) ->
      formatKeys = _.keys(formats)
      rand = Math.random()
      lengthLimit = editor.getLength() - 1
      if rand < 0.2
        index = 0
      else if rand < 0.4
        index = lengthLimit
      else
        index = _.random(0, lengthLimit)
      length = Scribe.Debug.Test.getRandomLength() + 1
      rand = Math.random()
      if rand < 0.5
        return {op: 'insertAt', args: [index, Scribe.Debug.Test.getRandomString(alphabet, length), {}]}
      if rand < 0.75
        return null if index + length > lengthLimit
        return {op: 'deleteAt', args: [index, length - 1]}
      else
        format = formatKeys[_.random(0, formatKeys.length - 1)]
        value = formats[format][_.random(0, formats[format].length - 1)]
        if format == 'link' && value == true
          value = 'http://www.google.com'
        return {op: 'formatAt', args: [index, length, format, value]}

    getRandomString: (alphabet, length) ->
      return _.map([0..(length - 1)], ->
        return alphabet[_.random(0, alphabet.length - 1)]
      ).join('')


module.exports = Scribe
