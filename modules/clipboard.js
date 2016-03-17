import Delta from 'rich-text/lib/delta';
import Emitter from '../core/emitter';
import Module from '../core/module';


class Clipboard extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener('copy', this.onCopy.bind(this));
    this.quill.root.addEventListener('cut', this.onCut.bind(this));
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
  }

  onCopy(e) {
    let range = this.quill.getSelection();
    if (range == null || range.length === 0 || e.defaultPrevented) return;
    let clipboard = e.clipboardData || window.clipboardData;
    clipboard.setData('text', this.quill.getText(range))
    if (e.clipboardData) {  // IE11 does not let us set non-text data
      clipboard.setData('application/json', JSON.stringify(this.quill.getContents(range)));
    }
    e.preventDefault();
  }

  onCut(e) {
    if (e.defaultPrevented) return;
    this.onCopy(e);
    let range = this.quill.getSelection();
    this.quill.deleteText(range, Emitter.sources.USER);
    this.quill.setSelection(range.index, Emitter.sources.SILENT);
  }

  onPaste(e) {
    if (e.defaultPrevented) return;
    let range = this.quill.getSelection();
    let clipboard = e.clipboardData || window.clipboardData;
    let delta = new Delta().retain(range.index).delete(range.length);
    let text = clipboard.getData('text');
    // Firefox types is in iterable, not array
    // IE11 types is null
    if ([].indexOf.call(clipboard.types || [], 'application/json') > -1) {
      try {
        let pasteJSON = JSON.parse(clipboard.getData('application/json'));
        delta = delta.concat(pasteJSON);
      } catch(e) {
        delta.insert(text);
      }
    } else {
      delta.insert(text);
    }
    this.quill.editor.applyDelta(delta, Emitter.sources.USER);
    // range.length contributes to delta.length()
    this.quill.setSelection(delta.length() - range.length*2, Emitter.sources.SILENT);
    // this.quill.selection.scrollIntoView();
    e.preventDefault();
  }
}


export default Clipboard;
