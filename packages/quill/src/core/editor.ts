import { cloneDeep, isEqual, merge } from 'lodash-es';
import { LeafBlot, EmbedBlot, Scope, ParentBlot } from 'parchment';
import type { Blot } from 'parchment';
import Delta, { AttributeMap, Op } from 'quill-delta';
import Block, { BlockEmbed, bubbleFormats } from '../blots/block.js';
import Break from '../blots/break.js';
import CursorBlot from '../blots/cursor.js';
import type Scroll from '../blots/scroll.js';
import TextBlot, { escapeText } from '../blots/text.js';
import { Range } from './selection.js';

const ASCII = /^[ -~]*$/;

type SelectionInfo = {
  newRange: Range;
  oldRange: Range;
};

class Editor {
  scroll: Scroll;
  delta: Delta;

  constructor(scroll: Scroll) {
    this.scroll = scroll;
    this.delta = this.getDelta();
  }

  applyDelta(delta: Delta): Delta {
    this.scroll.update();
    let scrollLength = this.scroll.length();
    this.scroll.batchStart();
    const normalizedDelta = normalizeDelta(delta);
    const deleteDelta = new Delta();
    const normalizedOps = splitOpLines(normalizedDelta.ops.slice());
    normalizedOps.reduce((index, op) => {
      const length = Op.length(op);
      let attributes = op.attributes || {};
      let isImplicitNewlinePrepended = false;
      let isImplicitNewlineAppended = false;
      if (op.insert != null) {
        deleteDelta.retain(length);
        if (typeof op.insert === 'string') {
          const text = op.insert;
          isImplicitNewlineAppended =
            !text.endsWith('\n') &&
            (scrollLength <= index ||
              !!this.scroll.descendant(BlockEmbed, index)[0]);
          this.scroll.insertAt(index, text);
          const [line, offset] = this.scroll.line(index);
          let formats = merge({}, bubbleFormats(line));
          if (line instanceof Block) {
            const [leaf] = line.descendant(LeafBlot, offset);
            if (leaf) {
              formats = merge(formats, bubbleFormats(leaf));
            }
          }
          attributes = AttributeMap.diff(formats, attributes) || {};
        } else if (typeof op.insert === 'object') {
          const key = Object.keys(op.insert)[0]; // There should only be one key
          if (key == null) return index;
          const isInlineEmbed = this.scroll.query(key, Scope.INLINE) != null;
          if (isInlineEmbed) {
            if (
              scrollLength <= index ||
              !!this.scroll.descendant(BlockEmbed, index)[0]
            ) {
              isImplicitNewlineAppended = true;
            }
          } else if (index > 0) {
            const [leaf, offset] = this.scroll.descendant(LeafBlot, index - 1);
            if (leaf instanceof TextBlot) {
              const text = leaf.value();
              if (text[offset] !== '\n') {
                isImplicitNewlinePrepended = true;
              }
            } else if (
              leaf instanceof EmbedBlot &&
              leaf.statics.scope === Scope.INLINE_BLOT
            ) {
              isImplicitNewlinePrepended = true;
            }
          }
          this.scroll.insertAt(index, key, op.insert[key]);

          if (isInlineEmbed) {
            const [leaf] = this.scroll.descendant(LeafBlot, index);
            if (leaf) {
              const formats = merge({}, bubbleFormats(leaf));
              attributes = AttributeMap.diff(formats, attributes) || {};
            }
          }
        }
        scrollLength += length;
      } else {
        deleteDelta.push(op);

        if (op.retain !== null && typeof op.retain === 'object') {
          const key = Object.keys(op.retain)[0];
          if (key == null) return index;
          this.scroll.updateEmbedAt(index, key, op.retain[key]);
        }
      }
      Object.keys(attributes).forEach((name) => {
        this.scroll.formatAt(index, length, name, attributes[name]);
      });
      const prependedLength = isImplicitNewlinePrepended ? 1 : 0;
      const addedLength = isImplicitNewlineAppended ? 1 : 0;
      scrollLength += prependedLength + addedLength;
      deleteDelta.retain(prependedLength);
      deleteDelta.delete(addedLength);
      return index + length + prependedLength + addedLength;
    }, 0);
    deleteDelta.reduce((index, op) => {
      if (typeof op.delete === 'number') {
        this.scroll.deleteAt(index, op.delete);
        return index;
      }
      return index + Op.length(op);
    }, 0);
    this.scroll.batchEnd();
    this.scroll.optimize();
    return this.update(normalizedDelta);
  }

  deleteText(index: number, length: number): Delta {
    this.scroll.deleteAt(index, length);
    return this.update(new Delta().retain(index).delete(length));
  }

