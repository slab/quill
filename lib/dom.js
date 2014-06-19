var DOM, lastKeyEvent, _;

_ = require('lodash');

_.str = require('underscore.string');

lastKeyEvent = null;

DOM = {
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
    'IMG': 'IMG',
    'IFRAME': 'IFRAME'
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
  addClass: function(node, cssClass) {
    if (DOM.hasClass(node, cssClass)) {
      return;
    }
    if (node.classList != null) {
      return node.classList.add(cssClass);
    } else if (node.className != null) {
      return node.className = _.str.trim(node.className + ' ' + cssClass);
    }
  },
  addEventListener: function(node, eventName, listener) {
    return node.addEventListener(eventName, function(event) {
      var arg, propogate;
      arg = lastKeyEvent && (eventName === 'keydown' || eventName === 'keyup') ? lastKeyEvent : event;
      propogate = listener(arg);
      if (!propogate) {
        event.preventDefault();
        event.stopPropagation();
      }
      return propogate;
    });
  },
  clearAttributes: function(node, exception) {
    if (exception == null) {
      exception = [];
    }
    if (_.isString(exception)) {
      exception = [exception];
    }
    return _.each(DOM.getAttributes(node), function(value, name) {
      if (!(_.indexOf(exception, name) > -1)) {
        return node.removeAttribute(name);
      }
    });
  },
  getAttributes: function(node) {
    var attr, attributes, i, value, _i, _len, _ref;
    if (node.attributes == null) {
      return {};
    }
    attributes = {};
    _ref = node.attributes;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      value = _ref[i];
      attr = node.attributes[i];
      attributes[attr.name] = attr.value;
    }
    return attributes;
  },
  getChildNodes: function(parent) {
    return _.map(parent.childNodes);
  },
  getChildren: function(parent) {
    return _.map(parent.children);
  },
  getDescendants: function(parent) {
    return _.map(parent.getElementsByTagName('*'));
  },
  getClasses: function(node) {
    return node.className.split(/\s+/);
  },
  getDefaultOption: function(select) {
    return select.querySelector('option[selected]');
  },
  getSelectValue: function(select) {
    if (select.selectedIndex > -1) {
      return select.options[select.selectedIndex].value;
    } else {
      return '';
    }
  },
  getStyles: function(node) {
    var obj, styleString;
    styleString = node.getAttribute('style') || '';
    obj = _.reduce(styleString.split(';'), function(styles, str) {
      var name, value, _ref;
      _ref = str.split(':'), name = _ref[0], value = _ref[1];
      if (name && value) {
        name = _.str.trim(name);
        value = _.str.trim(value);
        styles[name.toLowerCase()] = value;
      }
      return styles;
    }, {});
    return obj;
  },
  getText: function(node) {
    switch (node.nodeType) {
      case DOM.ELEMENT_NODE:
        if (node.tagName === DOM.DEFAULT_BREAK_TAG) {
          return "";
        }
        if (DOM.EMBED_TAGS[node.tagName] != null) {
          return DOM.EMBED_TEXT;
        }
        if (node.textContent != null) {
          return node.textContent;
        }
        return "";
      case DOM.TEXT_NODE:
        return node.data || "";
      default:
        return "";
    }
  },
  getTextNodes: function(root) {
    var node, nodes, walker;
    walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    nodes = [];
    while (node = walker.nextNode()) {
      nodes.push(node);
    }
    return nodes;
  },
  getWindow: function(node) {
    return node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
  },
  hasClass: function(node, cssClass) {
    if (node.classList != null) {
      return node.classList.contains(cssClass);
    } else if (node.className != null) {
      return _.indexOf(DOM.getClasses(node), cssClass) > -1;
    }
    return false;
  },
  isElement: function(node) {
    return (node != null ? node.nodeType : void 0) === DOM.ELEMENT_NODE;
  },
  isTextNode: function(node) {
    return (node != null ? node.nodeType : void 0) === DOM.TEXT_NODE;
  },
  moveChildren: function(newParent, oldParent) {
    return _.each(DOM.getChildNodes(oldParent), function(child) {
      return newParent.appendChild(child);
    });
  },
  normalize: function(node) {
    var curNode, newText, nextNode, _results;
    curNode = node.firstChild;
    _results = [];
    while (curNode != null) {
      nextNode = curNode.nextSibling;
      if (DOM.isTextNode(curNode)) {
        if (DOM.getText(curNode).length === 0) {
          DOM.removeNode(curNode);
        } else if (DOM.isTextNode(nextNode)) {
          nextNode = nextNode.nextSibling;
          newText = DOM.getText(curNode) + DOM.getText(curNode.nextSibling);
          DOM.setText(curNode, newText);
          DOM.removeNode(curNode.nextSibling);
        }
      }
      _results.push(curNode = nextNode);
    }
    return _results;
  },
  isIE: function(maxVersion) {
    var version;
    version = document.documentMode;
    return version && maxVersion >= version;
  },
  isIOS: function() {
    return /iPhone|iPad/i.test(navigator.userAgent);
  },
  removeClass: function(node, cssClass) {
    var classArray;
    if (!DOM.hasClass(node, cssClass)) {
      return;
    }
    if (node.classList != null) {
      return node.classList.remove(cssClass);
    } else if (node.className != null) {
      classArray = DOM.getClasses(node);
      classArray.splice(_.indexOf(classArray, cssClass), 1);
      return node.className = classArray.join(' ');
    }
  },
  removeNode: function(node) {
    var _ref;
    return (_ref = node.parentNode) != null ? _ref.removeChild(node) : void 0;
  },
  replaceNode: function(newNode, oldNode) {
    oldNode.parentNode.replaceChild(newNode, oldNode);
    return newNode;
  },
  resetSelect: function(select, trigger) {
    var option;
    if (trigger == null) {
      trigger = true;
    }
    option = DOM.getDefaultOption(select);
    if (option != null) {
      option.selected = true;
    } else {
      select.selectedIndex = 0;
    }
    if (trigger) {
      return DOM.triggerEvent(select, 'change');
    }
  },
  selectOption: function(select, option, trigger) {
    var value;
    if (trigger == null) {
      trigger = true;
    }
    value = _.isElement(option) ? option.value : option;
    if (value) {
      select.value = value;
    } else {
      select.selectedIndex = -1;
    }
    if (trigger) {
      return DOM.triggerEvent(select, 'change');
    }
  },
  setAttributes: function(node, attributes) {
    return _.each(attributes, function(value, name) {
      return node.setAttribute(name, value);
    });
  },
  setStyles: function(node, styles) {
    var styleString;
    styleString = _.map(styles, function(style, name) {
      return "" + name + ": " + style;
    }).join('; ') + ';';
    return node.setAttribute('style', styleString);
  },
  setText: function(node, text) {
    switch (node.nodeType) {
      case DOM.ELEMENT_NODE:
        return node.textContent = text;
      case DOM.TEXT_NODE:
        return node.data = text;
    }
  },
  switchTag: function(node, newTag) {
    var attributes, newNode;
    newTag = newTag.toUpperCase();
    if (node.tagName === newTag) {
      return node;
    }
    newNode = node.ownerDocument.createElement(newTag);
    attributes = DOM.getAttributes(node);
    if (DOM.VOID_TAGS[newTag] == null) {
      this.moveChildren(newNode, node);
    }
    node.parentNode.replaceChild(newNode, node);
    _.each(attributes, function(value, name) {
      return newNode.setAttribute(name, value);
    });
    return newNode;
  },
  toggleClass: function(node, className, state) {
    if (state == null) {
      state = !DOM.hasClass(node, className);
    }
    if (state) {
      return DOM.addClass(node, className);
    } else {
      return DOM.removeClass(node, className);
    }
  },
  triggerEvent: function(elem, eventName, options) {
    var event, initFn, modifiers;
    if (options == null) {
      options = {};
    }
    if (_.indexOf(['keypress', 'keydown', 'keyup'], eventName) < 0) {
      event = elem.ownerDocument.createEvent('Event');
      event.initEvent(eventName, options.bubbles, options.cancelable);
    } else {
      event = elem.ownerDocument.createEvent('KeyboardEvent');
      lastKeyEvent = _.clone(options);
      if (_.isNumber(options.key)) {
        lastKeyEvent.which = options.key;
      } else if (_.isString(options.key)) {
        lastKeyEvent.which = options.key.toUpperCase().charCodeAt(0);
      } else {
        lastKeyEvent.which = 0;
      }
      if (DOM.isIE(10)) {
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
        event.initKeyboardEvent(eventName, options.bubbles, options.cancelable, elem.ownerDocument.defaultView.window, 0, 0, modifiers.join(' '), null, null);
      } else {
        initFn = _.isFunction(event.initKeyboardEvent) ? 'initKeyboardEvent' : 'initKeyEvent';
        event[initFn](eventName, options.bubbles, options.cancelable, elem.ownerDocument.defaultView.window, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, 0, 0);
      }
    }
    elem.dispatchEvent(event);
    return lastKeyEvent = null;
  },
  unwrap: function(node) {
    var next, ret;
    ret = node.firstChild;
    next = node.nextSibling;
    _.each(DOM.getChildNodes(node), function(child) {
      return node.parentNode.insertBefore(child, next);
    });
    DOM.removeNode(node);
    return ret;
  },
  wrap: function(wrapper, node) {
    var parent;
    if (node.parentNode != null) {
      node.parentNode.insertBefore(wrapper, node);
    }
    parent = wrapper;
    while (parent.firstChild != null) {
      parent = wrapper.firstChild;
    }
    parent.appendChild(node);
    return parent;
  }
};

module.exports = DOM;
