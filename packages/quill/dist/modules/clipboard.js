import { Attributor, BlockBlot, ClassAttributor, EmbedBlot, Scope, StyleAttributor } from 'parchment';
import Delta from 'quill-delta';
import { BlockEmbed } from '../blots/block.js';
import logger from '../core/logger.js';
import Module from '../core/module.js';
import Quill from '../core/quill.js';
import { AlignAttribute, AlignStyle } from '../formats/align.js';
import { BackgroundStyle } from '../formats/background.js';
import CodeBlock from '../formats/code.js';
import { ColorStyle } from '../formats/color.js';
import { DirectionAttribute, DirectionStyle } from '../formats/direction.js';
import { FontStyle } from '../formats/font.js';
import { SizeStyle } from '../formats/size.js';
import { deleteRange } from './keyboard.js';
import normalizeExternalHTML from './normalizeExternalHTML/index.js';
import { SOFT_BREAK_CHARACTER } from '../blots/soft-break.js';
const debug = logger('quill:clipboard');
const CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], [Node.TEXT_NODE, matchNewline], ['br', matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ['li', matchIndent], ['ol, ul', matchList], ['pre', matchCodeBlock], ['tr', matchTable], ['b', createMatchAlias('bold')], ['i', createMatchAlias('italic')], ['strike', createMatchAlias('strike')], ['style', matchIgnore]];
const ATTRIBUTE_ATTRIBUTORS = [AlignAttribute, DirectionAttribute].reduce((memo, attr) => {
  memo[attr.keyName] = attr;
  return memo;
}, {});
const STYLE_ATTRIBUTORS = [AlignStyle, BackgroundStyle, ColorStyle, DirectionStyle, FontStyle, SizeStyle].reduce((memo, attr) => {
  memo[attr.keyName] = attr;
  return memo;
}, {});
class Clipboard extends Module {
  static DEFAULTS = {
    matchers: []
  };
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener('copy', e => this.onCaptureCopy(e, false));
    this.quill.root.addEventListener('cut', e => this.onCaptureCopy(e, true));
    this.quill.root.addEventListener('paste', this.onCapturePaste.bind(this));
    this.matchers = [];
    CLIPBOARD_CONFIG.concat(this.options.matchers ?? []).forEach(_ref => {
      let [selector, matcher] = _ref;
      this.addMatcher(selector, matcher);
    });
  }
  addMatcher(selector, matcher) {
    this.matchers.push([selector, matcher]);
  }
  convert(_ref2) {
    let {
      html,
      text
    } = _ref2;
    let formats = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (formats[CodeBlock.blotName]) {
      return new Delta().insert(text || '', {
        [CodeBlock.blotName]: formats[CodeBlock.blotName]
      });
    }
    if (!html) {
      return new Delta().insert(text || '', formats);
    }
    const delta = this.convertHTML(html);
    // Remove trailing newline
    if (deltaEndsWith(delta, '\n') && (delta.ops[delta.ops.length - 1].attributes == null || formats.table)) {
      return delta.compose(new Delta().retain(delta.length() - 1).delete(1));
    }
    return delta;
  }
  normalizeHTML(doc) {
    normalizeExternalHTML(doc);
  }
  convertHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    this.normalizeHTML(doc);
    const container = doc.body;
    const nodeMatches = new WeakMap();
    const [elementMatchers, textMatchers] = this.prepareMatching(container, nodeMatches);
    return traverse(this.quill.scroll, container, elementMatchers, textMatchers, nodeMatches);
  }
  dangerouslyPasteHTML(index, html) {
    let source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Quill.sources.API;
    if (typeof index === 'string') {
      const delta = this.convert({
        html: index,
        text: ''
      });
      // @ts-expect-error
      this.quill.setContents(delta, html);
      this.quill.setSelection(0, Quill.sources.SILENT);
    } else {
      const paste = this.convert({
        html,
        text: ''
      });
      this.quill.updateContents(new Delta().retain(index).concat(paste), source);
      this.quill.setSelection(index + paste.length(), Quill.sources.SILENT);
    }
  }
  onCaptureCopy(e) {
    let isCut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (e.defaultPrevented) return;
    e.preventDefault();
    const [range] = this.quill.selection.getRange();
    if (range == null) return;
    const {
      html,
      text
    } = this.onCopy(range, isCut);
    e.clipboardData?.setData('text/plain', text);
    e.clipboardData?.setData('text/html', html);
    if (isCut) {
      deleteRange({
        range,
        quill: this.quill
      });
    }
  }

  /*
   * https://www.iana.org/assignments/media-types/text/uri-list
   */
  normalizeURIList(urlList) {
    return urlList.split(/\r?\n/)
    // Ignore all comments
    .filter(url => url[0] !== '#').join('\n');
  }
  onCapturePaste(e) {
    if (e.defaultPrevented || !this.quill.isEnabled()) return;
    e.preventDefault();
    const range = this.quill.getSelection(true);
    if (range == null) return;
    const html = e.clipboardData?.getData('text/html');
    let text = e.clipboardData?.getData('text/plain');
    if (!html && !text) {
      const urlList = e.clipboardData?.getData('text/uri-list');
      if (urlList) {
        text = this.normalizeURIList(urlList);
      }
    }
    const files = Array.from(e.clipboardData?.files || []);
    if (!html && files.length > 0) {
      this.quill.uploader.upload(range, files);
      return;
    }
    if (html && files.length > 0) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (doc.body.childElementCount === 1 && doc.body.firstElementChild?.tagName === 'IMG') {
        this.quill.uploader.upload(range, files);
        return;
      }
    }
    this.onPaste(range, {
      html,
      text
    });
  }
  onCopy(range) {
    const text = this.quill.getText(range);
    const html = this.quill.getSemanticHTML(range);
    return {
      html,
      text
    };
  }
  onPaste(range, _ref3) {
    let {
      text,
      html
    } = _ref3;
    const formats = this.quill.getFormat(range.index);
    const pastedDelta = this.convert({
      text,
      html
    }, formats);
    debug.log('onPaste', pastedDelta, {
      text,
      html
    });
    const delta = new Delta().retain(range.index).delete(range.length).concat(pastedDelta);
    this.quill.updateContents(delta, Quill.sources.USER);
    // range.length contributes to delta.length()
    this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
    this.quill.scrollSelectionIntoView();
  }
  prepareMatching(container, nodeMatches) {
    const elementMatchers = [];
    const textMatchers = [];
    this.matchers.forEach(pair => {
      const [selector, matcher] = pair;
      switch (selector) {
        case Node.TEXT_NODE:
          textMatchers.push(matcher);
          break;
        case Node.ELEMENT_NODE:
          elementMatchers.push(matcher);
          break;
        default:
          Array.from(container.querySelectorAll(selector)).forEach(node => {
            if (nodeMatches.has(node)) {
              const matches = nodeMatches.get(node);
              matches?.push(matcher);
            } else {
              nodeMatches.set(node, [matcher]);
            }
          });
          break;
      }
    });
    return [elementMatchers, textMatchers];
  }
}
function applyFormat(delta, format, value, scroll) {
  if (!scroll.query(format)) {
    return delta;
  }
  return delta.reduce((newDelta, op) => {
    if (!op.insert) return newDelta;
    if (op.attributes && op.attributes[format]) {
      return newDelta.push(op);
    }
    const formats = value ? {
      [format]: value
    } : {};
    return newDelta.insert(op.insert, {
      ...formats,
      ...op.attributes
    });
  }, new Delta());
}
function deltaEndsWith(delta, text) {
  let endText = '';
  for (let i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i // eslint-disable-line no-plusplus
  ) {
    const op = delta.ops[i];
    if (typeof op.insert !== 'string') break;
    endText = op.insert + endText;
  }
  return endText.slice(-1 * text.length) === text;
}
function isLine(node, scroll) {
  if (!(node instanceof Element)) return false;
  const match = scroll.query(node);
  // @ts-expect-error
  if (match && match.prototype instanceof EmbedBlot) return false;
  return ['address', 'article', 'blockquote', 'canvas', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'iframe', 'li', 'main', 'nav', 'ol', 'output', 'p', 'pre', 'section', 'table', 'td', 'tr', 'ul', 'video'].includes(node.tagName.toLowerCase());
}
function isBetweenInlineElements(node, scroll) {
  return node.previousElementSibling && node.nextElementSibling && !isLine(node.previousElementSibling, scroll) && !isLine(node.nextElementSibling, scroll);
}
const preNodes = new WeakMap();
function isPre(node) {
  if (node == null) return false;
  if (!preNodes.has(node)) {
    // @ts-expect-error
    if (node.tagName === 'PRE') {
      preNodes.set(node, true);
    } else {
      preNodes.set(node, isPre(node.parentNode));
    }
  }
  return preNodes.get(node);
}
function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
  // Post-order
  if (node.nodeType === node.TEXT_NODE) {
    return textMatchers.reduce((delta, matcher) => {
      return matcher(node, delta, scroll);
    }, new Delta());
  }
  if (node.nodeType === node.ELEMENT_NODE) {
    return Array.from(node.childNodes || []).reduce((delta, childNode) => {
      let childrenDelta = traverse(scroll, childNode, elementMatchers, textMatchers, nodeMatches);
      if (childNode.nodeType === node.ELEMENT_NODE) {
        childrenDelta = elementMatchers.reduce((reducedDelta, matcher) => {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
        childrenDelta = (nodeMatches.get(childNode) || []).reduce((reducedDelta, matcher) => {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
      }
      return delta.concat(childrenDelta);
    }, new Delta());
  }
  return new Delta();
}
function createMatchAlias(format) {
  return (_node, delta, scroll) => {
    return applyFormat(delta, format, true, scroll);
  };
}
function matchAttributor(node, delta, scroll) {
  const attributes = Attributor.keys(node);
  const classes = ClassAttributor.keys(node);
  const styles = StyleAttributor.keys(node);
  const formats = {};
  attributes.concat(classes).concat(styles).forEach(name => {
    let attr = scroll.query(name, Scope.ATTRIBUTE);
    if (attr != null) {
      formats[attr.attrName] = attr.value(node);
      if (formats[attr.attrName]) return;
    }
    attr = ATTRIBUTE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      formats[attr.attrName] = attr.value(node) || undefined;
    }
    attr = STYLE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      attr = STYLE_ATTRIBUTORS[name];
      formats[attr.attrName] = attr.value(node) || undefined;
    }
  });
  return Object.entries(formats).reduce((newDelta, _ref4) => {
    let [name, value] = _ref4;
    return applyFormat(newDelta, name, value, scroll);
  }, delta);
}
function matchBlot(node, delta, scroll) {
  const match = scroll.query(node);
  if (match == null) return delta;
  // @ts-expect-error
  if (match.prototype instanceof EmbedBlot) {
    const embed = {};
    // @ts-expect-error
    const value = match.value(node);
    if (value != null) {
      // @ts-expect-error
      embed[match.blotName] = value;
      // @ts-expect-error
      return new Delta().insert(embed, match.formats(node, scroll));
    }
  } else {
    // @ts-expect-error
    if (match.prototype instanceof BlockBlot && !deltaEndsWith(delta, '\n')) {
      delta.insert('\n');
    }
    if ('blotName' in match && 'formats' in match && typeof match.formats === 'function') {
      return applyFormat(delta, match.blotName, match.formats(node, scroll), scroll);
    }
  }
  return delta;
}
function matchBreak(node, delta, scroll) {
  const parentLineElement = getParentLine(node, scroll);
  if (parentLineElement == null) {
    // <br> tags pasted without a parent will be treated as soft breaks
    return new Delta().insert(SOFT_BREAK_CHARACTER);
  }
  if (isPre(parentLineElement)) {
    // code blocks don't allow soft breaks
    return new Delta().insert('\n');
  }
  if (isInLastPositionOfParentLine(node, parentLineElement)) {
    // ignore trailing breaks
    return delta;
  }
  return new Delta().insert(SOFT_BREAK_CHARACTER);
}
function getParentLine(node, scroll) {
  let current = node;
  while (current.parentElement != null) {
    if (isLine(current.parentElement, scroll)) {
      return current.parentElement;
    }
    current = current.parentElement;
  }
  return null;
}
function isInLastPositionOfParentLine(node, parentLineElement) {
  let current = node;
  while (current.nextSibling == null && current.parentElement != null) {
    if (current.parentElement === parentLineElement) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}
function matchCodeBlock(node, delta, scroll) {
  const match = scroll.query('code-block');
  const language = match && 'formats' in match && typeof match.formats === 'function' ? match.formats(node, scroll) : true;
  return applyFormat(delta, 'code-block', language, scroll);
}
function matchIgnore() {
  return new Delta();
}
function matchIndent(node, delta, scroll) {
  const match = scroll.query(node);
  if (match == null ||
  // @ts-expect-error
  match.blotName !== 'list' || !deltaEndsWith(delta, '\n')) {
    return delta;
  }
  let indent = -1;
  let parent = node.parentNode;
  while (parent != null) {
    // @ts-expect-error
    if (['OL', 'UL'].includes(parent.tagName)) {
      indent += 1;
    }
    parent = parent.parentNode;
  }
  if (indent <= 0) return delta;
  return delta.reduce((composed, op) => {
    if (!op.insert) return composed;
    if (op.attributes && typeof op.attributes.indent === 'number') {
      return composed.push(op);
    }
    return composed.insert(op.insert, {
      indent,
      ...(op.attributes || {})
    });
  }, new Delta());
}
function matchList(node, delta, scroll) {
  const element = node;
  let list = element.tagName === 'OL' ? 'ordered' : 'bullet';
  const checkedAttr = element.getAttribute('data-checked');
  if (checkedAttr) {
    list = checkedAttr === 'true' ? 'checked' : 'unchecked';
  }
  return applyFormat(delta, 'list', list, scroll);
}
function matchNewline(node, delta, scroll) {
  if (!deltaEndsWith(delta, '\n')) {
    if (isLine(node, scroll) && (node.childNodes.length > 0 || node instanceof HTMLParagraphElement)) {
      return delta.insert('\n');
    }
    if (delta.length() > 0 && node.nextSibling) {
      let nextSibling = node.nextSibling;
      while (nextSibling != null) {
        if (isLine(nextSibling, scroll)) {
          return delta.insert('\n');
        }
        const match = scroll.query(nextSibling);
        // @ts-expect-error
        if (match && match.prototype instanceof BlockEmbed) {
          return delta.insert('\n');
        }
        nextSibling = nextSibling.firstChild;
      }
    }
  }
  return delta;
}
function matchStyles(node, delta, scroll) {
  const formats = {};
  const style = node.style || {};
  if (style.fontStyle === 'italic') {
    formats.italic = true;
  }
  if (style.textDecoration === 'underline') {
    formats.underline = true;
  }
  if (style.textDecoration === 'line-through') {
    formats.strike = true;
  }
  if (style.fontWeight?.startsWith('bold') ||
  // @ts-expect-error Fix me later
  parseInt(style.fontWeight, 10) >= 700) {
    formats.bold = true;
  }
  delta = Object.entries(formats).reduce((newDelta, _ref5) => {
    let [name, value] = _ref5;
    return applyFormat(newDelta, name, value, scroll);
  }, delta);
  // @ts-expect-error
  if (parseFloat(style.textIndent || 0) > 0) {
    // Could be 0.5in
    return new Delta().insert('\t').concat(delta);
  }
  return delta;
}
function matchTable(node, delta, scroll) {
  const table = node.parentElement?.tagName === 'TABLE' ? node.parentElement : node.parentElement?.parentElement;
  if (table != null) {
    const rows = Array.from(table.querySelectorAll('tr'));
    const row = rows.indexOf(node) + 1;
    return applyFormat(delta, 'table', row, scroll);
  }
  return delta;
}
function matchText(node, delta, scroll) {
  // @ts-expect-error
  let text = node.data;
  // Word represents empty line with <o:p>&nbsp;</o:p>
  if (node.parentElement?.tagName === 'O:P') {
    return delta.insert(text.trim());
  }
  if (!isPre(node)) {
    if (text.trim().length === 0 && text.includes('\n') && !isBetweenInlineElements(node, scroll)) {
      return delta;
    }
    // convert all non-nbsp whitespace into regular space
    text = text.replace(/[^\S\u00a0]/g, ' ');
    // collapse consecutive spaces into one
    text = text.replace(/ {2,}/g, ' ');
    if (node.previousSibling == null && node.parentElement != null && isLine(node.parentElement, scroll) || node.previousSibling instanceof Element && isLine(node.previousSibling, scroll)) {
      // block structure means we don't need leading space
      text = text.replace(/^ /, '');
    }
    if (node.nextSibling == null && node.parentElement != null && isLine(node.parentElement, scroll) || node.nextSibling instanceof Element && isLine(node.nextSibling, scroll)) {
      // block structure means we don't need trailing space
      text = text.replace(/ $/, '');
    }
    // done removing whitespace and can normalize all to regular space
    text = text.replaceAll('\u00a0', ' ');
  }
  return delta.insert(text);
}
export { Clipboard as default, matchAttributor, matchBlot, matchNewline, matchText, traverse };
//# sourceMappingURL=clipboard.js.map