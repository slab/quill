JS.LinkedList = new JS.Class('LinkedList', {
  include: JS.Enumerable || {},
  
  initialize: function(array, useNodes) {
    this.length = 0;
    this.first = this.last = null;
    if (!array) return;
    for (var i = 0, n = array.length; i < n; i++)
      this.push( useNodes ? new this.klass.Node(array[i]) : array[i] );
  },
  
  forEach: function(block, context) {
    if (!block) return this.enumFor('forEach');
    block = JS.Enumerable.toFn(block);
    
    var node   = this.first,
        next, i, n;
    
    for (i = 0, n = this.length; i < n; i++) {
      next = node.next;
      block.call(context || null, node, i);
      if (node === this.last) break;
      node = next;
    }
    return this;
  },
  
  at: function(n) {
    if (n < 0 || n >= this.length) return undefined;
    var node = this.first;
    while (n--) node = node.next;
    return node;
  },
  
  pop: function() {
    return this.length ? this.remove(this.last) : undefined;
  },
  
  shift: function() {
    return this.length ? this.remove(this.first) : undefined;
  },
  
  // stubs - should be implemented by concrete list types
  insertAfter:  function() {},
  push:         function() {},
  remove:       function() {},
  
  extend: {
    Node: new JS.Class({
      initialize: function(data) {
        this.data = data;
        this.prev = this.next = this.list = null;
      }
    })
  }
});

JS.LinkedList.Doubly = new JS.Class('LinkedList.Doubly', JS.LinkedList, {
  insertAt: function(n, newNode) {
    if (n < 0 || n >= this.length) return;
    this.insertBefore(this.at(n), newNode);
  },
  
  unshift: function(newNode) {
    this.length > 0
        ? this.insertBefore(this.first, newNode)
        : this.push(newNode);
  },
  
  insertBefore: function() {}
});

JS.LinkedList.insertTemplate = function(prev, next, pos) {
  return function(node, newNode) {
    if (node.list !== this) return;
    newNode[prev] = node;
    newNode[next] = node[next];
    node[next] = (node[next][prev] = newNode);
    if (newNode[prev] === this[pos]) this[pos] = newNode;
    newNode.list = this;
    this.length++;
  };
};

JS.LinkedList.Doubly.Circular = new JS.Class('LinkedList.Doubly.Circular', JS.LinkedList.Doubly, {
  insertAfter: JS.LinkedList.insertTemplate('prev', 'next', 'last'),
  insertBefore: JS.LinkedList.insertTemplate('next', 'prev', 'first'),
  
  push: function(newNode) {
    if (this.length)
      return this.insertAfter(this.last, newNode);
    
    this.first = this.last =
        newNode.prev = newNode.next = newNode;
    
    newNode.list = this;
    this.length = 1;
  },
  
  remove: function(removed) {
    if (removed.list !== this || this.length === 0) return null;
    if (this.length > 1) {
      removed.prev.next = removed.next;
      removed.next.prev = removed.prev;
      if (removed === this.first) this.first = removed.next;
      if (removed === this.last) this.last = removed.prev;
    } else {
      this.first = this.last = null;
    }
    removed.prev = removed.next = removed.list = null;
    this.length--;
    return removed;
  }
});