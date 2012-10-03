#= require underscore
#= require linked_list

class TandemLeaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'
  @TAB_NODE_CLASS: 'tab'

  @isLeafNode: (node) ->
    return true if node.childNodes.length == 1 && node.firstChild.nodeType == node.TEXT_NODE
    return true if node.tagName == 'BR'
    return true if node.classList.contains(Tandem.Leaf.TAB_NODE_CLASS)


  constructor: (@line, @node, attributes) ->
    @attributes = _.clone(attributes)
    @id = _.uniqueId(Tandem.Leaf.ID_PREFIX)
    if !@node.classList.contains(Tandem.Leaf.TAB_NODE_CLASS)
      @text = @node.textContent
      @length = @text.length
    else
      @length = 1
      @text = "\t"
      @node.textContent = "\t"
      @node.setAttribute('contenteditable', false)


  getAttributes: ->
    return _.extend({}, @attributes, @line.attributes)

  setText: (@text) ->
    @node.textContent = @text
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
