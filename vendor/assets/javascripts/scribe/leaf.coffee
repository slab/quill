class ScribeLeaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'

  @isLeafNode: (node) ->
    return false unless node?.nodeType == node.ELEMENT_NODE
    return false unless Scribe.DOM.canEdit(node)
    return true if node.tagName == 'BR'
    childNodes = Scribe.DOM.filterUneditable(node.childNodes)
    return true if childNodes.length == 1 && childNodes[0].nodeType == node.TEXT_NODE
    return false

  @isLeafParent: (node) ->
    return false unless node?.nodeType == node.ELEMENT_NODE
    return false unless Scribe.DOM.canEdit(node)
    childNodes = Scribe.DOM.filterUneditable(node.childNodes)
    return false if childNodes.length == 0
    return childNodes.length > 1 or childNodes[0].nodeType != node.TEXT_NODE

  constructor: (@line, @node, formats) ->
    @formats = _.clone(formats)
    @id = _.uniqueId(Scribe.Leaf.ID_PREFIX)
    @node.textContent = "" if @node.tagName == 'BR'
    @text = @node.textContent
    @length = @text.length

  getFormats: (excludeDefault = false) ->
    formats = if excludeDefault then {} else _.clone(Scribe.Constants.DEFAULT_LEAF_FORMATS)
    return _.extend(formats, @formats, @line.formats)

  getLineOffset: ->
    return Scribe.Position.getIndex(@node, 0, @line.node)

  insertText: (offset, text) ->
    @text = @text.substring(0, offset) + text + @text.substring(offset)
    [node, offset] = Scribe.Position.findDeepestNode(@line.doc.editor, @node, offset)
    node.textContent = node.textContent.substring(0, offset) + text + node.textContent.substring(offset)
    @length = @text.length


class ScribeLeafIterator
  # Start and end are both inclusive
  # Otherwise if end is inclusive, we cannot express end of line unambiguously
  constructor: (@start, @end) ->
    @cur = @start

  next: -> 
    ret = @cur
    if @cur == @end || @cur == null
      @cur = null
    else if @cur.next?
      @cur = @cur.next
    else
      line = @cur.line.next
      while line? && line.leaves.length == 0
        line = line.next
      @cur = if line? then line.leaves.first else null
    return ret

  toArray: ->
    arr = []
    itr = new Scribe.LeafIterator(@start, @end)
    while next = itr.next()
      arr.push(next)
    return arr


window.Scribe or= {}
window.Scribe.Leaf = ScribeLeaf
window.Scribe.LeafIterator = ScribeLeafIterator