  formatLine(
    index: number,
    length: number,
    formats: Record<string, unknown> = {},
  ): Delta {
    this.scroll.update();
    Object.keys(formats).forEach((format) => {
      this.scroll.lines(index, Math.max(length, 1)).forEach((line) => {
        line.format(format, formats[format]);
      });
    });
    this.scroll.optimize();
    const delta = new Delta().retain(index).retain(length, cloneDeep(formats));
    return this.update(delta);
  }

  formatText(
    index: number,
    length: number,
    formats: Record<string, unknown> = {},
  ): Delta {
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(index, length, format, formats[format]);
    });
    const delta = new Delta().retain(index).retain(length, cloneDeep(formats));
    return this.update(delta);
  }

  getContents(index: number, length: number): Delta {
    return this.delta.slice(index, index + length);
  }

  getDelta(): Delta {
    return this.scroll.lines().reduce((delta, line) => {
      return delta.concat(line.delta());
    }, new Delta());
  }

  getFormat(index: number, length = 0): Record<string, unknown> {
    let lines: (Block | BlockEmbed)[] = [];
    let leaves: LeafBlot[] = [];
    if (length === 0) {
      this.scroll.path(index).forEach((path) => {
        const [blot] = path;
        if (blot instanceof Block) {
          lines.push(blot);
        } else if (blot instanceof LeafBlot) {
          leaves.push(blot);
        }
      });
    } else {
      lines = this.scroll.lines(index, length);
      leaves = this.scroll.descendants(LeafBlot, index, length);
    }
    const [lineFormats, leafFormats] = [lines, leaves].map((blots) => {
      const blot = blots.shift();
      if (blot == null) return {};
      let formats = bubbleFormats(blot);
      while (Object.keys(formats).length > 0) {
        const blot = blots.shift();
        if (blot == null) return formats;
        formats = combineFormats(bubbleFormats(blot), formats);
      }
      return formats;
    });
    return { ...lineFormats, ...leafFormats };
  }

  getHTML(index: number, length: number): string {
    const [line, lineOffset] = this.scroll.line(index);
    if (line) {
      const lineLength = line.length();
      const isWithinLine = line.length() >= lineOffset + length;
      if (isWithinLine && !(lineOffset === 0 && length === lineLength)) {
        return convertHTML(line, lineOffset, length, true);
      }
      return convertHTML(this.scroll, index, length, true);
    }
    return '';
  }

  getText(index: number, length: number): string {
    return this.getContents(index, length)
      .filter((op) => typeof op.insert === 'string')
      .map((op) => op.insert)
      .join('');
  }

  insertContents(index: number, contents: Delta): Delta {
    const normalizedDelta = normalizeDelta(contents);
    const change = new Delta().retain(index).concat(normalizedDelta);
    this.scroll.insertContents(index, normalizedDelta);
    return this.update(change);
  }

  insertEmbed(index: number, embed: string, value: unknown): Delta {
    this.scroll.insertAt(index, embed, value);
    return this.update(new Delta().retain(index).insert({ [embed]: value }));
  }

  insertText(
    index: number,
    text: string,
    formats: Record<string, unknown> = {},
  ): Delta {
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    this.scroll.insertAt(index, text);
    Object.keys(formats).forEach((format) => {
      this.scroll.formatAt(index, text.length, format, formats[format]);
    });
    return this.update(
      new Delta().retain(index).insert(text, cloneDeep(formats)),
    );
  }

  isBlank(): boolean {
    if (this.scroll.children.length === 0) return true;
    if (this.scroll.children.length > 1) return false;
    const blot = this.scroll.children.head;
    if (blot?.statics.blotName !== Block.blotName) return false;
    const block = blot as Block;
    if (block.children.length > 1) return false;
    return block.children.head instanceof Break;
  }

  removeFormat(index: number, length: number): Delta {
    const text = this.getText(index, length);
    const [line, offset] = this.scroll.line(index + length);
    let suffixLength = 0;
    let suffix = new Delta();
    if (line != null) {
      suffixLength = line.length() - offset;
      suffix = line
        .delta()
        .slice(offset, offset + suffixLength - 1)
        .insert('\n');
    }
    const contents = this.getContents(index, length + suffixLength);
    const diff = contents.diff(new Delta().insert(text).concat(suffix));
    const delta = new Delta().retain(index).concat(diff);
    return this.applyDelta(delta);
  }

  update(
    change: Delta | null,
    mutations: MutationRecord[] = [],
    selectionInfo: SelectionInfo | undefined = undefined,
  ): Delta {
    const oldDelta = this.delta;
    if (
      mutations.length === 1 &&
      mutations[0].type === 'characterData' &&
      // @ts-expect-error Fix me later
      mutations[0].target.data.match(ASCII) &&
      this.scroll.find(mutations[0].target)
    ) {
      // Optimization for character changes
      const textBlot = this.scroll.find(mutations[0].target) as Blot;
      const formats = bubbleFormats(textBlot);
      const index = textBlot.offset(this.scroll);
      // @ts-expect-error Fix me later
      const oldValue = mutations[0].oldValue.replace(CursorBlot.CONTENTS, '');
      const oldText = new Delta().insert(oldValue);
      // @ts-expect-error
      const newText = new Delta().insert(textBlot.value());
      const relativeSelectionInfo = selectionInfo && {
        oldRange: shiftRange(selectionInfo.oldRange, -index),
        newRange: shiftRange(selectionInfo.newRange, -index),
      };
      const diffDelta = new Delta()
        .retain(index)
        .concat(oldText.diff(newText, relativeSelectionInfo));
      change = diffDelta.reduce((delta, op) => {
        if (op.insert) {
          return delta.insert(op.insert, formats);
        }
        return delta.push(op);
      }, new Delta());
      this.delta = oldDelta.compose(change);
    } else {
      this.delta = this.getDelta();
      if (!change || !isEqual(oldDelta.compose(change), this.delta)) {
        change = oldDelta.diff(this.delta, selectionInfo);
      }
    }
    return change;
  }
}

