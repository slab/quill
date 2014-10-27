var Normalizer, dom, _;

_ = require('lodash');

dom = require('./dom');

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
    'DIV': 'DIV',
    'P': 'P',
    'BR': 'BR',
    'SPAN': 'SPAN',
    'B': 'B',
    'H1': 'H1',
    'H2': 'H2',
    'H3': 'H3',
    'I': 'I',
    'S': 'S',
    'U': 'U',
    'A': 'A',
    'IMG': 'IMG',
    'OL': 'OL',
    'UL': 'UL',
    'LI': 'LI'
  },
  handleBreaks: function(lineNode) {
    var breaks;
    breaks = _.map(lineNode.querySelectorAll(dom.DEFAULT_BREAK_TAG));
    _.each(breaks, (function(_this) {
      return function(br) {
        if ((br.nextSibling != null) && (!dom.isIE(10) || (br.previousSibling != null))) {
          return dom(br.nextSibling).splitAncestors(lineNode.parentNode);
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
    if ((lineNode != null) && (dom.LIST_TAGS[lineNode.tagName] != null)) {
      lineNode = lineNode.firstChild;
    }
    return lineNode;
  },
  normalizeNode: function(node) {
    if (dom(node).isTextNode()) {
      return node;
    }
    _.each(Normalizer.ATTRIBUTES, function(style, attribute) {
      var value;
      if (node.hasAttribute(attribute)) {
        value = node.getAttribute(attribute);
        if (attribute === 'size') {
          value = dom.convertFontSize(value);
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
    lineNodeLength = dom(lineNode).length();
    nodes = dom(lineNode).descendants();
    _results = [];
    while (nodes.length > 0) {
      node = nodes.pop();
      if ((node != null ? node.parentNode : void 0) == null) {
        continue;
      }
      if (dom.EMBED_TAGS[node.tagName] != null) {
        continue;
      }
      if (node.tagName === dom.DEFAULT_BREAK_TAG) {
        if (lineNodeLength !== 0) {
          _results.push(dom(node).remove());
        } else {
          _results.push(void 0);
        }
      } else if (dom(node).length() === 0) {
        nodes.push(node.nextSibling);
        _results.push(dom(node).unwrap());
      } else if ((node.previousSibling != null) && node.tagName === node.previousSibling.tagName) {
        if (_.isEqual(dom(node).attributes(), dom(node.previousSibling).attributes())) {
          nodes.push(node.firstChild);
          _results.push(dom(node.previousSibling).merge(node));
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
      if ((dom.BLOCK_TAGS[curNode.tagName] != null) && curNode.tagName !== 'LI') {
        if (curNode.previousSibling != null) {
          dom(curNode).splitAncestors(lineNode.parentNode);
        }
        if (curNode.nextSibling != null) {
          dom(curNode.nextSibling).splitAncestors(lineNode.parentNode);
        }
        if ((dom.LIST_TAGS[curNode.tagName] == null) || !curNode.firstChild) {
          dom(curNode).unwrap();
          Normalizer.pullBlocks(lineNode);
        } else {
          dom(curNode.parentNode).unwrap();
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
    html = html.replace(/^\s+/, '').replace(/\s+$/, '');
    html = html.replace(/(\r?\n|\r)+/g, ' ');
    html = html.replace(/\>\s+\</g, '><');
    return html;
  },
  whitelistStyles: function(node) {
    var original, styles;
    original = dom(node).styles();
    styles = _.omit(original, function(value, key) {
      return Normalizer.STYLES[key] == null;
    });
    if (Object.keys(styles).length < Object.keys(original).length) {
      if (Object.keys(styles).length > 0) {
        return dom(node).styles(styles, true);
      } else {
        return node.removeAttribute('style');
      }
    }
  },
  whitelistTags: function(node) {
    if (!dom(node).isElement()) {
      return node;
    }
    if (Normalizer.ALIASES[node.tagName] != null) {
      node = dom(node).switchTag(Normalizer.ALIASES[node.tagName]);
    } else if (Normalizer.TAGS[node.tagName] == null) {
      if (dom.BLOCK_TAGS[node.tagName] != null) {
        node = dom(node).switchTag(dom.DEFAULT_BLOCK_TAG);
      } else if (!node.hasAttributes() && (node.firstChild != null)) {
        node = dom(node).unwrap();
      } else {
        node = dom(node).switchTag(dom.DEFAULT_INLINE_TAG);
      }
    }
    return node;
  },
  wrapInline: function(lineNode) {
    var blockNode, nextNode;
    if (dom.BLOCK_TAGS[lineNode.tagName] != null) {
      return lineNode;
    }
    blockNode = lineNode.ownerDocument.createElement(dom.DEFAULT_BLOCK_TAG);
    lineNode.parentNode.insertBefore(blockNode, lineNode);
    while ((lineNode != null) && (dom.BLOCK_TAGS[lineNode.tagName] == null)) {
      nextNode = lineNode.nextSibling;
      blockNode.appendChild(lineNode);
      lineNode = nextNode;
    }
    return blockNode;
  },
  unwrapText: function(lineNode) {
    var spans;
    spans = _.map(lineNode.querySelectorAll(dom.DEFAULT_INLINE_TAG));
    return _.each(spans, function(span) {
      if (!span.hasAttributes()) {
        return dom(span).unwrap();
      }
    });
  }
};

module.exports = Normalizer;
