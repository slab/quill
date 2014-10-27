var Authorship, Delta, Quill, dom, _;

Quill = require('../quill');

_ = Quill.require('lodash');

dom = Quill.require('dom');

Delta = Quill.require('delta');

Authorship = (function() {
  Authorship.DEFAULTS = {
    authorId: null,
    color: 'transparent',
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
        var authorDelta, authorFormat;
        if (eventName === _this.quill.constructor.events.TEXT_CHANGE && origin === 'user') {
          authorDelta = new Delta();
          authorFormat = {
            author: _this.options.authorId
          };
          _.each(delta.ops, function(op) {
            if (op["delete"] != null) {
              return;
            }
            if ((op.insert != null) || ((op.retain != null) && (op.attributes != null))) {
              op.attributes || (op.attributes = {});
              op.attributes.author = _this.options.authorId;
              return authorDelta.retain(op.retain || op.insert.length || 1, authorFormat);
            } else {
              return authorDelta.retain(op.retain);
            }
          });
          return _this.quill.updateContents(authorDelta, Quill.sources.SILENT);
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
    var $button;
    $button = dom(button);
    return $button.on('click', (function(_this) {
      return function() {
        $button.toggleClass('ql-on');
        return _this.enable($dom.hasClass('ql-on'));
      };
    })(this));
  };

  Authorship.prototype.enable = function(enabled) {
    if (enabled == null) {
      enabled = true;
    }
    return dom(this.quill.root).toggleClass('authorship', enabled);
  };

  Authorship.prototype.disable = function() {
    return this.enable(false);
  };

  return Authorship;

})();

Quill.registerModule('authorship', Authorship);

module.exports = Authorship;
