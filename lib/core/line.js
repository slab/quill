var Delta, Format, Leaf, Line, LinkedList, Normalizer, dom, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

Delta = require('rich-text').Delta;

dom = require('../lib/dom');

Format = require('./format');

Leaf = require('./leaf');

Line = require('./line');

LinkedList = require('../lib/linked-list');

Normalizer = require('../lib/normalizer');

Line = (function(_super) {
  __extends(Line, _super);

  Line.CLASS_NAME = 'line';

  Line.ID_PREFIX = 'line-';

  function Line(doc, node) {
    this.doc = doc;
    this.node = node;
    this.id = _.uniqueId(Line.ID_PREFIX);
    this.formats = {};
    dom(this.node).addClass(Line.CLASS_NAME);
    this.rebuild();
    Line.__super__.constructor.call(this, this.node);
  }

  Line.prototype.buildLeaves = function(node, formats) {
    return _.each(dom(node).childNodes(), (function(_this) {
      return function(node) {
        var nodeFormats;
        node = Normalizer.normalizeNode(node);
        nodeFormats = _.clone(formats);
        _.each(_this.doc.formats, function(format, name) {
          if (!format.isType(Format.types.LINE) && format.match(node)) {
            return nodeFormats[name] = format.value(node);
          }
        });
        if (Leaf.isLeafNode(node)) {
          return _this.leaves.append(new Leaf(node, nodeFormats));
        } else {
          return _this.buildLeaves(node, nodeFormats);
        }
      };
    })(this));
  };

  Line.prototype.deleteText = function(offset, length) {
    var deleteLength, leaf, _ref;
    if (!(length > 0)) {
      return;
    }
    _ref = this.findLeafAt(offset), leaf = _ref[0], offset = _ref[1];
    while ((leaf != null) && length > 0) {
      deleteLength = Math.min(length, leaf.length - offset);
      leaf.deleteText(offset, deleteLength);
      length -= deleteLength;
      leaf = leaf.next;
      offset = 0;
    }
    return this.rebuild();
  };

  Line.prototype.findLeaf = function(leafNode) {
    var curLeaf;
    curLeaf = this.leaves.first;
    while (curLeaf != null) {
      if (curLeaf.node === leafNode) {
        return curLeaf;
      }
      curLeaf = curLeaf.next;
    }
    return null;
  };

  Line.prototype.findLeafAt = function(offset, inclusive) {
    var leaf;
    if (inclusive == null) {
      inclusive = false;
    }
    if (offset >= this.length - 1) {
      return [this.leaves.last, this.leaves.last.length];
    }
    leaf = this.leaves.first;
    while (leaf != null) {
      if (offset < leaf.length || (offset === leaf.length && inclusive)) {
        return [leaf, offset];
      }
      offset -= leaf.length;
      leaf = leaf.next;
    }
    return [this.leaves.last, offset - this.leaves.last.length];
  };

  Line.prototype.format = function(name, value) {
    var formats;
    if (_.isObject(name)) {
      formats = name;
    } else {
      formats = {};
      formats[name] = value;
    }
    _.each(formats, (function(_this) {
      return function(value, name) {
        var format;
        format = _this.doc.formats[name];
        if (format.isType(Format.types.LINE)) {
          if (format.config.exclusive) {
            _this.node = format.removeConflicting(_this.node, _this.doc.formats, _this.formats);
          }
          _this.node = format.add(_this.node, value);
        }
        if (value) {
          return _this.formats[name] = value;
        } else {
          return delete _this.formats[name];
        }
      };
    })(this));
    return this.resetContent();
  };

  Line.prototype.formatText = function(offset, length, name, value) {
    var format, leaf, leafOffset, leftNode, nextLeaf, rightNode, targetNode, _ref, _ref1, _ref2;
    _ref = this.findLeafAt(offset), leaf = _ref[0], leafOffset = _ref[1];
    format = this.doc.formats[name];
    if (!((format != null) && format.config.type !== Format.types.LINE)) {
      return;
    }
    while ((leaf != null) && length > 0) {
      nextLeaf = leaf.next;
      if ((value && leaf.formats[name] !== value) || (!value && (leaf.formats[name] != null))) {
        targetNode = leaf.node;
        if (leaf.formats[name] != null) {
          dom(targetNode).splitAncestors(this.node);
          while (!format.match(targetNode)) {
            targetNode = targetNode.parentNode;
          }
        }
        if (leafOffset > 0) {
          _ref1 = dom(targetNode).split(leafOffset), leftNode = _ref1[0], targetNode = _ref1[1];
        }
        if (leaf.length > leafOffset + length) {
          _ref2 = dom(targetNode).split(length), targetNode = _ref2[0], rightNode = _ref2[1];
        }
        format.add(targetNode, value);
      }
      length -= leaf.length - leafOffset;
      leafOffset = 0;
      leaf = nextLeaf;
    }
    return this.rebuild();
  };

  Line.prototype.insertText = function(offset, text, formats) {
    var leaf, leafOffset, nextNode, node, prevNode, _ref, _ref1;
    if (formats == null) {
      formats = {};
    }
    if (!(text.length > 0)) {
      return;
    }
    _ref = this.findLeafAt(offset), leaf = _ref[0], leafOffset = _ref[1];
    if (_.isEqual(leaf.formats, formats)) {
      leaf.insertText(leafOffset, text);
      return this.resetContent();
    } else {
      node = _.reduce(formats, (function(_this) {
        return function(node, value, name) {
          return _this.doc.formats[name].add(node, value);
        };
      })(this), this.node.ownerDocument.createTextNode(text));
      _ref1 = dom(leaf.node).split(leafOffset), prevNode = _ref1[0], nextNode = _ref1[1];
      if (nextNode) {
        nextNode = dom(nextNode).splitAncestors(this.node).get();
      }
      this.node.insertBefore(node, nextNode);
      return this.rebuild();
    }
  };

  Line.prototype.optimize = function() {
    Normalizer.optimizeLine(this.node);
    return this.rebuild();
  };

  Line.prototype.rebuild = function(force) {
    if (force == null) {
      force = false;
    }
    if (!force && (this.outerHTML != null) && this.outerHTML === this.node.outerHTML) {
      if (_.all(this.leaves.toArray(), (function(_this) {
        return function(leaf) {
          return dom(leaf.node).isAncestor(_this.node);
        };
      })(this))) {
        return false;
      }
    }
    this.node = Normalizer.normalizeNode(this.node);
    if (dom(this.node).length() === 0 && !this.node.querySelector(dom.DEFAULT_BREAK_TAG)) {
      this.node.appendChild(this.node.ownerDocument.createElement(dom.DEFAULT_BREAK_TAG));
    }
    this.leaves = new LinkedList();
    this.formats = _.reduce(this.doc.formats, (function(_this) {
      return function(formats, format, name) {
        if (format.isType(Format.types.LINE)) {
          if (format.match(_this.node)) {
            formats[name] = format.value(_this.node);
          } else {
            delete formats[name];
          }
        }
        return formats;
      };
    })(this), this.formats);
    this.buildLeaves(this.node, {});
    this.resetContent();
    return true;
  };

  Line.prototype.resetContent = function() {
    if (this.node.id !== this.id) {
      this.node.id = this.id;
    }
    this.outerHTML = this.node.outerHTML;
    this.length = 1;
    this.delta = new Delta();
    _.each(this.leaves.toArray(), (function(_this) {
      return function(leaf) {
        _this.length += leaf.length;
        if (dom.EMBED_TAGS[leaf.node.tagName] != null) {
          return _this.delta.insert(1, leaf.formats);
        } else {
          return _this.delta.insert(leaf.text, leaf.formats);
        }
      };
    })(this));
    return this.delta.insert('\n', this.formats);
  };

  return Line;

})(LinkedList.Node);

module.exports = Line;
