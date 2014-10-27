var Format, dom, _;

_ = require('lodash');

dom = require('../lib/dom');

Format = (function() {
  Format.types = {
    LINE: 'line'
  };

  Format.FORMATS = {
    firstheader: {
      type: Format.types.LINE,
      exclusive: true,
      tag: 'H1',
      prepare: 'firstheader'
    },
    secondheader: {
      type: Format.types.LINE,
      exclusive: true,
      tag: 'H2',
      prepare: 'secondheader'
    },
    thirdheader: {
      type: Format.types.LINE,
      exclusive: true,
      tag: 'H3',
      prepare: 'thirdheader'
    },
    bold: {
      tag: 'B',
      prepare: 'bold'
    },
    italic: {
      tag: 'I',
      prepare: 'italic'
    },
    underline: {
      tag: 'U',
      prepare: 'underline'
    },
    strike: {
      tag: 'S',
      prepare: 'strikeThrough'
    },
    color: {
      style: 'color',
      "default": 'rgb(0, 0, 0)',
      prepare: 'foreColor'
    },
    background: {
      style: 'backgroundColor',
      "default": 'rgb(255, 255, 255)',
      prepare: 'backColor'
    },
    font: {
      style: 'fontFamily',
      "default": "'Helvetica', 'Arial', sans-serif",
      prepare: 'fontName'
    },
    size: {
      style: 'fontSize',
      "default": '13px',
      prepare: function(doc, value) {
        return doc.execCommand('fontSize', false, dom.convertFontSize(value));
      }
    },
    link: {
      tag: 'A',
      attribute: 'href'
    },
    image: {
      tag: 'IMG',
      attribute: 'src'
    },
    align: {
      type: Format.types.LINE,
      style: 'textAlign',
      "default": 'left'
    },
    bullet: {
      type: Format.types.LINE,
      exclusive: true,
      parentTag: 'UL',
      tag: 'LI'
    },
    list: {
      type: Format.types.LINE,
      exclusive: true,
      parentTag: 'OL',
      tag: 'LI'
    }
  };

  function Format(document, config) {
    this.document = document;
    this.config = config;
  }

  Format.prototype.add = function(node, value) {
    var formatNode, inline, parentNode, _ref, _ref1;
    if (!value) {
      return this.remove(node);
    }
    if (this.value(node) === value) {
      return node;
    }
    if (_.isString(this.config.parentTag)) {
      parentNode = this.document.createElement(this.config.parentTag);
      dom(node).wrap(parentNode);
      if (node.parentNode.tagName === ((_ref = node.parentNode.previousSibling) != null ? _ref.tagName : void 0)) {
        dom(node.parentNode.previousSibling).merge(node.parentNode);
      }
      if (node.parentNode.tagName === ((_ref1 = node.parentNode.nextSibling) != null ? _ref1.tagName : void 0)) {
        dom(node.parentNode).merge(node.parentNode.nextSibling);
      }
    }
    if (_.isString(this.config.tag)) {
      formatNode = this.document.createElement(this.config.tag);
      if (dom.VOID_TAGS[formatNode.tagName] != null) {
        if (node.parentNode != null) {
          dom(node).replace(formatNode);
        }
        node = formatNode;
      } else if (this.isType(Format.types.LINE)) {
        node = dom(node).switchTag(this.config.tag);
      } else {
        dom(node).wrap(formatNode);
        node = formatNode;
      }
    }
    if (_.isString(this.config.style) || _.isString(this.config.attribute) || _.isString(this.config["class"])) {
      if (_.isString(this.config["class"])) {
        node = this.remove(node);
      }
      if (dom(node).isTextNode()) {
        inline = this.document.createElement(dom.DEFAULT_INLINE_TAG);
        dom(node).wrap(inline);
        node = inline;
      }
      if (_.isString(this.config.style)) {
        if (value !== this.config["default"]) {
          node.style[this.config.style] = value;
        }
      }
      if (_.isString(this.config.attribute)) {
        node.setAttribute(this.config.attribute, value);
      }
      if (_.isString(this.config["class"])) {
        dom(node).addClass(this.config["class"] + value);
      }
    }
    return node;
  };

  Format.prototype.isType = function(type) {
    return type === this.config.type;
  };

  Format.prototype.match = function(node) {
    var c, _i, _len, _ref, _ref1;
    if (!dom(node).isElement()) {
      return false;
    }
    if (_.isString(this.config.parentTag) && ((_ref = node.parentNode) != null ? _ref.tagName : void 0) !== this.config.parentTag) {
      return false;
    }
    if (_.isString(this.config.tag) && node.tagName !== this.config.tag) {
      return false;
    }
    if (_.isString(this.config.style) && (!node.style[this.config.style] || node.style[this.config.style] === this.config["default"])) {
      return false;
    }
    if (_.isString(this.config.attribute) && !node.hasAttribute(this.config.attribute)) {
      return false;
    }
    if (_.isString(this.config["class"])) {
      _ref1 = dom(node).classes();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        if (c.indexOf(this.config["class"]) === 0) {
          return true;
        }
      }
      return false;
    }
    return true;
  };

  Format.prototype.prepare = function(value) {
    if (_.isString(this.config.prepare)) {
      return this.document.execCommand(this.config.prepare, false, value);
    } else if (_.isFunction(this.config.prepare)) {
      return this.config.prepare(this.document, value);
    }
  };

  Format.prototype.remove = function(node) {
    var c, _i, _len, _ref;
    if (!this.match(node)) {
      return node;
    }
    if (_.isString(this.config.style)) {
      node.style[this.config.style] = '';
      if (!node.getAttribute('style')) {
        node.removeAttribute('style');
      }
    }
    if (_.isString(this.config.attribute)) {
      node.removeAttribute(this.config.attribute);
    }
    if (_.isString(this.config["class"])) {
      _ref = dom(node).classes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c.indexOf(this.config["class"]) === 0) {
          dom(node).removeClass(c);
        }
      }
      if (!node.getAttribute('class')) {
        node.removeAttribute('class');
      }
    }
    if (_.isString(this.config.tag)) {
      if (this.isType(Format.types.LINE)) {
        if (_.isString(this.config.parentTag)) {
          if (node.previousSibling != null) {
            dom(node).splitAncestors(node.parentNode.parentNode);
          }
          if (node.nextSibling != null) {
            dom(node.nextSibling).splitAncestors(node.parentNode.parentNode);
          }
        }
        node = dom(node).switchTag(dom.DEFAULT_BLOCK_TAG);
      } else {
        node = dom(node).switchTag(dom.DEFAULT_INLINE_TAG);
        if (dom.EMBED_TAGS[this.config.tag] != null) {
          dom(node).text(dom.EMBED_TEXT);
        }
      }
    }
    if (_.isString(this.config.parentTag)) {
      dom(node.parentNode).unwrap();
    }
    if (node.tagName === dom.DEFAULT_INLINE_TAG && !node.hasAttributes()) {
      node = dom(node).unwrap();
    }
    return node;
  };

  Format.prototype.removeConflicting = function(node, conflicting, currentFormats) {
    _.each(conflicting, (function(_this) {
      return function(format, name) {
        if (!format.config.exclusive || format === _this) {
          return;
        }
        node = format.remove(node);
        return delete currentFormats[name];
      };
    })(this));
    return node;
  };

  Format.prototype.value = function(node) {
    var c, _i, _len, _ref;
    if (!this.match(node)) {
      return void 0;
    }
    if (_.isString(this.config.attribute)) {
      return node.getAttribute(this.config.attribute) || void 0;
    } else if (_.isString(this.config.style)) {
      return node.style[this.config.style] || void 0;
    } else if (_.isString(this.config["class"])) {
      _ref = dom(node).classes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c.indexOf(this.config["class"]) === 0) {
          return c.slice(this.config["class"].length);
        }
      }
    } else if (_.isString(this.config.tag)) {
      return true;
    }
    return void 0;
  };

  return Format;

})();

module.exports = Format;