interface ListItem {
  child: Blot;
  offset: number;
  length: number;
  indent: number;
  type: string;
}
function convertListHTML(
  items: ListItem[],
  lastIndent: number,
  types: string[],
): string {
  if (items.length === 0) {
    const [endTag] = getListType(types.pop());
    if (lastIndent <= 0) {
      return `</li></${endTag}>`;
    }
    return `</li></${endTag}>${convertListHTML([], lastIndent - 1, types)}`;
  }
  const [{ child, offset, length, indent, type }, ...rest] = items;
  const [tag, attribute] = getListType(type);
  if (indent > lastIndent) {
    types.push(type);
    if (indent === lastIndent + 1) {
      return `<${tag}><li${attribute}>${convertHTML(
        child,
        offset,
        length,
      )}${convertListHTML(rest, indent, types)}`;
    }
    return `<${tag}><li>${convertListHTML(items, lastIndent + 1, types)}`;
  }
  const previousType = types[types.length - 1];
  if (indent === lastIndent && type === previousType) {
    return `</li><li${attribute}>${convertHTML(
      child,
      offset,
      length,
    )}${convertListHTML(rest, indent, types)}`;
  }
  const [endTag] = getListType(types.pop());
  return `</li></${endTag}>${convertListHTML(items, lastIndent - 1, types)}`;
}

/*
  Security: sanitize HTML returned from editor to avoid injecting scripts or unsafe attributes.
  We avoid returning unsanitized outerHTML from DOM nodes. Instead we reconstruct elements
  with a safe subset of attributes and validate URLs to prevent javascript: URIs.
*/

function isSafeUrl(url: string | null | undefined) {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  // Disallow javascript: and data: URIs that could run scripts. Allow http(s) and mailto and relative URLs
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    // Allow protocol-relative
    trimmed.startsWith('//')
  );
}

function sanitizeAttributes(el: Element) {
  const allowedAttrs = new Set([
    'href',
    'src',
    'alt',
    'title',
    'width',
    'height',
    'colspan',
    'rowspan',
    'data-list',
    'data-id',
  ]);
  const attrs: string[] = [];
  for (let i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i];
    const name = a.name.toLowerCase();
    const value = a.value;
    // Drop event handlers and styles
    if (name.startsWith('on') || name === 'style') continue;
    // Only allow whitelisted attributes
    if (!allowedAttrs.has(name) && !name.startsWith('data-')) continue;
    // Validate URLs
    if ((name === 'href' || name === 'src') && !isSafeUrl(value)) continue;
    // Escape attribute value
    const escaped = String(value)
      .replace(/&/g, '&amp;')
      .replace(/\"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    attrs.push(`${name}="${escaped}"`);
  }
  return attrs.length ? ' ' + attrs.join(' ') : '';
}

function serializeElementSafely(el: Element, innerHtml: string) {
  const tag = el.tagName.toLowerCase();
  const attrs = sanitizeAttributes(el);
  // For tables, preserve a simple visible border without allowing arbitrary style attributes
  if (tag === 'table') {
    return `<table${attrs} style=\"border: 1px solid #000;\">${innerHtml}</table>`;
  }
  return `<${tag}${attrs}>${innerHtml}</${tag}>`;
}

