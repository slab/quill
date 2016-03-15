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
    if (!range.length || e.defaultPrevented) {
      return;
    }
    e.clipboardData.setData('text', this.quill.getText(range));
    e.clipboardData.setData('application/json', JSON.stringify(this.quill.getContents(range)));
    e.preventDefault();
  }

  onCut(e) {
    if (e.defaultPrevented) {
      return;
    }
    this.onCopy(e);
    this.quill.deleteText(this.quill.getSelection(), Emitter.sources.USER);
  }

  onPaste(e) {
    if (e.defaultPrevented) {
      return;
    }
    let range = this.quill.getSelection();
    let delta = new Delta().retain(range.index);
    if (range.length > 0) {
      delta.delete(range.length);
    }
    if (e.clipboardData.types.indexOf('application/json') !== -1) {
      let deltaJsonStr = e.clipboardData.getData('application/json');
      let deltaJson = JSON.parse(deltaJsonStr);
      if (Array.isArray(deltaJson.ops)) { // isDelta?
        delta = delta.concat(deltaJson);
      } else {
        delta.insert(deltaJsonStr);
      }
    } else {
      delta.insert(e.clipboardData.getData('text'));
    }
    this.quill.editor.applyDelta(delta, Emitter.sources.USER);
    this.quill.setSelection(this.length(delta), Emitter.sources.SILENT);
    this.quill.selection.scrollIntoView();
    e.preventDefault();
  }

  length(delta) {
    return delta.ops.reduce((memo, op) => {
      if (typeof op['delete'] === 'number') {
        return memo - op['delete'];
      } else if (typeof op.retain === 'number') {
        return memo + op.retain;
      } else {
        return memo + (typeof op.insert === 'string' ? op.insert.length : 1);
      }
    }, 0);
  }
}

export default Clipboard;
