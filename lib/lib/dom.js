var SelectWrapper, Wrapper, dom, lastKeyEvent, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

lastKeyEvent = null;

Wrapper = (function() {
  function Wrapper(node) {
    this.node = node;
    this.trigger = __bind(this.trigger, this);
  }

  Wrapper.prototype.addClass = function(cssClass) {
    if (this.hasClass(cssClass)) {
      return;
    }
    if (this.node.classList != null) {
      this.node.classList.add(cssClass);
    } else if (this.node.className != null) {
      this.node.className = (this.node.className + ' ' + cssClass).trim();
    }
    return this;
  };

  Wrapper.prototype.attributes = function(attributes) {
    var attr, i, value, _i, _len, _ref;
    if (attributes) {
      _.each(attributes, (function(_this) {
        return function(value, name) {
          return _this.node.setAttribute(name, value);
        };
      })(this));
      return this;
    } else {
      if (this.node.attributes == null) {
        return {};
      }
      attributes = {};
      _ref = this.node.attributes;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        value = _ref[i];
        attr = this.node.attributes[i];
        attributes[attr.name] = attr.value;
      }
      return attributes;
    }
  };

  Wrapper.prototype.child = function(offset) {
    var child, length;
    child = this.node.firstChild;
    length = dom(child).length();
    while (child != null) {
      if (offset < length) {
        break;
      }
      offset -= length;
      child = child.nextSibling;
      length = dom(child).length();
    }
    if (child == null) {
      child = this.node.lastChild;
      offset = dom(child).length();
    }
    return [child, offset];
  };

  Wrapper.prototype.childNodes = function() {
    return _.map(this.node.childNodes);
  };

  Wrapper.prototype.classes = function() {
    return this.node.className.split(/\s+/);
  };

  Wrapper.prototype.descendants = function() {
    return _.map(this.node.getElementsByTagName('*'));
  };

  Wrapper.prototype.get = function() {
    return this.node;
  };

  Wrapper.prototype.hasClass = function(cssClass) {
    if (this.node.classList != null) {
      return this.node.classList.contains(cssClass);
    } else if (this.node.className != null) {
      return this.classes().indexOf(cssClass) > -1;
    }
    return false;
  };

  Wrapper.prototype.isAncestor = function(ancestor, inclusive) {
    var node;
    if (inclusive == null) {
      inclusive = false;
    }
    if (ancestor === this.node) {
      return inclusive;
    }
    node = this.node;
    while (node) {
      if (node === ancestor) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  Wrapper.prototype.isElement = function() {
    var _ref;
    return ((_ref = this.node) != null ? _ref.nodeType : void 0) === dom.ELEMENT_NODE;
  };

  Wrapper.prototype.isTextNode = function() {
    var _ref;
    return ((_ref = this.node) != null ? _ref.nodeType : void 0) === dom.TEXT_NODE;
  };

  Wrapper.prototype.length = function() {
    var length;
    if (this.node == null) {
      return 0;
    }
    length = this.text().length;
    if (this.isElement()) {
      length += this.node.querySelectorAll(Object.keys(dom.EMBED_TAGS).join(',')).length;
    }
    return length;
  };

  Wrapper.prototype.merge = function(node) {
    var $node;
    $node = dom(node);
    if (this.isElement()) {
      $node.moveChildren(this.node);
      this.normalize();
    } else {
      this.text(this.text() + $node.text());
    }
    $node.remove();
    return this;
  };

  Wrapper.prototype.moveChildren = function(newParent) {
    _.each(this.childNodes(), function(child) {
      return newParent.appendChild(child);
    });
    return this;
  };

  Wrapper.prototype.nextLineNode = function(root) {
    var nextNode;
    nextNode = this.node.nextSibling;
    if ((nextNode == null) && this.node.parentNode !== root) {
      nextNode = this.node.parentNode.nextSibling;
    }
    if ((nextNode != null) && (dom.LIST_TAGS[nextNode.tagName] != null)) {
      nextNode = nextNode.firstChild;
    }
    return nextNode;
  };

  Wrapper.prototype.normalize = function() {
    var $node, curNode, followingNode, nextNode;
    curNode = this.node.firstChild;
    while (curNode != null) {
      nextNode = curNode.nextSibling;
      $node = dom(curNode);
      if ((nextNode != null) && dom(nextNode).isTextNode()) {
        if ($node.text().length === 0) {
          $node.remove();
        } else if ($node.isTextNode()) {
          followingNode = nextNode.nextSibling;
          $node.merge(nextNode);
          nextNode = followingNode;
        }
      }
      curNode = nextNode;
    }
    return this;
  };

  Wrapper.prototype.on = function(eventName, listener) {
    this.node.addEventListener(eventName, (function(_this) {
      return function(event) {
        var arg, propagate;
        arg = lastKeyEvent && (eventName === 'keydown' || eventName === 'keyup') ? lastKeyEvent : event;
        propagate = listener.call(_this.node, arg);
        if (!propagate) {
          event.preventDefault();
          event.stopPropagation();
        }
        return propagate;
      };
    })(this));
    return this;
  };

  Wrapper.prototype.remove = function() {
    var _ref;
    if ((_ref = this.node.parentNode) != null) {
      _ref.removeChild(this.node);
    }
    this.node = null;
    return null;
  };

  Wrapper.prototype.removeClass = function(cssClass) {
    var classArray;
    if (!this.hasClass(cssClass)) {
      return;
    }
    if (this.node.classList != null) {
      return this.node.classList.remove(cssClass);
    } else if (this.node.className != null) {
      classArray = this.classes();
      classArray.splice(classArray.indexOf(cssClass), 1);
      this.node.className = classArray.join(' ');
    }
    return this;
  };

  Wrapper.prototype.replace = function(newNode) {
    this.node.parentNode.replaceChild(newNode, this.node);
    this.node = newNode;
    return newNode;
  };

  Wrapper.prototype.splitAncestors = function(root, force) {
    var nextNode, parentClone, parentNode, refNode;
    if (force == null) {
      force = false;
    }
    if (this.node === root || this.node.parentNode === root) {
      return this;
    }
    if ((this.node.previousSibling != null) || force) {
      parentNode = this.node.parentNode;
      parentClone = parentNode.cloneNode(false);
      parentNode.parentNode.insertBefore(parentClone, parentNode.nextSibling);
      refNode = this.node;
      while (refNode != null) {
        nextNode = refNode.nextSibling;
        parentClone.appendChild(refNode);
        refNode = nextNode;
      }
      return dom(parentClone).splitAncestors(root);
    } else {
      return dom(this.node.parentNode).splitAncestors(root);
    }
  };

  Wrapper.prototype.split = function(offset, force) {
    var after, child, childLeft, childRight, left, nextRight, nodeLength, right, _ref, _ref1;
    if (force == null) {
      force = false;
    }
    nodeLength = this.length();
    offset = Math.max(0, offset);
    offset = Math.min(offset, nodeLength);
    if (!(force || offset !== 0)) {
      return [this.node.previousSibling, this.node, false];
    }
    if (!(force || offset !== nodeLength)) {
      return [this.node, this.node.nextSibling, false];
    }
    if (this.node.nodeType === dom.TEXT_NODE) {
      after = this.node.splitText(offset);
      return [this.node, after, true];
    } else {
      left = this.node;
      right = this.node.cloneNode(false);
      this.node.parentNode.insertBefore(right, left.nextSibling);
      _ref = this.child(offset), child = _ref[0], offset = _ref[1];
      _ref1 = dom(child).split(offset), childLeft = _ref1[0], childRight = _ref1[1];
      while (childRight !== null) {
        nextRight = childRight.nextSibling;
        right.appendChild(childRight);
        childRight = nextRight;
      }
      return [left, right, true];
    }
  };

  Wrapper.prototype.styles = function(styles, overwrite) {
    var obj, styleString;
    if (overwrite == null) {
      overwrite = false;
    }
    if (styles) {
      if (!overwrite) {
        styles = _.defaults(styles, this.styles());
      }
      styleString = _.map(styles, function(style, name) {
        return "" + name + ": " + style;
      }).join('; ') + ';';
      this.node.setAttribute('style', styleString);
      return this;
    } else {
      styleString = this.node.getAttribute('style') || '';
      obj = _.reduce(styleString.split(';'), function(styles, str) {
        var name, value, _ref;
        _ref = str.split(':'), name = _ref[0], value = _ref[1];
        if (name && value) {
          name = name.trim();
          value = value.trim();
          styles[name.toLowerCase()] = value;
        }
        return styles;
      }, {});
      return obj;
    }
  };

  Wrapper.prototype.switchTag = function(newTag) {
    var attributes, newNode;
    newTag = newTag.toUpperCase();
    if (this.node.tagName === newTag) {
      return this;
    }
    newNode = this.node.ownerDocument.createElement(newTag);
    attributes = this.attributes();
    if (dom.VOID_TAGS[newTag] == null) {
      this.moveChildren(newNode);
    }
    this.replace(newNode);
    return this.attributes(attributes).get();
  };

  Wrapper.prototype.text = function(text) {
    if (text != null) {
      switch (this.node.nodeType) {
        case dom.ELEMENT_NODE:
          this.node.textContent = text;
          break;
        case dom.TEXT_NODE:
          this.node.data = text;
      }
      return this;
    } else {
      switch (this.node.nodeType) {
        case dom.ELEMENT_NODE:
          if (this.node.tagName === dom.DEFAULT_BREAK_TAG) {
            return "";
          }
          if (dom.EMBED_TAGS[this.node.tagName] != null) {
            return dom.EMBED_TEXT;
          }
          if (this.node.textContent != null) {
            return this.node.textContent;
          }
          return "";
        case dom.TEXT_NODE:
          return this.node.data || "";
        default:
          return "";
      }
    }
  };

  Wrapper.prototype.textNodes = function() {
    var textNode, textNodes, walker;
    walker = this.node.ownerDocument.createTreeWalker(this.node, NodeFilter.SHOW_TEXT, null, false);
    textNodes = [];
    while (textNode = walker.nextNode()) {
      textNodes.push(textNode);
    }
    return textNodes;
  };

  Wrapper.prototype.toggleClass = function(className, state) {
    if (state == null) {
      state = !this.hasClass(className);
    }
    if (state) {
      this.addClass(className);
    } else {
      this.removeClass(className);
    }
    return this;
  };

  Wrapper.prototype.trigger = function(eventName, options) {
    var event, initFn, modifiers;
    if (options == null) {
      options = {};
    }
    if (['keypress', 'keydown', 'keyup'].indexOf(eventName) < 0) {
      event = this.node.ownerDocument.createEvent('Event');
      event.initEvent(eventName, options.bubbles, options.cancelable);
    } else {
      event = this.node.ownerDocument.createEvent('KeyboardEvent');
      lastKeyEvent = _.clone(options);
      if (_.isNumber(options.key)) {
        lastKeyEvent.which = options.key;
      } else if (_.isString(options.key)) {
        lastKeyEvent.which = options.key.toUpperCase().charCodeAt(0);
      } else {
        lastKeyEvent.which = 0;
      }
      if (dom.isIE(10)) {
        modifiers = [];
        if (options.altKey) {
          modifiers.push('Alt');
        }
        if (options.ctrlKey) {
          modifiers.push('Control');
        }
        if (options.metaKey) {
          modifiers.push('Meta');
        }
        if (options.shiftKey) {
          modifiers.push('Shift');
        }
        event.initKeyboardEvent(eventName, options.bubbles, options.cancelable, this.window(), 0, 0, modifiers.join(' '), null, null);
      } else {
        initFn = _.isFunction(event.initKeyboardEvent) ? 'initKeyboardEvent' : 'initKeyEvent';
        event[initFn](eventName, options.bubbles, options.cancelable, this.window(), options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 0, 0);
      }
    }
    this.node.dispatchEvent(event);
    lastKeyEvent = null;
    return this;
  };

  Wrapper.prototype.unwrap = function() {
    var next, ret;
    ret = this.node.firstChild;
    next = this.node.nextSibling;
    _.each(this.childNodes(), (function(_this) {
      return function(child) {
        return _this.node.parentNode.insertBefore(child, next);
      };
    })(this));
    this.remove();
    return ret;
  };

  Wrapper.prototype.window = function() {
    return this.node.ownerDocument.defaultView || this.node.ownerDocument.parentWindow;
  };

  Wrapper.prototype.wrap = function(wrapper) {
    var parent;
    if (this.node.parentNode != null) {
      this.node.parentNode.insertBefore(wrapper, this.node);
    }
    parent = wrapper;
    while (parent.firstChild != null) {
      parent = wrapper.firstChild;
    }
    parent.appendChild(this.node);
    return this;
  };

  return Wrapper;

})();

SelectWrapper = (function(_super) {
  __extends(SelectWrapper, _super);

  function SelectWrapper() {
    return SelectWrapper.__super__.constructor.apply(this, arguments);
  }

  SelectWrapper.prototype["default"] = function() {
    return this.node.querySelector('option[selected]');
  };

  SelectWrapper.prototype.option = function(option, trigger) {
    var child, i, value, _i, _len, _ref;
    if (trigger == null) {
      trigger = true;
    }
    value = _.isElement(option) ? option.value : option;
    if (value) {
      value = value.replace(/[^\w]+/g, '');
      _ref = this.node.children;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        child = _ref[i];
        if (child.value.replace(/[^\w]+/g, '') === value) {
          this.node.selectedIndex = i;
          break;
        }
      }
    } else {
      this.node.selectedIndex = -1;
    }
    if (trigger) {
      this.trigger('change');
    }
    return this;
  };

  SelectWrapper.prototype.reset = function(trigger) {
    var option;
    if (trigger == null) {
      trigger = true;
    }
    option = this["default"]();
    if (option != null) {
      option.selected = true;
    } else {
      this.node.selectedIndex = 0;
    }
    if (trigger) {
      this.trigger('change');
    }
    return this;
  };

  SelectWrapper.prototype.value = function() {
    if (this.node.selectedIndex > -1) {
      return this.node.options[this.node.selectedIndex].value;
    } else {
      return '';
    }
  };

  return SelectWrapper;

})(Wrapper);

