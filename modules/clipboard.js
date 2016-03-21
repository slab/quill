import Delta from 'rich-text/lib/delta';
import Emitter from '../core/emitter';
import Module from '../core/module';
import Parchment from 'parchment';


const DOM_KEY = '__ql-matcher';
const BLOCK_ELEMENTS = {
  'ADDRESS': true,
  'ARTICLE': true,
  'ASIDE': true,
  'BLOCKQUOTE': true,
  'CANVAS': true,
  'DIV': true,
  'DL': true,
  'FIELDSET': true,
  'FIGCAPTION': true,
  'FIGURE': true,
  'FOOTER': true,
  'FORM': true,
  'HEADER': true,
  'H1': true, 'H2': true, 'H3': true, 'H4': true, 'H5': true, 'H6': true,
  'HGROUP': true,
  'HR': true,
  'LI': true,
  'MAIN': true,
  'NAV': true,
  'NOSCRIPT': true,
  'OL': true,
  'OUTPUT': true,
  'P': true,
  'PRE': true,
  'SECTION': true,
  'TABLE': true,
  'TFOOT': true,
  'UL': true,
  'VIDEO': true
};


class Clipboard extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener('copy', this.onCopy.bind(this));
    this.quill.root.addEventListener('cut', this.onCut.bind(this));
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
    this.container = this.quill.addContainer('ql-clipboard');
    this.container.setAttribute('contenteditable', true);
    this.matchers = [
      [true, matchText],
      [true, matchNewline],
      [true, matchBlot],
      [true, matchAliases]
    ];
  }

  addMatcher(selector, matcher) {
    this.matchers.push([selector, matcher]);
  }

  convert(container) {
    let globalMatchers = [];
    this.matchers.forEach(function(pair) {
      let [selector, matcher] = pair;
      if (selector === true) {
        globalMatchers.push(matcher);
      } else {
        [].forEach.call(container.querySelectorAll(selector), function(node) {
          // TODO use weakmap
          node[DOM_KEY] = node[DOM_KEY] || [];
          node[DOM_KEY].push(this.matchers[selector]);
        });
      }
    });
    let traverse = function(node) {  // Post-order
      return [].reduce.call(node.childNodes || [], function(delta, childNode) {
        let matchers = globalMatchers.concat(childNode[DOM_KEY] || []);
        let childrenDelta = matchers.reduce(function(childrenDelta, matcher) {
          return matcher(childNode, childrenDelta);
        }, traverse(childNode));
        return delta.concat(childrenDelta);
      }, new Delta());
    };
    return traverse(container);
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
        delta = delta.concat(this.convert(this.container));
        this.container.innerHTML = '';
        callback(delta);
      }, 1);
    };
    // Firefox types is an iterable, not array
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


function matchAliases(node, delta) {
  let formats = {};
  switch(node.tagName) {
    case 'B':
      formats = { bold: true };
      break;
    case 'I':
      formats = { italic: true };
      break;
    default: return delta;
  }
  return delta.compose(new Delta().retain(delta.length(), formats));
}

function matchBlot(node, delta) {
  let match = Parchment.query(node);
  if (match == null) return delta;
  if (match.prototype instanceof Parchment.Embed) {
    let embed = {};
    embed[match.blotName] = match.value(node);
    delta.insert(embed, match.formats(node));
  } else if (typeof match.formats === 'function') {
    delta = delta.compose(new Delta().retain(delta.length(), match.formats(node)));
  }
  return delta;
}

function matchNewline(node, delta) {
  if (!(node instanceof HTMLElement)) return delta;
  if (BLOCK_ELEMENTS[node.tagName] || node.style.display === 'block') {
    let lastOp = delta.ops[delta.ops.length - 1];
    let endText = (lastOp == null || typeof lastOp.insert !== 'string') ? '' : lastOp.insert;
    if (!endText.endsWith('\n')) {
      delta.insert('\n');
    }
    if (node.style.paddingBottom || (node.style.marginBottom && !endText.endsWith('\n\n'))) {
      delta.insert('\n');
    }
  }
  return delta;
}

function matchText(node, delta) {
  if (node instanceof Text) {
    let text = node.data.replace(/\s\s+/g, ' ');
    delta.insert(text);
  }
  return delta;
}


export default Clipboard;
