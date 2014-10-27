var DEFAULT_STYLES, LIST_STYLES, Normalizer, Renderer, dom, rule, _;

_ = require('lodash');

dom = require('../lib/dom');

Normalizer = require('../lib/normalizer');

DEFAULT_STYLES = {
  'html': {
    'height': '100%',
    'width': '100%'
  },
  'body': {
    'box-sizing': 'border-box',
    'cursor': 'text',
    'font-family': "'Helvetica', 'Arial', sans-serif",
    'font-size': '13px',
    'height': '100%',
    'line-height': '1.42',
    'margin': '0px',
    'overflow-x': 'hidden',
    'overflow-y': 'auto',
    'padding': '12px 15px'
  },
  '.editor-container': {
    'min-height': '100%',
    'overflow': 'hidden',
    'outline': 'none',
    'position': 'relative',
    'tab-size': '4',
    'white-space': 'pre-wrap'
  },
  '.editor-container div': {
    'margin': '0',
    'padding': '0'
  },
  '.editor-container a': {
    'text-decoration': 'underline'
  },
  '.editor-container b': {
    'font-weight': 'bold'
  },
  '.editor-container i': {
    'font-style': 'italic'
  },
  '.editor-container s': {
    'text-decoration': 'line-through'
  },
  '.editor-container u': {
    'text-decoration': 'underline'
  },
  '.editor-container img': {
    'max-width': '100%'
  },
  '.editor-container blockquote': {
    'margin': '0 0 0 2em',
    'padding': '0'
  },
  '.editor-container h1': {
    'font-weight': 'bold',
    'font-size': '2em'
  },
  '.editor-container h2': {
    'font-weight': 'bold',
    'font-size': '1.75em'
  },
  '.editor-container h3': {
    'font-weight': 'bold',
    'font-size': '1.5em'
  },
  '.editor-container ol': {
    'margin': '0 0 0 2em',
    'padding': '0',
    'list-style-type': 'decimal'
  },
  '.editor-container ul': {
    'margin': '0 0 0 2em',
    'padding': '0',
    'list-style-type': 'disc'
  }
};

LIST_STYLES = ['decimal', 'lower-alpha', 'lower-roman'];

rule = '.editor-container ol > li';

_.each([1, 2, 3, 4, 5, 6, 7, 8, 9], function(i) {
  rule += ' > ol';
  DEFAULT_STYLES[rule] = {
    'list-style-type': LIST_STYLES[i % 3]
  };
  return rule += ' > li';
});

if (dom.isIE(10)) {
  DEFAULT_STYLES[dom.DEFAULT_BREAK_TAG] = {
    'display': 'none'
  };
}

Renderer = (function() {
  Renderer.objToCss = function(obj) {
    return _.map(obj, function(value, key) {
      var innerStr;
      innerStr = _.map(value, function(innerValue, innerKey) {
        return "" + innerKey + ": " + innerValue + ";";
      }).join(' ');
      return "" + key + " { " + innerStr + " }";
    }).join("\n");
  };

  Renderer.buildFrame = function(container) {
    var iframe, iframeDoc, root;
    iframe = container.ownerDocument.createElement('iframe');
    dom(iframe).attributes({
      frameBorder: '0',
      height: '100%',
      width: '100%',
      title: 'Quill Rich Text Editor',
      role: 'presentation'
    });
    container.appendChild(iframe);
    iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write('<!DOCTYPE html>');
    iframeDoc.close();
    root = iframeDoc.createElement('div');
    iframeDoc.body.appendChild(root);
    return [root, iframe];
  };

  function Renderer(container, options) {
    var _ref;
    this.container = container;
    this.options = options != null ? options : {};
    this.container.innerHTML = '';
    _ref = Renderer.buildFrame(this.container), this.root = _ref[0], this.iframe = _ref[1];
    this.root.setAttribute('id', this.options.id);
    this.iframe.setAttribute('name', this.options.id);
    dom(this.root).addClass('editor-container');
    dom(this.container).addClass('ql-container');
    if (dom.isIOS()) {
      dom(this.container).styles({
        'overflow': 'auto',
        '-webkit-overflow-scrolling': 'touch'
      });
    }
    this.addStyles(DEFAULT_STYLES);
    if (this.options.styles != null) {
      _.defer(_.bind(this.addStyles, this, this.options.styles));
    }
  }

  Renderer.prototype.addContainer = function(className, before) {
    var container, refNode;
    if (before == null) {
      before = false;
    }
    refNode = before ? this.root : null;
    container = this.root.ownerDocument.createElement('div');
    dom(container).addClass(className);
    this.root.parentNode.insertBefore(container, refNode);
    return container;
  };

  Renderer.prototype.addStyles = function(css) {
    var link, style;
    if (typeof css === 'object') {
      style = this.root.ownerDocument.createElement('style');
      style.type = 'text/css';
      css = Renderer.objToCss(css);
      style.appendChild(this.root.ownerDocument.createTextNode(css));
      return this.root.ownerDocument.head.appendChild(style);
    } else if (typeof css === 'string') {
      link = this.root.ownerDocument.createElement('link');
      dom(link).attributes({
        type: 'text/css',
        rel: 'stylesheet',
        href: css
      });
      return this.root.ownerDocument.head.appendChild(link);
    }
  };

  return Renderer;

})();

module.exports = Renderer;
