var DOM, Document, PasteManager, Tandem, _;

_ = require('lodash');

DOM = require('../dom');

Document = require('../document');

Tandem = require('tandem-core');

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
    DOM.addEventListener(this.quill.root, 'paste', _.bind(this._paste, this));
  }

  PasteManager.prototype._paste = function() {
    var oldDocLength, range;
    oldDocLength = this.quill.getLength();
    range = this.quill.getSelection();
    if (range == null) {
      return;
    }
    this.container.innerHTML = "";
    this.container.focus();
    return _.defer((function(_this) {
      return function() {
        var delta, doc, lengthAdded;
        doc = new Document(_this.container, _this.quill.options);
        delta = doc.toDelta();
        delta = delta.compose(Tandem.Delta.makeDeleteDelta(delta.endLength, delta.endLength - 1, 1));
        lengthAdded = delta.endLength;
        if (range.start > 0) {
          delta.ops.unshift(new Tandem.RetainOp(0, range.start));
        }
        if (range.end < oldDocLength) {
          delta.ops.push(new Tandem.RetainOp(range.end, oldDocLength));
        }
        delta.endLength += _this.quill.getLength() - (range.end - range.start);
        delta.startLength = oldDocLength;
        _this.quill.updateContents(delta, 'user');
        _this.quill.focus();
        return _this.quill.setSelection(range.start + lengthAdded, range.start + lengthAdded);
      };
    })(this));
  };

  return PasteManager;

})();

module.exports = PasteManager;
