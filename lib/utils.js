var DOM, Utils, _;

_ = require('lodash');

DOM = require('./dom');

Utils = {
  convertFontSize: function(size) {
    var i, s, sources, targets;
    if (_.isString(size) && size.indexOf('px') > -1) {
      sources = _.keys(DOM.FONT_SIZES);
      targets = _.values(DOM.FONT_SIZES);
    } else {
      targets = _.keys(DOM.FONT_SIZES);
      sources = _.values(DOM.FONT_SIZES);
    }
    for (i in sources) {
      s = sources[i];
      if (parseInt(size) <= parseInt(s)) {
        return targets[i];
      }
    }
    return _.last(targets);
  },
  getChildAtOffset: function(node, offset) {
    var child, length;
    child = node.firstChild;
    length = Utils.getNodeLength(child);
    while (child != null) {
      if (offset < length) {
        break;
      }
      offset -= length;
      child = child.nextSibling;
      length = Utils.getNodeLength(child);
    }
    if (child == null) {
      child = node.lastChild;
      offset = Utils.getNodeLength(child);
    }
    return [child, offset];
  },
  getNextLineNode: function(curNode, root) {
    var nextNode;
    nextNode = curNode.nextSibling;
    if ((nextNode == null) && curNode.parentNode !== root) {
      nextNode = curNode.parentNode.nextSibling;
    }
    if ((nextNode != null) && (DOM.LIST_TAGS[nextNode.tagName] != null)) {
      nextNode = nextNode.firstChild;
    }
    return nextNode;
  },
  getNodeLength: function(node) {
    var length;
    if (node == null) {
      return 0;
    }
    length = DOM.getText(node).length;
    if (DOM.isElement(node)) {
      length += node.querySelectorAll(_.keys(DOM.EMBED_TAGS).join(',')).length;
    }
    return length;
  },
  isIE: function(maxVersion) {
    var version;
    version = document.documentMode;
    return version && maxVersion >= version;
  },
  mergeNodes: function(newNode, oldNode) {
    var text;
    if (DOM.isElement(newNode)) {
      DOM.moveChildren(newNode, oldNode);
      DOM.normalize(newNode);
    } else {
      text = DOM.getText(newNode) + DOM.getText(oldNode);
      DOM.setText(newNode, text);
    }
    return DOM.removeNode(oldNode);
  },
  splitAncestors: function(refNode, root, force) {
    var nextNode, parentClone, parentNode;
    if (force == null) {
      force = false;
    }
    if (refNode === root || refNode.parentNode === root) {
      return refNode;
    }
    if ((refNode.previousSibling != null) || force) {
      parentNode = refNode.parentNode;
      parentClone = parentNode.cloneNode(false);
      parentNode.parentNode.insertBefore(parentClone, parentNode.nextSibling);
      while (refNode != null) {
        nextNode = refNode.nextSibling;
        parentClone.appendChild(refNode);
        refNode = nextNode;
      }
      return Utils.splitAncestors(parentClone, root);
    } else {
      return Utils.splitAncestors(refNode.parentNode, root);
    }
  },
  splitNode: function(node, offset, force) {
    var after, child, childLeft, childRight, left, nextRight, nodeLength, right, _ref, _ref1;
    if (force == null) {
      force = false;
    }
    nodeLength = Utils.getNodeLength(node);
    offset = Math.max(0, offset);
    offset = Math.min(offset, nodeLength);
    if (!(force || offset !== 0)) {
      return [node.previousSibling, node, false];
    }
    if (!(force || offset !== nodeLength)) {
      return [node, node.nextSibling, false];
    }
    if (node.nodeType === DOM.TEXT_NODE) {
      after = node.splitText(offset);
      return [node, after, true];
    } else {
      left = node;
      right = node.cloneNode(false);
      node.parentNode.insertBefore(right, left.nextSibling);
      _ref = Utils.getChildAtOffset(node, offset), child = _ref[0], offset = _ref[1];
      _ref1 = Utils.splitNode(child, offset), childLeft = _ref1[0], childRight = _ref1[1];
      while (childRight !== null) {
        nextRight = childRight.nextSibling;
        right.appendChild(childRight);
        childRight = nextRight;
      }
      return [left, right, true];
    }
  }
};

module.exports = Utils;