dom = function(node) {
  if ((node != null ? node.tagName : void 0) === 'SELECT') {
    return new SelectWrapper(node);
  } else {
    return new Wrapper(node);
  }
};

dom = _.extend(dom, {
  ELEMENT_NODE: 1,
  NOBREAK_SPACE: "&nbsp;",
  TEXT_NODE: 3,
  ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF",
  DEFAULT_BLOCK_TAG: 'P',
  DEFAULT_BREAK_TAG: 'BR',
  DEFAULT_INLINE_TAG: 'SPAN',
  EMBED_TEXT: '!',
  FONT_SIZES: {
    '10px': 1,
    '13px': 2,
    '16px': 3,
    '18px': 4,
    '24px': 5,
    '32px': 6,
    '48px': 7
  },
  KEYS: {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  },
  BLOCK_TAGS: {
    'ADDRESS': 'ADDRESS',
    'ARTICLE': 'ARTICLE',
    'ASIDE': 'ASIDE',
    'AUDIO': 'AUDIO',
    'BLOCKQUOTE': 'BLOCKQUOTE',
    'CANVAS': 'CANVAS',
    'DD': 'DD',
    'DIV': 'DIV',
    'DL': 'DL',
    'FIGCAPTION': 'FIGCAPTION',
    'FIGURE': 'FIGURE',
    'FOOTER': 'FOOTER',
    'FORM': 'FORM',
    'H1': 'H1',
    'H2': 'H2',
    'H3': 'H3',
    'H4': 'H4',
    'H5': 'H5',
    'H6': 'H6',
    'HEADER': 'HEADER',
    'HGROUP': 'HGROUP',
    'LI': 'LI',
    'OL': 'OL',
    'OUTPUT': 'OUTPUT',
    'P': 'P',
    'PRE': 'PRE',
    'SECTION': 'SECTION',
    'TABLE': 'TABLE',
    'TBODY': 'TBODY',
    'TD': 'TD',
    'TFOOT': 'TFOOT',
    'TH': 'TH',
    'THEAD': 'THEAD',
    'TR': 'TR',
    'UL': 'UL',
    'VIDEO': 'VIDEO'
  },
  EMBED_TAGS: {
    'IMG': 'IMG'
  },
  LINE_TAGS: {
    'DIV': 'DIV',
    'LI': 'LI'
  },
  LIST_TAGS: {
    'OL': 'OL',
    'UL': 'UL'
  },
  VOID_TAGS: {
    'AREA': 'AREA',
    'BASE': 'BASE',
    'BR': 'BR',
    'COL': 'COL',
    'COMMAND': 'COMMAND',
    'EMBED': 'EMBED',
    'HR': 'HR',
    'IMG': 'IMG',
    'INPUT': 'INPUT',
    'KEYGEN': 'KEYGEN',
    'LINK': 'LINK',
    'META': 'META',
    'PARAM': 'PARAM',
    'SOURCE': 'SOURCE',
    'TRACK': 'TRACK',
    'WBR': 'WBR'
  },
  convertFontSize: function(size) {
    var i, s, sources, targets;
    if (_.isString(size) && size.indexOf('px') > -1) {
      sources = Object.keys(dom.FONT_SIZES);
      targets = _.values(dom.FONT_SIZES);
    } else {
      targets = Object.keys(dom.FONT_SIZES);
      sources = _.values(dom.FONT_SIZES);
    }
    for (i in sources) {
      s = sources[i];
      if (parseInt(size) <= parseInt(s)) {
        return targets[i];
      }
    }
    return _.last(targets);
  },
  isIE: function(maxVersion) {
    var version;
    version = document.documentMode;
    return version && maxVersion >= version;
  },
  isIOS: function() {
    return /iPhone|iPad/i.test(navigator.userAgent);
  },
  isMac: function() {
    return /Mac/i.test(navigator.platform);
  }
});

module.exports = dom;
