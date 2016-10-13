import Parchment from 'parchment';
import Module from '../core/module';
import Quill from '../core/quill';
import Delta from 'quill-delta';

let AuthorClass = new Parchment.Attributor.Class('author', 'ql-author', {
  scope: Parchment.Scope.INLINE
});


class Authorship extends Module {
  constructor(quill, options) {
    super(quill, options);
    //if(this.options.button) {
    //  this.attachButton(options.button);
    //}
    if(this.options.enabled) {
      this.enable();
    }
    Quill.register(AuthorClass, true);
    if(!this.options.authorId) {
      return;
    }
    this.quill.on(Quill.events.EDITOR_CHANGE, (eventName, delta, oldDelta, source) => {
      if (eventName == Quill.events.TEXT_CHANGE && source == 'user') {
        let authorDelta = new Delta();
        let authorFormat = { author: this.options.authorId };
        delta.ops.forEach((op) => {
          if(op.delete) {
            return;
          }
          if(op.insert || (op.retain && op.attributes)) {
            // Add authorship to insert/format
            op.attributes = op.attributes || {};
            op.attributes.author = this.options.authorId;
            // Apply authorship to our own editor
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

  enable(enabled = true) {
    this.quill.root.classList.toggle('ql-authorship', enabled);
  }

  disable() {
    this.enable(false);
  }

  addAuthor(id, color) {
    let css = ".ql-authorship .ql-author-" + id + " { " + "background-color:" + color + "; }\n";
    this.addStyle(css);
  }

  addStyle(css) {
    if(!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.type = 'text/css';
      document.documentElement.getElementsByTagName('head')[0].appendChild(this.styleElement);
    }
    this.styleElement.sheet.insertRule(css, 0);
  }
}

Authorship.DEFAULTS = {
  authorId: null,
  color: 'transparent',
  enabled: false
};


export { AuthorClass, Authorship as default };
