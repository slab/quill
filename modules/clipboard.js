import Delta from 'rich-text/lib/delta';
import Emitter from '../core/emitter';
import Module from '../core/module';


class Clipboard extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
    this.container = this.quill.addContainer('ql-clipboard');
  }

  onPaste() {
    let range = this.quill.getSelection();
    if (range == null) return;
    let updateDelta = new Delta().retain(range.index).delete(range.length);
    this.container.setAttribute('contenteditable', true);
    this.container.focus();
    setTimeout(() => {
      let pasteDelta = this.options.sanitize(this.container);
      this.container.innerHTML = '';
      let lengthAdded = pasteDelta.length();
      if (lengthAdded > 0) {
        this.quill.updateContents(updateDelta.concat(pasteDelta), Emitter.sources.USER);
      }
      this.quill.setSelection(range.index + lengthAdded, Emitter.sources.SILENT);
      this.quill.selection.scrollIntoView();
    }, 0);
  }
}
Clipboard.DEFAULTS = {
  sanitize: function(container) {
    return new Delta().insert(container.innerText);
  }
};


export default Clipboard;
