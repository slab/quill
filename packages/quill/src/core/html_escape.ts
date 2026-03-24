import { escapeText } from '../blots/text.js';

/** HTML body / text node context (same as TextBlot escape). */
export const escapeHtml = escapeText;

/** Double-quoted attribute context. */
export function escapeAttribute(value: string): string {
  return value.replace(/[&<>"'\n\r\t]/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      case '\n':
        return '&#10;';
      case '\r':
        return '&#13;';
      case '\t':
        return '&#9;';
      default:
        return ch;
    }
  });
}

export function stripDangerousAttributes(element: Element): void {
  for (const attr of Array.from(element.attributes)) {
    const name = attr.name.toLowerCase();
    if (name.startsWith('on')) {
      element.removeAttribute(attr.name);
      continue;
    }
    const val = attr.value;
    if (
      (name === 'href' || name === 'src' || name === 'xlink:href') &&
      /^\s*javascript:/i.test(val)
    ) {
      element.removeAttribute(attr.name);
    }
  }
}

const EXPORT_MARKER = '\uE000QUILL_HTML_EXPORT\uE000';

/**
 * Safe open/close fragments for a non-void element by cloning the shell,
 * stripping dangerous attributes, and replacing inner HTML with a marker.
 */
export function getSafeWrapperMarkup(domNode: Element): [string, string] {
  const shell = domNode.cloneNode(false) as Element;
  stripDangerousAttributes(shell);
  shell.innerHTML = EXPORT_MARKER;
  const outer = shell.outerHTML;
  const idx = outer.indexOf(EXPORT_MARKER);
  if (idx === -1) {
    return [shell.outerHTML, ''];
  }
  return [outer.slice(0, idx), outer.slice(idx + EXPORT_MARKER.length)];
}

/** Clone subtree and strip event handlers / javascript: URLs from every element. */
export function cloneWithSafeAttributes(root: Element): Element {
  const clone = root.cloneNode(true) as Element;
  const walk = (el: Element) => {
    stripDangerousAttributes(el);
    Array.from(el.children).forEach((ch) => walk(ch));
  };
  walk(clone);
  return clone;
}
