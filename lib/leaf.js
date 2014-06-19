var DOM, Format, Leaf, LinkedList, Utils, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

DOM = require('./dom');

Format = require('./format');

LinkedList = require('./lib/linked-list');

Utils = require('./utils');

Leaf = (function(_super) {
  __extends(Leaf, _super);

  Leaf.ID_PREFIX = 'leaf-';

  Leaf.isLeafNode = function(node) {
    return DOM.isTextNode(node) || (node.firstChild == null);
  };

  function Leaf(node, formats) {
    this.node = node;
    this.formats = _.clone(formats);
    this.id = _.uniqueId(Leaf.ID_PREFIX);
    this.text = DOM.getText(this.node);
    this.length = this.text.length;
  }

  Leaf.prototype.getFormats = function() {
    return this.formats;
  };

  Leaf.prototype.deleteText = function(offset, length) {
    var textNode;
    if (!(length > 0)) {
      return;
    }
    this.text = this.text.slice(0, offset) + this.text.slice(offset + length);
    this.length = this.text.length;
    if (DOM.EMBED_TAGS[this.node.tagName] != null) {
      textNode = this.node.ownerDocument.createTextNode(this.text);
      return this.node = DOM.replaceNode(textNode, this.node);
    } else {
      return DOM.setText(this.node, this.text);
    }
  };

  Leaf.prototype.insertText = function(offset, text) {
    var textNode;
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
    if (DOM.isTextNode(this.node)) {
      DOM.setText(this.node, this.text);
    } else {
      textNode = this.node.ownerDocument.createTextNode(text);
      if (this.node.tagName === DOM.DEFAULT_BREAK_TAG) {
        DOM.replaceNode(textNode, this.node);
      } else {
        this.node.appendChild(textNode);
      }
      this.node = textNode;
    }
    return this.length = this.text.length;
  };

  return Leaf;

})(LinkedList.Node);

module.exports = Leaf;
