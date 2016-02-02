import extend from 'extend';
import Editor from '../editor';
import Emitter from '../emitter';
import Quill from '../quill';


let Delta = Quill.import('delta');
let Parchment = Quill.import('parchment');


class PasteManager {
  constructor(quill, options) {
    this.quill = quill;
    this.options = extend({}, PasteManager.DEFAULTS, options);
    this.container = this.quill.addContainer('ql-paste-manager');
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
  }

  onPaste() {
    let range = this.quill.getSelection();
    if (range == null) return;
    let container = this.quill.addContainer('ql-paste-manager');
    container.setAttribute('contenteditable', true);
    let oldDocLength = this.quill.getLength();
    container.focus();
    setTimeout(() => {
      let pasteDelta = this.options.sanitize(container);
      container.parentNode.removeChild(container);
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
      this.quill.selection.scrollIntoView();
    }, 0);
  }
}
PasteManager.DEFAULTS = {
  sanitize: sanitize
};

function sanitize(container) {
  return new Delta().insert(container.innerText);
  // let emitter = new Emitter();
  // let scroll = Parchment.create(container, emitter);
  // let editor = new Editor(scroll, emitter);
  // let delta = editor.getDelta();
  // let lengthAdded = delta.length();
  // if (lengthAdded === 0) return delta;
  // // Need to remove trailing newline so paste is inline,
  // // losing format is expected and observed in Word
  // return delta.compose(new Delta().retain(lengthAdded - 1).delete(1));
}


Quill.registerModule('paste-manager', PasteManager);

export { PasteManager as default };
