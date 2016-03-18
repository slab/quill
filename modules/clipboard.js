import Delta from 'rich-text/lib/delta';
import Emitter from '../core/emitter';
import Module from '../core/module';
import Parchment from 'parchment';


function textSanitize(node, delta) {
  if (node instanceof Text) {
    let text = node.data.replace(/\s\s+/g, ' ');
    delta.insert(text);
  }
  return delta;
}

function newlineSanitize(node, delta) {
  if (['P', 'DIV', 'VIDEO', 'BR'].indexOf(node.tagName) > -1) {
    delta.insert('\n');
  }
  return delta;
}

function blotSanitize(node, delta) {
  let match = Parchment.query(node);
  if (match == null) return delta;
  if (match instanceof Parchment.Embed) {
    let embed = {};
    embed[match.blotName] = match.value(node);
    delta.insert(embed, match.formats(node));
  } else if (typeof match.formats === 'function') {
    delta = delta.compose(new Delta().retain(delta.length(), match.formats(node)));
  }
  return delta;
}

let matchers = [
  textSanitize,
  newlineSanitize,
  blotSanitize,
];

function sanitize(node) {  // Post-order traversal
  return [].reduce.call(node.childNodes || [], function(delta, childNode) {
    let childrenDelta = matchers.reduce(function(childrenDelta, matcher) {
      return matcher(childNode, childrenDelta);
    }, sanitize(childNode));
    return delta.concat(childrenDelta);
  }, new Delta());
}


class Clipboard extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener('copy', this.onCopy.bind(this));
    this.quill.root.addEventListener('cut', this.onCut.bind(this));
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
    this.container = this.quill.addContainer('ql-clipboard');
    this.container.setAttribute('contenteditable', true);
  }

  onCopy(e) {
    let range = this.quill.getSelection();
    if (range == null || range.length === 0 || e.defaultPrevented) return;
    let clipboard = e.clipboardData || window.clipboardData;
    clipboard.setData('text', this.quill.getText(range));
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
    let callback = (delta) => {
      this.quill.updateContents(delta, Emitter.sources.USER);
      // range.length contributes to delta.length()
      this.quill.setSelection(delta.length() - range.length*2, Emitter.sources.SILENT);
      this.quill.selection.scrollIntoView();
    };
    let intercept = (delta) => {
      this.container.focus();
      setTimeout(() => {
        delta = delta.concat(sanitize(this.container));
        this.container.innerHTML = '';
        callback(delta);
      }, 1);
    };
    // Firefox types is in iterable, not array
    // IE11 types can be null
    if ([].indexOf.call(clipboard.types || [], 'application/json') > -1) {
      try {
        let pasteJSON = JSON.parse(clipboard.getData('application/json'));
        callback(delta.concat(pasteJSON));
      } catch(err) {
        intercept(delta);
      }
      e.preventDefault();
      return;
    }
    intercept(delta);
  }
}


export default Clipboard;
