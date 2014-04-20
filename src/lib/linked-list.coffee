# Inspired by http://blog.jcoglan.com/2007/07/23/writing-a-linked-list-in-javascript/

class Node
  constructor: (@data) ->
    @prev = @next = null


class LinkedList
  @Node: Node

  constructor: ->
    @length = 0
    @first = @last = null

  append: (node) ->
    if @first?
      node.next = null
      @last.next = node
    else
      @first = node
    node.prev = @last
    @last = node
    @length += 1

  insertAfter: (refNode, newNode) ->
    newNode.prev = refNode
    if refNode?
      newNode.next = refNode.next
      refNode.next.prev = newNode if refNode.next?
      refNode.next = newNode
      @last = newNode if refNode == @last
    else # Insert after null implies inserting at position 0
      newNode.next = @first
      @first.prev = newNode
      @first = newNode
    @length += 1

  remove: (node) ->
    if @length > 1
      node.prev.next = node.next if node.prev?
      node.next.prev = node.prev if node.next?
      @first = node.next if node == @first
      @last = node.prev if node == @last
    else
      @first = @last = null
    node.prev = node.next = null
    @length -= 1

  toArray: ->
    arr = []
    cur = @first
    while cur?
      arr.push(cur)
      cur = cur.next
    return arr


module.exports = LinkedList
