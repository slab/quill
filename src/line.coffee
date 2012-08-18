#= require underscore

class TandemLine
  @CLASS_NAME: 'line'

  constructor: (@node, @id, @index) ->
    @leaves = []
    this.normalizeHTML()
    this.buildLeaves()
    @length = @node.textContent.length
    @innerHTML = @node.innerHTML


  buildLeaves: ->
    leafNodes = _.filter(@node.querySelectorAll("*"), (node) ->
      return node.childNodes.length == 1 && node.firstChild.nodeType == node.TEXT_NODE
    )
    @leaves = _.map(leafNodes, (leaf) ->
      return new Tandem.Leaf(leaf)
    )

  normalizeHTML: ->




window.Tandem ||= {}
window.Tandem.Line = TandemLine
