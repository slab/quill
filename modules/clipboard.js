import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import Quill from '../core/quill';
import logger from '../core/logger';
import Module from '../core/module';
import { BlockEmbed } from '../blots/block';

let debug = logger('quill:clipboard');


class Clipboard extends Module {
  constructor(quill, options) {
    if (options.matchers !== Clipboard.DEFAULTS.matchers) {
      options.matchers = Clipboard.DEFAULTS.matchers.concat(options.matchers);
    }
    super(quill, options);
    this.quill.root.addEventListener('copy', this.onCopy.bind(this));
    this.quill.root.addEventListener('cut', this.onCut.bind(this));
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
    this.container = this.quill.addContainer('ql-clipboard');
    this.container.setAttribute('contenteditable', true);
    this.container.setAttribute('tabindex', -1);
    this.matchers = [];
    this.options.matchers.forEach((pair) => {
      this.addMatcher(...pair);
    });
  }

  addMatcher(selector, matcher) {
    this.matchers.push([selector, matcher]);
  }

  convert(html) {
    const DOM_KEY = '__ql-matcher';
    if (typeof html === 'string') {
      this.container.innerHTML = html;
    }
    this.matchers.forEach((pair) => {
      let [selector, matcher] = pair;
      if (typeof selector === 'string') {
        [].forEach.call(this.container.querySelectorAll(selector), (node) => {
          // TODO use weakmap
          node[DOM_KEY] = node[DOM_KEY] || [];
          node[DOM_KEY].push(matcher);
        });
      }
    });
    let traverse = (node) => {  // Post-order
      return [].reduce.call(node.childNodes || [], (delta, childNode) => {
        let childrenDelta = traverse(childNode);
        childrenDelta = this.matchers.reduce(function(childrenDelta, pair) {
          let [type, matcher] = pair;
          if (type === true || childNode.nodeType === type) {
            childrenDelta = matcher(childNode, childrenDelta);
          }
          return childrenDelta;
        }, childrenDelta);
        childrenDelta = (childNode[DOM_KEY] || []).reduce(function(childrenDelta, matcher) {
          return matcher(childNode, childrenDelta);
        }, childrenDelta);
        return delta.concat(childrenDelta);
      }, new Delta());
    };
    let delta = traverse(this.container);
    // Remove trailing newline
    if (deltaEndsWith(delta, '\n') && delta.ops[delta.ops.length - 1].attributes == null) {
      delta = delta.compose(new Delta().retain(delta.length() - 1).delete(1));
    }
    debug.info('convert', this.container.innerHTML, delta);
    this.container.innerHTML = '';
    return delta;
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
    this.quill.deleteText(range, Quill.sources.USER);
    this.quill.setSelection(range.index, Quill.sources.SILENT);
  }

  onPaste(e) {
    if (e.defaultPrevented) return;
    let range = this.quill.getSelection();
    let clipboard = e.clipboardData || window.clipboardData;
    let delta = new Delta().retain(range.index).delete(range.length);
    let done = (delta) => {
      this.quill.updateContents(delta, Quill.sources.USER);
      // range.length contributes to delta.length()
      this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
      this.quill.selection.scrollIntoView();
    };
    let intercept = (delta, callback) => {
      this.container.focus();
      setTimeout(() => {
        let html = this.container.innerHTML;
        delta = delta.concat(this.convert());
        callback(delta);
      }, 1);
    };
    // Firefox types is an iterable, not array
    // IE11 types can be null
    if ([].indexOf.call(clipboard.types || [], 'application/json') > -1) {
      try {
        let pasteJSON = JSON.parse(clipboard.getData('application/json'));
        done(delta.concat(pasteJSON));
      } catch(err) {
        intercept(delta, done);
      }
      e.preventDefault();
    } else {
      intercept(delta, done);
    }
  }
}
Clipboard.DEFAULTS = {
  matchers: [
    [Node.TEXT_NODE, matchText],
    [Node.ELEMENT_NODE, matchNewline],
    [Node.ELEMENT_NODE, matchBlot],
    [Node.ELEMENT_NODE, matchSpacing],
    [Node.ELEMENT_NODE, matchAttributor],
    ['b', matchAlias.bind(matchAlias, 'bold')],
    ['i', matchAlias.bind(matchAlias, 'italic')]
  ]
};


