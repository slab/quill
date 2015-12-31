import Quill from '../quill';
import extend from 'extend';

let Delta = Quill.import('delta');
let Parchment = Quill.import('parchment');


class PasteManager {
  constructor(quill, options) {
    this.quill = quill;
    this.options = extend({}, PasteManager.DEFAULTS, options);
    this.container = this.quill.addContainer('ql-paste-manager');
    this.container.setAttribute('contenteditable', true);
    this.container.setAttribute('tabindex', '-1');
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
  }

  onPaste() {
    let range = this.quill.getSelection();
    if (range == null) return;
    let oldDocLength = this.quill.getLength();
    this.container.focus();
    setTimeout(() => {
      let pasteDelta = this.options.sanitize(this.container);
      let lengthAdded = pasteDelta.length();
      if (lengthAdded > 0) {
        let delta = new Delta();
        if (range.start > 0) {
          delta.retain(range.start);
        }
        delta.delete(range.end - range.start);
        delta = delta.concat(pasteDelta);
        this.quill.updateContents(delta, Quill.sources.USER);
      }
      this.quill.setSelection(range.start + lengthAdded, range.start + lengthAdded, Quill.sources.SILENT);
      this.quill.scrollIntoView();
      this.container.innerHTML = "";
    }, 0);
  }
}
PasteManager.DEFAULTS = {
  sanitize: sanitize
};

function sanitize(container) {
  // TODO this needs to be Editor for getDelta to work
  let doc = new Parchment.Container(container);
  let delta = doc.getDelta();
  let lengthAdded = delta.length();
  if (lengthAdded === 0) return delta;
  // Need to remove trailing newline so paste is inline,
  // losing format is expected and observed in Word
  return delta.compose(new Delta().retain(lengthAdded - 1).delete(1));
}


Quill.registerModule('paste-manager', PasteManager);

export { PasteManager as default };
