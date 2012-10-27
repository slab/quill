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
        return node.nodeType == node.ELEMENT_NODE && (node.nodeName == 'BR' || node.firstChild.nodeType == node.TEXT_NODE)
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
      )
        return false

      # Document length should be correct
      docLength = _.reduce(lines, (count, line) ->
        return line.length + count
      , lines.length - 1)
      if docLength != doc.length
        console.error "incorrect document length", docLength, doc.length
        return false

      # doc.lines should match nodesByLine
      if lines.length != nodesByLine.length
        console.error "doc.lines and nodesByLine differ in length"
        return false
      return false if _.any(lines, (line, index) =>
        if line.length != line.node.textContent.length
          console.error line, line.length, line.node.textContent.length, 'differ in length'
          return true
        leaves = line.leaves.toArray()
        leafNodes = _.map(leaves, (leaf) -> return leaf.node)
        if !_.isEqual(leafNodes, nodesByLine[index])
          console.error leafNodes, 'nodes differ from', nodesByLine[index]
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



