var Authorship, DOM, Format, Tandem, _;

_ = require('lodash');

DOM = require('../dom');

Format = require('../format');

Tandem = require('tandem-core');

Authorship = (function() {
  Authorship.DEFAULTS = {
    authorId: null,
    color: 'blue',
    enabled: false
  };

  function Authorship(quill, options) {
    this.quill = quill;
    this.options = options;
    if (this.options.button != null) {
      this.attachButton(this.options.button);
    }
    if (this.options.enabled) {
      this.enable();
    }
    this.quill.addFormat('author', {
      "class": 'author-'
    });
    if (this.options.authorId == null) {
      return;
    }
    this.quill.on(this.quill.constructor.events.PRE_EVENT, (function(_this) {
      return function(eventName, delta, origin) {
        var attribute, authorDelta;
        if (eventName === _this.quill.constructor.events.TEXT_CHANGE && origin === 'user') {
          _.each(delta.ops, function(op) {
            if (Tandem.InsertOp.isInsert(op) || _.keys(op.attributes).length > 0) {
              return op.attributes['author'] = _this.options.authorId;
            }
          });
          authorDelta = new Tandem.Delta(delta.endLength, [new Tandem.RetainOp(0, delta.endLength)]);
          attribute = {
            author: _this.options.authorId
          };
          delta.apply(function(index, text) {
            return authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, text.length, attribute));
          }, (function() {}), function(index, length, name, value) {
            return authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, length, attribute));
          });
          return _this.quill.updateContents(authorDelta, 'silent');
        }
      };
    })(this));
    this.addAuthor(this.options.authorId, this.options.color);
  }

  Authorship.prototype.addAuthor = function(id, color) {
    var styles;
    styles = {};
    styles[".authorship .author-" + id] = {
      "background-color": "" + color
    };
    return this.quill.addStyles(styles);
  };

  Authorship.prototype.attachButton = function(button) {
    return DOM.addEventListener(button, 'click', (function(_this) {
      return function() {
        DOM.toggleClass(button, 'ql-on');
        return _this.enable(DOM.hasClass(button, 'ql-on'));
      };
    })(this));
  };

  Authorship.prototype.enable = function(enabled) {
    if (enabled == null) {
      enabled = true;
    }
    return DOM.toggleClass(this.quill.root, 'authorship', enabled);
  };

  Authorship.prototype.disable = function() {
    return this.enable(false);
  };

  return Authorship;

})();

module.exports = Authorship;
