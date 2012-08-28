// Inspired by http://blog.jcoglan.com/2007/07/23/writing-a-linked-list-in-javascript/

function LinkedList() {}
LinkedList.prototype = {
  length: 0,
  first: null,
  last: null
};

LinkedList.prototype.append = function(node) {
  if (this.first === null) {
    this.first = node;
    this.last = node;
  } else {
    node.prev = this.last;
    node.next = null;
    this.last.next = node;
    this.last = node;
  }
  this.length++;
};

LinkedList.prototype.insertAfter = function(node, newNode) {
  newNode.prev = node;
  newNode.next = node.next;
  if (node.next !== null) {
    node.next.prev = newNode;
  }
  node.next = newNode;
  this.length++;
};

LinkedList.prototype.remove = function(node) {
  if (this.length > 1) {
    if (node.prev !== null) {
      node.prev.next = node.next;
    }
    if (node.next !== null) {
      node.next.prev = node.prev;
    }
    if (node == this.first) { this.first = node.next; }
    if (node == this.last) { this.last = node.prev; }
  } else {
    this.first = null;
    this.last = null;
  }
  node.prev = null;
  node.next = null;
  this.length--;
};

LinkedList.Node = function(data) {
  this.prev = null; this.next = null;
  this.data = data;
};