function computeStyle(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return {};
  const DOM_KEY = '__ql-computed-style';
  return node[DOM_KEY] || (node[DOM_KEY] = window.getComputedStyle(node));
}

function deltaEndsWith(delta, text) {
  let endText = "";
  for (let i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
    let op  = delta.ops[i];
    if (typeof op.insert !== 'string') break;
    endText = op.insert + endText;
  }
  return endText.slice(-1*text.length) === text;
}

function isLine(node) {
  if (node.childNodes.length === 0) return false;   // Exclude embed blocks
  let style = computeStyle(node);
  return ['block', 'list-item'].indexOf(style.display) > -1;
}

function matchAlias(format, node, delta) {
  return delta.compose(new Delta().retain(delta.length(), { [format]: true }));
}

function matchAttributor(node, delta) {
  let attributes = Parchment.Attributor.Attribute.keys(node);
  let classes = Parchment.Attributor.Class.keys(node);
  let styles = Parchment.Attributor.Style.keys(node);
  let formats = {};
  attributes.concat(classes).concat(styles).forEach((name) => {
    let attr = Parchment.query(name, Parchment.Scope.ATTRIBUTE);
    if (attr != null) {
      formats[attr.attrName] = attr.value(node);
    }
  });
  if (Object.keys(formats).length > 0) {
    delta = delta.compose(new Delta().retain(delta.length(), formats));
  }
  return delta;
}

function matchBlot(node, delta) {
  let match = Parchment.query(node);
  if (match == null) return delta;
  if (match.prototype instanceof Parchment.Embed) {
    let embed = {};
    let value = match.value(node);
    if (value != null) {
      embed[match.blotName] = value;
      delta.insert(embed, match.formats(node));
      if (match.prototype instanceof BlockEmbed) {
        let newlineDelta = matchAttributor(node, new Delta().insert('\n'));
        delta = delta.concat(newlineDelta);
      }
    }
  } else if (typeof match.formats === 'function') {
    let formats = { [match.blotName]: match.formats(node) };
    delta = delta.compose(new Delta().retain(delta.length(), formats));
  }
  return delta;
}

function matchNewline(node, delta) {
  if (!isLine(node)) return delta;
  if (computeStyle(node).whiteSpace.startsWith('pre') || !deltaEndsWith(delta, '\n')) {
    delta.insert('\n');
  }
  return delta;
}

function matchSpacing(node, delta) {
  if (node.nextElementSibling != null &&
      node.nextElementSibling.offsetTop > node.offsetTop + node.offsetHeight*1.4 &&
      !deltaEndsWith(delta, '\n\n')) {
    delta.insert('\n');
  }
  return delta;
}

function matchText(node, delta) {
  let text = node.data;
  if (!computeStyle(node.parentNode).whiteSpace.startsWith('pre')) {
    function replacer(collapse, match) {
      match = match.replace(/[^\u00a0]/g, '');    // \u00a0 is nbsp;
      return match.length < 1 && collapse ? ' ' : match;
    }
    text = text.replace(/\s\s+/g, replacer.bind(replacer, true));
    if (node.previousSibling == null || isLine(node.previousSibling)) {
      text = text.replace(/^\s+/, replacer.bind(replacer, false));
    }
    if (node.nextSibling == null || isLine(node.nextSibling)) {
      text = text.replace(/\s+$/, replacer.bind(replacer, false));
    }
  }
  return delta.insert(text);
}


export { Clipboard as default, matchAttributor, matchBlot, matchNewline, matchSpacing, matchText };