function convertHTML(
  blot: Blot,
  index: number,
  length: number,
  isRoot = false,
): string {
  if ('html' in blot && typeof blot.html === 'function') {
    // If blot provides its own html, sanitize the returned string
    try {
      const raw = blot.html(index, length);
      // Simple sanitize: parse into a template and reconstruct allowed parts
      const container = document.createElement('template');
      container.innerHTML = raw || '';
      // Walk and remove disallowed elements (script, iframe, object, embed)
      const forbidden = ['script', 'iframe', 'object', 'embed', 'style'];
      forbidden.forEach((tag) => {
        container.content.querySelectorAll(tag).forEach((node) => node.remove());
      });
      // For remaining elements, strip unsafe attributes
      container.content.querySelectorAll('*').forEach((node) => {
        if (node instanceof Element) {
          const attrs = sanitizeAttributes(node);
          // Rebuild node with allowed attributes only
          // Create new node to avoid keeping original attributes
          const newNode = document.createElement(node.tagName.toLowerCase());
          if (attrs) {
            // attrs string is like ' name=\"value\" ...' — set via innerHTML trick
            const dummy = document.createElement('div');
            dummy.innerHTML = `<${node.tagName.toLowerCase()}${attrs}></${node.tagName.toLowerCase()}>`;
            const newEl = dummy.firstChild as Element;
            if (newEl && newEl.attributes) {
              for (let i = 0; i < newEl.attributes.length; i++) {
                const a = newEl.attributes[i];
                newNode.setAttribute(a.name, a.value);
              }
            }
          }
          // Move children
          while (node.firstChild) {
            newNode.appendChild(node.firstChild);
          }
          node.replaceWith(newNode);
        }
      });
      return (container.innerHTML || '').replaceAll(' ', '&nbsp;');
    } catch (e) {
      // If blot.html throws or DOM not available, fall back to safe empty string
      return '';
    }
  }
  if (blot instanceof TextBlot) {
    const escapedText = escapeText(blot.value().slice(index, index + length));
    return escapedText.replaceAll(' ', '&nbsp;');
  }
  if (blot instanceof ParentBlot) {
    // TODO fix API
    if (blot.statics.blotName === 'list-container') {
      const items: any[] = [];
      blot.children.forEachAt(index, length, (child, offset, childLength) => {
        const formats =
          'formats' in child && typeof child.formats === 'function'
            ? child.formats()
            : {};
        items.push({
          child,
          offset,
          length: childLength,
          indent: formats.indent || 0,
          type: formats.list,
        });
      });
      return convertListHTML(items, -1, []);
    }
    const parts: string[] = [];
    blot.children.forEachAt(index, length, (child, offset, childLength) => {
      parts.push(convertHTML(child, offset, childLength));
    });
    if (isRoot || blot.statics.blotName === 'list') {
      return parts.join('');
    }
    // Reconstruct element safely instead of using outerHTML/innerHTML which may contain unsafe attributes
    const dom = blot.domNode as Element;
    const inner = parts.join('');
    return serializeElementSafely(dom, inner);
  }
  if (blot.domNode instanceof Element) {
    // Non-Parent blots: return a safe serialization of the element
    try {
      const dom = blot.domNode as Element;
      return serializeElementSafely(dom, dom.textContent ? escapeText(dom.textContent) : '');
    } catch (e) {
      return '';
    }
  }
  return '';
}

function combineFormats(
  formats: Record<string, unknown>,
  combined: Record<string, unknown>,
): Record<string, unknown> {
  return Object.keys(combined).reduce(
    (merged, name) => {
      if (formats[name] == null) return merged;
      const combinedValue = combined[name];
      if (combinedValue === formats[name]) {
        merged[name] = combinedValue;
      } else if (Array.isArray(combinedValue)) {
        if (combinedValue.indexOf(formats[name]) < 0) {
          merged[name] = combinedValue.concat([formats[name]]);
        } else {
          // If style already exists, don't add to an array, but don't lose other styles
          merged[name] = combinedValue;
        }
      } else {
        merged[name] = [combinedValue, formats[name]];
      }
      return merged;
    },
    {} as Record<string, unknown>,
  );
}

function getListType(type: string | undefined) {
  const tag = type === 'ordered' ? 'ol' : 'ul';
  switch (type) {
    case 'checked':
      return [tag, ' data-list="checked"'];
    case 'unchecked':
      return [tag, ' data-list="unchecked"'];
    default:
      return [tag, ''];
  }
}

function normalizeDelta(delta: Delta) {
  return delta.reduce((normalizedDelta, op) => {
    if (typeof op.insert === 'string') {
      const text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      return normalizedDelta.insert(text, op.attributes);
    }
    return normalizedDelta.push(op);
  }, new Delta());
}

function shiftRange({ index, length }: Range, amount: number) {
  return new Range(index + amount, length);
}

function splitOpLines(ops: Op[]) {
  const split: Op[] = [];
  ops.forEach((op) => {
    if (typeof op.insert === 'string') {
      const lines = op.insert.split('\n');
      lines.forEach((line, index) => {
        if (index) split.push({ insert: '\n', attributes: op.attributes });
        if (line) split.push({ insert: line, attributes: op.attributes });
      });
    } else {
      split.push(op);
    }
  });

  return split;
}

export default Editor;
