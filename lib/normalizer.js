var DOM, Normalizer, Utils, _;

_ = require('lodash');

DOM = require('./dom');

Utils = require('./utils');

Normalizer = {
  ALIASES: {
    'STRONG': 'B',
    'EM': 'I',
    'DEL': 'S',
    'STRIKE': 'S'
  },
  ATTRIBUTES: {
    'color': 'color',
    'face': 'fontFamily',
    'size': 'fontSize'
  },
  STYLES: {
    'background-color': 'background-color',
    'color': 'color',
    'font-family': 'font-family',
    'font-size': 'font-size',
    'text-align': 'text-align'
  },
  TAGS: {
    'P': 'P',
    'BR': 'BR',
    'SPAN': 'SPAN',
    'B': 'B',
    'I': 'I',
    'S': 'S',
    'U': 'U',
    'A': 'A',
    'IMG': 'IMG',
    'UL': 'UL',
    'LI': 'LI',
    'IFRAME': 'IFRAME'
  },
  handleBreaks: function(lineNode) {
    var breaks;
    breaks = _.map(lineNode.querySelectorAll(DOM.DEFAULT_BREAK_TAG));
    _.each(breaks, (function(_this) {
      return function(br) {
        if ((br.nextSibling != null) && (!DOM.isIE(10) || (br.previousSibling != null))) {
          return Utils.splitAncestors(br.nextSibling, lineNode.parentNode);
        }
      };
    })(this));
    return lineNode;
  },
  normalizeLine: function(lineNode) {
    lineNode = Normalizer.wrapInline(lineNode);
    lineNode = Normalizer.handleBreaks(lineNode);
    lineNode = Normalizer.pullBlocks(lineNode);
    lineNode = Normalizer.normalizeNode(lineNode);
    Normalizer.unwrapText(lineNode);
    return lineNode;
  },
  normalizeNode: function(node) {
    if (DOM.isTextNode(node)) {
      return node;
    }
    _.each(Normalizer.ATTRIBUTES, function(style, attribute) {
      var value;
      if (node.hasAttribute(attribute)) {
        value = node.getAttribute(attribute);
        if (attribute === 'size') {
          value = Utils.convertFontSize(value);
        }
        node.style[style] = value;
        return node.removeAttribute(attribute);
      }
    });
    Normalizer.whitelistStyles(node);
    return Normalizer.whitelistTags(node);
  },
  optimizeLine: function(lineNode) {
    var lineNodeLength, node, nodes, _results;
    lineNodeLength = Utils.getNodeLength(lineNode);
    nodes = DOM.getDescendants(lineNode);
    _results = [];
    while (nodes.length > 0) {
      node = nodes.pop();
      if ((node != null ? node.parentNode : void 0) == null) {
        continue;
      }
      if (DOM.EMBED_TAGS[node.tagName] != null) {
        continue;
      }
      if (node.tagName === DOM.DEFAULT_BREAK_TAG) {
        if (lineNodeLength !== 0) {
          _results.push(DOM.removeNode(node));
        } else {
          _results.push(void 0);
        }
      } else if (Utils.getNodeLength(node) === 0) {
        nodes.push(node.nextSibling);
        _results.push(DOM.unwrap(node));
      } else if ((node.previousSibling != null) && node.tagName === node.previousSibling.tagName) {
        if (_.isEqual(DOM.getAttributes(node), DOM.getAttributes(node.previousSibling))) {
          nodes.push(node.firstChild);
          _results.push(Utils.mergeNodes(node.previousSibling, node));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  pullBlocks: function(lineNode) {
    var curNode;
    curNode = lineNode.firstChild;
    while (curNode != null) {
      if ((DOM.BLOCK_TAGS[curNode.tagName] != null) && curNode.tagName !== 'LI') {
        if (curNode.previousSibling != null) {
          Utils.splitAncestors(curNode, lineNode.parentNode);
        }
        if (curNode.nextSibling != null) {
          Utils.splitAncestors(curNode.nextSibling, lineNode.parentNode);
        }
        if (DOM.LIST_TAGS[curNode.tagName] == null) {
          DOM.unwrap(curNode);
          Normalizer.pullBlocks(lineNode);
        } else {
          DOM.unwrap(curNode.parentNode);
          if (lineNode.parentNode == null) {
            lineNode = curNode;
          }
        }
        break;
      }
      curNode = curNode.nextSibling;
    }
    return lineNode;
  },
  stripComments: function(html) {
    return html.replace(/<!--[\s\S]*?-->/g, '');
  },
  stripWhitespace: function(html) {
    html = html.replace(/^\s+/, '').replace(/\s+$/, '');
    html = html.replace(/\>\s+\</g, '><');
    return html;
  },
  whitelistStyles: function(node) {
    var original, styles;
    original = DOM.getStyles(node);
    styles = _.omit(original, function(value, key) {
      return Normalizer.STYLES[key] == null;
    });
    if (_.keys(styles).length < _.keys(original).length) {
      if (_.keys(styles).length > 0) {
        return DOM.setStyles(node, styles);
      } else {
        return node.removeAttribute('style');
      }
    }
  },
  whitelistTags: function(node) {
    if (!DOM.isElement(node)) {
      return node;
    }
    if (Normalizer.ALIASES[node.tagName] != null) {
      node = DOM.switchTag(node, Normalizer.ALIASES[node.tagName]);
    }
    if (Normalizer.TAGS[node.tagName] == null) {
      if (DOM.BLOCK_TAGS[node.tagName] != null) {
        node = DOM.switchTag(node, DOM.DEFAULT_BLOCK_TAG);
      } else if (!node.hasAttributes() && (node.firstChild != null)) {
        node = DOM.unwrap(node);
      } else {
        node = DOM.switchTag(node, DOM.DEFAULT_INLINE_TAG);
      }
    }
    return node;
  },
  wrapInline: function(lineNode) {
    var blockNode, nextNode;
    if (DOM.BLOCK_TAGS[lineNode.tagName] != null) {
      return lineNode;
    }
    blockNode = lineNode.ownerDocument.createElement(DOM.DEFAULT_BLOCK_TAG);
    lineNode.parentNode.insertBefore(blockNode, lineNode);
    while ((lineNode != null) && (DOM.BLOCK_TAGS[lineNode.tagName] == null)) {
      nextNode = lineNode.nextSibling;
      blockNode.appendChild(lineNode);
      lineNode = nextNode;
    }
    return blockNode;
  },
  unwrapText: function(lineNode) {
    var spans;
    spans = _.map(lineNode.querySelectorAll(DOM.DEFAULT_INLINE_TAG));
    return _.each(spans, function(span) {
      var attributes;
      attributes = DOM.getAttributes(span);
      if (_.keys(attributes).length === 0) {
        return DOM.unwrap(span);
      }
    });
  }
};

module.exports = Normalizer;
