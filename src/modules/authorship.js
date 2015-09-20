import Quill from '../quill';
let Delta = Quill.require('delta');


class Authorship {
  constructor(quill, options = {}) {
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
    if (this.options.authorId == null) return;
    this.quill.on(Quill.events.PRE_EVENT, (eventName, delta, source) => {
      if (eventName === Quill.events.TEXT_CHANGE && source === Quill.sources.USER) {
        let authorDelta = new Delta();
        let authorFormat = { author: this.options.authorId };
        delta.ops.forEach(function(op) {
          if (op.delete != null) return;
          if ((op.insert != null) || ((op.retain != null) && (op.attributes != null))) {
            op.attributes = op.attributes || {};
            op.attributes.author = this.options.authorId;
            authorDelta.retain(op.retain || op.insert.length || 1, authorFormat);
          } else {
            authorDelta.retain(op.retain);
          }
        });
        this.quill.updateContents(authorDelta, Quill.sources.SILENT);
      }
    });
    this.addAuthor(this.options.authorId, this.options.color);
  }

  addAuthor(id, color) {
    this.quill.theme.addStyles(".authorship .author-" + id + " { \"background-color: " + color + ";\" }");
  }

  attachButton(button) {
    button.addEventListener('click', () => {
      button.classList.toggle('ql-on');
      this.enable(button.classList.contains('ql-on'));
    });
  }

  disable() {
    this.enable(false);
  }

  enable(enabled = true) {
    if (enabled === this.quill.root.classList.contains('authorship')) return;
    this.quill.root.classList.toggle('authorship');
  }
}
Authorship.DEFAULTS = {
  authorId: null,
  color: 'transparent',
  enabled: false
};


Quill.registerModule('authorship', Authorship);

export { Authorship as default };
