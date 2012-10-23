#= require underscore
#= require linked_list

class TandemLeaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'
  @TAB_NODE_CLASS: 'tab'

  @isLeafNode: (node) ->
    return false if !node?
    return false if node.classList.contains(Tandem.Constants.SPECIAL_CLASSES.EXTERNAL)
    return true if node.childNodes.length == 1 && node.firstChild.nodeType == node.TEXT_NODE
    return true if node.tagName == 'BR'
    return true if node.classList?.contains(Tandem.Leaf.TAB_NODE_CLASS)
    return false


  constructor: (@line, @node, attributes) ->
    @attributes = _.clone(attributes)
    @id = _.uniqueId(Tandem.Leaf.ID_PREFIX)
    if !@node.classList.contains(Tandem.Leaf.TAB_NODE_CLASS)
      @node.textContent = "" if @node.tagName == 'BR'
    else
      @node.classList.add(Tandem.Constants.ATOMIC_CLASS)
      @node.textContent = "\t"
    @text = @node.textContent
    @length = @text.length

  getAttributes: (excludeDefault = false) ->
    attributes = if excludeDefault then {} else _.clone(Tandem.Constants.DEFAULT_LEAF_ATTRIBUTES)
    return _.extend(attributes, @attributes, @line.attributes)

  insertText: (offset, text) ->
    @text = @text.substring(0, offset) + text + @text.substring(offset)
    [node, offset] = Tandem.Position.findDeepestNode(@line.doc.editor, @node, offset)
    node.textContent = node.textContent.substring(0, offset) + text + node.textContent.substring(offset)
    @length = @text.length



class TandemLeafIterator
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
    itr = new TandemLeafIterator(@start, @end)
    while next = itr.next()
      arr.push(next)
    return arr



window.Tandem ||= {}
window.Tandem.Leaf = TandemLeaf
window.Tandem.LeafIterator = TandemLeafIterator
