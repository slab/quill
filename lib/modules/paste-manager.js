var Delta, Document, PasteManager, Quill, dom, _;

Quill = require('../quill');

Document = require('../core/document');

_ = Quill.require('lodash');

dom = Quill.require('dom');

Delta = Quill.require('delta');

PasteManager = (function() {
  function PasteManager(quill, options) {
    this.quill = quill;
    this.options = options;
    this.container = this.quill.addContainer('paste-container');
    this.container.setAttribute('contenteditable', true);
    this.quill.addStyles({
      '.paste-container': {
        'left': '-10000px',
        'position': 'absolute',
        'top': '50%'
      }
    });
    dom(this.quill.root).on('paste', _.bind(this._paste, this));
  }

  PasteManager.prototype._paste = function() {
    var iframe, iframeScrollY, oldDocLength, range, windowScrollX, windowScrollY;
    oldDocLength = this.quill.getLength();
    range = this.quill.getSelection();
    if (range == null) {
      return;
    }
    this.container.innerHTML = "";
    iframe = dom(this.quill.root).window();
    iframeScrollY = iframe.scrollY;
    windowScrollX = window.scrollX;
    windowScrollY = window.scrollY;
    this.container.focus();
    return _.defer((function(_this) {
      return function() {
        var delta, doc, lengthAdded, line, lineBottom, offset, _ref;
        doc = new Document(_this.container, _this.quill.options);
        delta = doc.toDelta();
        lengthAdded = delta.length() - 1;
        delta.compose(new Delta().retain(lengthAdded)["delete"](1));
        if (range.start > 0) {
          delta.ops.unshift({
            retain: range.start
          });
        }
        delta["delete"](range.end - range.start);
        _this.quill.updateContents(delta, 'user');
        _this.quill.setSelection(range.start + lengthAdded, range.start + lengthAdded);
        _ref = _this.quill.editor.doc.findLineAt(range.start + lengthAdded), line = _ref[0], offset = _ref[1];
        lineBottom = line.node.offsetTop + line.node.offsetHeight;
        if (lineBottom > iframeScrollY + _this.quill.root.offsetHeight) {
          iframeScrollY = line.node.offsetTop - _this.quill.root.offsetHeight / 2;
        }
        iframe.scrollTo(0, iframeScrollY);
        return window.scrollTo(windowScrollX, windowScrollY);
      };
    })(this));
  };

  return PasteManager;

})();

Quill.registerModule('paste-manager', PasteManager);

module.exports = PasteManager;
