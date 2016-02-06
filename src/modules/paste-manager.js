import Delta from 'rich-text/lib/delta';
import Editor from '../editor';
import Emitter from '../emitter';
import Module from './module';


class PasteManager extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
    this.container = this.quill.addContainer('ql-paste-manager');
  }

  onPaste() {
    let range = this.quill.getSelection();
    if (range == null) return;
    let updateDelta = new Delta().retain(range.start).delete(range.end - range.start);
    container.setAttribute('contenteditable', true);
    container.focus();
    setTimeout(() => {
      let pasteDelta = this.options.sanitize(this.container);
      this.container.innerHTML = '';
      let lengthAdded = pasteDelta.length();
      if (lengthAdded > 0) {
        this.quill.updateContents(updateDelta.concat(pasteDelta), Emitter.sources.USER);
      }
      this.quill.setSelection(range.start + lengthAdded, range.start + lengthAdded, Emitter.sources.SILENT);
      this.quill.selection.scrollIntoView();
    }, 0);
  }
}
PasteManager.DEFAULTS = {
  sanitize: function(container) {
    return new Delta().insert(container.innerText);
  }
};


export default PasteManager;
