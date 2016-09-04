import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import Quill from '../core/quill';
import logger from '../core/logger';
import Module from '../core/module';

import { AlignStyle } from '../formats/align';
import { BackgroundStyle } from '../formats/background';
import { ColorStyle } from '../formats/color';
import { DirectionStyle } from '../formats/direction';
import { FontStyle } from '../formats/font';
import { SizeStyle } from '../formats/size';

let debug = logger('quill:clipboard');

const CLIPBOARD_CONFIG = [
  [Node.TEXT_NODE, matchText],
  ['br', matchBreak],
  [Node.ELEMENT_NODE, matchNewline],
  [Node.ELEMENT_NODE, matchBlot],
  [Node.ELEMENT_NODE, matchSpacing],
  [Node.ELEMENT_NODE, matchAttributor],
  [Node.ELEMENT_NODE, matchStyles],
  ['b', matchAlias.bind(matchAlias, 'bold')],
  ['i', matchAlias.bind(matchAlias, 'italic')],
  ['style', matchIgnore]
];

const STYLE_ATTRIBUTORS = [
  AlignStyle,
  BackgroundStyle,
  ColorStyle,
  DirectionStyle,
  FontStyle,
  SizeStyle
].reduce(function(memo, attr) {
  memo[attr.keyName] = attr;
  return memo;
}, {});


class Clipboard extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
    this.container = this.quill.addContainer('ql-clipboard');
    this.container.setAttribute('contenteditable', true);
    this.container.setAttribute('tabindex', -1);
    this.matchers = [];
    CLIPBOARD_CONFIG.concat(this.options.matchers).forEach((pair) => {
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
    let textMatchers = [], elementMatchers = [];
    this.matchers.forEach((pair) => {
      let [selector, matcher] = pair;
      switch (selector) {
        case Node.TEXT_NODE:
          textMatchers.push(matcher);
          break;
        case Node.ELEMENT_NODE:
          elementMatchers.push(matcher);
          break;
        default:
          [].forEach.call(this.container.querySelectorAll(selector), (node) => {
            // TODO use weakmap
            node[DOM_KEY] = node[DOM_KEY] || [];
            node[DOM_KEY].push(matcher);
          });
          break;
      }
    });
    let traverse = (node) => {  // Post-order
      if (node.nodeType === node.TEXT_NODE) {
        return textMatchers.reduce(function(delta, matcher) {
          return matcher(node, delta);
        }, new Delta());
      } else if (node.nodeType === node.ELEMENT_NODE) {
        return [].reduce.call(node.childNodes || [], (delta, childNode) => {
          let childrenDelta = traverse(childNode);
          if (childNode.nodeType === node.ELEMENT_NODE) {
            childrenDelta = elementMatchers.reduce(function(childrenDelta, matcher) {
              return matcher(childNode, childrenDelta);
            }, childrenDelta);
            childrenDelta = (childNode[DOM_KEY] || []).reduce(function(childrenDelta, matcher) {
              return matcher(childNode, childrenDelta);
            }, childrenDelta);
          }
          return delta.concat(childrenDelta);
        }, new Delta());
      } else {
        return new Delta();
      }
    };
    let delta = traverse(this.container);
    // Remove trailing newline
    if (deltaEndsWith(delta, '\n') && delta.ops[delta.ops.length - 1].attributes == null) {
      delta = delta.compose(new Delta().retain(delta.length() - 1).delete(1));
    }
    debug.log('convert', this.container.innerHTML, delta);
    this.container.innerHTML = '';
    return delta;
  }

  onPaste(e) {
    if (e.defaultPrevented) return;
    let range = this.quill.getSelection();
    let delta = new Delta().retain(range.index).delete(range.length);
    let bodyTop = document.body.scrollTop;
    this.container.focus();
    setTimeout(() => {
      delta = delta.concat(this.convert());
      this.quill.updateContents(delta, Quill.sources.USER);
      // range.length contributes to delta.length()
      this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
      document.body.scrollTop = bodyTop;
      this.quill.selection.scrollIntoView();
    }, 1);
  }
}
Clipboard.DEFAULTS = {
  matchers: []
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
      if (formats[attr.attrName]) return;
    }
    if (STYLE_ATTRIBUTORS[name] != null) {
      attr = STYLE_ATTRIBUTORS[name];
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
      delta = new Delta().insert(embed, match.formats(node));
    }
  } else if (typeof match.formats === 'function') {
    let formats = { [match.blotName]: match.formats(node) };
    delta = delta.compose(new Delta().retain(delta.length(), formats));
  }
  return delta;
}

function matchBreak(node, delta) {
  if (!deltaEndsWith(delta, '\n')) {
    delta.insert('\n');
  }
  return delta;
}

function matchIgnore(node, delta) {
  return new Delta();
}

function matchNewline(node, delta) {
  if (isLine(node) && !deltaEndsWith(delta, '\n')) {
    delta.insert('\n');
  }
  return delta;
}

function matchSpacing(node, delta) {
  if (isLine(node) && node.nextElementSibling != null && !deltaEndsWith(delta, '\n\n')) {
    let nodeHeight = node.offsetHeight + parseFloat(computeStyle(node).marginTop) + parseFloat(computeStyle(node).marginBottom);
    if (node.nextElementSibling.offsetTop > node.offsetTop + nodeHeight*1.5) {
      delta.insert('\n');
    }
  }
  return delta;
}

function matchStyles(node, delta) {
  let formats = {};
  let style = node.style || {};
  if (style.fontWeight && computeStyle(node).fontWeight === 'bold') {
    formats.bold = true;
  }
  if (Object.keys(formats).length > 0) {
    delta = delta.compose(new Delta().retain(delta.length(), formats));
  }
  if (parseFloat(style.textIndent || 0) > 0) {  // Could be 0.5in
    delta = new Delta().insert('\t').concat(delta);
  }
  return delta;
}

function matchText(node, delta) {
  let text = node.data;
  // Word represents empty line with <o:p>&nbsp;</o:p>
  if (node.parentNode.tagName === 'O:P') {
    return delta.insert(text.trim());
  }
  if (!computeStyle(node.parentNode).whiteSpace.startsWith('pre')) {
    function replacer(collapse, match) {
      match = match.replace(/[^\u00a0]/g, '');    // \u00a0 is nbsp;
      return match.length < 1 && collapse ? ' ' : match;
    }
    text = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
    text = text.replace(/\s\s+/g, replacer.bind(replacer, true));  // collapse whitespace
    if ((node.previousSibling == null && isLine(node.parentNode)) ||
        (node.previousSibling != null && isLine(node.previousSibling))) {
      text = text.replace(/^\s+/, replacer.bind(replacer, false));
    }
    if ((node.nextSibling == null && isLine(node.parentNode)) ||
        (node.nextSibling != null && isLine(node.nextSibling))) {
      text = text.replace(/\s+$/, replacer.bind(replacer, false));
    }
  }
  return delta.insert(text);
}


export { Clipboard as default, matchAttributor, matchBlot, matchNewline, matchSpacing, matchText };
